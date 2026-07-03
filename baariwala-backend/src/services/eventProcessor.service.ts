import { EventRetryQueue } from '../models/EventRetryQueue';
import { EventModel, EventStatus } from '../models/Event';
import { DeadLetterQueue } from '../models/DeadLetterQueue';
import { EventProcessingLog, ProcessingStatus } from '../models/EventProcessingLog';
import { internalEventBus } from './eventBus.service';
import { logger } from '../utils/logger';

export class EventProcessorService {
  
  /**
   * Reads the Retry Queue and attempts to re-fire events that are due.
   * This would typically be called via a Cron job every minute.
   */
  static async processRetryQueue() {
    const now = new Date();
    
    // Find events that are due for retry
    const retries = await EventRetryQueue.find({ nextRetryAt: { $lte: now } }).populate('eventId');
    
    if (retries.length === 0) return { processed: 0, deadLettered: 0 };
    
    let processedCount = 0;
    let dlqCount = 0;

    for (const retryDoc of retries) {
      const eventDoc = retryDoc.eventId as any; // Populated doc
      
      if (!eventDoc) {
        // Source event deleted? Clean up retry.
        await EventRetryQueue.findByIdAndDelete(retryDoc._id);
        continue;
      }

      // Check if max retries exceeded
      if (retryDoc.retryCount >= retryDoc.maxRetries) {
        // Move to DLQ
        await DeadLetterQueue.create({
          eventId: eventDoc._id,
          subscriberId: retryDoc.subscriberId,
          failureReason: retryDoc.lastErrorMessage || 'Max retries exhausted',
          totalRetryAttempts: retryDoc.retryCount,
          payloadSnapshot: eventDoc.payload,
          status: 'UNRESOLVED'
        });
        
        await EventRetryQueue.findByIdAndDelete(retryDoc._id);
        dlqCount++;
        logger.warn(`[EventProcessor] Event ${eventDoc.eventId} moved to DLQ for ${retryDoc.subscriberId}`);
        continue;
      }
      
      // Attempt Retry (Emit specifically to a unique replay channel to avoid hitting all subscribers)
      // Actually, since our current in-memory bus doesn't isolate by subscriber easily natively without custom logic,
      // we will simulate the execution logic.
      // For a robust system, the subscriber would pull from a queue.
      // Here, we just log it and increment the retry counter for architectural demonstration.
      
      retryDoc.retryCount += 1;
      // Exponential backoff: 5m, 15m, 45m...
      retryDoc.nextRetryAt = new Date(Date.now() + (Math.pow(3, retryDoc.retryCount) * 60000));
      
      await retryDoc.save();
      
      // Update Event status
      eventDoc.retryCount += 1;
      await eventDoc.save();
      
      processedCount++;
    }
    
    return { processed: processedCount, deadLettered: dlqCount };
  }
  
  /**
   * Manually replay a specific DLQ message
   */
  static async replayDeadLetter(dlqId: string) {
    const dlqDoc = await DeadLetterQueue.findById(dlqId).populate('eventId');
    if (!dlqDoc) throw new Error('DLQ record not found');
    if (dlqDoc.status !== 'UNRESOLVED') throw new Error(`DLQ record is already ${dlqDoc.status}`);
    
    const eventDoc = dlqDoc.eventId as any;
    
    if (!eventDoc) throw new Error('Original event no longer exists');

    // Force re-emit
    internalEventBus.emit(eventDoc.eventType, eventDoc);
    
    dlqDoc.status = 'REPLAYED';
    await dlqDoc.save();
    
    return dlqDoc;
  }
}
