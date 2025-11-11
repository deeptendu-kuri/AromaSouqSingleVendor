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

  async findAll() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
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
        `Cannot delete brand with ${brand._count.products} products. Move or delete products first.`,
      );
    }

    // Soft delete by setting isActive to false
    return this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
