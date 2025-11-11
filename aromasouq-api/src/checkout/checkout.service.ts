import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuickCheckoutDto } from './dto/quick-checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async quickCheckout(userId: string, dto: QuickCheckoutDto) {
    const {
      productId,
      variantId,
      quantity,
      addressId,
      deliveryMethod,
      paymentMethod,
      coinsToUse = 0,
      giftOptions,
    } = dto;

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get price (from variant if specified, otherwise from product)
    let price = product.price;
    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }
      price = variant.price;
    }

    // Verify address belongs to user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('Address does not belong to user');
    }

    // Calculate totals
    const subtotal = price * quantity;
    const shippingFee = deliveryMethod === 'EXPRESS' ? 25 : deliveryMethod === 'STANDARD' ? 15 : 0;

    // Calculate gift wrapping cost
    let giftWrappingCost = 0;
    if (giftOptions?.giftWrapping) {
      giftWrappingCost =
        giftOptions.giftWrapping === 'BASIC'
          ? 10
          : giftOptions.giftWrapping === 'PREMIUM'
          ? 20
          : 35; // LUXURY
    }

    // Handle coins usage
    let coinsDiscount = 0;
    let coinsUsed = 0;

    if (coinsToUse > 0) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.coinsBalance < coinsToUse) {
        throw new BadRequestException('Insufficient coins balance');
      }

      // 1 coin = 1 AED discount, maximum 50% of subtotal
      const maxCoinsDiscount = subtotal * 0.5;
      coinsDiscount = Math.min(coinsToUse * 1.0, maxCoinsDiscount);
      coinsUsed = Math.floor(coinsDiscount);
    }

    const tax = (subtotal - coinsDiscount + shippingFee + giftWrappingCost) * 0.05;
    const total = subtotal - coinsDiscount + shippingFee + giftWrappingCost + tax;

    // Calculate coins to earn
    const coinsEarned = Math.floor(total / 10);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          paymentMethod,
          subtotal,
          tax,
          shippingFee: shippingFee,
          giftWrappingFee: giftWrappingCost,
          discount: coinsDiscount,
          total,
          coinsUsed,
          coinsEarned,
          items: {
            create: {
              productId,
              quantity,
              price,
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      // Update user's coins if used
      if (coinsUsed > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            coinsBalance: {
              decrement: coinsUsed,
            },
          },
        });
      }

      return newOrder;
    });

    return {
      id: order.id,
      orderNumber: order.orderNumber,
    };
  }
}
