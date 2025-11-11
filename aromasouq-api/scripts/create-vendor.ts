import { PrismaClient, VendorStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const vendorUserId = '63b5f5ce-392e-4e79-89d6-79bd1e957a11';

  const vendor = await prisma.vendor.upsert({
    where: { userId: vendorUserId },
    update: {},
    create: {
      userId: vendorUserId,
      businessName: 'Luxury Fragrances UAE',
      businessNameAr: 'العطور الفاخرة الإمارات',
      businessEmail: 'vendor2@aromasouq.ae',
      businessPhone: '+971501234567',
      description: 'Premium fragrance vendor specializing in luxury perfumes',
      descriptionAr: 'بائع عطور فاخرة متخصص في العطور الفاخرة',
      status: VendorStatus.APPROVED,
    },
  });

  console.log('Vendor created:', vendor);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
