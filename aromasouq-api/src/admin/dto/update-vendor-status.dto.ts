import { IsEnum, IsNotEmpty } from 'class-validator';
import { VendorStatus } from '@prisma/client';

export class UpdateVendorStatusDto {
  @IsNotEmpty()
  @IsEnum(VendorStatus)
  status: VendorStatus;
}
