import { IsString, MaxLength, MinLength } from 'class-validator';

export class VendorReplyDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  vendorReply: string;
}
