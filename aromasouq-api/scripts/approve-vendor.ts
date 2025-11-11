import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function approveVendor(userEmail: string) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { vendorProfile: true },
    });

    if (!user) {
      console.error('❌ User not found');
      return;
    }

    if (user.role !== 'VENDOR') {
      console.error('❌ User is not a vendor');
      return;
    }

    if (!user.vendorProfile) {
      console.error('❌ Vendor profile not found');
      return;
    }

    // Update vendor status
    const updatedVendor = await prisma.vendor.update({
      where: { userId: user.id },
      data: {
        status: 'APPROVED',
        verifiedAt: new Date(),
      },
    });

    console.log('✅ Vendor approved successfully!');
    console.log('📧 Email:', user.email);
    console.log('🏪 Business:', updatedVendor.businessName);
    console.log('✅ Status:', updatedVendor.status);
    console.log('📅 Verified At:', updatedVendor.verifiedAt);
  } catch (error) {
    console.error('❌ Error approving vendor:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
const email = process.argv[2] || 'deeptendukuri@gmail.com';
approveVendor(email);
