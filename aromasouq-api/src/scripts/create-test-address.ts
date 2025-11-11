import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const address = await prisma.address.create({
    data: {
      userId: '91a326b6-7dec-4233-8f5a-2a1ec636efd3',
      fullName: 'Cart Tester',
      phone: '+971501234567',
      addressLine1: '123 Dubai Mall, Downtown',
      city: 'Dubai',
      state: 'Dubai',
      country: 'UAE',
      zipCode: '12345',
      isDefault: true,
    },
  });

  console.log('Address created:', JSON.stringify(address));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
