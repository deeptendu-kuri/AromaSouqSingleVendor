import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class SpendCoinsDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
