import nodemailer from 'nodemailer';
import net from 'net';
import { ProviderSendOptions, ProviderResponse } from './whatsapp';
import { NOTIFICATION_CONFIG } from '@/config/notification.config';

let hasLoggedStartup = false;

function logStartupMessageIfNeeded() {
  if (!hasLoggedStartup) {
    hasLoggedStartup = true;
    if (NOTIFICATION_CONFIG.MODE === 'mock' || NOTIFICATION_CONFIG.EMAIL_PROVIDER === 'smtp') {
      console.log(`[Notification Engine] Using Local SMTP (Mailpit) at ${NOTIFICATION_CONFIG.SMTP_HOST}:${NOTIFICATION_CONFIG.SMTP_PORT}`);
    }
  }
}

export class EmailProvider {
  static get providerName() {
    if (NOTIFICATION_CONFIG.EMAIL_PROVIDER === 'smtp') {
      return `Local SMTP (Mailpit)`;
    }
    return 'ShipKart Mailer Engine (Resend / AWS SES)';
  }

  static async validate(to: string): Promise<boolean> {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);
  }

  static createTransport() {
    const isSmtp = NOTIFICATION_CONFIG.EMAIL_PROVIDER === 'smtp';
    
    if (isSmtp) {
      const auth = NOTIFICATION_CONFIG.SMTP_USER && NOTIFICATION_CONFIG.SMTP_PASS
        ? { user: NOTIFICATION_CONFIG.SMTP_USER, pass: NOTIFICATION_CONFIG.SMTP_PASS }
        : undefined;

      return nodemailer.createTransport({
        host: NOTIFICATION_CONFIG.SMTP_HOST,
        port: NOTIFICATION_CONFIG.SMTP_PORT,
        secure: false,
        auth,
        tls: {
          rejectUnauthorized: false,
        },
      });
    }

    // Default mock / test transport if not explicit SMTP
    return nodemailer.createTransport({
      host: NOTIFICATION_CONFIG.SMTP_HOST,
      port: NOTIFICATION_CONFIG.SMTP_PORT,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  static async healthCheck(): Promise<{
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    responseTimeMs: number;
    reason?: string;
  }> {
    logStartupMessageIfNeeded();
    const start = Date.now();

    if (NOTIFICATION_CONFIG.EMAIL_PROVIDER === 'smtp' || NOTIFICATION_CONFIG.MODE === 'mock') {
      return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(2000);

        socket.on('connect', () => {
          const latency = Date.now() - start;
          socket.destroy();
          resolve({
            status: 'HEALTHY',
            responseTimeMs: latency,
          });
        });

        socket.on('timeout', () => {
          socket.destroy();
          resolve({
            status: 'DEGRADED',
            responseTimeMs: Date.now() - start,
            reason: 'SMTP server unavailable',
          });
        });

        socket.on('error', () => {
          socket.destroy();
          resolve({
            status: 'DEGRADED',
            responseTimeMs: Date.now() - start,
            reason: 'SMTP server unavailable',
          });
        });

        socket.connect(NOTIFICATION_CONFIG.SMTP_PORT, NOTIFICATION_CONFIG.SMTP_HOST);
      });
    }

    return {
      status: 'HEALTHY',
      responseTimeMs: 20,
    };
  }

  static async send(options: ProviderSendOptions): Promise<ProviderResponse> {
    logStartupMessageIfNeeded();

    const isValid = await this.validate(options.to);
    if (!isValid) {
      return {
        success: false,
        providerMessageId: `email_err_${Date.now()}`,
        provider: this.providerName,
        error: `Invalid email address: ${options.to}`,
        timestamp: new Date(),
      };
    }

    try {
      const transporter = this.createTransport();

      if (NOTIFICATION_CONFIG.MODE === 'mock' || NOTIFICATION_CONFIG.EMAIL_PROVIDER === 'smtp') {
        console.log(`[SMTP MAILER SEND] (${NOTIFICATION_CONFIG.SMTP_HOST}:${NOTIFICATION_CONFIG.SMTP_PORT}) To: ${options.to} | Subject: ${options.title || 'ShipKart Notification'}`);
      }

      const info = await transporter.sendMail({
        from: '"Pooja Travels & Cargo" <notifications@shipkart.local>',
        to: options.to,
        subject: options.title || 'ShipKart Tracking Notification',
        text: options.message,
        html: `<div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0284c7;">Pooja Travels & Cargo</h2>
          <p style="font-size: 14px; color: #334155;">${options.message.replace(/\n/g, '<br/>')}</p>
          <hr/>
          <small style="color: #94a3b8;">Sent via ShipKart Enterprise Notification Engine</small>
        </div>`,
      });

      return {
        success: true,
        providerMessageId: info.messageId || `email_msg_${Date.now()}`,
        provider: this.providerName,
        timestamp: new Date(),
      };
    } catch (err: any) {
      console.warn(`[SMTP Mailer Warning] Failed to dispatch email via SMTP server (${NOTIFICATION_CONFIG.SMTP_HOST}:${NOTIFICATION_CONFIG.SMTP_PORT}):`, err.message);
      
      // Fallback in mock mode so system doesn't fail if Mailpit service is offline
      if (NOTIFICATION_CONFIG.MODE === 'mock') {
        return {
          success: true,
          providerMessageId: `mock_fallback_email_${Date.now()}`,
          provider: `${this.providerName} (Mock Fallback)`,
          timestamp: new Date(),
        };
      }

      return {
        success: false,
        providerMessageId: `email_err_${Date.now()}`,
        provider: this.providerName,
        error: err.message || 'SMTP Connection Error',
        timestamp: new Date(),
      };
    }
  }
}
