import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto, DiscountType } from './dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, userRole: UserRole, createCouponDto: CreateCouponDto) {
    let vendorId: string;

    if (userRole === UserRole.ADMIN) {
      throw new ForbiddenException('Admin cannot create coupons. Only vendors can create coupons.');
    }

    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new ForbiddenException('Vendor profile not found');
    if (vendor.status !== 'APPROVED') throw new ForbiddenException(`Cannot create coupons. Vendor status is: ${vendor.status}`);

    vendorId = vendor.id;

    const existingCoupon = await this.prisma.coupon.findUnique({ where: { code: createCouponDto.code } });
    if (existingCoupon) throw new ConflictException(`Coupon code ${createCouponDto.code} already exists`);

    if (createCouponDto.startDate >= createCouponDto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (createCouponDto.discountType === DiscountType.PERCENTAGE && createCouponDto.discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%');
    }

    return this.prisma.coupon.create({
      data: { ...createCouponDto, vendorId },
      include: { vendor: { select: { id: true, businessName: true } } },
    });
  }

  async findAll(userId: string, userRole: UserRole) {
    let where: any = { isActive: true };

    if (userRole === UserRole.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor) throw new ForbiddenException('Vendor profile not found');
      where.vendorId = vendor.id;
    }

    return this.prisma.coupon.findMany({
      where,
      include: {
        vendor: { select: { id: true, businessName: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { vendor: true, _count: { select: { orders: true } } },
    });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);

    if (userRole === UserRole.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor || coupon.vendorId !== vendor.id) {
        throw new ForbiddenException('You can only view your own coupons');
      }
    }

    return coupon;
  }

  async update(id: string, userId: string, userRole: UserRole, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);

    if (userRole === UserRole.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor || coupon.vendorId !== vendor.id) {
        throw new ForbiddenException('You can only update your own coupons');
      }
    }

    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.prisma.coupon.findUnique({ where: { code: updateCouponDto.code } });
      if (existingCoupon) throw new ConflictException(`Coupon code ${updateCouponDto.code} already exists`);
    }

    const startDate = updateCouponDto.startDate || coupon.startDate;
    const endDate = updateCouponDto.endDate || coupon.endDate;
    if (startDate >= endDate) throw new BadRequestException('End date must be after start date');

    return this.prisma.coupon.update({
      where: { id },
      data: updateCouponDto,
      include: { vendor: { select: { id: true, businessName: true } } },
    });
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);

    if (userRole === UserRole.VENDOR) {
      const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
      if (!vendor || coupon.vendorId !== vendor.id) {
        throw new ForbiddenException('You can only delete your own coupons');
      }
    }

    return this.prisma.coupon.update({ where: { id }, data: { isActive: false } });
  }

  async validate(validateCouponDto: ValidateCouponDto) {
    const { code, orderAmount } = validateCouponDto;
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

    if (!coupon) throw new NotFoundException('Invalid coupon code');
    if (!coupon.isActive) throw new BadRequestException('This coupon is no longer active');

    const now = new Date();
    if (now < coupon.startDate) throw new BadRequestException('This coupon is not yet valid');
    if (now > coupon.endDate) throw new BadRequestException('This coupon has expired');
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('This coupon has reached its usage limit');
    }
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(`Minimum order amount of ${coupon.minOrderAmount} AED required`);
    }

    let discountAmount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      finalAmount: orderAmount - discountAmount,
    };
  }

  // Get active coupons for a specific vendor (public endpoint)
  async getActiveCouponsByVendor(vendorId: string) {
    const now = new Date();

    return this.prisma.coupon.findMany({
      where: {
        vendorId,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          { usageLimit: null },
          { usageCount: { lt: this.prisma.coupon.fields.usageLimit } }
        ]
      },
      select: {
        id: true,
        code: true,
        discountType: true,
        discountValue: true,
        minOrderAmount: true,
        maxDiscount: true,
        endDate: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
