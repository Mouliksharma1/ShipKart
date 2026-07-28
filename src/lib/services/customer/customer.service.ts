import { db as prisma } from '@/lib/db';

export async function getCustomerProfile(phoneOrEmail: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: phoneOrEmail },
        { email: phoneOrEmail }
      ]
    }
  });

  return user;
}

export async function updateCustomerProfile(phoneOrEmail: string, data: {
  name?: string;
  phone?: string;
  email?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profilePhoto?: string;
}) {
  const user = await getCustomerProfile(phoneOrEmail);

  if (user) {
    return prisma.user.update({
      where: { id: user.id },
      data
    });
  } else {
    // Create new customer profile record automatically
    return prisma.user.create({
      data: {
        phone: data.phone || phoneOrEmail,
        name: data.name || 'Customer User',
        email: data.email || null,
        role: 'CUSTOMER',
        alternatePhone: data.alternatePhone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode
      }
    });
  }
}


export async function getBookingHistory(customerPhone: string, query?: string, statusFilter?: string) {
  const whereClause: any = {
    OR: [
      { senderPhone: customerPhone },
      { receiverPhone: customerPhone }
    ]
  };

  if (statusFilter && statusFilter !== 'ALL') {
    whereClause.status = statusFilter;
  }

  if (query && query.trim() !== '') {
    const q = query.trim();
    whereClause.AND = [
      {
        OR: [
          { lrNumber: { contains: q, mode: 'insensitive' } },
          { receiverName: { contains: q, mode: 'insensitive' } },
          { senderName: { contains: q, mode: 'insensitive' } }
        ]
      }
    ];
  }

  return prisma.booking.findMany({
    where: whereClause,
    include: {
      originOffice: { select: { name: true, city: true } },
      destinationOffice: { select: { name: true, city: true } },
      trackingHistory: { orderBy: { createdAt: 'desc' } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCustomerBookingDetails(bookingIdOrLr: string, customerPhone: string) {
  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id: bookingIdOrLr },
        { lrNumber: bookingIdOrLr }
      ],
      AND: [
        {
          OR: [
            { senderPhone: customerPhone },
            { receiverPhone: customerPhone }
          ]
        }
      ]
    },
    include: {
      originOffice: true,
      destinationOffice: true,
      items: true,
      trackingHistory: { orderBy: { createdAt: 'desc' } },
      collectionOtp: true
    }
  });


  if (!booking) {
    throw new Error('Booking record not found or unauthorized to access this consignment.');
  }

  return booking;
}
