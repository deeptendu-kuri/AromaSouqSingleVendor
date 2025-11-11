import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req: Request) {
    const userId = req.user!['sub'];
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  addItem(@Req() req: Request, @Body() addWishlistItemDto: AddWishlistItemDto) {
    const userId = req.user!['sub'];
    return this.wishlistService.addItem(userId, addWishlistItemDto);
  }

  @Delete(':productId')
  removeItem(@Req() req: Request, @Param('productId') productId: string) {
    const userId = req.user!['sub'];
    return this.wishlistService.removeItem(userId, productId);
  }
}
