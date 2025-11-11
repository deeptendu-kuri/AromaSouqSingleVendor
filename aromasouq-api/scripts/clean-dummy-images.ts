import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDummyImages() {
  console.log('🧹 Cleaning dummy Unsplash images from database...\n');

  try {
    // Find products with Unsplash images
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        images: true,
      },
    });

    const productsWithDummyImages = allProducts.filter(product =>
      product.images &&
      Array.isArray(product.images) &&
      product.images.some((img: any) =>
        typeof img === 'string' && img.includes('unsplash')
      )
    );

    console.log(`Found ${productsWithDummyImages.length} products with dummy Unsplash images\n`);

    if (productsWithDummyImages.length === 0) {
      console.log('✅ No dummy images found!');
      return;
    }

    // Clean each product
    for (const product of productsWithDummyImages) {
      console.log(`Cleaning: ${product.name}`);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: [], // Set to empty array
        },
      });
    }

    console.log(`\n✅ Cleaned ${productsWithDummyImages.length} products`);
    console.log('All dummy Unsplash images removed from database!');

  } catch (error) {
    console.error('Error cleaning images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDummyImages();
