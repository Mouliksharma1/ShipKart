import { ProviderSendOptions, ProviderResponse } from './whatsapp';
import { NOTIFICATION_CONFIG } from '@/config/notification.config';

export class PushProvider {
  static providerName = 'ShipKart Web & Mobile Push Notification Engine';

  static async validate(to: string): Promise<boolean> {
    return to.length > 5;
  }

  static async healthCheck(): Promise<{ status: 'HEALTHY' | 'DEGRADED' | 'DOWN'; responseTimeMs: number }> {
    if (!NOTIFICATION_CONFIG.FCM_ENABLED) {
      return {
        status: 'DEGRADED',
        responseTimeMs: 0,
      };
    }
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 20));
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
        providerMessageId: `push_err_${Date.now()}`,
        provider: this.providerName,
        error: `Invalid Push Token / Device ID: ${options.to}`,
        timestamp: new Date(),
      };
    }

    await new Promise((r) => setTimeout(r, 40));

    return {
      success: true,
      providerMessageId: `push_msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      provider: this.providerName,
      timestamp: new Date(),
    };
  }
}
