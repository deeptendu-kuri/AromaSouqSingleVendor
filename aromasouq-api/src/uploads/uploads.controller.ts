import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /**
   * Upload product images
   * POST /api/uploads/products/:id/images
   * Requires: ADMIN or VENDOR role
   */
  @Post('products/:id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadProductImages(
    @Param('id') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const userId = req.user?.['sub'];
    const userRole = req.user?.['role'];
    return this.uploadsService.uploadProductImages(productId, files, userId, userRole);
  }

  /**
   * Upload user avatar
   * POST /api/uploads/users/avatar
   * Requires: Authenticated user
   */
  @Post('users/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const userId = req.user?.['sub'];
    return this.uploadsService.uploadUserAvatar(userId, file);
  }

  /**
   * Upload review images
   * POST /api/uploads/reviews/:id/images
   * Requires: Authenticated user (must own the review)
   */
  @Post('reviews/:id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadReviewImages(
    @Param('id') reviewId: string,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const userId = req.user?.['sub'];
    return this.uploadsService.uploadReviewImages(reviewId, userId, files);
  }

  /**
   * Upload brand logo
   * POST /api/uploads/brands/:id/logo
   * Requires: ADMIN role
   */
  @Post('brands/:id/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadBrandLogo(
    @Param('id') brandId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.uploadsService.uploadBrandLogo(brandId, file);
  }

  /**
   * Upload brand banner
   * POST /api/uploads/brands/:id/banner
   * Requires: ADMIN role
   */
  @Post('brands/:id/banner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadBrandBanner(
    @Param('id') brandId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.uploadsService.uploadBrandBanner(brandId, file);
  }

  /**
   * Delete file from storage
   * DELETE /api/uploads/:bucket/:path
   * Requires: ADMIN role
   * TEMPORARILY DISABLED - path-to-regexp syntax issue
   */
  // @Delete(':bucket/*')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  // async deleteFile(
  //   @Param('bucket') bucket: string,
  //   @Param('0') path: string,
  // ) {
  //   return this.uploadsService.deleteFile(bucket, path);
  // }
}
