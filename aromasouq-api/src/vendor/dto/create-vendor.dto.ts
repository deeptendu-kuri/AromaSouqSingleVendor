import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';

export class CreateVendorDto {
  // Required Business Information
  @IsString()
  @MinLength(3, { message: 'Business name must be at least 3 characters' })
  businessName: string;

  @IsEmail()
  businessEmail: string;

  @IsString()
  @Matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, {
    message: 'Invalid phone number format',
  })
  businessPhone: string;

  // Optional Business Information
  @IsOptional()
  @IsString()
  businessNameAr?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  tradeLicense?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;

  @IsOptional()
  @IsString()
  website?: string;

  // Social Media
  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;
}
