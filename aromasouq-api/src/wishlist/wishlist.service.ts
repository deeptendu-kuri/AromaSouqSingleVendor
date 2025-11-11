import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                nameAr: true,
                logo: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                nameAr: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return wishlistItems;
  }

  async addItem(userId: string, addWishlistItemDto: AddWishlistItemDto) {
    const { productId } = addWishlistItemDto;

    // Verify product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (!product.isActive) {
      throw new NotFoundException('Product is not available');
    }

    // Check if already in wishlist
    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('Product already in wishlist');
    }

    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
    });

    return wishlistItem;
  }

  async removeItem(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { message: 'Product removed from wishlist' };
  }
}
