import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { EventModel, EventStatus } from '../models/Event';
import { EventSubscription } from '../models/EventSubscription';
import { EventProcessingLog, ProcessingStatus } from '../models/EventProcessingLog';
import { EventRetryQueue } from '../models/EventRetryQueue';
import { logger } from '../utils/logger';

// Create a global Event Emitter instance for internal SalonWala messaging
export const internalEventBus = new EventEmitter();
// Increase max listeners to prevent memory leak warnings as modules grow
internalEventBus.setMaxListeners(50);

export class EventBusService {
  
  /**
   * Publish an event to the internal Event Bus.
   * This saves the event immutably to the database and then emits it to memory.
   */
  static async publish(eventType: string, payload: any, producer: string, correlationId?: string) {
    try {
      const payloadString = JSON.stringify(payload);
      
      // 1. Immutable Event Persistence
      const eventDoc = await EventModel.create({
        eventId: uuidv4(),
        eventType,
        producer,
        payload: payloadString,
        correlationId,
        status: EventStatus.PENDING,
      });

      // 2. Emit to Node.js Event Emitter
      // Subscribers will receive the database event object to know the exact Mongo ID
      internalEventBus.emit(eventType, eventDoc);
      
      return eventDoc;
    } catch (error) {
      logger.error(`[EventBus] Failed to publish event ${eventType}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe a service to an event type.
   * The handler is wrapped in a massive try/catch to ensure exceptions are caught 
   * and routed to the Retry Queue automatically.
   */
  static async subscribe(eventType: string, subscriberId: string, handler: (event: any) => Promise<void>) {
    
    // Register subscription in DB (Idempotent)
    await EventSubscription.findOneAndUpdate(
      { subscriberId, eventType },
      { isActive: true },
      { upsert: true, new: true }
    ).catch(e => {
      // Ignore unique constraint errors on concurrent startup
      if (e.code !== 11000) logger.error(`[EventBus] Error registering subscription:`, e);
    });

    // Attach listener
    internalEventBus.on(eventType, async (eventDoc) => {
      const startTime = Date.now();
      
      try {
        // Execute the handler
        await handler(eventDoc);
        
        // Log Success
        await EventProcessingLog.create({
          eventId: eventDoc._id,
          subscriberId,
          status: ProcessingStatus.SUCCESS,
          processingTimeMs: Date.now() - startTime
        });
        
        // Mark event as processed (Optimistic approach, if multiple succeed it just stays PROCESSED)
        await EventModel.findByIdAndUpdate(eventDoc._id, { status: EventStatus.PROCESSED });
        
      } catch (error: any) {
        logger.error(`[EventBus] Subscriber ${subscriberId} failed to process ${eventType}:`, error);
        
        // Log Failure
        await EventProcessingLog.create({
          eventId: eventDoc._id,
          subscriberId,
          status: ProcessingStatus.FAILED,
          errorMessage: error.message,
          errorStack: error.stack,
          processingTimeMs: Date.now() - startTime
        });
        
        // Route to Retry Queue
        await EventRetryQueue.create({
          eventId: eventDoc._id,
          subscriberId,
          retryCount: 0,
          maxRetries: 3,
          nextRetryAt: new Date(Date.now() + 5 * 60000), // Retry in 5 minutes
          lastErrorMessage: error.message
        });
        
        await EventModel.findByIdAndUpdate(eventDoc._id, { status: EventStatus.FAILED });
      }
    });

    logger.info(`[EventBus] ${subscriberId} subscribed to ${eventType}`);
  }
}
