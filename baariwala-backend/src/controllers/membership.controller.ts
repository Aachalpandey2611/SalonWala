import { Request, Response } from 'express';
import { MembershipService } from '../services/membership.service';
import { MembershipPlan } from '../models/MembershipPlan';
import { UserMembership, MembershipStatus } from '../models/UserMembership';
import { catchAsync } from '../utils/catchAsync';

export const getPlansController = catchAsync(async (req: Request, res: Response) => {
  const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
  res.status(200).json({ success: true, data: plans });
});

export const getMyMembershipController = catchAsync(async (req: Request, res: Response) => {
  const membership = await UserMembership.findOne({ customerId: req.user!.id, status: MembershipStatus.ACTIVE }).populate('planId');
  res.status(200).json({ success: true, data: membership });
});

export const purchaseMembershipController = catchAsync(async (req: Request, res: Response) => {
  const { planId } = req.body;
  const result = await MembershipService.purchaseMembership(req.user!.id, planId);
  res.status(201).json({ success: true, data: result });
});

export const upgradeMembershipController = catchAsync(async (req: Request, res: Response) => {
  const { newPlanId } = req.body;
  const membership = await MembershipService.upgradeMembership(req.user!.id, newPlanId);
  res.status(200).json({ success: true, data: membership });
});

export const cancelAutoRenewController = catchAsync(async (req: Request, res: Response) => {
  const membership = await MembershipService.cancelAutoRenew(req.user!.id);
  res.status(200).json({ success: true, data: membership });
});
