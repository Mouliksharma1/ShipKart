import { ProviderSendOptions, ProviderResponse } from './whatsapp';

export class SMSProvider {
  static providerName = 'ShipKart FastSMS Gateway';

  static async validate(to: string): Promise<boolean> {
    const cleaned = to.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
  }

  static async healthCheck(): Promise<{ status: 'HEALTHY' | 'DEGRADED' | 'DOWN'; responseTimeMs: number }> {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 30));
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
        providerMessageId: `sms_err_${Date.now()}`,
        provider: this.providerName,
        error: `Invalid SMS phone number: ${options.to}`,
        timestamp: new Date(),
      };
    }

    await new Promise((r) => setTimeout(r, 80));

    return {
      success: true,
      providerMessageId: `sms_msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      provider: this.providerName,
      timestamp: new Date(),
    };
  }
}
