import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
