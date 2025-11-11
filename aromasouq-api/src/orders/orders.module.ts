import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
// import { InvoiceService } from './invoice.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CouponsModule } from '../coupons/coupons.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, CouponsModule, WalletModule],
  controllers: [OrdersController],
  providers: [OrdersService], // InvoiceService commented out until pdfkit installed
  exports: [OrdersService],
})
export class OrdersModule {}
