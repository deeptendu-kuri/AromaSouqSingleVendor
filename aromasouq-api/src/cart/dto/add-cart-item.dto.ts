import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class AddCartItemDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
