import { IsEnum } from 'class-validator';
import { VoteType } from '@prisma/client';

export class VoteReviewDto {
  @IsEnum(VoteType)
  voteType: VoteType;
}
