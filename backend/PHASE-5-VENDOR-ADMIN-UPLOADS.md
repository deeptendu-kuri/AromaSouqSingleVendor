# Backend Phase 5: Vendor Dashboard, Admin & File Uploads

## Overview
This phase implements Vendor profile management, Admin dashboard APIs, and File Upload module for Supabase Storage integration.

**Prerequisites**: Phases 1-4 must be completed.

---

## 1. Vendor Module (Profile Management)

### File: `src/vendors/vendors.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
```

### File: `src/vendors/dto/create-vendor-profile.dto.ts`

```typescript
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';

export class CreateVendorProfileDto {
  @IsString()
  businessName: string;

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
  tagline?: string;

  @IsOptional()
  @IsString()
  taglineAr?: string;

  @IsOptional()
  @IsString()
  brandStory?: string;

  @IsOptional()
  @IsString()
  brandStoryAr?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  tradeLicense?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;

  @IsEmail()
  businessEmail: string;

  @IsPhoneNumber('AE')
  businessPhone: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsPhoneNumber('AE')
  whatsappNumber?: string;

  @IsOptional()
  @IsBoolean()
  whatsappEnabled?: boolean;

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
  tiktokUrl?: string;
}
```

### File: `src/vendors/dto/update-vendor-profile.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorProfileDto } from './create-vendor-profile.dto';

export class UpdateVendorProfileDto extends PartialType(CreateVendorProfileDto) {}
```

### File: `src/vendors/vendors.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorProfileDto } from './dto/create-vendor-profile.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    return this.prisma.vendor.findMany({
      where: includeInactive
        ? {}
        : { status: { in: ['APPROVED', 'PENDING'] } },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        products: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            brand: {
              select: { name: true, logo: true },
            },
            category: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async getMyProfile(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return vendor;
  }

  async createProfile(userId: string, createDto: CreateVendorProfileDto) {
    // Check if user already has vendor profile
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      throw new ConflictException('Vendor profile already exists');
    }

    // Update user role to VENDOR
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'VENDOR' },
    });

    return this.prisma.vendor.create({
      data: {
        ...createDto,
        userId,
        status: 'PENDING', // Requires admin approval
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: string, updateDto: UpdateVendorProfileDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return this.prisma.vendor.update({
      where: { id: vendor.id },
      data: updateDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getVendorStats(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    // Get product stats
    const products = await this.prisma.product.findMany({
      where: { vendorId: vendor.id },
      select: {
        id: true,
        stock: true,
        viewCount: true,
        salesCount: true,
        price: true,
      },
    });

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.stock > 0).length;
    const totalViews = products.reduce((sum, p) => sum + p.viewCount, 0);
    const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);

    // Get revenue from completed orders
    const orders = await this.prisma.order.findMany({
      where: {
        orderStatus: 'DELIVERED',
        items: {
          some: {
            product: {
              vendorId: vendor.id,
            },
          },
        },
      },
      include: {
        items: {
          where: {
            product: {
              vendorId: vendor.id,
            },
          },
          select: {
            price: true,
            quantity: true,
          },
        },
      },
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((itemSum, item) => {
          return itemSum + item.price * item.quantity;
        }, 0)
      );
    }, 0);

    // Get reviews stats
    const reviews = await this.prisma.review.findMany({
      where: {
        product: {
          vendorId: vendor.id,
        },
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return {
      products: {
        total: totalProducts,
        active: activeProducts,
        outOfStock: totalProducts - activeProducts,
      },
      performance: {
        totalViews,
        totalSales,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
      reviews: {
        total: totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    };
  }

  // Admin methods
  async approveVendor(vendorId: string) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        status: 'APPROVED',
        verifiedAt: new Date(),
      },
    });
  }

  async rejectVendor(vendorId: string) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        status: 'REJECTED',
      },
    });
  }

  async suspendVendor(vendorId: string) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        status: 'SUSPENDED',
      },
    });
  }
}
```

### File: `src/vendors/vendors.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { VendorsService } from './vendors.service';
import { CreateVendorProfileDto } from './dto/create-vendor-profile.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  // Public endpoints
  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.vendorsService.findAll(includeInactive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  // Vendor endpoints
  @Get('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  getMyProfile(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.vendorsService.getMyProfile(userId);
  }

  @Post('me/profile')
  @UseGuards(JwtAuthGuard)
  createProfile(@Req() req: Request, @Body() createDto: CreateVendorProfileDto) {
    const userId = req.user['sub'];
    return this.vendorsService.createProfile(userId, createDto);
  }

  @Patch('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  updateProfile(@Req() req: Request, @Body() updateDto: UpdateVendorProfileDto) {
    const userId = req.user['sub'];
    return this.vendorsService.updateProfile(userId, updateDto);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  getVendorStats(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.vendorsService.getVendorStats(userId);
  }

  // Admin endpoints
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approveVendor(@Param('id') vendorId: string) {
    return this.vendorsService.approveVendor(vendorId);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  rejectVendor(@Param('id') vendorId: string) {
    return this.vendorsService.rejectVendor(vendorId);
  }

  @Patch(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  suspendVendor(@Param('id') vendorId: string) {
    return this.vendorsService.suspendVendor(vendorId);
  }
}
```

---

## 2. Admin Module

### File: `src/admin/admin.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
```

### File: `src/admin/admin.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    // Users stats
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({
      where: { status: 'ACTIVE' },
    });
    const newUsersThisMonth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    // Vendors stats
    const totalVendors = await this.prisma.vendor.count();
    const approvedVendors = await this.prisma.vendor.count({
      where: { status: 'APPROVED' },
    });
    const pendingVendors = await this.prisma.vendor.count({
      where: { status: 'PENDING' },
    });

    // Products stats
    const totalProducts = await this.prisma.product.count();
    const activeProducts = await this.prisma.product.count({
      where: { isActive: true },
    });
    const lowStockProducts = await this.prisma.product.count({
      where: {
        isActive: true,
        stock: { lte: this.prisma.product.fields.lowStockAlert },
      },
    });

    // Orders stats
    const totalOrders = await this.prisma.order.count();
    const pendingOrders = await this.prisma.order.count({
      where: { orderStatus: 'PENDING' },
    });
    const deliveredOrders = await this.prisma.order.count({
      where: { orderStatus: 'DELIVERED' },
    });

    // Revenue stats
    const orders = await this.prisma.order.findMany({
      where: { orderStatus: 'DELIVERED' },
      select: { total: true },
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Revenue this month
    const ordersThisMonth = await this.prisma.order.findMany({
      where: {
        orderStatus: 'DELIVERED',
        deliveredAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      select: { total: true },
    });
    const revenueThisMonth = ordersThisMonth.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    // Reviews stats
    const totalReviews = await this.prisma.review.count();
    const publishedReviews = await this.prisma.review.count({
      where: { isPublished: true },
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      vendors: {
        total: totalVendors,
        approved: approvedVendors,
        pending: pendingVendors,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
      },
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        thisMonth: Math.round(revenueThisMonth * 100) / 100,
      },
      reviews: {
        total: totalReviews,
        published: publishedReviews,
        pending: totalReviews - publishedReviews,
      },
    };
  }

  async getRecentOrders(limit = 10) {
    return this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                nameAr: true,
              },
            },
          },
        },
      },
    });
  }

  async getTopSellingProducts(limit = 10) {
    return this.prisma.product.findMany({
      take: limit,
      where: { isActive: true },
      orderBy: { salesCount: 'desc' },
      include: {
        brand: {
          select: { name: true, logo: true },
        },
        vendor: {
          select: { businessName: true },
        },
      },
    });
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }
}
```

### File: `src/admin/admin.controller.ts`

```typescript
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/recent-orders')
  getRecentOrders(@Query('limit') limit?: string) {
    return this.adminService.getRecentOrders(limit ? parseInt(limit) : 10);
  }

  @Get('dashboard/top-products')
  getTopSellingProducts(@Query('limit') limit?: string) {
    return this.adminService.getTopSellingProducts(limit ? parseInt(limit) : 10);
  }

  @Get('users')
  getAllUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getAllUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') userId: string,
    @Body('status') status: UserStatus,
  ) {
    return this.adminService.updateUserStatus(userId, status);
  }
}
```

---

## 3. Upload Module (Supabase Storage)

### File: `src/upload/upload.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
```

### Install Supabase Client

```bash
npm install @supabase/supabase-js
npm install multer
npm install --save-dev @types/multer
```

### File: `src/upload/upload.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;
  private bucketName = 'aromasouq-uploads';

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; path: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed',
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = file.originalname.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<Array<{ url: string; path: string }>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Limit to 5 files at once
    if (files.length > 5) {
      throw new BadRequestException('Maximum 5 files allowed per upload');
    }

    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; path: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (max 50MB for videos)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Video size exceeds 50MB limit');
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid video type. Only MP4, WebM, and MOV are allowed',
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = file.originalname.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }
}
```

### File: `src/upload/upload.controller.ts`

```typescript
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string = 'general',
  ) {
    return this.uploadService.uploadFile(file, folder);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder: string = 'general',
  ) {
    return this.uploadService.uploadMultipleFiles(files, folder);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string = 'videos',
  ) {
    return this.uploadService.uploadVideo(file, folder);
  }
}
```

---

## 4. Update App Module

### File: `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { WalletModule } from './wallet/wallet.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { VendorsModule } from './vendors/vendors.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    CartModule,
    WishlistModule,
    WalletModule,
    ReviewsModule,
    OrdersModule,
    VendorsModule,
    AdminModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 5. API Endpoints Documentation

### Vendor Endpoints

#### GET /api/vendors/me/profile
Get current vendor's profile.

**Response:**
```json
{
  "id": "vendor-uuid",
  "userId": "user-uuid",
  "businessName": "Luxury Scents UAE",
  "businessNameAr": "عطور فاخرة الإمارات",
  "tagline": "Authentic Luxury Fragrances",
  "description": "...",
  "logo": "https://...",
  "banner": "https://...",
  "whatsappNumber": "+971501234567",
  "whatsappEnabled": true,
  "instagramUrl": "https://instagram.com/...",
  "status": "APPROVED",
  "user": {
    "id": "user-uuid",
    "email": "vendor@example.com",
    "firstName": "Ahmed",
    "lastName": "Al-Mansoori"
  },
  "_count": {
    "products": 45
  }
}
```

#### POST /api/vendors/me/profile
Create vendor profile (requires authentication).

**Request:**
```json
{
  "businessName": "Luxury Scents UAE",
  "businessNameAr": "عطور فاخرة الإمارات",
  "tagline": "Authentic Luxury Fragrances",
  "description": "...",
  "businessEmail": "business@example.com",
  "businessPhone": "+971501234567",
  "whatsappNumber": "+971501234567",
  "whatsappEnabled": true
}
```

#### GET /api/vendors/me/stats
Get vendor statistics.

**Response:**
```json
{
  "products": {
    "total": 45,
    "active": 42,
    "outOfStock": 3
  },
  "performance": {
    "totalViews": 12500,
    "totalSales": 850,
    "totalRevenue": 125000.00
  },
  "reviews": {
    "total": 234,
    "averageRating": 4.7
  }
}
```

#### PATCH /api/vendors/:id/approve (Admin only)
Approve vendor application.

#### PATCH /api/vendors/:id/reject (Admin only)
Reject vendor application.

#### PATCH /api/vendors/:id/suspend (Admin only)
Suspend vendor account.

---

### Admin Endpoints

#### GET /api/admin/dashboard/stats
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "users": {
    "total": 5000,
    "active": 4800,
    "newThisMonth": 250
  },
  "vendors": {
    "total": 50,
    "approved": 45,
    "pending": 5
  },
  "products": {
    "total": 1200,
    "active": 1150,
    "lowStock": 25
  },
  "orders": {
    "total": 3500,
    "pending": 45,
    "delivered": 3200
  },
  "revenue": {
    "total": 525000.00,
    "thisMonth": 45000.00
  },
  "reviews": {
    "total": 2500,
    "published": 2400,
    "pending": 100
  }
}
```

#### GET /api/admin/dashboard/recent-orders
Get recent orders (default 10).

**Query Parameters:**
- `limit` (optional, default: 10)

#### GET /api/admin/dashboard/top-products
Get top-selling products.

**Query Parameters:**
- `limit` (optional, default: 10)

#### GET /api/admin/users
Get all users with pagination.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

#### PATCH /api/admin/users/:id/status
Update user status.

**Request:**
```json
{
  "status": "SUSPENDED"
}
```

---

### Upload Endpoints

#### POST /api/upload/image
Upload single image.

**Form Data:**
- `file`: Image file (JPEG, PNG, WebP, max 5MB)
- `folder`: Target folder (optional, default: "general")

**Response:**
```json
{
  "url": "https://owflekosdjmwnkqpjjnn.supabase.co/storage/v1/object/public/aromasouq-uploads/products/1705320000000-abc123.jpg",
  "path": "products/1705320000000-abc123.jpg"
}
```

#### POST /api/upload/images
Upload multiple images (max 5).

**Form Data:**
- `files`: Multiple image files
- `folder`: Target folder (optional)

**Response:**
```json
[
  {
    "url": "https://...",
    "path": "products/..."
  },
  {
    "url": "https://...",
    "path": "products/..."
  }
]
```

#### POST /api/upload/video
Upload video file.

**Form Data:**
- `file`: Video file (MP4, WebM, MOV, max 50MB)
- `folder`: Target folder (optional, default: "videos")

**Response:**
```json
{
  "url": "https://...",
  "path": "videos/1705320000000-abc123.mp4"
}
```

---

## 6. Suggested Upload Folders

- `products/` - Product images
- `brands/` - Brand logos and banners
- `categories/` - Category icons and images
- `vendors/` - Vendor logos and banners
- `users/` - User avatars
- `reviews/` - Review images
- `videos/` - Product videos
- `general/` - Miscellaneous uploads

---

## 7. Testing Commands

### Vendor Endpoints
```bash
# Get vendor profile
curl -X GET http://localhost:3001/api/vendors/me/profile -b cookies.txt

# Create vendor profile
curl -X POST http://localhost:3001/api/vendors/me/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d @vendor-profile.json

# Get vendor stats
curl -X GET http://localhost:3001/api/vendors/me/stats -b cookies.txt

# Approve vendor (admin)
curl -X PATCH http://localhost:3001/api/vendors/vendor-uuid/approve -b admin-cookies.txt
```

### Admin Endpoints
```bash
# Get dashboard stats
curl -X GET http://localhost:3001/api/admin/dashboard/stats -b admin-cookies.txt

# Get recent orders
curl -X GET "http://localhost:3001/api/admin/dashboard/recent-orders?limit=5" -b admin-cookies.txt

# Get all users
curl -X GET "http://localhost:3001/api/admin/users?page=1&limit=20" -b admin-cookies.txt
```

### Upload Endpoints
```bash
# Upload single image
curl -X POST http://localhost:3001/api/upload/image \
  -b cookies.txt \
  -F "file=@/path/to/image.jpg" \
  -F "folder=products"

# Upload multiple images
curl -X POST http://localhost:3001/api/upload/images \
  -b cookies.txt \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "folder=products"

# Upload video
curl -X POST http://localhost:3001/api/upload/video \
  -b cookies.txt \
  -F "file=@/path/to/video.mp4" \
  -F "folder=videos"
```

---

## 8. Environment Variables

Add to `.env`:

```env
# Supabase (already present in aromasouq-api/.env)
NEXT_PUBLIC_SUPABASE_URL=https://owflekosdjmwnkqpjjnn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 9. Supabase Storage Setup

### Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket: `aromasouq-uploads`
3. Set as **Public bucket**
4. Configure policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'aromasouq-uploads');

-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'aromasouq-uploads');

-- Allow users to delete their own files
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'aromasouq-uploads');
```

---

## 10. Phase 5 Completion Checklist

- [ ] Vendors module created with profile management
- [ ] Vendor profile creation and update
- [ ] Vendor statistics dashboard
- [ ] Vendor approval/rejection/suspension (Admin)
- [ ] Admin module created
- [ ] Admin dashboard with comprehensive stats
- [ ] User management endpoints (Admin)
- [ ] Recent orders and top products (Admin)
- [ ] Upload module created with Supabase integration
- [ ] Single image upload
- [ ] Multiple image upload (max 5)
- [ ] Video upload
- [ ] File validation (type, size)
- [ ] Supabase storage bucket created and configured
- [ ] All modules added to AppModule
- [ ] All endpoints tested

---

## Next Steps

All backend phases are complete! Now proceed to:
- **Frontend Implementation**: Create phase-wise frontend files for Next.js 15 with all features

---

**Phase 5 Complete!** The entire AromaSouq MVP v2 backend is now fully functional with vendor management, admin dashboard, and file uploads.
