import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsObject,
  IsBoolean,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class QuickCheckoutDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsUUID()
  addressId: string;

  @IsString()
  deliveryMethod: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsInt()
  @Min(0)
  coinsToUse?: number;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsObject()
  giftOptions?: {
    isGift: boolean;
    giftMessage?: string;
    giftWrapping?: 'BASIC' | 'PREMIUM' | 'LUXURY';
  };
}
