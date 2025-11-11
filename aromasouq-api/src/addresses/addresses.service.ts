import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If no addresses exist, make this one default
    const existingAddresses = await this.prisma.address.count({
      where: { userId },
    });

    const shouldBeDefault = isDefault || existingAddresses === 0;

    const address = await this.prisma.address.create({
      data: {
        ...addressData,
        userId,
        isDefault: shouldBeDefault,
      },
    });

    return address;
  }

  async findAll(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return addresses;
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    if (address.userId !== userId) {
      throw new BadRequestException('Address does not belong to user');
    }

    return address;
  }

  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto) {
    // Verify ownership
    await this.findOne(userId, id);

    const { isDefault, ...addressData } = updateAddressDto;

    // If setting as default, unset other defaults
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.update({
      where: { id },
      data: {
        ...addressData,
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return address;
  }

  async remove(userId: string, id: string) {
    const address = await this.findOne(userId, id);

    // If deleting default address, make another one default
    if (address.isDefault) {
      const otherAddress = await this.prisma.address.findFirst({
        where: { userId, id: { not: id } },
      });

      if (otherAddress) {
        await this.prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await this.prisma.address.delete({
      where: { id },
    });

    return { message: 'Address deleted successfully' };
  }

  async setDefault(userId: string, id: string) {
    // Verify ownership
    await this.findOne(userId, id);

    // Unset all defaults
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set this one as default
    const address = await this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return address;
  }
}
