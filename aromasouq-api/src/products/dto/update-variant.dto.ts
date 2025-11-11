import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantDto } from './create-variant.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVariantDto extends PartialType(CreateVariantDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
