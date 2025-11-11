import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
