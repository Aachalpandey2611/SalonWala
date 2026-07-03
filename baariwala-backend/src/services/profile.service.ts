import { ICustomerProfile } from '../models/CustomerProfile';
import { IBarberProfile } from '../models/BarberProfile';
import { IOwnerProfile } from '../models/OwnerProfile';

export const calculateCustomerCompletion = (profile: ICustomerProfile, hasAvatar: boolean): number => {
  let score = 0;
  
  if (hasAvatar) score += 10;
  if (profile.firstName && profile.lastName) score += 20;
  if (profile.gender) score += 10;
  if (profile.dob) score += 10;
  if (profile.addresses && profile.addresses.length > 0) score += 15;
  if (profile.preferredServices && profile.preferredServices.length > 0) score += 10;
  if (profile.alternatePhone) score += 5;
  // Based on prompt: Photo +10, Phone Verified (Auth) +15, Address +15, Preferences +10, etc.
  // We approximate 100% total based on available profile fields.
  
  // We'll give +20 base assuming Auth fields (email/phone) are already there.
  return Math.min(score + 20, 100);
};

export const calculateBarberCompletion = (profile: IBarberProfile, hasAvatar: boolean): number => {
  let score = 0;
  if (hasAvatar) score += 15;
  if (profile.bio) score += 15;
  if (profile.skills && profile.skills.length > 0) score += 20;
  if (profile.workingDays && profile.workingDays.length > 0) score += 10;
  if (profile.portfolioImages && profile.portfolioImages.length > 0) score += 20;
  
  return Math.min(score + 20, 100);
};

export const calculateOwnerCompletion = (profile: IOwnerProfile): number => {
  let score = 0;
  if (profile.companyName) score += 20;
  if (profile.businessAddress && profile.businessAddress.street) score += 20;
  if (profile.gstNumber || profile.businessRegistration) score += 20;
  if (profile.verificationDocuments && profile.verificationDocuments.length > 0) score += 20;
  
  return Math.min(score + 20, 100);
};
