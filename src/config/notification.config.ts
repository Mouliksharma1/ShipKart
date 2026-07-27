import { NotificationChannel } from '@prisma/client';

export const NOTIFICATION_CONFIG = {
  PROVIDER_PRIORITY: [
    NotificationChannel.WHATSAPP,
    NotificationChannel.SMS,
    NotificationChannel.EMAIL,
    NotificationChannel.PUSH,
  ] as NotificationChannel[],

  RETRY_DELAYS_MINUTES: [5, 15, 30],
  MAX_RETRIES: 3,
  BATCH_SIZE: 50,
  LOCK_TIMEOUT_SECONDS: 300, // 5 minutes queue lock timeout

  RATE_LIMITS: {
    [NotificationChannel.WHATSAPP]: 100, // messages per minute
    [NotificationChannel.SMS]: 500,
    [NotificationChannel.EMAIL]: 1000,
    [NotificationChannel.PUSH]: 1000,
  },

  MODE: (process.env.NOTIFICATION_MODE || 'mock') as 'mock' | 'production',
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'smtp',
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '1025', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FCM_ENABLED: process.env.FCM_ENABLED === 'true',

  DEFAULT_LANGUAGE: 'en',

  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  ],
};

let hasPrintedBanner = false;
export function printStartupBanner() {
  if (hasPrintedBanner) return;
  hasPrintedBanner = true;

  const isMock = NOTIFICATION_CONFIG.MODE === 'mock';
  const emailName = NOTIFICATION_CONFIG.EMAIL_PROVIDER === 'smtp' ? 'Local SMTP (Mailpit)' : 'Resend / AWS SES';
  const pushName = NOTIFICATION_CONFIG.FCM_ENABLED ? 'Firebase Cloud Messaging' : 'Disabled';

  console.log(`
====================================
ShipKart Notification Environment
====================================

Mode        : ${NOTIFICATION_CONFIG.MODE.toUpperCase()}

Email       : ${emailName}

SMTP Host   : ${NOTIFICATION_CONFIG.SMTP_HOST}

SMTP Port   : ${NOTIFICATION_CONFIG.SMTP_PORT}

Push        : ${pushName}

WhatsApp    : ${isMock ? 'Mock' : 'Production API'}

SMS         : ${isMock ? 'Mock' : 'Production Gateway'}

====================================
`);
}

if (process.env.NODE_ENV !== 'test') {
  printStartupBanner();
}
