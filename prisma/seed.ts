import "dotenv/config";
import { db } from "@/lib/db";
import { ParcelType } from "@prisma/client";

export async function seed() {
  console.log("🌱 Seeding ShipKart initial data & normalized pricing engine...");

  // 1. Company Settings
  await db.companySettings.upsert({
    where: { id: "default" },
    update: {
      address: "45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass, Jodhpur, Rajasthan 342001",
    },
    create: {
      id: "default",
      companyName: "POOJA TRAVELS & CARGO",
      tagline: "Powered by POOJA TRAVELS & CARGO",
      helpline1: "6350603414",
      helpline2: "7852091119",
      helpline3: "0291-2651955",
      address: "45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass, Jodhpur, Rajasthan 342001",
      upiId: "6350603414@upi",
    },
  });

  // 1.5. Admin User Seed
  await db.user.upsert({
    where: { phone: "6350603414" },
    update: {
      email: "admin@shipKart.com",
      role: "ADMIN",
      name: "Pooja Travels Admin",
      status: true,
    },
    create: {
      name: "Pooja Travels Admin",
      email: "admin@shipKart.com",
      phone: "6350603414",
      role: "ADMIN",
      status: true,
    },
  });

  // 2. Head Office
  const headOffice = await db.officeMaster.upsert({
    where: { name: "Pooja Travels Head Office - Jodhpur" },
    update: {
      address: "45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass, Jodhpur, Rajasthan 342001",
      openingTime: "04:00 AM",
      closingTime: "11:00 PM",
    },
    create: {
      name: "Pooja Travels Head Office - Jodhpur",
      code: "JDH-HO",
      address: "45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass, Jodhpur, Rajasthan 342001",
      city: "Jodhpur",
      state: "Rajasthan",
      pinCode: "342001",
      country: "India",
      phone: "6350603414",
      altPhone: "02912651955",
      managerName: "Head Office Manager",
      managerPhone: "7852091119",
      latitude: 26.285498,
      longitude: 73.018264,
      googleMapsUrl: "https://maps.google.com/?q=26.285498,73.018264",
      openingTime: "04:00 AM",
      closingTime: "11:00 PM",
      officeTiming: "04:00 AM - 11:00 PM",
      status: true,
    },
  });

  // 3. Initial Destination Branch Offices
  const branchesData = [
    // Inside Rajasthan
    { name: "Jaipur Office", code: "JPR01", city: "Jaipur", state: "Rajasthan", pinCode: "302001", phone: "7852091119", lat: 26.92207, lng: 75.7946 },
    { name: "Ajmer Office", code: "AJM01", city: "Ajmer", state: "Rajasthan", pinCode: "305001", phone: "6350603414", lat: 26.4499, lng: 74.6399 },
    { name: "Beawar Office", code: "BWR01", city: "Beawar", state: "Rajasthan", pinCode: "305901", phone: "6350603414", lat: 26.1012, lng: 74.3174 },
    { name: "Nasirabad Office", code: "NAS01", city: "Nasirabad", state: "Rajasthan", pinCode: "305601", phone: "6350603414", lat: 26.3023, lng: 74.7369 },
    { name: "Kekri Office", code: "KKR01", city: "Kekri", state: "Rajasthan", pinCode: "305404", phone: "6350603414", lat: 25.9734, lng: 75.1528 },
    { name: "Bundi Office", code: "BND01", city: "Bundi", state: "Rajasthan", pinCode: "323001", phone: "6350603414", lat: 25.4415, lng: 75.6456 },
    { name: "Deoli Office", code: "DEO01", city: "Deoli", state: "Rajasthan", pinCode: "304804", phone: "6350603414", lat: 25.7601, lng: 75.3842 },
    { name: "Nathdwara Office", code: "NTD01", city: "Nathdwara", state: "Rajasthan", pinCode: "313301", phone: "6350603414", lat: 24.9317, lng: 73.8188 },
    { name: "Udaipur Office", code: "UDP01", city: "Udaipur", state: "Rajasthan", pinCode: "313001", phone: "6350603414", lat: 24.5854, lng: 73.7125 },
    { name: "Bikaner Office", code: "BKN01", city: "Bikaner", state: "Rajasthan", pinCode: "334001", phone: "6350603414", lat: 28.0229, lng: 73.3119 },
    { name: "Sri Ganganagar Office", code: "SGN01", city: "Sri Ganganagar", state: "Rajasthan", pinCode: "335001", phone: "6350603414", lat: 29.9038, lng: 73.8772 },
    { name: "Churu Office", code: "CHU01", city: "Churu", state: "Rajasthan", pinCode: "331001", phone: "6350603414", lat: 28.29, lng: 74.9667 },
    { name: "Sikar Office", code: "SKR01", city: "Sikar", state: "Rajasthan", pinCode: "332001", phone: "6350603414", lat: 27.6094, lng: 75.1398 },
    { name: "Sarwar Office", code: "SRW01", city: "Sarwar", state: "Rajasthan", pinCode: "305403", phone: "6350603414", lat: 26.0645, lng: 75.0068 },
    
    // Outside Rajasthan
    { name: "Delhi Office", code: "DEL-HQ", city: "Delhi", state: "Delhi", pinCode: "110006", phone: "6350603414", lat: 28.6562, lng: 77.241 },
    { name: "Meerut Office", code: "MRT01", city: "Meerut", state: "Uttar Pradesh", pinCode: "250002", phone: "6350603414", lat: 28.9845, lng: 77.7064 },
    { name: "Moradabad Office", code: "MDB01", city: "Moradabad", state: "Uttar Pradesh", pinCode: "244001", phone: "6350603414", lat: 28.8386, lng: 78.7733 },
    { name: "Firozabad Office", code: "FZD01", city: "Firozabad", state: "Uttar Pradesh", pinCode: "283203", phone: "6350603414", lat: 27.1592, lng: 78.3957 },
    { name: "Guna Office", code: "GNA01", city: "Guna", state: "Madhya Pradesh", pinCode: "473001", phone: "6350603414", lat: 24.6467, lng: 77.3114 },
  ];

  const createdOfficesMap = new Map<string, string>();
  createdOfficesMap.set(headOffice.name, headOffice.id);

  for (const b of branchesData) {
    const existingOffice = await db.officeMaster.findFirst({
      where: {
        OR: [{ name: b.name }, { code: b.code }],
      },
    });

    const office = existingOffice
      ? await db.officeMaster.update({
          where: { id: existingOffice.id },
          data: { code: b.code, name: b.name },
        })
      : await db.officeMaster.create({
          data: {
            name: b.name,
            code: b.code,
            address: `${b.name} Center, ${b.city}, ${b.state} ${b.pinCode}`,
            city: b.city,
            state: b.state,
            pinCode: b.pinCode,
            country: "India",
            phone: b.phone,
            latitude: b.lat,
            longitude: b.lng,
            openingTime: "04:00 AM",
            closingTime: "11:00 PM",
            officeTiming: "04:00 AM - 11:00 PM",
            status: true,
          },
        });
    createdOfficesMap.set(b.name, office.id);
  }

  // 4. Normalized Pricing Groups & Pricing Rules
  const rajasthanPricing = await db.pricingGroup.upsert({
    where: { name: "Rajasthan Standard Group" },
    update: { isRajasthan: true, status: true },
    create: {
      name: "Rajasthan Standard Group",
      description: "Standard intra-state tariff for all stations inside Rajasthan",
      isRajasthan: true,
      status: true,
    },
  });

  const rajasthanRules = [
    { parcelType: ParcelType.ENVELOPE, selfPrice: 99, taxiPrice: null, displayOrder: 1 },
    { parcelType: ParcelType.BOX, selfPrice: 149, taxiPrice: 169, displayOrder: 2 },
    { parcelType: ParcelType.MEDIUM_PARCEL, selfPrice: 199, taxiPrice: 219, displayOrder: 3 },
    { parcelType: ParcelType.LARGE_BUNDLE, selfPrice: 249, taxiPrice: 269, displayOrder: 4 },
  ];

  for (const r of rajasthanRules) {
    await db.pricingRule.upsert({
      where: {
        pricingGroupId_parcelType: {
          pricingGroupId: rajasthanPricing.id,
          parcelType: r.parcelType,
        },
      },
      update: {
        selfPrice: r.selfPrice,
        taxiPrice: r.taxiPrice,
        displayOrder: r.displayOrder,
      },
      create: {
        pricingGroupId: rajasthanPricing.id,
        parcelType: r.parcelType,
        selfPrice: r.selfPrice,
        taxiPrice: r.taxiPrice,
        displayOrder: r.displayOrder,
      },
    });
  }

  const outsidePricing = await db.pricingGroup.upsert({
    where: { name: "Outside Rajasthan Standard Group" },
    update: { isRajasthan: false, status: true },
    create: {
      name: "Outside Rajasthan Standard Group",
      description: "Standard interstate tariff for Delhi, UP, MP, and Gujarat stations",
      isRajasthan: false,
      status: true,
    },
  });

  const outsideRules = [
    { parcelType: ParcelType.ENVELOPE, selfPrice: 199, taxiPrice: null, displayOrder: 1 },
    { parcelType: ParcelType.BOX, selfPrice: 399, taxiPrice: 429, displayOrder: 2 },
    { parcelType: ParcelType.MEDIUM_PARCEL, selfPrice: 499, taxiPrice: 519, displayOrder: 3 },
    { parcelType: ParcelType.LARGE_BUNDLE, selfPrice: 599, taxiPrice: 619, displayOrder: 4 },
  ];

  for (const r of outsideRules) {
    await db.pricingRule.upsert({
      where: {
        pricingGroupId_parcelType: {
          pricingGroupId: outsidePricing.id,
          parcelType: r.parcelType,
        },
      },
      update: {
        selfPrice: r.selfPrice,
        taxiPrice: r.taxiPrice,
        displayOrder: r.displayOrder,
      },
      create: {
        pricingGroupId: outsidePricing.id,
        parcelType: r.parcelType,
        selfPrice: r.selfPrice,
        taxiPrice: r.taxiPrice,
        displayOrder: r.displayOrder,
      },
    });
  }

  // 5. Initial Routes Setup from Head Office (Jodhpur) to All Destination Offices
  for (const b of branchesData) {
    const destId = createdOfficesMap.get(b.name);
    if (destId) {
      const isRaj = b.state === "Rajasthan";
      await db.routeMaster.upsert({
        where: {
          originOfficeId_destinationOfficeId: {
            originOfficeId: headOffice.id,
            destinationOfficeId: destId,
          },
        },
        update: {},
        create: {
          originOfficeId: headOffice.id,
          destinationOfficeId: destId,
          etaHours: isRaj ? 6.0 : 12.0,
          distanceKm: isRaj ? 300.0 : 650.0,
          operatingDays: "Daily",
          departureTime: "08:00 PM",
          arrivalTime: "06:00 AM",
          status: true,
          routeStatus: "ACTIVE",
          pricingGroupId: isRaj ? rajasthanPricing.id : outsidePricing.id,
        },
      });
    }
  }

  // 6. Status Master
  const statuses = [
    { name: "Draft", order: 1, color: "#9ca3af" },
    { name: "Booked", order: 2, color: "#3b82f6" },
    { name: "Pickup Requested", order: 3, color: "#8b5cf6" },
    { name: "Received At Origin Office", order: 4, color: "#0284c7" },
    { name: "Loaded", order: 5, color: "#eab308" },
    { name: "In Transit", order: 6, color: "#f97316" },
    { name: "Arrived At Destination Office", order: 7, color: "#a855f7" },
    { name: "Ready For Collection", order: 8, color: "#06b6d4" },
    { name: "Collected", order: 9, color: "#22c55e" },
    { name: "Completed", order: 10, color: "#16a34a" },
    { name: "Cancelled", order: 11, color: "#ef4444" },
  ];

  for (const s of statuses) {
    await db.statusMaster.upsert({
      where: { name: s.name },
      update: { order: s.order, color: s.color },
      create: s,
    });
  }

  // 7. LR Sequence Init (Global Monotonic Sequence)
  const existingSeq = await db.lRSequence.findFirst();
  if (!existingSeq) {
    await db.lRSequence.create({
      data: { id: 1, lastNumber: 0 },
    });
  }

  console.log("✅ ShipKart Milestone 4 Normalized Pricing Engine Seeding finished successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
