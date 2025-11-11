import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { id: '91a326b6-7dec-4233-8f5a-2a1ec636efd3' },
    data: {
      coinsBalance: 100,
    },
    select: {
      id: true,
      email: true,
      coinsBalance: true,
    },
  });

  console.log('User coins updated:', JSON.stringify(user));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
