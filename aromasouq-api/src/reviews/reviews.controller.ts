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
import type { Request } from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { VoteReviewDto } from './dto/vote-review.dto';
import { VendorReplyDto } from './dto/vendor-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: Request, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user!['sub'];
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get('stats/:productId')
  getStats(@Param('productId') productId: string) {
    return this.reviewsService.getStats(productId);
  }

  @Get()
  findAll(
    @Query('productId') productId?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findAll({
      productId,
      userId,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const userId = req.user!['sub'];
    return this.reviewsService.update(userId, id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!['sub'];
    return this.reviewsService.remove(userId, id);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  vote(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() voteReviewDto: VoteReviewDto,
  ) {
    const userId = req.user!['sub'];
    return this.reviewsService.vote(userId, id, voteReviewDto);
  }

  @Post(':id/reply')
  @UseGuards(RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  addVendorReply(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() vendorReplyDto: VendorReplyDto,
  ) {
    const vendorId = req.user!['sub'];
    return this.reviewsService.addVendorReply(vendorId, id, vendorReplyDto);
  }

  @Patch(':id/publish')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  togglePublish(@Param('id') id: string) {
    return this.reviewsService.togglePublish(id);
  }
}
