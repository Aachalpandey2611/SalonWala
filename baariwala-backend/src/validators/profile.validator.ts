import { z } from 'zod';

export const profileSchemas = {
  updateCustomerProfile: z.object({
    body: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      gender: z.enum(['Male', 'Female', 'Other']).optional(),
      dob: z.string().optional(), // Or date
      alternatePhone: z.string().optional(),
      preferredLanguage: z.string().optional(),
      preferredServices: z.array(z.string()).optional(),
      notificationSettings: z
        .object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
          push: z.boolean().optional(),
        })
        .optional(),
      privacySettings: z
        .object({
          hidePhone: z.boolean().optional(),
          hideEmail: z.boolean().optional(),
        })
        .optional(),
    }),
  }),

  updateBarberProfile: z.object({
    body: z.object({
      experience: z.number().min(0).optional(),
      bio: z.string().max(500).optional(),
      skills: z.array(z.string()).optional(),
      certifications: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      availability: z
        .object({
          start: z.string().optional(),
          end: z.string().optional(),
        })
        .optional(),
      workingDays: z.array(z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])).optional(),
    }),
  }),

  addAddress: z.object({
    body: z.object({
      label: z.string().min(1, 'Label is required'),
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'Zip code is required'),
      country: z.string().optional(),
      isDefault: z.boolean().optional(),
    }),
  }),
  
  updateAddress: z.object({
    params: z.object({
      addressId: z.string().min(1, 'Address ID is required'),
    }),
    body: z.object({
      label: z.string().optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
      isDefault: z.boolean().optional(),
    }),
  }),
};
