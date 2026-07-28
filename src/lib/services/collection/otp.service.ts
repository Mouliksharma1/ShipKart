import { db as prisma } from '@/lib/db';

export async function generateOTP(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    throw new Error('Parcel booking not found');
  }

  // Generate 6-digit numeric OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

  const otpRecord = await prisma.collectionOTP.upsert({
    where: { bookingId },
    update: {
      otp: otpCode,
      expiresAt,
      verifiedAt: null
    },
    create: {
      bookingId,
      otp: otpCode,
      expiresAt
    }
  });

  return {
    otp: otpRecord.otp,
    expiresAt: otpRecord.expiresAt,
    receiverPhone: booking.receiverPhone,
    receiverName: booking.receiverName
  };
}

export async function verifyOTP(bookingId: string, inputOtp: string) {
  const otpRecord = await prisma.collectionOTP.findUnique({
    where: { bookingId }
  });

  if (!otpRecord) {
    throw new Error('No OTP generated for this collection. Please generate OTP first.');
  }

  if (new Date() > new Date(otpRecord.expiresAt)) {
    throw new Error('OTP has expired. Please generate a new OTP.');
  }

  if (otpRecord.otp !== inputOtp.trim()) {
    throw new Error('Invalid OTP entered. Please verify and try again.');
  }

  const updatedRecord = await prisma.collectionOTP.update({
    where: { bookingId },
    data: { verifiedAt: new Date() }
  });

  return { success: true, verifiedAt: updatedRecord.verifiedAt };
}

export async function resendOTP(bookingId: string) {
  return generateOTP(bookingId);
}
