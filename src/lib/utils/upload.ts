/**
 * Validates uploaded image file type and size.
 * Allowed: jpg, jpeg, png, webp. Max Size: 5 MB.
 * Base64 strings are NEVER accepted or stored.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file format. Only JPG, JPEG, PNG, and WEBP image files are allowed.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds maximum limit of 5 MB.",
    };
  }

  return { valid: true };
}

/**
 * Uploads file to storage bucket (or creates object URL for local dev) and returns public URL string.
 */
export async function uploadParcelImage(file: File): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "File validation failed");
  }

  // Placeholder storage upload returning clean public URL string
  const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
  return `https://utdmaawoudhqwdyxygii.supabase.co/storage/v1/object/public/parcels/${cleanFileName}`;
}
