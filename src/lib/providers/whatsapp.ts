import { NotificationChannel } from '@prisma/client';

export interface ProviderSendOptions {
  to: string;
  message: string;
  title?: string | null;
  attachmentUrl?: string | null;
  metadata?: Record<string, unknown>;
}

export interface ProviderResponse {
  success: boolean;
  providerMessageId: string;
  provider: string;
  error?: string;
  timestamp: Date;
}

export class WhatsAppProvider {
  static providerName = 'WhatsApp Business API (Pooja Cargo)';

  static async validate(to: string): Promise<boolean> {
    // Basic phone validation (E.164 or 10-digit Indian mobile)
    const cleaned = to.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
  }

  static async healthCheck(): Promise<{ status: 'HEALTHY' | 'DEGRADED' | 'DOWN'; responseTimeMs: number }> {
    const start = Date.now();
    // Simulate ping
    await new Promise((r) => setTimeout(r, 45));
    return {
      status: 'HEALTHY',
      responseTimeMs: Date.now() - start,
    };
  }

  static async send(options: ProviderSendOptions): Promise<ProviderResponse> {
    const isValid = await this.validate(options.to);
    if (!isValid) {
      return {
        success: false,
        providerMessageId: `wa_err_${Date.now()}`,
        provider: this.providerName,
        error: `Invalid phone number format: ${options.to}`,
        timestamp: new Date(),
      };
    }

    // Simulate sending via WhatsApp Cloud API / Twilio WhatsApp
    await new Promise((r) => setTimeout(r, 120));

    return {
      success: true,
      providerMessageId: `wa_msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      provider: this.providerName,
      timestamp: new Date(),
    };
  }
}
