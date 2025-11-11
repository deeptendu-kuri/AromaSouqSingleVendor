import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllWithProducts() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        parent: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        parent: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    // Check slug uniqueness
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with slug ${createCategoryDto.slug} already exists`,
      );
    }

    // If parentId is provided, verify it exists
    if (createCategoryDto.parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException(
          `Parent category with ID ${createCategoryDto.parentId} not found`,
        );
      }
    }

    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check slug uniqueness if slug is being updated
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with slug ${updateCategoryDto.slug} already exists`,
        );
      }
    }

    // If parentId is being updated, verify it exists and prevent circular reference
    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      const parentCategory = await this.prisma.category.findUnique({
        where: { id: updateCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException(
          `Parent category with ID ${updateCategoryDto.parentId} not found`,
        );
      }

      // Check if the parent is a child of this category (circular reference)
      if (parentCategory.parentId === id) {
        throw new BadRequestException(
          'Cannot create circular reference: parent category is a child of this category',
        );
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async remove(id: string) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has children
    if (category.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with subcategories. Delete subcategories first.',
      );
    }

    // Check if category has products
    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category._count.products} products. Move or delete products first.`,
      );
    }

    // Soft delete by setting isActive to false
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
