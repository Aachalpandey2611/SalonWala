import { z } from 'zod';
import { ClientPlatform } from '../models/ClientCompatibility';

export const versionSchemas = {
  updateCompat: z.object({
    body: z.object({
      platform: z.nativeEnum(ClientPlatform),
      minSupportedVersion: z.string(),
      latestVersion: z.string(),
      deprecationWarningThreshold: z.string()
    })
  })
};
