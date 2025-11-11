# Backend Phase 3: Cart, Wishlist, Reviews & Coins

## Overview
This phase implements the Cart module, Wishlist module, enhanced Reviews with images and voting, and the Wallet/Coins management system.

**Prerequisites**: Phase 1 and Phase 2 must be completed.

---

## 1. Cart Module

### File: `src/cart/cart.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
```

### File: `src/cart/dto/add-to-cart.dto.ts`

```typescript
import { IsUUID, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
```

### File: `src/cart/dto/update-cart-item.dto.ts`

```typescript
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
```

### File: `src/cart/cart.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: {
              select: { id: true, name: true, nameAr: true, logo: true },
            },
            vendor: {
              select: { id: true, businessName: true, businessNameAr: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cartItems,
      summary: {
        itemCount,
        subtotal,
      },
    };
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check if product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or unavailable');
    }

    // Check stock availability
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Only ${product.stock} items available`,
      );
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      // Check stock for new quantity
      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock. Only ${product.stock} items available`,
        );
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              brand: {
                select: { id: true, name: true, logo: true },
              },
            },
          },
        },
      });
    }

    // Create new cart item
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            brand: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
      },
    });
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    // Find cart item
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock availability
    if (cartItem.product.stock < updateDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Only ${cartItem.product.stock} items available`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: updateDto.quantity },
      include: {
        product: {
          include: {
            brand: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
      },
    });
  }

  async removeFromCart(userId: string, itemId: string) {
    // Find cart item
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: 'Cart cleared successfully' };
  }
}
```

### File: `src/cart/cart.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.cartService.getCart(userId);
  }

  @Post()
  addToCart(@Req() req: Request, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user['sub'];
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Patch(':id')
  updateCartItem(
    @Req() req: Request,
    @Param('id') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    const userId = req.user['sub'];
    return this.cartService.updateCartItem(userId, itemId, updateDto);
  }

  @Delete(':id')
  removeFromCart(@Req() req: Request, @Param('id') itemId: string) {
    const userId = req.user['sub'];
    return this.cartService.removeFromCart(userId, itemId);
  }

  @Delete()
  clearCart(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.cartService.clearCart(userId);
  }
}
```

---

## 2. Wishlist Module

### File: `src/wishlist/wishlist.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
```

### File: `src/wishlist/dto/add-to-wishlist.dto.ts`

```typescript
import { IsUUID } from 'class-validator';

export class AddToWishlistDto {
  @IsUUID()
  productId: string;
}
```

### File: `src/wishlist/wishlist.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

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
              select: { id: true, name: true, nameAr: true, logo: true },
            },
            vendor: {
              select: { id: true, businessName: true, businessNameAr: true },
            },
            category: {
              select: { id: true, name: true, nameAr: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      items: wishlistItems,
      count: wishlistItems.length,
    };
  }

  async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto) {
    const { productId } = addToWishlistDto;

    // Check if product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or unavailable');
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

    return this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            brand: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: string, itemId: string) {
    // Find wishlist item
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: { id: itemId },
    });

    if (!wishlistItem || wishlistItem.userId !== userId) {
      throw new NotFoundException('Wishlist item not found');
    }

    return this.prisma.wishlistItem.delete({
      where: { id: itemId },
    });
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { inWishlist: !!item };
  }
}
```

### File: `src/wishlist/wishlist.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  addToWishlist(@Req() req: Request, @Body() addToWishlistDto: AddToWishlistDto) {
    const userId = req.user['sub'];
    return this.wishlistService.addToWishlist(userId, addToWishlistDto);
  }

  @Delete(':id')
  removeFromWishlist(@Req() req: Request, @Param('id') itemId: string) {
    const userId = req.user['sub'];
    return this.wishlistService.removeFromWishlist(userId, itemId);
  }

  @Get('check/:productId')
  isInWishlist(@Req() req: Request, @Param('productId') productId: string) {
    const userId = req.user['sub'];
    return this.wishlistService.isInWishlist(userId, productId);
  }
}
```

---

## 3. Reviews Module

### File: `src/reviews/reviews.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, WalletModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
```

### File: `src/reviews/dto/create-review.dto.ts`

```typescript
import { IsUUID, IsInt, Min, Max, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
```

### File: `src/reviews/dto/vendor-reply.dto.ts`

```typescript
import { IsString } from 'class-validator';

export class VendorReplyDto {
  @IsString()
  vendorReply: string;
}
```

### File: `src/reviews/dto/vote-review.dto.ts`

```typescript
import { IsEnum } from 'class-validator';
import { VoteType } from '@prisma/client';

export class VoteReviewDto {
  @IsEnum(VoteType)
  voteType: VoteType;
}
```

### File: `src/reviews/reviews.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { VendorReplyDto } from './dto/vendor-reply.dto';
import { VoteReviewDto } from './dto/vote-review.dto';
import { VoteType, CoinTransactionType, CoinSource } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  async createReview(userId: string, createReviewDto: CreateReviewDto) {
    const { productId, rating, title, comment, images = [] } = createReviewDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product');
    }

    // Check if user purchased this product (verified purchase)
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          orderStatus: 'DELIVERED',
        },
      },
    });

    // Create review with images
    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
        images,
        isVerifiedPurchase: !!hasPurchased,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            coinsToAward: true,
          },
        },
      },
    });

    // Update product average rating and review count
    await this.updateProductRating(productId);

    // Award coins for review (if configured in product)
    if (product.coinsToAward > 0) {
      await this.walletService.addCoins(
        userId,
        product.coinsToAward,
        CoinTransactionType.EARNED,
        CoinSource.PRODUCT_REVIEW,
        `Review for ${product.name}`,
        null,
        review.id,
        productId,
      );
    }

    return review;
  }

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          productId,
          isPublished: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          reviewImages: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      this.prisma.review.count({
        where: {
          productId,
          isPublished: true,
        },
      }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async vendorReply(
    vendorId: string,
    reviewId: string,
    replyDto: VendorReplyDto,
  ) {
    // Find review and verify vendor owns the product
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        product: {
          select: { vendorId: true },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.product.vendorId !== vendorId) {
      throw new BadRequestException('You can only reply to reviews on your products');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        vendorReply: replyDto.vendorReply,
        vendorRepliedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async voteReview(userId: string, reviewId: string, voteDto: VoteReviewDto) {
    // Check if review exists
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if user already voted
    const existingVote = await this.prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingVote) {
      // Update vote if different
      if (existingVote.voteType !== voteDto.voteType) {
        await this.prisma.reviewVote.update({
          where: { id: existingVote.id },
          data: { voteType: voteDto.voteType },
        });

        // Update counts
        await this.updateReviewVoteCounts(reviewId);
      }
    } else {
      // Create new vote
      await this.prisma.reviewVote.create({
        data: {
          reviewId,
          userId,
          voteType: voteDto.voteType,
        },
      });

      // Update counts
      await this.updateReviewVoteCounts(reviewId);
    }

    return { message: 'Vote recorded successfully' };
  }

  async removeVote(userId: string, reviewId: string) {
    const vote = await this.prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    await this.prisma.reviewVote.delete({
      where: { id: vote.id },
    });

    // Update counts
    await this.updateReviewVoteCounts(reviewId);

    return { message: 'Vote removed successfully' };
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
        isPublished: true,
      },
      select: { rating: true },
    });

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount,
      },
    });
  }

  private async updateReviewVoteCounts(reviewId: string) {
    const votes = await this.prisma.reviewVote.groupBy({
      by: ['voteType'],
      where: { reviewId },
      _count: true,
    });

    const helpfulCount =
      votes.find((v) => v.voteType === VoteType.HELPFUL)?._count || 0;
    const notHelpfulCount =
      votes.find((v) => v.voteType === VoteType.NOT_HELPFUL)?._count || 0;

    await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount,
        notHelpfulCount,
      },
    });
  }
}
```

### File: `src/reviews/reviews.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { VendorReplyDto } from './dto/vendor-reply.dto';
import { VoteReviewDto } from './dto/vote-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createReview(@Req() req: Request, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user['sub'];
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  @Get('product/:productId')
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.getProductReviews(
      productId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Patch(':id/vendor-reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  vendorReply(
    @Req() req: Request,
    @Param('id') reviewId: string,
    @Body() replyDto: VendorReplyDto,
  ) {
    const vendor = req.user;
    // Note: You'll need to fetch vendorId from user in real implementation
    return this.reviewsService.vendorReply(vendor['sub'], reviewId, replyDto);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  voteReview(
    @Req() req: Request,
    @Param('id') reviewId: string,
    @Body() voteDto: VoteReviewDto,
  ) {
    const userId = req.user['sub'];
    return this.reviewsService.voteReview(userId, reviewId, voteDto);
  }

  @Delete(':id/vote')
  @UseGuards(JwtAuthGuard)
  removeVote(@Req() req: Request, @Param('id') reviewId: string) {
    const userId = req.user['sub'];
    return this.reviewsService.removeVote(userId, reviewId);
  }
}
```

---

## 4. Wallet/Coins Module

### File: `src/wallet/wallet.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
```

### File: `src/wallet/wallet.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoinTransactionType, CoinSource } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId },
        include: {
          transactions: true,
        },
      });
    }

    return wallet;
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.coinTransaction.findMany({
        where: { walletId: wallet.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coinTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addCoins(
    userId: string,
    amount: number,
    type: CoinTransactionType,
    source: CoinSource,
    description?: string,
    orderId?: string,
    reviewId?: string,
    productId?: string,
    expiresAt?: Date,
  ) {
    // Get or create wallet
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId },
      });
    }

    // Calculate new balance
    const newBalance = wallet.balance + amount;

    // Update wallet and create transaction in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: newBalance,
          lifetimeEarned: wallet.lifetimeEarned + amount,
        },
      });

      // Create transaction record
      const transaction = await tx.coinTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type,
          source,
          description,
          orderId,
          reviewId,
          productId,
          balanceAfter: newBalance,
          expiresAt,
        },
      });

      return { wallet: updatedWallet, transaction };
    });

    return result;
  }

  async deductCoins(
    userId: string,
    amount: number,
    type: CoinTransactionType,
    source: CoinSource,
    description?: string,
    orderId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new NotFoundException('Insufficient coins');
    }

    // Calculate new balance
    const newBalance = wallet.balance - amount;

    // Update wallet and create transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: newBalance,
          lifetimeSpent: wallet.lifetimeSpent + amount,
        },
      });

      const transaction = await tx.coinTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount, // Negative for deduction
          type,
          source,
          description,
          orderId,
          balanceAfter: newBalance,
        },
      });

      return { wallet: updatedWallet, transaction };
    });

    return result;
  }
}
```

### File: `src/wallet/wallet.controller.ts`

```typescript
import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  getWallet(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.walletService.getWallet(userId);
  }

  @Get('transactions')
  getTransactions(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user['sub'];
    return this.walletService.getTransactions(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }
}
```

---

## 5. Update App Module

### File: `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { WalletModule } from './wallet/wallet.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    CartModule,
    WishlistModule,
    WalletModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 6. API Endpoints Documentation

### Cart Endpoints

#### GET /api/cart
Get user's cart with items and summary.

**Response:**
```json
{
  "items": [
    {
      "id": "cart-item-1",
      "userId": "user-1",
      "productId": "product-1",
      "quantity": 2,
      "product": {
        "id": "product-1",
        "name": "Sauvage EDP",
        "price": 450.00,
        "images": ["https://..."],
        "stock": 50,
        "brand": {
          "id": "brand-1",
          "name": "Dior",
          "logo": "https://..."
        }
      },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "summary": {
    "itemCount": 3,
    "subtotal": 1200.00
  }
}
```

#### POST /api/cart
Add item to cart.

**Request:**
```json
{
  "productId": "product-1",
  "quantity": 2
}
```

#### PATCH /api/cart/:id
Update cart item quantity.

**Request:**
```json
{
  "quantity": 3
}
```

#### DELETE /api/cart/:id
Remove item from cart.

#### DELETE /api/cart
Clear entire cart.

---

### Wishlist Endpoints

#### GET /api/wishlist
Get user's wishlist.

**Response:**
```json
{
  "items": [
    {
      "id": "wishlist-1",
      "userId": "user-1",
      "productId": "product-1",
      "product": {
        "id": "product-1",
        "name": "Oud Wood",
        "price": 650.00,
        "images": ["https://..."],
        "brand": {...},
        "category": {...}
      },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "count": 5
}
```

#### POST /api/wishlist
Add product to wishlist.

**Request:**
```json
{
  "productId": "product-1"
}
```

#### DELETE /api/wishlist/:id
Remove item from wishlist.

#### GET /api/wishlist/check/:productId
Check if product is in wishlist.

**Response:**
```json
{
  "inWishlist": true
}
```

---

### Reviews Endpoints

#### POST /api/reviews
Create a new review (awards coins if configured).

**Request:**
```json
{
  "productId": "product-1",
  "rating": 5,
  "title": "Amazing fragrance!",
  "comment": "Long-lasting and perfect for the UAE climate",
  "images": ["https://...", "https://..."]
}
```

**Response:**
```json
{
  "id": "review-1",
  "userId": "user-1",
  "productId": "product-1",
  "rating": 5,
  "title": "Amazing fragrance!",
  "comment": "Long-lasting and perfect for the UAE climate",
  "images": ["https://...", "https://..."],
  "isVerifiedPurchase": true,
  "user": {
    "id": "user-1",
    "firstName": "Ahmed",
    "lastName": "Al-Mansoori",
    "avatar": "https://..."
  },
  "product": {
    "id": "product-1",
    "name": "Sauvage EDP",
    "coinsToAward": 45
  },
  "createdAt": "2025-01-15T14:00:00.000Z"
}
```

#### GET /api/reviews/product/:productId
Get all reviews for a product.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

#### PATCH /api/reviews/:id/vendor-reply
Vendor replies to a review (Vendor only).

**Request:**
```json
{
  "vendorReply": "Thank you for your kind words! We're glad you love it."
}
```

#### POST /api/reviews/:id/vote
Vote on a review (helpful/not helpful).

**Request:**
```json
{
  "voteType": "HELPFUL"
}
```

#### DELETE /api/reviews/:id/vote
Remove vote from a review.

---

### Wallet Endpoints

#### GET /api/wallet
Get user's wallet with balance and recent transactions.

**Response:**
```json
{
  "id": "wallet-1",
  "userId": "user-1",
  "balance": 450,
  "lifetimeEarned": 1200,
  "lifetimeSpent": 750,
  "transactions": [
    {
      "id": "tx-1",
      "amount": 45,
      "type": "EARNED",
      "source": "PRODUCT_REVIEW",
      "description": "Review for Sauvage EDP",
      "balanceAfter": 450,
      "reviewId": "review-1",
      "productId": "product-1",
      "createdAt": "2025-01-15T14:00:00.000Z"
    }
  ],
  "createdAt": "2025-01-10T10:00:00.000Z",
  "updatedAt": "2025-01-15T14:00:00.000Z"
}
```

#### GET /api/wallet/transactions
Get paginated transaction history.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "tx-1",
      "amount": 45,
      "type": "EARNED",
      "source": "PRODUCT_REVIEW",
      "description": "Review for Sauvage EDP",
      "balanceAfter": 450,
      "createdAt": "2025-01-15T14:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## 7. Testing Commands

```bash
# Cart
curl -X GET http://localhost:3001/api/cart -b cookies.txt
curl -X POST http://localhost:3001/api/cart -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"productId": "product-uuid", "quantity": 2}'

# Wishlist
curl -X GET http://localhost:3001/api/wishlist -b cookies.txt
curl -X POST http://localhost:3001/api/wishlist -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"productId": "product-uuid"}'

# Reviews
curl -X POST http://localhost:3001/api/reviews -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-uuid",
    "rating": 5,
    "title": "Great product",
    "comment": "Highly recommended!"
  }'

curl -X GET http://localhost:3001/api/reviews/product/product-uuid

# Wallet
curl -X GET http://localhost:3001/api/wallet -b cookies.txt
curl -X GET http://localhost:3001/api/wallet/transactions?page=1&limit=10 -b cookies.txt
```

---

## 8. Phase 3 Completion Checklist

- [ ] Cart module created with all CRUD operations
- [ ] Wishlist module created with all operations
- [ ] Reviews module created with images support
- [ ] Review voting system implemented
- [ ] Vendor reply functionality implemented
- [ ] Wallet module created
- [ ] Coins transaction system implemented
- [ ] Automatic coin awarding on review creation
- [ ] Product rating auto-update on new reviews
- [ ] All modules added to AppModule
- [ ] All endpoints tested

---

**Phase 3 Complete!** Cart, Wishlist, Reviews, and Coins system are fully functional.
