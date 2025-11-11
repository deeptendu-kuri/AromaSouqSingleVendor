import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @IsUUID()
  addressId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsInt()
  @Min(0)
  coinsToUse?: number;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
