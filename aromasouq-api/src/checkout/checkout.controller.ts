import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CheckoutService } from './checkout.service';
import { QuickCheckoutDto } from './dto/quick-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('quick')
  quickCheckout(@Req() req: Request, @Body() quickCheckoutDto: QuickCheckoutDto) {
    const userId = req.user!['sub'];
    return this.checkoutService.quickCheckout(userId, quickCheckoutDto);
  }
}
