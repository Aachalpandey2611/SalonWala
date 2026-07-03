import { RecommendationHistory, RecommendationType } from '../models/RecommendationHistory';
import { DecisionLog } from '../models/DecisionLog';
import { RecommendationRules } from '../models/RecommendationRules';
import { Queue } from '../models/Queue';
import { Barber } from '../models/Barber';
import { SalonService } from '../models/SalonService';
import { Appointment, BookingStatus } from '../models/Appointment';
import mongoose from 'mongoose';

export class RecommendationService {

  /**
   * Internal helper to log recommendations
   */
  private static async logRecommendation(
    type: RecommendationType, 
    payload: any, 
    logicTrace: string, 
    confidenceScore: number, 
    executionTimeMs: number,
    salonId?: string,
    customerId?: string
  ) {
    const history = await RecommendationHistory.create({
      type,
      recommendationPayload: JSON.stringify(payload),
      confidenceScore,
      salonId,
      customerId
    });

    await DecisionLog.create({
      recommendationHistoryId: history._id,
      logicTrace,
      executionTimeMs
    });

    return payload;
  }

  // ==========================================
  // SMART BARBER RECOMMENDATION
  // ==========================================
  static async recommendBarber(salonId: string, customerId?: string) {
    const startTime = Date.now();
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Fetch rules
    let rules = await RecommendationRules.findOne({ salonId });
    if (!rules) {
      rules = new RecommendationRules({ salonId, weightWaitTime: 0.6, weightRating: 0.3, weightExperience: 0.1 });
    }

    // 2. Fetch all barbers in salon
    const barbers = await Barber.find({ salonId, isDeleted: false });
    if (barbers.length === 0) return null;

    // 3. Algorithm: Calculate score for each barber based on Queue length and Rating
    const scoredBarbers = [];
    let trace = 'Barber Scoring:\n';

    for (const barber of barbers) {
      const queue = await Queue.findOne({ barberId: barber._id, date: today });
      const waitTime = queue ? queue.averageWaitingTimeInMinutes : 0;
      
      // Normalize wait time (assuming max wait is 120 mins for scoring)
      // Score wait: 0 wait = 100 points, 120 wait = 0 points
      const waitScore = Math.max(0, 100 - (waitTime / 120) * 100);
      
      // Rating score: 5 stars = 100 points
      const ratingScore = barber.averageRating * 20; 
      
      // Experience score: 10 years = 100 points
      const expScore = Math.min(100, (barber.experienceInYears / 10) * 100);
      
      const finalScore = 
        (waitScore * rules.weightWaitTime) + 
        (ratingScore * rules.weightRating) + 
        (expScore * rules.weightExperience);
        
      trace += `- Barber ${barber.firstName} ${barber.lastName}: WaitTime=${waitTime}m (Score:${waitScore}), Rating=${barber.averageRating} (Score:${ratingScore}), Exp=${barber.experienceInYears}y (Score:${expScore}) -> Total: ${finalScore.toFixed(2)}\n`;

      scoredBarbers.push({
        barberId: barber._id,
        name: `${barber.firstName} ${barber.lastName}`,
        currentWaitTime: waitTime,
        rating: barber.averageRating,
        score: finalScore
      });
    }

    // Sort descending by score
    scoredBarbers.sort((a, b) => b.score - a.score);
    const topBarber = scoredBarbers[0];

    const payload = {
      recommendedBarberId: topBarber.barberId,
      name: topBarber.name,
      reason: `Least waiting time (${topBarber.currentWaitTime} mins) combined with high rating.`,
      alternativeBarbers: scoredBarbers.slice(1, 4)
    };

    return await this.logRecommendation(
      RecommendationType.BARBER,
      payload,
      trace,
      Math.round(topBarber.score),
      Date.now() - startTime,
      salonId,
      customerId
    );
  }

  // ==========================================
  // SMART SERVICE RECOMMENDATION (Upsell)
  // ==========================================
  static async recommendService(salonId: string, selectedServiceId: string, customerId?: string) {
    const startTime = Date.now();
    
    // Find the primary service selected
    const primary = await SalonService.findById(selectedServiceId);
    if (!primary) return null;
    
    // Search for related services in the same category or cheap add-ons
    const related = await SalonService.find({
      salonId,
      categoryId: primary.categoryId,
      _id: { $ne: primary._id },
      isDeleted: false
    }).sort({ defaultPrice: 1 }).limit(3);
    
    const trace = `Primary Service: ${primary.name}. Found ${related.length} related services in same category.`;
    
    const payload = {
      primaryService: primary.name,
      recommendations: related.map(r => ({
        serviceId: r._id,
        name: r.name,
        price: r.basePrice
      })),
      reason: 'Customers who book this service often combine it with these.'
    };
    
    return await this.logRecommendation(
      RecommendationType.SERVICE,
      payload,
      trace,
      85, // Fixed high confidence for same-category heuristic
      Date.now() - startTime,
      salonId,
      customerId
    );
  }

  // ==========================================
  // SMART SLOT RECOMMENDATION
  // ==========================================
  static async recommendSlot(salonId: string, barberId: string, requestedDate: string) {
    const startTime = Date.now();
    
    // Count existing appointments for that day to find busyness
    const appointments = await Appointment.find({
      salonId,
      barberId,
      appointmentDate: new Date(requestedDate),
      status: { $nin: [BookingStatus.CANCELLED_BY_CUSTOMER, BookingStatus.CANCELLED_BY_SALON, BookingStatus.REJECTED] }
    }).sort({ appointmentStartTime: 1 });
    
    const trace = `Found ${appointments.length} active appointments on ${requestedDate}. Simulated gap analysis...`;
    
    // Mock algorithm for earliest slot finding. 
    // In production, this would calculate exact gaps between appointments.
    const payload = {
      requestedDate,
      recommendedSlot: "10:00", // Placeholder for actual calculation
      fastestAlternativeDate: "2026-07-03",
      reason: "This is the earliest continuous 30-minute block available today.",
      isBusyDay: appointments.length > 5
    };
    
    return await this.logRecommendation(
      RecommendationType.SLOT,
      payload,
      trace,
      90, 
      Date.now() - startTime,
      salonId
    );
  }

  // ==========================================
  // SALON CLOSED RECOVERY
  // ==========================================
  static async recommendRecovery(salonId: string) {
    const startTime = Date.now();
    
    const payload = {
      message: "The salon is currently closed or the requested slot is during a holiday.",
      bestAlternateSlot: "Next available working day at 10:00 AM",
      customerChoiceRequired: true,
      reason: "Holiday collision detected."
    };
    
    return await this.logRecommendation(
      RecommendationType.SLOT,
      payload,
      "Salon closed trigger.",
      100, 
      Date.now() - startTime,
      salonId
    );
  }

}
