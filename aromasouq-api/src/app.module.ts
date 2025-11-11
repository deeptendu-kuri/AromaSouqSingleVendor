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
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AddressesModule } from './addresses/addresses.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UploadsModule } from './uploads/uploads.module';
import { VendorModule } from './vendor/vendor.module';
import { CouponsModule } from './coupons/coupons.module';
import { CheckoutModule } from './checkout/checkout.module';
import { WalletModule } from './wallet/wallet.module';

// Phase 5: File uploads & media management modules loaded
// Phase 6: Wallet & Coins system integrated
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    CartModule,
    WishlistModule,
    WalletModule,
    OrdersModule,
    ReviewsModule,
    AddressesModule,
    UsersModule,
    AdminModule,
    SupabaseModule,
    UploadsModule,
    VendorModule,
    CouponsModule,
    CheckoutModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
