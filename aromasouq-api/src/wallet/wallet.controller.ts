import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AwardCoinsDto } from './dto/award-coins.dto';
import { SpendCoinsDto } from './dto/spend-coins.dto';
import { RedeemCoinsDto } from './dto/redeem-coins.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Get user's wallet
   * GET /wallet
   */
  @Get()
  async getWallet(@Req() req: Request) {
    const userId = req.user!['sub'];
    return this.walletService.getWallet(userId);
  }

  /**
   * Get wallet transaction history
   * GET /wallet/transactions?page=1&limit=20
   */
  @Get('transactions')
  async getTransactions(
    @Req() req: Request,
    @Query() query: GetTransactionsDto,
  ) {
    const userId = req.user!['sub'];
    return this.walletService.getTransactions(userId, query);
  }

  /**
   * Get wallet statistics
   * GET /wallet/stats
   */
  @Get('stats')
  async getStats(@Req() req: Request) {
    const userId = req.user!['sub'];
    return this.walletService.getStats(userId);
  }

  /**
   * Redeem coins for a discount coupon
   * POST /wallet/redeem
   */
  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  async redeemCoins(
    @Req() req: Request,
    @Body() redeemCoinsDto: RedeemCoinsDto,
  ) {
    const userId = req.user!['sub'];
    return this.walletService.redeemCoins(userId, redeemCoinsDto);
  }

  /**
   * Award coins to a user (Admin only)
   * POST /wallet/award
   */
  @Post('award')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async awardCoins(
    @Body() awardCoinsDto: AwardCoinsDto & { userId: string },
  ) {
    const { userId, ...dto } = awardCoinsDto;
    return this.walletService.awardCoins(userId, dto);
  }

  /**
   * Spend coins (Admin only - for testing/adjustments)
   * POST /wallet/spend
   */
  @Post('spend')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async spendCoins(
    @Body() spendCoinsDto: SpendCoinsDto & { userId: string },
  ) {
    const { userId, ...dto } = spendCoinsDto;
    return this.walletService.spendCoins(userId, dto);
  }

  /**
   * Expire old coins (Admin only - for cron job)
   * POST /wallet/expire-old-coins
   */
  @Post('expire-old-coins')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async expireOldCoins() {
    return this.walletService.expireOldCoins();
  }
}
