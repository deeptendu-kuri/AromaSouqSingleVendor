# Backend Phase 2: Products and Brands

## Overview
This phase implements the Brands module and the enhanced Products module with scent profiles, variants, videos, WhatsApp integration, and coins system.

**Prerequisites**: Phase 1 must be completed (schema migration, auth, categories).

---

## 1. Brands Module

### File: `src/brands/brands.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
```

### File: `src/brands/dto/create-brand.dto.ts`

```typescript
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
```

### File: `src/brands/dto/update-brand.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
```

### File: `src/brands/brands.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    return this.prisma.brand.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with slug ${slug} not found`);
    }

    return brand;
  }

  async create(createBrandDto: CreateBrandDto) {
    // Check slug uniqueness
    const existingBrand = await this.prisma.brand.findUnique({
      where: { slug: createBrandDto.slug },
    });

    if (existingBrand) {
      throw new ConflictException(
        `Brand with slug ${createBrandDto.slug} already exists`,
      );
    }

    return this.prisma.brand.create({
      data: createBrandDto,
    });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    // Check if brand exists
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // Check slug uniqueness if slug is being updated
    if (updateBrandDto.slug && updateBrandDto.slug !== brand.slug) {
      const existingBrand = await this.prisma.brand.findUnique({
        where: { slug: updateBrandDto.slug },
      });

      if (existingBrand) {
        throw new ConflictException(
          `Brand with slug ${updateBrandDto.slug} already exists`,
        );
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  async remove(id: string) {
    // Check if brand exists
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // Check if brand has products
    if (brand._count.products > 0) {
      throw new ConflictException(
        `Cannot delete brand with ${brand._count.products} products. Remove products first.`,
      );
    }

    // Soft delete
    return this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
```

### File: `src/brands/brands.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  // Public endpoints
  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.brandsService.findAll(includeInactive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }

  // Admin-only endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
```

---

## 2. Products Module

### File: `src/products/products.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### File: `src/products/dto/create-product.dto.ts`

```typescript
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUUID,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
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

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lowStockAlert?: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsString()
  video?: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsUUID()
  vendorId: string;

  // Basic specifications
  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  concentration?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  // Scent profile
  @IsOptional()
  @IsString()
  topNotes?: string;

  @IsOptional()
  @IsString()
  heartNotes?: string;

  @IsOptional()
  @IsString()
  baseNotes?: string;

  @IsOptional()
  @IsString()
  scentFamily?: string;

  @IsOptional()
  @IsString()
  longevity?: string;

  @IsOptional()
  @IsString()
  sillage?: string;

  @IsOptional()
  @IsString()
  season?: string;

  // WhatsApp integration
  @IsOptional()
  @IsBoolean()
  enableWhatsapp?: boolean;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  // Coins
  @IsOptional()
  @IsInt()
  @Min(0)
  coinsToAward?: number;

  // SEO
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  // Status
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
```

### File: `src/products/dto/update-product.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### File: `src/products/dto/query-products.dto.ts`

```typescript
import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

enum SortBy {
  CREATED_AT = 'createdAt',
  PRICE = 'price',
  NAME = 'name',
  AVERAGE_RATING = 'averageRating',
  SALES_COUNT = 'salesCount',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  concentration?: string;

  @IsOptional()
  @IsString()
  scentFamily?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
```

### File: `src/products/dto/create-product-variant.dto.ts`

```typescript
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsString()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
```

### File: `src/products/dto/create-product-video.dto.ts`

```typescript
import { IsString, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateProductVideoDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

### File: `src/products/products.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { CreateProductVideoDto } from './dto/create-product-video.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      brandId,
      vendorId,
      search,
      minPrice,
      maxPrice,
      gender,
      concentration,
      scentFamily,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (gender) {
      where.gender = gender;
    }

    if (concentration) {
      where.concentration = concentration;
    }

    if (scentFamily) {
      where.scentFamily = scentFamily;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Execute query
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: {
            select: { id: true, name: true, nameAr: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, nameAr: true, slug: true, logo: true },
          },
          vendor: {
            select: {
              id: true,
              businessName: true,
              businessNameAr: true,
              logo: true,
            },
          },
          variants: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessNameAr: true,
            tagline: true,
            taglineAr: true,
            logo: true,
            whatsappNumber: true,
            whatsappEnabled: true,
          },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        videos: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            reviewImages: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessNameAr: true,
            tagline: true,
            taglineAr: true,
            logo: true,
            whatsappNumber: true,
            whatsappEnabled: true,
          },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        videos: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            reviewImages: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    // Check slug uniqueness
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with slug ${createProductDto.slug} already exists`,
      );
    }

    // Check SKU uniqueness
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException(
        `Product with SKU ${createProductDto.sku} already exists`,
      );
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    // Verify brand exists (if provided)
    if (createProductDto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: createProductDto.brandId },
      });

      if (!brand) {
        throw new BadRequestException(
          `Brand with ID ${createProductDto.brandId} not found`,
        );
      }
    }

    // Verify vendor exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: createProductDto.vendorId },
    });

    if (!vendor) {
      throw new BadRequestException(
        `Vendor with ID ${createProductDto.vendorId} not found`,
      );
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
        brand: true,
        vendor: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check slug uniqueness if being updated
    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with slug ${updateProductDto.slug} already exists`,
        );
      }
    }

    // Check SKU uniqueness if being updated
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException(
          `Product with SKU ${updateProductDto.sku} already exists`,
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        brand: true,
        vendor: true,
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Soft delete
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== PRODUCT VARIANTS ====================

  async addVariant(productId: string, variantDto: CreateProductVariantDto) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check SKU uniqueness
    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: variantDto.sku },
    });

    if (existingSku) {
      throw new ConflictException(
        `Variant with SKU ${variantDto.sku} already exists`,
      );
    }

    return this.prisma.productVariant.create({
      data: {
        ...variantDto,
        productId,
      },
    });
  }

  async updateVariant(
    productId: string,
    variantId: string,
    variantDto: Partial<CreateProductVariantDto>,
  ) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.productId !== productId) {
      throw new NotFoundException(
        `Variant with ID ${variantId} not found for product ${productId}`,
      );
    }

    // Check SKU uniqueness if being updated
    if (variantDto.sku && variantDto.sku !== variant.sku) {
      const existingSku = await this.prisma.productVariant.findUnique({
        where: { sku: variantDto.sku },
      });

      if (existingSku) {
        throw new ConflictException(
          `Variant with SKU ${variantDto.sku} already exists`,
        );
      }
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: variantDto,
    });
  }

  async removeVariant(productId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.productId !== productId) {
      throw new NotFoundException(
        `Variant with ID ${variantId} not found for product ${productId}`,
      );
    }

    // Soft delete
    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { isActive: false },
    });
  }

  // ==================== PRODUCT VIDEOS ====================

  async addVideo(productId: string, videoDto: CreateProductVideoDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return this.prisma.productVideo.create({
      data: {
        ...videoDto,
        productId,
      },
    });
  }

  async updateVideo(
    productId: string,
    videoId: string,
    videoDto: Partial<CreateProductVideoDto>,
  ) {
    const video = await this.prisma.productVideo.findUnique({
      where: { id: videoId },
    });

    if (!video || video.productId !== productId) {
      throw new NotFoundException(
        `Video with ID ${videoId} not found for product ${productId}`,
      );
    }

    return this.prisma.productVideo.update({
      where: { id: videoId },
      data: videoDto,
    });
  }

  async removeVideo(productId: string, videoId: string) {
    const video = await this.prisma.productVideo.findUnique({
      where: { id: videoId },
    });

    if (!video || video.productId !== productId) {
      throw new NotFoundException(
        `Video with ID ${videoId} not found for product ${productId}`,
      );
    }

    // Hard delete for videos
    return this.prisma.productVideo.delete({
      where: { id: videoId },
    });
  }
}
```

### File: `src/products/products.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { CreateProductVideoDto } from './dto/create-product-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public endpoints
  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  // Admin/Vendor endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // Variant endpoints
  @Post(':id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  addVariant(
    @Param('id') productId: string,
    @Body() variantDto: CreateProductVariantDto,
  ) {
    return this.productsService.addVariant(productId, variantDto);
  }

  @Patch(':id/variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  updateVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() variantDto: Partial<CreateProductVariantDto>,
  ) {
    return this.productsService.updateVariant(productId, variantId, variantDto);
  }

  @Delete(':id/variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  removeVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.removeVariant(productId, variantId);
  }

  // Video endpoints
  @Post(':id/videos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  addVideo(
    @Param('id') productId: string,
    @Body() videoDto: CreateProductVideoDto,
  ) {
    return this.productsService.addVideo(productId, videoDto);
  }

  @Patch(':id/videos/:videoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  updateVideo(
    @Param('id') productId: string,
    @Param('videoId') videoId: string,
    @Body() videoDto: Partial<CreateProductVideoDto>,
  ) {
    return this.productsService.updateVideo(productId, videoId, videoDto);
  }

  @Delete(':id/videos/:videoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  removeVideo(
    @Param('id') productId: string,
    @Param('videoId') videoId: string,
  ) {
    return this.productsService.removeVideo(productId, videoId);
  }
}
```

---

## 3. Update App Module

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 4. API Endpoints Documentation

### Brands Endpoints

#### GET /api/brands
Get all active brands.

**Query Parameters:**
- `includeInactive` (optional): "true" to include inactive brands (admin only)

**Response (200 OK):**
```json
[
  {
    "id": "uuid-1",
    "name": "Dior",
    "nameAr": "ديور",
    "slug": "dior",
    "description": "Luxury French fashion house",
    "descriptionAr": "دار أزياء فرنسية فاخرة",
    "logo": "https://...",
    "banner": "https://...",
    "isActive": true,
    "_count": {
      "products": 45
    },
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

#### POST /api/brands
Create a new brand (Admin only).

**Request Body:**
```json
{
  "name": "Tom Ford",
  "nameAr": "توم فورد",
  "slug": "tom-ford",
  "description": "American luxury fashion house",
  "descriptionAr": "دار أزياء أمريكية فاخرة",
  "logo": "https://...",
  "banner": "https://...",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-new",
  "name": "Tom Ford",
  "nameAr": "توم فورد",
  "slug": "tom-ford",
  ...
}
```

---

### Products Endpoints

#### GET /api/products
Get all products with filtering, search, and pagination.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `categoryId` (optional)
- `brandId` (optional)
- `vendorId` (optional)
- `search` (optional)
- `minPrice` (optional)
- `maxPrice` (optional)
- `gender` (optional)
- `concentration` (optional)
- `scentFamily` (optional)
- `isFeatured` (optional)
- `sortBy` (optional: createdAt, price, name, averageRating, salesCount)
- `sortOrder` (optional: asc, desc)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Sauvage Eau de Parfum",
      "nameAr": "سوفاج او دو بارفيوم",
      "slug": "sauvage-edp",
      "description": "...",
      "price": 450.00,
      "compareAtPrice": 550.00,
      "images": ["https://...", "https://..."],
      "stock": 50,
      "sku": "DIOR-SAUV-100",
      "categoryId": "uuid-cat",
      "category": {
        "id": "uuid-cat",
        "name": "Men's Fragrances",
        "slug": "mens-fragrances"
      },
      "brandId": "uuid-brand",
      "brand": {
        "id": "uuid-brand",
        "name": "Dior",
        "slug": "dior",
        "logo": "https://..."
      },
      "vendor": {
        "id": "uuid-vendor",
        "businessName": "Luxury Scents UAE",
        "logo": "https://..."
      },
      "topNotes": "Bergamot, Pepper",
      "heartNotes": "Lavender, Geranium",
      "baseNotes": "Ambroxan, Cedar, Vetiver",
      "scentFamily": "Woody Aromatic",
      "longevity": "8-10 hours",
      "sillage": "Strong",
      "season": "All Seasons",
      "coinsToAward": 45,
      "averageRating": 4.8,
      "reviewCount": 234,
      "viewCount": 1250,
      "salesCount": 156,
      "isFeatured": true,
      "variants": [
        {
          "id": "variant-1",
          "name": "50ml",
          "price": 350.00,
          "stock": 30,
          "sku": "DIOR-SAUV-50"
        },
        {
          "id": "variant-2",
          "name": "100ml",
          "price": 450.00,
          "stock": 50,
          "sku": "DIOR-SAUV-100"
        }
      ],
      "_count": {
        "reviews": 234
      }
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

#### GET /api/products/:id
Get single product by ID with full details.

**Response (200 OK):**
```json
{
  "id": "uuid-1",
  "name": "Sauvage Eau de Parfum",
  "nameAr": "سوفاج او دو بارفيوم",
  "slug": "sauvage-edp",
  "description": "...",
  "descriptionAr": "...",
  "price": 450.00,
  "compareAtPrice": 550.00,
  "images": ["https://..."],
  "video": "https://...",
  "sku": "DIOR-SAUV-100",
  "stock": 50,
  "category": {...},
  "brand": {...},
  "vendor": {
    "id": "uuid-vendor",
    "businessName": "Luxury Scents UAE",
    "businessNameAr": "...",
    "tagline": "Authentic Luxury Fragrances",
    "logo": "https://...",
    "whatsappNumber": "+971501234567",
    "whatsappEnabled": true
  },
  "topNotes": "Bergamot, Pepper",
  "heartNotes": "Lavender, Geranium",
  "baseNotes": "Ambroxan, Cedar, Vetiver",
  "scentFamily": "Woody Aromatic",
  "longevity": "8-10 hours",
  "sillage": "Strong",
  "season": "All Seasons",
  "enableWhatsapp": true,
  "whatsappNumber": "+971501234567",
  "coinsToAward": 45,
  "averageRating": 4.8,
  "reviewCount": 234,
  "viewCount": 1251,
  "salesCount": 156,
  "variants": [
    {
      "id": "variant-1",
      "name": "50ml",
      "nameAr": "50 مل",
      "sku": "DIOR-SAUV-50",
      "price": 350.00,
      "stock": 30,
      "image": "https://..."
    }
  ],
  "videos": [
    {
      "id": "video-1",
      "url": "https://...",
      "title": "Product Review",
      "thumbnail": "https://...",
      "duration": 120
    }
  ],
  "reviews": [
    {
      "id": "review-1",
      "user": {
        "id": "user-1",
        "firstName": "Ahmed",
        "lastName": "Al-Mansoori",
        "avatar": "https://..."
      },
      "rating": 5,
      "title": "Amazing scent!",
      "comment": "Long-lasting and perfect for the UAE climate",
      "reviewImages": [
        {
          "url": "https://...",
          "sortOrder": 0
        }
      ],
      "helpfulCount": 15,
      "notHelpfulCount": 2,
      "vendorReply": "Thank you for your feedback!",
      "vendorRepliedAt": "2025-01-16T10:00:00.000Z",
      "isVerifiedPurchase": true,
      "createdAt": "2025-01-15T14:30:00.000Z"
    }
  ],
  "_count": {
    "reviews": 234
  }
}
```

#### POST /api/products
Create a new product (Admin/Vendor).

**Request Body:**
```json
{
  "name": "Oud Wood Intense",
  "nameAr": "عود وود إنتنس",
  "slug": "oud-wood-intense",
  "description": "Rich and intense oud fragrance",
  "descriptionAr": "عطر عود غني ومكثف",
  "price": 650.00,
  "compareAtPrice": 800.00,
  "cost": 400.00,
  "sku": "TF-OUD-100",
  "barcode": "1234567890123",
  "stock": 30,
  "lowStockAlert": 5,
  "images": ["https://..."],
  "categoryId": "uuid-cat",
  "brandId": "uuid-brand",
  "vendorId": "uuid-vendor",
  "size": "100ml",
  "concentration": "Eau de Parfum",
  "gender": "Unisex",
  "topNotes": "Oud, Rose",
  "heartNotes": "Cardamom, Sandalwood",
  "baseNotes": "Amber, Vetiver",
  "scentFamily": "Oriental Woody",
  "longevity": "12+ hours",
  "sillage": "Very Strong",
  "season": "Fall, Winter",
  "enableWhatsapp": true,
  "whatsappNumber": "+971501234567",
  "coinsToAward": 65,
  "metaTitle": "Oud Wood Intense - Tom Ford",
  "metaDescription": "...",
  "isActive": true,
  "isFeatured": true
}
```

**Response (201 Created):**
Product object with all fields.

#### POST /api/products/:id/variants
Add a variant to a product (Admin/Vendor).

**Request Body:**
```json
{
  "name": "50ml",
  "nameAr": "50 مل",
  "sku": "TF-OUD-50",
  "price": 450.00,
  "stock": 20,
  "compareAtPrice": 550.00,
  "sortOrder": 1,
  "isActive": true
}
```

**Response (201 Created):**
Variant object.

#### POST /api/products/:id/videos
Add a video to a product (Admin/Vendor).

**Request Body:**
```json
{
  "url": "https://supabase-storage.../video.mp4",
  "title": "Unboxing and Review",
  "titleAr": "فتح العلبة والمراجعة",
  "thumbnail": "https://...",
  "duration": 180,
  "sortOrder": 1,
  "isActive": true
}
```

**Response (201 Created):**
Video object.

---

## 5. Testing Commands

### Test Brands Endpoints

**Get all brands:**
```bash
curl -X GET http://localhost:3001/api/brands
```

**Create brand (admin):**
```bash
curl -X POST http://localhost:3001/api/brands \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Tom Ford",
    "nameAr": "توم فورد",
    "slug": "tom-ford",
    "description": "American luxury fashion house",
    "isActive": true
  }'
```

### Test Products Endpoints

**Get all products:**
```bash
curl -X GET http://localhost:3001/api/products
```

**Get products with filters:**
```bash
curl -X GET "http://localhost:3001/api/products?page=1&limit=10&minPrice=100&maxPrice=500&gender=Men&sortBy=price&sortOrder=asc"
```

**Get single product:**
```bash
curl -X GET http://localhost:3001/api/products/uuid-here
```

**Get product by slug:**
```bash
curl -X GET http://localhost:3001/api/products/slug/sauvage-edp
```

**Create product (admin/vendor):**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d @product-data.json
```

**Add variant:**
```bash
curl -X POST http://localhost:3001/api/products/uuid-here/variants \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "50ml",
    "sku": "TEST-50",
    "price": 300.00,
    "stock": 20
  }'
```

**Add video:**
```bash
curl -X POST http://localhost:3001/api/products/uuid-here/videos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "url": "https://...",
    "title": "Product Review",
    "duration": 120
  }'
```

---

## 6. Phase 2 Completion Checklist

- [ ] Brands module created (module, service, controller, DTOs)
- [ ] Products module created (module, service, controller, DTOs)
- [ ] All product DTOs created (create, update, query, variant, video)
- [ ] Product filtering and search implemented
- [ ] Product pagination implemented
- [ ] View count increment on product view
- [ ] Product variants CRUD operations
- [ ] Product videos CRUD operations
- [ ] AppModule updated with new modules
- [ ] All brands endpoints tested
- [ ] All products endpoints tested
- [ ] Variant management tested
- [ ] Video management tested
- [ ] Scent profile fields working
- [ ] WhatsApp integration fields working
- [ ] Coins award system in place

---

## Next Steps

After completing Phase 2, proceed to:
- **Phase 3**: Cart, Wishlist, Reviews with images/voting, Wallet/Coins
- **Phase 4**: Orders with payment and coins integration
- **Phase 5**: Vendor dashboard APIs
- **Phase 6**: Admin dashboard and search

---

**Phase 2 Complete!** Products and Brands are now fully functional with all MVP v2 features.
