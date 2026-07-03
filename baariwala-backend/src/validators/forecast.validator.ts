import { z } from 'zod';
import { RecommendationStatus } from '../models/AIRecommendation';

export const forecastSchemas = {
  actionRecommendation: z.object({
    body: z.object({
      status: z.enum([RecommendationStatus.ACCEPTED, RecommendationStatus.REJECTED, RecommendationStatus.IGNORED])
    })
  })
};
