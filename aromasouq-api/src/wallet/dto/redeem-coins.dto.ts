import { IsInt, Min, Max } from 'class-validator';

export class RedeemCoinsDto {
  @IsInt()
  @Min(10)
  @Max(10000)
  amount: number;
}
