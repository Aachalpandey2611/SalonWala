import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';

const httpServer = http.createServer(app);

import { socketService } from './services/socket.service';
import { initializeNotificationEventListeners } from './services/notificationEventListener';
import { initializeLedgerEventListeners } from './services/ledgerEventListener';
import { initializeInventoryEventListeners } from './services/inventoryEventListener';
import { initializeWalletEventListeners } from './services/walletEventListener';
import { initializeBillingEventListeners } from './services/billingEventListener';
import { initializeRefundEventListeners } from './services/refundEventListener';
import { initializeMembershipEventListeners } from './services/membershipEventListener';
import { initializeCommissionEventListeners } from './services/commissionEventListener';
import { setupPayrollEventListeners } from './services/payrollEventListener';
import { setupAttendanceEventListeners } from './services/attendanceEventListener';
import { setupProcurementEventListeners } from './services/procurementEventListener';
import { setupAnalyticsEventListeners } from './services/analyticsEventListener';
import { setupReportEventListeners } from './services/reportEventListener';
import { setupDashboardEventListeners } from './services/dashboardEventListener';
import { setupForecastEventListeners } from './services/forecastEventListener';
import { setupTenantEventListeners } from './services/tenantEventListener';
import { setupRBACEventListeners } from './services/rbacEventListener';
import { setupAuditEventListeners } from './services/auditEventListener';
import { setupConfigEventListeners } from './services/configEventListener';
import { setupMonitoringEventListeners } from './services/monitoringEventListener';
import { setupSecurityEventListeners } from './services/securityEventListener';
import { setupVersionEventListeners } from './services/versionEventListener';
import { setupBackupEventListeners } from './services/backupEventListener';

// Initialize Socket.IO via our dedicated service
socketService.initialize(httpServer);
export const io = socketService.getIO();

// Initialize Event Bus Listeners
initializeNotificationEventListeners();
initializeLedgerEventListeners();
initializeInventoryEventListeners();
initializeWalletEventListeners();
initializeBillingEventListeners();
initializeRefundEventListeners();
initializeMembershipEventListeners();
initializeCommissionEventListeners();
setupPayrollEventListeners();
setupAttendanceEventListeners();
setupProcurementEventListeners();
setupAnalyticsEventListeners();
setupReportEventListeners();
setupDashboardEventListeners();
setupForecastEventListeners();
setupTenantEventListeners();
setupRBACEventListeners();
setupAuditEventListeners();
setupConfigEventListeners();
setupMonitoringEventListeners();
setupSecurityEventListeners();
setupVersionEventListeners();
setupBackupEventListeners();

let server: http.Server;

const startServer = async () => {
  // Connect to databases
  await connectDatabase();
  await connectRedis();

  server = httpServer.listen(env.port, () => {
    logger.info(`🚀 Server listening on port ${env.port}`);
  });
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error('Unhandled Error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
