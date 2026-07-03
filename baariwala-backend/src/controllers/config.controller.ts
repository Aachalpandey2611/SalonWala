import { Request, Response } from 'express';
import { PlatformSetting } from '../models/PlatformSetting';
import { ConfigService } from '../services/config.service';
import { catchAsync } from '../utils/catchAsync';
import { ConfigurationHistory, ConfigChangeAction } from '../models/ConfigurationHistory';
import { EventBusService } from '../services/eventBus.service';

export const createOrUpdateSettingController = catchAsync(async (req: Request, res: Response) => {
  const { key, value, type, level, tenantId, branchId } = req.body;
  const adminId = req.user!.id;

  let setting = await PlatformSetting.findOne({ key, level, tenantId, branchId });
  
  if (setting) {
    const previousValue = setting.value;
    setting.value = value;
    await setting.save();
    
    await ConfigurationHistory.create({
      settingId: setting._id,
      action: ConfigChangeAction.UPDATE,
      previousValue,
      newValue: value,
      changedBy: adminId
    });
  } else {
    setting = await PlatformSetting.create({
      key, value, type, level, tenantId, branchId
    });
    
    await ConfigurationHistory.create({
      settingId: setting._id,
      action: ConfigChangeAction.CREATE,
      newValue: value,
      changedBy: adminId
    });
  }

  EventBusService.publish('ConfigurationUpdated', { key, level }, 'ConfigController');

  res.status(200).json({ success: true, data: setting });
});

export const resolveSettingController = catchAsync(async (req: Request, res: Response) => {
  const key = req.params.key as string;
  const tenantId = typeof req.query.tenantId === 'string' ? req.query.tenantId : undefined;
  const branchId = typeof req.query.branchId === 'string' ? req.query.branchId : undefined;

  const value = await ConfigService.resolveSetting(key, tenantId, branchId);

  res.status(200).json({ success: true, data: { key, value } });
});

export const checkFeatureFlagController = catchAsync(async (req: Request, res: Response) => {
  const key = req.params.key as string;
  const tenantId = typeof req.query.tenantId === 'string' ? req.query.tenantId : undefined;

  const isEnabled = await ConfigService.isFeatureEnabled(key, tenantId);

  res.status(200).json({ success: true, data: { key, isEnabled } });
});
