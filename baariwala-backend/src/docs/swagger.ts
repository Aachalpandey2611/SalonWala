import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'SalonWala API',
    version: '1.0.0',
    description: 'API Documentation for SalonWala Backend Services',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Development Server',
    },
  ],
  paths: {
    '/api/v1/commissions': {
      get: {
        tags: ['Commissions'],
        summary: 'Get list of commissions',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/v1/commissions/summary': {
      get: {
        tags: ['Commissions'],
        summary: 'Get commission summary dashboard',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/v1/commissions/bulk-approve': {
      post: {
        tags: ['Commissions'],
        summary: 'Bulk approve commissions',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ids: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/v1/commissions/{id}/status': {
      post: {
        tags: ['Commissions'],
        summary: 'Change commission status',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['PENDING', 'CALCULATED', 'APPROVED', 'REJECTED', 'REVERSED', 'LOCKED', 'TRANSFERRED', 'PAID', 'CANCELLED'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/v1/commissions/{id}/adjust': {
      post: {
        tags: ['Commissions'],
        summary: 'Manually adjust a commission (Bonus/Deduction)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['BONUS', 'DEDUCTION'] },
                  amount: { type: 'number' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Success' }
        }
      }
    },
    '/api/v1/commissions/rules': {
      get: {
        tags: ['Commissions'],
        summary: 'Get commission rules',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Success' }
        }
      },
      post: {
        tags: ['Commissions'],
        summary: 'Create a new commission rule',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ruleName: { type: 'string' },
                  ruleType: { type: 'string', enum: ['FLAT', 'PERCENTAGE', 'HYBRID', 'TIER_BASED'] },
                  targetType: { type: 'string', enum: ['ROLE', 'SERVICE', 'PRODUCT', 'MEMBERSHIP', 'CAMPAIGN', 'BRANCH', 'DEFAULT'] },
                  targetId: { type: 'string' },
                  rate: { type: 'number' },
                  priority: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Created' }
        }
      }
    },
    '/api/v1/payroll/cycles': {
      get: {
        tags: ['Payroll'],
        summary: 'Get list of payroll cycles',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      },
      post: {
        tags: ['Payroll'],
        summary: 'Create a new payroll cycle',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  cycleType: { type: 'string', enum: ['MONTHLY', 'WEEKLY', 'BI_WEEKLY', 'CUSTOM'] },
                  startDate: { type: 'string', format: 'date-time' },
                  endDate: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/payroll/cycles/{id}/generate': {
      post: {
        tags: ['Payroll'],
        summary: 'Generate payroll for a cycle and branch',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  branchId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/payroll/cycles/{id}/approve': {
      post: {
        tags: ['Payroll'],
        summary: 'Approve a payroll cycle',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/payroll': {
      get: {
        tags: ['Payroll'],
        summary: 'Get individual payrolls',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'cycleId', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'employeeId', in: 'query', required: false, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/payroll/{id}/adjust': {
      post: {
        tags: ['Payroll'],
        summary: 'Manually adjust an individual payroll (Bonus/Penalty)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['BONUS', 'PENALTY', 'ADVANCE_RECOVERY', 'INCENTIVE'] },
                  amount: { type: 'number' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/payroll/{id}/payslip': {
      post: {
        tags: ['Payroll'],
        summary: 'Generate digital payslip for a payroll',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/attendance/shifts': {
      get: {
        tags: ['Attendance'],
        summary: 'Get all active shifts',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      },
      post: {
        tags: ['Attendance'],
        summary: 'Create a new shift',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  shiftType: { type: 'string', enum: ['MORNING', 'EVENING', 'NIGHT', 'SPLIT', 'FLEXIBLE', 'TEMPORARY', 'HOLIDAY'] },
                  startTime: { type: 'string' },
                  endTime: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/attendance/shifts/assign': {
      post: {
        tags: ['Attendance'],
        summary: 'Assign a shift to an employee',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  employeeId: { type: 'string' },
                  shiftId: { type: 'string' },
                  startDate: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/attendance/check-in': {
      post: {
        tags: ['Attendance'],
        summary: 'Employee Check-In',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  method: { type: 'string', enum: ['QR_CODE', 'PIN', 'MOBILE_APP', 'MANUAL_ENTRY'] },
                  location: { type: 'object', properties: { lat: { type: 'number' }, lng: { type: 'number' } } }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/attendance/check-out': {
      post: {
        tags: ['Attendance'],
        summary: 'Employee Check-Out',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  method: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/attendance/leave': {
      post: {
        tags: ['Attendance'],
        summary: 'Apply for Leave',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  leaveType: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  totalDays: { type: 'number' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/attendance/leave/{id}/approve': {
      post: {
        tags: ['Attendance'],
        summary: 'Approve Leave Request',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/procurement/suppliers': {
      get: {
        tags: ['Procurement'],
        summary: 'Get all suppliers',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      },
      post: {
        tags: ['Procurement'],
        summary: 'Register a new supplier',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  companyName: { type: 'string' },
                  gstNumber: { type: 'string' },
                  isPreferred: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/procurement/orders': {
      get: {
        tags: ['Procurement'],
        summary: 'Get Purchase Orders',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      },
      post: {
        tags: ['Procurement'],
        summary: 'Create a Purchase Order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  branchId: { type: 'string' },
                  supplierId: { type: 'string' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string' },
                        expectedQuantity: { type: 'number' },
                        unitPrice: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/procurement/orders/{id}/approve': {
      post: {
        tags: ['Procurement'],
        summary: 'Approve a Purchase Order',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/procurement/orders/{id}/receive': {
      post: {
        tags: ['Procurement'],
        summary: 'Receive Goods (GRN)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        purchaseOrderItemId: { type: 'string' },
                        productId: { type: 'string' },
                        acceptedQuantity: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Created' } }
      }
    },
    '/api/v1/analytics/revenue': {
      get: {
        tags: ['Analytics'],
        summary: 'Get Revenue Analytics',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/analytics/bookings': {
      get: {
        tags: ['Analytics'],
        summary: 'Get Booking Analytics',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'branchId', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/analytics/dashboard/live': {
      get: {
        tags: ['Analytics'],
        summary: 'Get Live Dashboard Metrics',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'branchId', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/reports/generate': {
      post: {
        tags: ['Reports'],
        summary: 'Request Asynchronous Report Generation',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  reportCode: { type: 'string' },
                  format: { type: 'string', enum: ['CSV', 'PDF', 'EXCEL'] },
                  parameters: {
                    type: 'object',
                    properties: {
                      startDate: { type: 'string', format: 'date-time' },
                      endDate: { type: 'string', format: 'date-time' }
                    }
                  },
                  branchId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 202: { description: 'Accepted - Processing in Background' } }
      }
    },
    '/api/v1/reports/{id}/status': {
      get: {
        tags: ['Reports'],
        summary: 'Check Async Report Status',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/reports/{id}/download': {
      get: {
        tags: ['Reports'],
        summary: 'Download Generated Report (Logs Export Audit)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success - Returns file URL' } }
      }
    },
    '/api/v1/dashboards/me': {
      get: {
        tags: ['Dashboards'],
        summary: 'Get Hydrated Role-Based Dashboard',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success - Returns Layout Grid & Aggregated Data' } }
      }
    },
    '/api/v1/dashboards/preferences': {
      put: {
        tags: ['Dashboards'],
        summary: 'Save Dashboard Preferences',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  theme: { type: 'string' },
                  refreshInterval: { type: 'number' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/forecasts/revenue': {
      get: {
        tags: ['Forecasting'],
        summary: 'Get AI Revenue Forecast',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success - Returns Forecast Snapshot' } }
      }
    },
    '/api/v1/forecasts/recommendations': {
      get: {
        tags: ['Forecasting'],
        summary: 'Get AI Business Recommendations',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/forecasts/recommendations/{id}/action': {
      post: {
        tags: ['Forecasting'],
        summary: 'Accept or Reject Recommendation',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['ACCEPTED', 'REJECTED', 'IGNORED'] }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/tenants/config/me': {
      get: {
        tags: ['Tenants'],
        summary: 'Get Tenant Configuration',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/tenants': {
      post: {
        tags: ['Tenants'],
        summary: 'Create Tenant Pipeline (SuperAdmin Only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tenantName: { type: 'string' },
                  email: { type: 'string' },
                  plan: { type: 'string', enum: ['FREE_TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'] }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Success' } }
      }
    },
    '/api/v1/tenants/{id}/suspend': {
      put: {
        tags: ['Tenants'],
        summary: 'Suspend Tenant (SuperAdmin Only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/rbac/me/permissions': {
      get: {
        tags: ['RBAC'],
        summary: 'Get Resolvable User Permissions (Used for UI rendering)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/rbac/assign': {
      post: {
        tags: ['RBAC'],
        summary: 'Assign Role to User',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  roleId: { type: 'string' },
                  tenantId: { type: 'string' },
                  branchId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Success' } }
      }
    },
    '/api/v1/audit/logs': {
      get: {
        tags: ['Audit & Compliance'],
        summary: 'Get Immutable Audit Logs',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'module', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/config/settings': {
      post: {
        tags: ['Platform Settings'],
        summary: 'Create or Update a Settings Key',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                  type: { type: 'string' },
                  level: { type: 'string', enum: ['GLOBAL', 'TENANT', 'BRANCH'] },
                  tenantId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/config/settings/{key}/resolve': {
      get: {
        tags: ['Platform Settings'],
        summary: 'Resolve Configuration Key hierarchically',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'key', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'tenantId', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/monitoring/dashboard': {
      get: {
        tags: ['Monitoring & Observability'],
        summary: 'Get Live System Health Dashboard',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/security/sessions': {
      get: {
        tags: ['Security Hardening'],
        summary: 'Get Active User Device Sessions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/security/block-ip': {
      post: {
        tags: ['Security Hardening'],
        summary: 'Manually Block Malicious IP Address',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ipAddress: { type: 'string' },
                  reason: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/security/dashboard': {
      get: {
        tags: ['Security Hardening'],
        summary: 'Get Threat and Blocked IP Dashboard',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/versioning/registry': {
      get: {
        tags: ['API Versioning & Compatibility'],
        summary: 'Get all API versions and lifecycle status',
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/backup/dashboard': {
      get: {
        tags: ['Backup & Disaster Recovery'],
        summary: 'Get Backup and Restore History Dashboard',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/backup/trigger': {
      post: {
        tags: ['Backup & Disaster Recovery'],
        summary: 'Manually trigger a backup',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['DATABASE', 'REDIS', 'MEDIA', 'CONFIG'] }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Backup Started' } }
      }
    },
    '/api/v1/deployment/history': {
      get: {
        tags: ['CI/CD & Deployment Engine'],
        summary: 'Get Deployment History',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/api/v1/deployment/releases': {
      get: {
        tags: ['CI/CD & Deployment Engine'],
        summary: 'Get Release History',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
      }
    }
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
