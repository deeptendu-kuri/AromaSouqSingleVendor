import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Req() req: Request, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user!['sub'];
    return this.addressesService.create(userId, createAddressDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = req.user!['sub'];
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!['sub'];
    return this.addressesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const userId = req.user!['sub'];
    return this.addressesService.update(userId, id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!['sub'];
    return this.addressesService.remove(userId, id);
  }

  @Patch(':id/set-default')
  setDefault(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user!['sub'];
    return this.addressesService.setDefault(userId, id);
  }
}
