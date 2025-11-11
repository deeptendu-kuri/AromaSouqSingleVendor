import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { CoinSource } from '../wallet/dto/award-coins.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { VoteReviewDto } from './dto/vote-review.dto';
import { VendorReplyDto } from './dto/vendor-reply.dto';
import { VoteType } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { productId, rating, title, comment, images } = createReviewDto;

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
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

    // Check if user purchased this product and order is delivered
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          orderStatus: 'DELIVERED',
        },
      },
    });

    // Only allow reviews from users who have received the product
    if (!hasPurchased) {
      throw new BadRequestException(
        'You can only review products after your order has been delivered',
      );
    }

    const isVerifiedPurchase = true; // Always true since we enforce delivered order

    // Create review
    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
        images: images || [],
        isVerifiedPurchase,
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
            nameAr: true,
            images: true,
          },
        },
      },
    });

    // Update product average rating
    await this.updateProductRating(productId);

    // Award coins for writing review
    try {
      await this.walletService.awardCoins(userId, {
        amount: 10, // 10 coins per review
        source: CoinSource.PRODUCT_REVIEW,
        description: `Earned 10 coins for reviewing "${product.name}"`,
        productId: product.id,
        reviewId: review.id,
      });
    } catch (error) {
      // Log error but don't fail the review creation
      console.error('Failed to award coins for review:', error);
    }

    return review;
  }

  async findAll(params?: {
    productId?: string;
    userId?: string;
    isPublished?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      productId,
      userId,
      isPublished = true,
      page = 1,
      limit = 20,
    } = params || {};

    const where: any = { isPublished };
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
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
              nameAr: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where }),
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

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
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
            nameAr: true,
            images: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(userId: string, id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
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
            nameAr: true,
            images: true,
          },
        },
      },
    });

    // Update product rating if rating changed
    if (updateReviewDto.rating) {
      await this.updateProductRating(review.productId);
    }

    return updatedReview;
  }

  async remove(userId: string, id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    // Update product rating
    await this.updateProductRating(review.productId);

    return { message: 'Review deleted successfully' };
  }

  async vote(userId: string, reviewId: string, voteReviewDto: VoteReviewDto) {
    const { voteType } = voteReviewDto;

    // Check if review exists
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    // Check for existing vote
    const existingVote = await this.prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingVote) {
      // If same vote type, remove vote
      if (existingVote.voteType === voteType) {
        await this.prisma.reviewVote.delete({
          where: { id: existingVote.id },
        });

        // Decrement count
        await this.updateVoteCounts(reviewId);

        return { message: 'Vote removed' };
      }

      // If different vote type, update vote
      await this.prisma.reviewVote.update({
        where: { id: existingVote.id },
        data: { voteType },
      });

      // Update counts
      await this.updateVoteCounts(reviewId);

      return { message: 'Vote updated' };
    }

    // Create new vote
    await this.prisma.reviewVote.create({
      data: {
        userId,
        reviewId,
        voteType,
      },
    });

    // Update counts
    await this.updateVoteCounts(reviewId);

    return { message: 'Vote recorded' };
  }

  async addVendorReply(
    vendorId: string,
    reviewId: string,
    vendorReplyDto: VendorReplyDto,
  ) {
    const { vendorReply } = vendorReplyDto;

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: true },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    // Verify vendor owns the product
    if (review.product.vendorId !== vendorId) {
      throw new ForbiddenException(
        'You can only reply to reviews of your own products',
      );
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        vendorReply,
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
        product: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            images: true,
          },
        },
      },
    });

    return updatedReview;
  }

  async togglePublish(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        isPublished: !review.isPublished,
      },
    });

    // Update product rating
    await this.updateProductRating(review.productId);

    return updatedReview;
  }

  async getStats(productId: string) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Get all published reviews for this product
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
        isPublished: true,
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      1: reviews.filter((r) => r.rating === 1).length,
      2: reviews.filter((r) => r.rating === 2).length,
      3: reviews.filter((r) => r.rating === 3).length,
      4: reviews.filter((r) => r.rating === 4).length,
      5: reviews.filter((r) => r.rating === 5).length,
    };

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    };
  }

  private async updateProductRating(productId: string) {
    // Calculate average rating from published reviews
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
        isPublished: true,
      },
      select: {
        rating: true,
      },
    });

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        averageRating,
        reviewCount,
      },
    });
  }

  private async updateVoteCounts(reviewId: string) {
    const votes = await this.prisma.reviewVote.findMany({
      where: { reviewId },
    });

    const helpfulCount = votes.filter((v) => v.voteType === VoteType.HELPFUL).length;
    const notHelpfulCount = votes.filter((v) => v.voteType === VoteType.NOT_HELPFUL).length;

    await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount,
        notHelpfulCount,
      },
    });
  }
}
