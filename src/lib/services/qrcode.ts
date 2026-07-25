import QRCode from "qrcode";

export type QRCodeOptions = {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
};

/**
 * QR CODE GENERATOR SERVICE
 * Generates QR Code for tracking links (e.g. /track/SK000000001)
 * Supports Data URL (Base64 PNG), SVG String, and Buffer.
 */

export function getTrackingUrl(lrNumber: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shipkart.in";
  return `${baseUrl}/track/${lrNumber}`;
}

export function getLRUrl(lrNumber: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shipkart.in";
  return `${baseUrl}/lr/${lrNumber}`;
}

/**
 * Generate Base64 PNG Data URL for embedding in HTML / React components / PDF
 */
export async function generateQRCodeDataUrl(
  textOrLr: string,
  options?: QRCodeOptions
): Promise<string> {
  const text = textOrLr.startsWith("http") ? textOrLr : getTrackingUrl(textOrLr);
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 200,
      margin: options?.margin || 1,
      color: {
        dark: options?.color?.dark || "#1e3a8a", // Navy blue accent
        light: options?.color?.light || "#ffffff",
      },
    });
  } catch (err) {
    console.error("QR Code Data URL Generation Error:", err);
    throw new Error("Failed to generate QR Code Data URL");
  }
}

/**
 * Generate SVG String
 */
export async function generateQRCodeSvg(
  textOrLr: string,
  options?: QRCodeOptions
): Promise<string> {
  const text = textOrLr.startsWith("http") ? textOrLr : getTrackingUrl(textOrLr);
  try {
    return await QRCode.toString(text, {
      type: "svg",
      width: options?.width || 200,
      margin: options?.margin || 1,
      color: {
        dark: options?.color?.dark || "#1e3a8a",
        light: options?.color?.light || "#ffffff",
      },
    });
  } catch (err) {
    console.error("QR Code SVG Generation Error:", err);
    throw new Error("Failed to generate QR Code SVG");
  }
}

/**
 * Generate PNG Buffer for PDF streams or file downloads
 */
export async function generateQRCodeBuffer(
  textOrLr: string,
  options?: QRCodeOptions
): Promise<Buffer> {
  const text = textOrLr.startsWith("http") ? textOrLr : getTrackingUrl(textOrLr);
  try {
    return await QRCode.toBuffer(text, {
      width: options?.width || 200,
      margin: options?.margin || 1,
      color: {
        dark: options?.color?.dark || "#1e3a8a",
        light: options?.color?.light || "#ffffff",
      },
    });
  } catch (err) {
    console.error("QR Code Buffer Generation Error:", err);
    throw new Error("Failed to generate QR Code Buffer");
  }
}
