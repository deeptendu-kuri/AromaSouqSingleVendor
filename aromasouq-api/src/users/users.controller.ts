import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: Request) {
    const userId = req.user!['sub'];
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user!['sub'];
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Patch('change-password')
  changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user!['sub'];
    return this.usersService.changePassword(userId, changePasswordDto);
  }

  @Get('coins-history')
  getCoinsHistory(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user!['sub'];
    return this.usersService.getCoinsHistory(userId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
