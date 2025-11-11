import { IsString, IsEnum, IsNumber, IsDate, IsOptional, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateCouponDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]+$/, { message: 'Coupon code must contain only uppercase letters, numbers, hyphens, and underscores' })
  code: string;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  vendorId?: string;
}
