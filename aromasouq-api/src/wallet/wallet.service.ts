import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwardCoinsDto, CoinSource } from './dto/award-coins.dto';
import { SpendCoinsDto } from './dto/spend-coins.dto';
import { RedeemCoinsDto } from './dto/redeem-coins.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { CoinTransactionType } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create wallet for a user
   */
  async getWallet(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get or create wallet
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            coinsBalance: true,
          },
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: user.coinsBalance || 0, // Initialize with existing balance
          lifetimeEarned: user.coinsBalance || 0,
          lifetimeSpent: 0,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              coinsBalance: true,
            },
          },
        },
      });
    }

    // Get coins expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringCoins = await this.prisma.coinTransaction.aggregate({
      where: {
        walletId: wallet.id,
        type: CoinTransactionType.EARNED,
        expiresAt: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      ...wallet,
      availableBalance: wallet.balance,
      coinsExpiringSoon: expiringCoins._sum.amount || 0,
    };
  }

  /**
   * Get wallet transaction history
   */
  async getTransactions(userId: string, params: GetTransactionsDto) {
    const { page = 1, limit = 20 } = params;

    // Get wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.coinTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
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

  /**
   * Award coins to a user
   */
  async awardCoins(userId: string, awardCoinsDto: AwardCoinsDto) {
    const { amount, source, description, orderId, productId, reviewId } =
      awardCoinsDto;

    // Get or create wallet
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      // Create wallet if doesn't exist
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          lifetimeEarned: 0,
          lifetimeSpent: 0,
        },
      });
    }

    // Use transaction to ensure atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: { increment: amount },
          lifetimeEarned: { increment: amount },
        },
      });

      // Calculate expiration date (90 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);

      // Create transaction record
      const transaction = await tx.coinTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: CoinTransactionType.EARNED,
          source,
          description:
            description || `Earned ${amount} coins from ${source.toLowerCase().replace('_', ' ')}`,
          orderId,
          productId,
          reviewId,
          balanceAfter: updatedWallet.balance,
          expiresAt,
        },
      });

      // Update user.coinsBalance for backward compatibility
      await tx.user.update({
        where: { id: userId },
        data: { coinsBalance: updatedWallet.balance },
      });

      return { wallet: updatedWallet, transaction };
    });

    return result;
  }

  /**
   * Spend coins from a user's wallet
   */
  async spendCoins(userId: string, spendCoinsDto: SpendCoinsDto) {
    const { amount, orderId, description } = spendCoinsDto;

    // Get wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new BadRequestException(
        `Insufficient coins balance. Available: ${wallet.balance}, Required: ${amount}`,
      );
    }

    // Use transaction to ensure atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Deduct from wallet
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
          lifetimeSpent: { increment: amount },
        },
      });

      // Record transaction
      const transaction = await tx.coinTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount, // Negative for spending
          type: CoinTransactionType.SPENT,
          source: 'ORDER_PURCHASE',
          description: description || `Used ${amount} coins for order discount`,
          orderId,
          balanceAfter: updatedWallet.balance,
        },
      });

      // Update user.coinsBalance for backward compatibility
      await tx.user.update({
        where: { id: userId },
        data: { coinsBalance: updatedWallet.balance },
      });

      return { wallet: updatedWallet, transaction };
    });

    return result;
  }

  /**
   * Refund coins to a user (e.g., when order is cancelled)
   */
  async refundCoins(
    userId: string,
    amount: number,
    orderId: string,
    description?: string,
  ) {
    return this.awardCoins(userId, {
      amount,
      source: CoinSource.REFUND,
      description: description || `Refund of ${amount} coins`,
      orderId,
    });
  }

  /**
   * Redeem coins for a discount coupon
   */
  async redeemCoins(userId: string, redeemCoinsDto: RedeemCoinsDto) {
    const { amount } = redeemCoinsDto;

    // Get wallet
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new BadRequestException(
        `Insufficient balance. You have ${wallet.balance} coins`,
      );
    }

    // Calculate discount value (1 coin = 0.1 AED)
    const discountValue = amount * 0.1;

    // Get system vendor (first vendor or create placeholder)
    // In production, you might want a dedicated "SYSTEM" vendor for wallet-redeemed coupons
    const systemVendor = await this.prisma.vendor.findFirst();

    if (!systemVendor) {
      throw new BadRequestException('System vendor not configured. Please contact support.');
    }

    const now = new Date();
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create a single-use coupon
    const coupon = await this.prisma.coupon.create({
      data: {
        code: `COINS-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        discountType: 'FIXED',
        discountValue,
        usageLimit: 1,
        usageCount: 0,
        isActive: true,
        startDate: now,
        endDate: expiryDate,
        vendorId: systemVendor.id,
      },
    });

    // Spend the coins
    await this.spendCoins(userId, {
      amount,
      description: `Redeemed ${amount} coins for ${discountValue} AED coupon`,
    });

    return {
      message: `Successfully redeemed ${amount} coins`,
      coupon: {
        code: coupon.code,
        value: discountValue,
        expiresAt: coupon.endDate,
      },
    };
  }

  /**
   * Get wallet statistics
   */
  async getStats(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return {
        totalEarned: 0,
        totalSpent: 0,
        currentBalance: 0,
        transactionCount: 0,
      };
    }

    const transactionCount = await this.prisma.coinTransaction.count({
      where: { walletId: wallet.id },
    });

    // Get earnings by source
    const earningsBySource = await this.prisma.coinTransaction.groupBy({
      by: ['source'],
      where: {
        walletId: wallet.id,
        type: CoinTransactionType.EARNED,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalEarned: wallet.lifetimeEarned,
      totalSpent: wallet.lifetimeSpent,
      currentBalance: wallet.balance,
      transactionCount,
      earningsBySource: earningsBySource.map((item) => ({
        source: item.source,
        amount: item._sum.amount || 0,
      })),
    };
  }

  /**
   * Expire old coins (should be run as a cron job)
   */
  async expireOldCoins() {
    const now = new Date();

    // Find all expired transactions
    const expiredTransactions = await this.prisma.coinTransaction.findMany({
      where: {
        type: CoinTransactionType.EARNED,
        expiresAt: {
          lte: now,
        },
      },
      include: {
        wallet: true,
      },
    });

    for (const transaction of expiredTransactions) {
      // Mark as expired and deduct from wallet
      await this.prisma.$transaction(async (tx) => {
        // Update transaction type to EXPIRED
        await tx.coinTransaction.update({
          where: { id: transaction.id },
          data: { type: CoinTransactionType.EXPIRED },
        });

        // Deduct from wallet balance
        await tx.wallet.update({
          where: { id: transaction.walletId },
          data: {
            balance: { decrement: transaction.amount },
          },
        });

        // Update user balance
        await tx.user.update({
          where: { id: transaction.wallet.userId },
          data: {
            coinsBalance: { decrement: transaction.amount },
          },
        });
      });
    }

    return {
      message: `Expired ${expiredTransactions.length} coin transactions`,
      coinsExpired: expiredTransactions.reduce(
        (sum, t) => sum + t.amount,
        0,
      ),
    };
  }
}
