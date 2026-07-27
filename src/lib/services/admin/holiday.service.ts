import { prisma } from '@/lib/db';

export interface CreateHolidayInput {
  officeId?: string;
  holidayDate: string; // YYYY-MM-DD
  title: string;
  description?: string;
}

export async function createHoliday(input: CreateHolidayInput) {
  return prisma.holiday.create({
    data: {
      officeId: input.officeId || null,
      holidayDate: input.holidayDate,
      title: input.title,
      description: input.description,
    },
  });
}

export async function deleteHoliday(id: string) {
  return prisma.holiday.delete({
    where: { id },
  });
}

export async function getHolidays(officeId?: string) {
  const where: any = {};
  if (officeId) {
    where.OR = [{ officeId }, { officeId: null }];
  }
  return prisma.holiday.findMany({
    where,
    include: { office: { select: { id: true, name: true } } },
    orderBy: { holidayDate: 'asc' },
  });
}

export async function isOfficeClosedOnDate(officeId: string, dateStr: string): Promise<{ closed: boolean; reason?: string }> {
  // Check explicit holiday model
  const holiday = await prisma.holiday.findFirst({
    where: {
      holidayDate: dateStr,
      OR: [{ officeId }, { officeId: null }],
    },
  });

  if (holiday) {
    return { closed: true, reason: `Holiday: ${holiday.title}` };
  }

  return { closed: false };
}
