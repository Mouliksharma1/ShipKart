import { db as prisma } from '../src/lib/db';
import { Role, OfficeType, VehicleStatus, RouteStatus } from '@prisma/client';

async function main() {
  console.log('🌱 Seeding Milestone 10 Enterprise Administration Master Data...');

  // 1. Seed Permissions Catalog
  const permissionsData = [
    { module: 'OFFICE', action: 'read', code: 'offices:read', description: 'View office details and list' },
    { module: 'OFFICE', action: 'manage', code: 'offices:manage', description: 'Create and edit branch offices' },
    { module: 'OFFICE', action: 'delete', code: 'offices:delete', description: 'Archive and restore offices' },

    { module: 'EMPLOYEE', action: 'read', code: 'employees:read', description: 'View employee profiles' },
    { module: 'EMPLOYEE', action: 'manage', code: 'employees:manage', description: 'Create, update, and assign staff' },
    { module: 'EMPLOYEE', action: 'security', code: 'employees:security', description: 'Lock/unlock accounts and force password reset' },

    { module: 'VEHICLE', action: 'read', code: 'vehicles:read', description: 'View fleet registry and maintenance logs' },
    { module: 'VEHICLE', action: 'manage', code: 'vehicles:manage', description: 'Register vehicles and add maintenance records' },

    { module: 'ROUTE', action: 'read', code: 'routes:read', description: 'View route network matrix' },
    { module: 'ROUTE', action: 'manage', code: 'routes:manage', description: 'Configure routes and status toggles' },

    { module: 'PRICING', action: 'read', code: 'pricing:read', description: 'View freight tariff rate matrix' },
    { module: 'PRICING', action: 'manage', code: 'pricing:manage', description: 'Create and activate tariff versions' },

    { module: 'SETTINGS', action: 'manage', code: 'settings:manage', description: 'Manage modular enterprise settings and feature flags' },
    { module: 'SYSTEM', action: 'backup', code: 'system:backup', description: 'Export and restore configuration backups' },
  ];

  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: perm,
      create: perm,
    });
  }

  // 2. Seed System Roles
  const rolesData = [
    { name: 'Super Admin', code: 'SUPER_ADMIN', description: 'Full unrestricted system governance', isSystem: true },
    { name: 'Administrator', code: 'ADMIN', description: 'Enterprise administration rights', isSystem: true },
    { name: 'Branch Manager', code: 'MANAGER', description: 'Branch operation & staff management', isSystem: true },
    { name: 'Counter Staff', code: 'COUNTER_EMPLOYEE', description: 'Parcel booking and collection counter', isSystem: fontIsSystem(true) },
    { name: 'Accountant', code: 'ACCOUNTANT', description: 'Financial ledger & closing reports', isSystem: true },
  ];

  function fontIsSystem(val: boolean) { return val; }

  for (const r of rolesData) {
    await prisma.roleModel.upsert({
      where: { code: r.code },
      update: r,
      create: r,
    });
  }

  // 3. Seed Sequence Counter
  const sequenceKeys = ['OFF', 'EMP', 'VEH', 'ROUTE', 'PRICE', 'ACT'];
  for (const key of sequenceKeys) {
    await prisma.sequenceMaster.upsert({
      where: { key },
      update: {},
      create: { key, lastNumber: 10 },
    });
  }

  // 4. Seed Default Head Office & Regional Branches
  const headOffice = await prisma.officeMaster.upsert({
    where: { code: 'JDH01' },
    update: {
      officeCode: 'OFF000001',
      officeType: OfficeType.HEAD_OFFICE,
      maximumStorageCapacity: 5000,
      currentStorageCapacity: 120,
      isActive: true,
    },
    create: {
      officeCode: 'OFF000001',
      name: 'Pooja Travels Jodhpur Head Office',
      code: 'JDH01',
      officeType: OfficeType.HEAD_OFFICE,
      address: '45, Jaswant Building, MG Hospital Rd, Sojati Gate',
      city: 'Jodhpur',
      state: 'Rajasthan',
      pinCode: '342001',
      phone: '6350603414',
      altPhone: '0291-2651955',
      managerName: 'Moulik Sharma',
      managerPhone: '6350603414',
      managerEmail: 'admin@poojatravels.com',
      latitude: 26.2855,
      longitude: 73.0183,
      openingTime: '04:00 AM',
      closingTime: '11:00 PM',
      workingDays: 'Mon-Sun',
      maximumStorageCapacity: 5000,
      currentStorageCapacity: 120,
      status: true,
      isActive: true,
    },
  });

  const jaipurOffice = await prisma.officeMaster.upsert({
    where: { code: 'JPR01' },
    update: {
      officeCode: 'OFF000002',
      officeType: OfficeType.REGIONAL_OFFICE,
      parentOfficeId: headOffice.id,
      maximumStorageCapacity: 3000,
      currentStorageCapacity: 85,
      isActive: true,
    },
    create: {
      officeCode: 'OFF000002',
      name: 'Jaipur Regional Office',
      code: 'JPR01',
      officeType: OfficeType.REGIONAL_OFFICE,
      parentOfficeId: headOffice.id,
      address: '12, Transport Nagar, GT Road',
      city: 'Jaipur',
      state: 'Rajasthan',
      pinCode: '302004',
      phone: '7852091119',
      managerName: 'Rajesh Verma',
      managerPhone: '7852091119',
      managerEmail: 'jaipur@poojatravels.com',
      latitude: 26.9124,
      longitude: 75.7873,
      openingTime: '06:00 AM',
      closingTime: '10:00 PM',
      workingDays: 'Mon-Sat',
      maximumStorageCapacity: 3000,
      currentStorageCapacity: 85,
      status: true,
      isActive: true,
    },
  });

  const kotaOffice = await prisma.officeMaster.upsert({
    where: { code: 'KOTA01' },
    update: {
      officeCode: 'OFF000003',
      officeType: OfficeType.BRANCH,
      parentOfficeId: jaipurOffice.id,
      maximumStorageCapacity: 1500,
      currentStorageCapacity: 40,
      isActive: true,
    },
    create: {
      officeCode: 'OFF000003',
      name: 'Kota Branch Office',
      code: 'KOTA01',
      officeType: OfficeType.BRANCH,
      parentOfficeId: jaipurOffice.id,
      address: '88, Aerodrome Circle',
      city: 'Kota',
      state: 'Rajasthan',
      pinCode: '324007',
      phone: '9829012345',
      managerName: 'Suresh Kumar',
      managerPhone: '9829012345',
      latitude: 25.18,
      longitude: 75.83,
      openingTime: '06:00 AM',
      closingTime: '09:00 PM',
      workingDays: 'Mon-Sat',
      maximumStorageCapacity: 1500,
      currentStorageCapacity: 40,
      status: true,
      isActive: true,
    },
  });

  // 5. Seed Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { phone: '6350603414' },
    update: {
      officeId: headOffice.id,
      role: Role.SUPER_ADMIN,
      employeeCode: 'EMP000001',
    },
    create: {
      employeeCode: 'EMP000001',
      name: 'Moulik Sharma',
      phone: '6350603414',
      email: 'mouliksharma618@gmail.com',
      role: Role.SUPER_ADMIN,
      designation: 'Managing Director & Enterprise Admin',
      officeId: headOffice.id,
      status: true,
      isActive: true,
    },
  });

  // 6. Seed Fleet Vehicles
  await prisma.vehicleMaster.upsert({
    where: { vehicleNumber: 'RJ19-GB-1234' },
    update: {},
    create: {
      vehicleNumber: 'RJ19-GB-1234',
      vehicleType: 'CONTAINER TRUCK (14FT)',
      registrationNumber: 'RJ19GB1234',
      capacityKg: 3500,
      status: VehicleStatus.AVAILABLE,
      driverEmployeeId: adminUser.id,
      driverName: 'Ramesh Singh',
      driverPhone: '9828098765',
      insuranceExpiry: new Date('2027-03-31'),
      permitExpiry: new Date('2027-05-15'),
      fitnessExpiry: new Date('2026-12-31'),
      pollutionExpiry: new Date('2026-10-15'),
      odometer: 45200,
      maintenanceCost: 12500,
      isActive: true,
    },
  });

  // 7. Seed Pricing Version 1
  const pricingGroup = await prisma.pricingGroup.upsert({
    where: { name: 'Rajasthan Standard Freight Tariff v1' },
    update: { status: true, isActive: true },
    create: {
      pricingCode: 'PRICE000001',
      name: 'Rajasthan Standard Freight Tariff v1',
      description: 'Default intra-state freight pricing matrix for Rajasthan',
      version: 1,
      isRajasthan: true,
      status: true,
      isActive: true,
      pricingRules: {
        create: [
          { parcelType: 'ENVELOPE', selfPrice: 40, taxiPrice: null, displayOrder: 1 },
          { parcelType: 'BOX', selfPrice: 100, taxiPrice: 50, displayOrder: 2 },
          { parcelType: 'MEDIUM_PARCEL', selfPrice: 180, taxiPrice: 70, displayOrder: 3 },
          { parcelType: 'LARGE_BUNDLE', selfPrice: 350, taxiPrice: 120, displayOrder: 4 },
        ],
      },
    },
  });

  // 8. Seed Routes
  await prisma.routeMaster.upsert({
    where: {
      originOfficeId_destinationOfficeId: {
        originOfficeId: headOffice.id,
        destinationOfficeId: jaipurOffice.id,
      },
    },
    update: {},
    create: {
      routeCode: 'ROUTE000001',
      originOfficeId: headOffice.id,
      destinationOfficeId: jaipurOffice.id,
      etaHours: 6.5,
      distanceKm: 335.0,
      operatingDays: 'Daily',
      departureTime: '09:00 PM',
      arrivalTime: '03:30 AM',
      isBidirectional: true,
      status: true,
      routeStatus: RouteStatus.ACTIVE,
      pricingGroupId: pricingGroup.id,
      isActive: true,
    },
  });

  // 9. Seed Modular Settings
  await prisma.companySettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  await prisma.bookingSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  await prisma.brandingSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  await prisma.notificationSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  await prisma.financeSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  await prisma.securitySettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  await prisma.systemSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });

  console.log('✅ Milestone 10 Enterprise Administration Master Data Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
