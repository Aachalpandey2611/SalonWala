import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
// Note: We'll implement a custom simple XSS middleware since types/xss is missing
import { xssProtection } from './middlewares/xss.middleware';
import { env } from './config/env';
import { apiLimiter } from './middlewares/rateLimiter';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import { setupSwagger } from './docs/swagger';

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection (skip req.query — read-only in Express 5)
app.use((req: Request, _res: Response, next: NextFunction) => {
  try {
    const sanitizer = (mongoSanitize as any).sanitize;
    if (req.body) req.body = sanitizer(req.body);
    if (req.params) req.params = sanitizer(req.params);
  } catch (e) { /* ignore */ }
  next();
});

// Data sanitization against XSS
app.use(xssProtection);

// Apply rate limiting
if (env.nodeEnv === 'production') {
  app.use('/api', apiLimiter);
}

// Request logging via Morgan
app.use(
  morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', environment: env.nodeEnv });
});

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import salonRoutes from './routes/salon.routes';
import catalogRoutes from './routes/catalog.routes';
import barberRoutes from './routes/barber.routes';
import availabilityRoutes from './routes/availability.routes';
import bookingRoutes from './routes/booking.routes';
import validationRoutes from './routes/validation.routes';
import lifecycleRoutes from './routes/lifecycle.routes';
import queueRoutes from './routes/queue.routes';
import recommendationRoutes from './routes/recommendation.routes';
import eventRoutes from './routes/event.routes';
import notificationRoutes from './routes/notification.routes';
import paymentRoutes from './routes/payment.routes';
import ledgerRoutes from './routes/ledger.routes';
import inventoryRoutes from './routes/inventory.routes';
import walletRoutes from './routes/wallet.routes';
import billingRoutes from './routes/billing.routes';
import refundRoutes from './routes/refund.routes';
import membershipRoutes from './routes/membership.routes';
import commissionRoutes from './routes/commission.routes';
import payrollRoutes from './routes/payroll.routes';
import attendanceRoutes from './routes/attendance.routes';
import procurementRoutes from './routes/procurement.routes';
import analyticsRoutes from './routes/analytics.routes';
import reportRoutes from './routes/report.routes';
import dashboardRoutes from './routes/dashboard.routes';
import forecastRoutes from './routes/forecast.routes';
import tenantRoutes from './routes/tenant.routes';
import rbacRoutes from './routes/rbac.routes';
import auditRoutes from './routes/audit.routes';
import configRoutes from './routes/config.routes';
import monitoringRoutes from './routes/monitoring.routes';
import securityRoutes from './routes/security.routes';
import versionRoutes from './routes/version.routes';
import backupRoutes from './routes/backup.routes';
import deploymentRoutes from './routes/deployment.routes';
import { ipBlockGuard, rateLimiter } from './middlewares/security.middleware';
import { versionGuard } from './middlewares/version.middleware';

// Security Middlewares
app.use(ipBlockGuard);
// Apply Global Rate Limiting (100 hits / 1 min)
app.use(rateLimiter(100, 1));
// Apply Version Compatibility Guards
app.use(versionGuard);

// v1 API Routes Placeholder
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/salons', salonRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/barbers', barberRoutes);
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/validations', validationRoutes);
app.use('/api/v1/lifecycle', lifecycleRoutes);
app.use('/api/v1/queue', queueRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/ledger', ledgerRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/refund', refundRoutes);
app.use('/api/v1/memberships', membershipRoutes);
app.use('/api/v1/commissions', commissionRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/procurement', procurementRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/dashboards', dashboardRoutes);
app.use('/api/v1/forecasts', forecastRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/rbac', rbacRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/monitoring', monitoringRoutes);
app.use('/api/v1/security', securityRoutes);
app.use('/api/v1/versioning', versionRoutes);
app.use('/api/v1/backup', backupRoutes);
app.use('/api/v1/deployment', deploymentRoutes);

// Setup Swagger Docs
setupSwagger(app);

// Handle undefined routes
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
