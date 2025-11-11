import { IsInt, IsString, IsOptional, Min, IsEnum } from 'class-validator';

export enum CoinSource {
  ORDER_PURCHASE = 'ORDER_PURCHASE',
  PRODUCT_REVIEW = 'PRODUCT_REVIEW',
  REFERRAL = 'REFERRAL',
  PROMOTION = 'PROMOTION',
  REFUND = 'REFUND',
  ADMIN = 'ADMIN',
}

export class AwardCoinsDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsEnum(CoinSource)
  source: CoinSource;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  reviewId?: string;
}
