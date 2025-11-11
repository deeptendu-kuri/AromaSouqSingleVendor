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
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // Public endpoint to get active coupons by vendor
  @Get('public/vendor/:vendorId')
  getPublicCouponsByVendor(@Param('vendorId') vendorId: string) {
    return this.couponsService.getActiveCouponsByVendor(vendorId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  create(@Req() req: Request, @Body() createCouponDto: CreateCouponDto) {
    const userId = req.user!['sub'];
    const userRole = req.user!['role'] as UserRole;
    return this.couponsService.create(userId, userRole, createCouponDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  findAll(@Req() req: Request) {
    const userId = req.user!['sub'];
    const userRole = req.user!['role'] as UserRole;
    return this.couponsService.findAll(userId, userRole);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!['sub'];
    const userRole = req.user!['role'] as UserRole;
    return this.couponsService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    const userId = req.user!['sub'];
    const userRole = req.user!['role'] as UserRole;
    return this.couponsService.update(id, userId, userRole, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!['sub'];
    const userRole = req.user!['role'] as UserRole;
    return this.couponsService.remove(id, userId, userRole);
  }

  @Post('validate')
  validate(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponsService.validate(validateCouponDto);
  }
}
