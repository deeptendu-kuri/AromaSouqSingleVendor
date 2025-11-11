import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone: string;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  addressLine1: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  addressLine2?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  zipCode: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
