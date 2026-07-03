import { Queue, QueueStatus } from '../models/Queue';
import { QueueEntry, QueueEntryStatus, QueuePriority } from '../models/QueueEntry';
import { Appointment } from '../models/Appointment';
import { AppError } from '../utils/AppError';
import { socketService } from './socket.service';
import mongoose from 'mongoose';
import { QueueHistory } from '../models/QueueHistory';

export class QueueService {
  
  /**
   * Recalculate the entire queue for a specific barber on a specific date.
   * This updates ETAs and queue positions dynamically.
   */
  static async recalculateQueue(barberId: string, date: string, salonId: string) {
    const queue = await Queue.findOne({ barberId, date });
    if (!queue) return; // No queue to recalculate
    
    // Fetch all active entries for this queue, sorted by Status then Priority then CreatedAt
    // Order of execution:
    // 1. IN_SERVICE (Always first, holds the anchor time)
    // 2. WAITING / CALLED / CHECKED_IN
    // 3. Sorted by Priority Level (Highest first: VIP/EMERGENCY = 5/6, NORMAL = 1)
    // 4. Sorted by token creation time (First come first serve)
    
    const activeEntries = await QueueEntry.find({
      queueId: queue._id,
      status: { $in: [QueueEntryStatus.IN_SERVICE, QueueEntryStatus.WAITING, QueueEntryStatus.CALLED, QueueEntryStatus.CHECKED_IN] }
    }).sort({ status: -1, priorityLevel: -1, createdAt: 1 });

    if (activeEntries.length === 0) {
      queue.currentlyServingEntryId = undefined;
      queue.nextCustomerEntryId = undefined;
      queue.totalWaitingCustomers = 0;
      queue.averageWaitingTimeInMinutes = 0;
      await queue.save();
      
      socketService.broadcastQueueUpdate(barberId, { queueId: queue._id, status: 'EMPTY' });
      return;
    }

    let currentTimeAnchor = new Date();
    let totalWaitMins = 0;
    let waitingCount = 0;

    for (let i = 0; i < activeEntries.length; i++) {
      const entry = activeEntries[i];
      
      // Update queue position
      entry.queuePosition = i + 1;
      
      if (entry.status === QueueEntryStatus.IN_SERVICE) {
        // This is our anchor. They are currently being served.
        queue.currentlyServingEntryId = entry._id as mongoose.Types.ObjectId;
        
        // Find how much time is left for this service
        let duration = 30; // Fallback
        if (entry.appointmentId) {
          const appt = await Appointment.findById(entry.appointmentId);
          if (appt) duration = appt.reservedDurationInMinutes;
        }
        
        // Estimate end time based on when it started
        if (entry.estimatedStartTime) {
           const timePassed = (currentTimeAnchor.getTime() - entry.estimatedStartTime.getTime()) / 60000;
           const remaining = Math.max(0, duration - timePassed);
           currentTimeAnchor = new Date(currentTimeAnchor.getTime() + remaining * 60000);
        } else {
           currentTimeAnchor = new Date(currentTimeAnchor.getTime() + duration * 60000);
        }
        
        entry.estimatedEndTime = currentTimeAnchor;
        
      } else {
        // For WAITING customers
        if (i === 1) { // The guy right after IN_SERVICE
          queue.nextCustomerEntryId = entry._id as mongoose.Types.ObjectId;
        }
        
        entry.estimatedStartTime = new Date(currentTimeAnchor);
        
        let duration = 30; // Fallback
        if (entry.appointmentId) {
          const appt = await Appointment.findById(entry.appointmentId);
          if (appt) duration = appt.reservedDurationInMinutes;
        }
        
        currentTimeAnchor = new Date(currentTimeAnchor.getTime() + duration * 60000);
        entry.estimatedEndTime = currentTimeAnchor;
        
        // Wait time is difference between now and estimated start
        const waitMs = entry.estimatedStartTime.getTime() - new Date().getTime();
        entry.estimatedWaitingTimeInMinutes = Math.max(0, Math.round(waitMs / 60000));
        
        totalWaitMins += entry.estimatedWaitingTimeInMinutes;
        waitingCount++;
      }
      
      await entry.save();
    }
    
    queue.totalWaitingCustomers = waitingCount;
    queue.averageWaitingTimeInMinutes = waitingCount > 0 ? Math.round(totalWaitMins / waitingCount) : 0;
    
    // If no one is IN_SERVICE but someone is waiting, currently serving is null, next is index 0
    if (activeEntries[0].status !== QueueEntryStatus.IN_SERVICE) {
      queue.currentlyServingEntryId = undefined;
      queue.nextCustomerEntryId = activeEntries[0]._id as mongoose.Types.ObjectId;
    }
    
    await queue.save();
    
    // Broadcast live update
    socketService.broadcastQueueUpdate(barberId, {
      queueId: queue._id,
      currentlyServing: queue.currentlyServingEntryId,
      nextCustomer: queue.nextCustomerEntryId,
      totalWaiting: queue.totalWaitingCustomers,
      averageWait: queue.averageWaitingTimeInMinutes,
      entries: activeEntries.map(e => ({
        id: e._id,
        token: e.tokenNumber,
        status: e.status,
        position: e.queuePosition,
        eta: e.estimatedStartTime,
        waitMins: e.estimatedWaitingTimeInMinutes
      }))
    });
  }

  /**
   * Add to Queue (Join)
   */
  static async joinQueue(payload: { salonId: string; branchId: string; barberId: string; customerId?: string; appointmentId?: string; source: string; priorityLevel?: number }) {
    const today = new Date().toISOString().split('T')[0];
    
    let queue = await Queue.findOne({ barberId: payload.barberId, date: today });
    if (!queue) {
      queue = await Queue.create({
        salonId: payload.salonId,
        branchId: payload.branchId,
        barberId: payload.barberId,
        date: today,
        status: QueueStatus.ACTIVE
      });
    }

    // Generate Token (e.g. T-1, T-2)
    const count = await QueueEntry.countDocuments({ queueId: queue._id });
    const tokenNumber = `T-${count + 1}`;

    const entry = await QueueEntry.create({
      queueId: queue._id,
      appointmentId: payload.appointmentId,
      customerId: payload.customerId,
      salonId: payload.salonId,
      branchId: payload.branchId,
      barberId: payload.barberId,
      queuePosition: count + 1,
      tokenNumber,
      status: QueueEntryStatus.WAITING,
      priorityLevel: payload.priorityLevel || QueuePriority.NORMAL,
      source: payload.source
    });

    await QueueHistory.create({
      queueEntryId: entry._id,
      queueId: queue._id,
      previousStatus: 'NONE',
      newStatus: QueueEntryStatus.WAITING,
      action: 'JOINED_QUEUE'
    });

    // Trigger Recalculation
    await this.recalculateQueue(payload.barberId, today, payload.salonId);
    
    return entry;
  }

  /**
   * Change Status (Call, Skip, Complete, Cancel)
   */
  static async updateEntryStatus(entryId: string, newStatus: QueueEntryStatus, actorId: string) {
    const entry = await QueueEntry.findById(entryId);
    if (!entry) throw new AppError('Queue Entry not found', 404);
    
    const previousStatus = entry.status;
    entry.status = newStatus;
    
    if (newStatus === QueueEntryStatus.IN_SERVICE && !entry.estimatedStartTime) {
       entry.estimatedStartTime = new Date();
    }
    
    await entry.save();
    
    await QueueHistory.create({
      queueEntryId: entry._id,
      queueId: entry.queueId,
      previousStatus,
      newStatus,
      action: `STATUS_CHANGED_TO_${newStatus}`,
      actorId: new mongoose.Types.ObjectId(actorId)
    });
    
    const queue = await Queue.findById(entry.queueId);
    if (queue) {
      await this.recalculateQueue(queue.barberId.toString(), queue.date, queue.salonId.toString());
    }
    
    return entry;
  }
}
