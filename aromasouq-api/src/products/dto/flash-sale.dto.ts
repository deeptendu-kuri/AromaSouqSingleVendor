import {
  IsArray,
  IsString,
  IsNumber,
  IsInt,
  IsDate,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BulkFlashSaleDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  saleEndDate?: Date;
}

export class RemoveFlashSaleDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];
}

export class SetDiscountPercentDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsInt()
  @Min(0)
  @Max(100)
  discountPercent: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  saleEndDate?: Date;
}
