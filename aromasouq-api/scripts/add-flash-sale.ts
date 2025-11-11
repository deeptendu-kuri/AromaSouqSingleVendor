import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addFlashSale() {
  console.log('🔥 Adding flash sale to products...\n');

  try {
    // Get 5 random products to put on sale
    const products = await prisma.product.findMany({
      take: 5,
      where: {
        isActive: true,
        stock: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
      },
    });

    console.log(`Found ${products.length} products to put on flash sale:\n`);

    // Calculate sale end date (24 hours from now)
    const saleEndDate = new Date();
    saleEndDate.setHours(saleEndDate.getHours() + 24);

    for (const product of products) {
      // Calculate 30-50% discount
      const discountPercent = Math.floor(Math.random() * 21) + 30; // 30-50%
      const newSalePrice = Math.round(product.price * (1 - discountPercent / 100));

      await prisma.product.update({
        where: { id: product.id },
        data: {
          isOnSale: true,
          salePrice: newSalePrice,
          discountPercent: discountPercent,
          saleEndDate: saleEndDate,
        },
      });

      console.log(`✅ ${product.name}`);
      console.log(`   Price: AED ${product.price} → AED ${newSalePrice} (${discountPercent}% OFF)`);
      console.log(`   Ends: ${saleEndDate.toLocaleString()}\n`);
    }

    console.log(`\n🎉 Successfully added ${products.length} products to flash sale!`);
    console.log(`Sale ends: ${saleEndDate.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error adding flash sale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFlashSale();
