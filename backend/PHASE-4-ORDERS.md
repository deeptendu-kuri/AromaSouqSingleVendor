# Backend Phase 4: Orders & Checkout

## Overview
This phase implements the complete Orders module with checkout, payment integration, order management, and coins integration (earning and spending).

**Prerequisites**: Phases 1, 2, and 3 must be completed.

---

## 1. Orders Module

### File: `src/orders/orders.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CartModule } from '../cart/cart.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, CartModule, WalletModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
```

### File: `src/orders/dto/create-order.dto.ts`

```typescript
import { IsUUID, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @IsUUID()
  addressId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsInt()
  @Min(0)
  coinsToUse?: number; // Number of coins to redeem for this order
}
```

### File: `src/orders/dto/update-order-status.dto.ts`

```typescript
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
```

### File: `src/orders/dto/query-orders.dto.ts`

```typescript
import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class QueryOrdersDto {
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
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
```

### File: `src/orders/orders.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { WalletService } from '../wallet/wallet.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import {
  OrderStatus,
  PaymentStatus,
  CoinTransactionType,
  CoinSource,
} from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly walletService: WalletService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, paymentMethod, coinsToUse = 0 } = createOrderDto;

    // Get user's cart
    const cart = await this.cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify address belongs to user
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }

    // Calculate pricing
    const subtotal = cart.summary.subtotal;
    const tax = subtotal * 0.05; // 5% VAT
    const shippingFee = 25; // Flat shipping fee (AED)

    // Coins conversion: 1 coin = 0.1 AED
    let coinsDiscount = 0;
    if (coinsToUse > 0) {
      const wallet = await this.walletService.getWallet(userId);

      if (wallet.balance < coinsToUse) {
        throw new BadRequestException(
          `Insufficient coins. You have ${wallet.balance} coins`,
        );
      }

      // Maximum 50% of subtotal can be paid with coins
      const maxCoinsAllowed = Math.floor((subtotal * 0.5) / 0.1);

      if (coinsToUse > maxCoinsAllowed) {
        throw new BadRequestException(
          `You can use maximum ${maxCoinsAllowed} coins for this order`,
        );
      }

      coinsDiscount = coinsToUse * 0.1; // Convert coins to AED
    }

    const total = subtotal + tax + shippingFee - coinsDiscount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate coins to be earned (1% of subtotal as coins)
    const coinsEarned = Math.floor(subtotal * 0.01 / 0.1); // 1% cashback as coins

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          subtotal,
          tax,
          shippingFee,
          discount: coinsDiscount,
          total,
          coinsEarned,
          coinsUsed: coinsToUse,
          paymentMethod,
          orderStatus: OrderStatus.PENDING,
          paymentStatus:
            paymentMethod === 'CASH_ON_DELIVERY'
              ? PaymentStatus.PENDING
              : PaymentStatus.PENDING,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: {
                    select: { id: true, name: true, nameAr: true, logo: true },
                  },
                  vendor: {
                    select: {
                      id: true,
                      businessName: true,
                      businessNameAr: true,
                    },
                  },
                },
              },
            },
          },
          address: true,
        },
      });

      // Deduct coins if used
      if (coinsToUse > 0) {
        await this.walletService.deductCoins(
          userId,
          coinsToUse,
          CoinTransactionType.SPENT,
          CoinSource.ORDER_PURCHASE,
          `Order ${orderNumber}`,
          newOrder.id,
        );
      }

      // Update product stock and sales count
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return order;
  }

  async findAll(userId: string, query: QueryOrdersDto) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (status) {
      where.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  nameAr: true,
                  slug: true,
                  images: true,
                  brand: {
                    select: { name: true, nameAr: true },
                  },
                },
              },
            },
          },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: {
                  select: { id: true, name: true, nameAr: true, logo: true },
                },
                vendor: {
                  select: {
                    id: true,
                    businessName: true,
                    businessNameAr: true,
                    whatsappNumber: true,
                    whatsappEnabled: true,
                  },
                },
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderNumber(userId: string, orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: {
                  select: { id: true, name: true, nameAr: true, logo: true },
                },
                vendor: {
                  select: {
                    id: true,
                    businessName: true,
                    businessNameAr: true,
                  },
                },
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    updateDto: UpdateOrderStatusDto,
    updatedBy: 'admin' | 'vendor' | 'system' = 'admin',
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const { orderStatus } = updateDto;
    const updateData: any = { orderStatus };

    // Set appropriate timestamp fields
    if (orderStatus === OrderStatus.CONFIRMED) {
      updateData.confirmedAt = new Date();
    } else if (orderStatus === OrderStatus.SHIPPED) {
      updateData.shippedAt = new Date();
    } else if (orderStatus === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();

      // Award coins when order is delivered
      if (order.coinsEarned > 0 && !order.coinsEarned) {
        await this.walletService.addCoins(
          order.userId,
          order.coinsEarned,
          CoinTransactionType.EARNED,
          CoinSource.ORDER_PURCHASE,
          `Order ${order.orderNumber} completed`,
          order.id,
        );
      }
    } else if (orderStatus === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date();

      // Refund coins if used
      if (order.coinsUsed > 0) {
        await this.walletService.addCoins(
          order.userId,
          order.coinsUsed,
          CoinTransactionType.REFUNDED,
          CoinSource.REFUND,
          `Order ${order.orderNumber} cancelled`,
          order.id,
        );
      }

      // Restore product stock
      for (const item of order.items) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            salesCount: { decrement: item.quantity },
          },
        });
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                nameAr: true,
                images: true,
              },
            },
          },
        },
        address: true,
      },
    });
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    // Only allow cancellation if order is PENDING or CONFIRMED
    if (
      order.orderStatus !== OrderStatus.PENDING &&
      order.orderStatus !== OrderStatus.CONFIRMED
    ) {
      throw new BadRequestException(
        'Order cannot be cancelled at this stage',
      );
    }

    return this.updateOrderStatus(orderId, {
      orderStatus: OrderStatus.CANCELLED,
    });
  }

  // Vendor-specific methods
  async getVendorOrders(vendorId: string, query: QueryOrdersDto) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    // Get vendor's products
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { products: { select: { id: true } } },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const productIds = vendor.products.map((p) => p.id);

    const where: any = {
      items: {
        some: {
          productId: { in: productIds },
        },
      },
    };

    if (status) {
      where.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            where: {
              productId: { in: productIds },
            },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  nameAr: true,
                  slug: true,
                  images: true,
                  sku: true,
                },
              },
            },
          },
          address: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVendorOrderStats(vendorId: string) {
    // Get vendor's products
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { products: { select: { id: true } } },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const productIds = vendor.products.map((p) => p.id);

    // Count orders by status
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['orderStatus'],
      where: {
        items: {
          some: {
            productId: { in: productIds },
          },
        },
      },
      _count: true,
    });

    // Calculate total revenue
    const completedOrders = await this.prisma.order.findMany({
      where: {
        orderStatus: OrderStatus.DELIVERED,
        items: {
          some: {
            productId: { in: productIds },
          },
        },
      },
      select: {
        items: {
          where: {
            productId: { in: productIds },
          },
          select: {
            price: true,
            quantity: true,
          },
        },
      },
    });

    const totalRevenue = completedOrders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((itemSum, item) => {
          return itemSum + item.price * item.quantity;
        }, 0)
      );
    }, 0);

    return {
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.orderStatus] = item._count;
        return acc;
      }, {}),
      totalRevenue,
      totalOrders: ordersByStatus.reduce((sum, item) => sum + item._count, 0),
    };
  }
}
```

### File: `src/orders/orders.controller.ts`

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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Customer endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user['sub'];
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request, @Query() query: QueryOrdersDto) {
    const userId = req.user['sub'];
    return this.ordersService.findAll(userId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: Request, @Param('id') orderId: string) {
    const userId = req.user['sub'];
    return this.ordersService.findOne(userId, orderId);
  }

  @Get('number/:orderNumber')
  @UseGuards(JwtAuthGuard)
  findByOrderNumber(
    @Req() req: Request,
    @Param('orderNumber') orderNumber: string,
  ) {
    const userId = req.user['sub'];
    return this.ordersService.findByOrderNumber(userId, orderNumber);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelOrder(@Req() req: Request, @Param('id') orderId: string) {
    const userId = req.user['sub'];
    return this.ordersService.cancelOrder(userId, orderId);
  }

  // Admin/Vendor endpoints
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateDto);
  }

  // Vendor-specific endpoints
  @Get('vendor/my-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  async getVendorOrders(@Req() req: Request, @Query() query: QueryOrdersDto) {
    const userId = req.user['sub'];
    // Get vendor ID from user
    const vendor = await this.ordersService['prisma'].vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return this.ordersService.getVendorOrders(vendor.id, query);
  }

  @Get('vendor/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  async getVendorOrderStats(@Req() req: Request) {
    const userId = req.user['sub'];
    const vendor = await this.ordersService['prisma'].vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return this.ordersService.getVendorOrderStats(vendor.id);
  }
}
```

---

## 2. Update App Module

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 3. API Endpoints Documentation

### Orders Endpoints

#### POST /api/orders
Create a new order from cart.

**Request:**
```json
{
  "addressId": "address-uuid",
  "paymentMethod": "CREDIT_CARD",
  "coinsToUse": 100
}
```

**Response (201 Created):**
```json
{
  "id": "order-uuid",
  "orderNumber": "ORD-1705320000000-ABC123XYZ",
  "userId": "user-uuid",
  "addressId": "address-uuid",
  "subtotal": 1200.00,
  "tax": 60.00,
  "shippingFee": 25.00,
  "discount": 10.00,
  "total": 1275.00,
  "coinsEarned": 120,
  "coinsUsed": 100,
  "orderStatus": "PENDING",
  "paymentStatus": "PENDING",
  "paymentMethod": "CREDIT_CARD",
  "items": [
    {
      "id": "item-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "price": 450.00,
      "product": {
        "id": "product-uuid",
        "name": "Sauvage EDP",
        "nameAr": "سوفاج",
        "images": ["https://..."],
        "brand": {
          "id": "brand-uuid",
          "name": "Dior",
          "logo": "https://..."
        }
      }
    }
  ],
  "address": {
    "id": "address-uuid",
    "fullName": "Ahmed Al-Mansoori",
    "phone": "+971501234567",
    "addressLine1": "Villa 123",
    "city": "Dubai",
    "state": "Dubai",
    "country": "UAE",
    "zipCode": "12345"
  },
  "createdAt": "2025-01-15T14:00:00.000Z",
  "updatedAt": "2025-01-15T14:00:00.000Z"
}
```

---

#### GET /api/orders
Get all orders for the authenticated user.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional): Filter by OrderStatus

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "ORD-1705320000000-ABC123XYZ",
      "subtotal": 1200.00,
      "tax": 60.00,
      "shippingFee": 25.00,
      "discount": 10.00,
      "total": 1275.00,
      "orderStatus": "DELIVERED",
      "paymentStatus": "COMPLETED",
      "paymentMethod": "CREDIT_CARD",
      "coinsEarned": 120,
      "coinsUsed": 100,
      "items": [
        {
          "id": "item-uuid",
          "quantity": 2,
          "price": 450.00,
          "product": {
            "id": "product-uuid",
            "name": "Sauvage EDP",
            "slug": "sauvage-edp",
            "images": ["https://..."],
            "brand": {
              "name": "Dior"
            }
          }
        }
      ],
      "address": {...},
      "createdAt": "2025-01-15T14:00:00.000Z",
      "deliveredAt": "2025-01-18T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

#### GET /api/orders/:id
Get a single order by ID.

**Response (200 OK):**
Same structure as order creation response with full details.

---

#### GET /api/orders/number/:orderNumber
Get order by order number.

**Response (200 OK):**
Same structure as GET /api/orders/:id

---

#### PATCH /api/orders/:id/cancel
Cancel an order (customer only, only if PENDING or CONFIRMED).

**Response (200 OK):**
Updated order object with orderStatus: "CANCELLED" and cancelledAt timestamp.

---

#### PATCH /api/orders/:id/status
Update order status (Admin/Vendor only).

**Request:**
```json
{
  "orderStatus": "SHIPPED"
}
```

**Response (200 OK):**
Updated order object with new status and appropriate timestamp.

---

#### GET /api/orders/vendor/my-orders
Get all orders containing vendor's products (Vendor only).

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "ORD-1705320000000-ABC123XYZ",
      "orderStatus": "CONFIRMED",
      "paymentStatus": "COMPLETED",
      "total": 1275.00,
      "items": [
        {
          "id": "item-uuid",
          "quantity": 2,
          "price": 450.00,
          "product": {
            "id": "product-uuid",
            "name": "My Product",
            "sku": "SKU-123",
            "images": ["https://..."]
          }
        }
      ],
      "address": {...},
      "user": {
        "id": "user-uuid",
        "firstName": "Ahmed",
        "lastName": "Al-Mansoori",
        "email": "ahmed@example.com",
        "phone": "+971501234567"
      },
      "createdAt": "2025-01-15T14:00:00.000Z"
    }
  ],
  "meta": {...}
}
```

---

#### GET /api/orders/vendor/stats
Get vendor order statistics (Vendor only).

**Response (200 OK):**
```json
{
  "ordersByStatus": {
    "PENDING": 5,
    "CONFIRMED": 12,
    "PROCESSING": 8,
    "SHIPPED": 20,
    "DELIVERED": 150,
    "CANCELLED": 3
  },
  "totalRevenue": 125000.00,
  "totalOrders": 198
}
```

---

## 4. Business Logic Features

### Coins Integration

**Earning Coins:**
- Users earn 1% of order subtotal as coins when order is delivered
- Example: Order subtotal AED 1000 → 100 coins earned
- Coins are only awarded when order status changes to DELIVERED

**Spending Coins:**
- 1 coin = AED 0.10
- Maximum 50% of subtotal can be paid with coins
- Example: Subtotal AED 1000 → Max 500 coins can be used (AED 50 discount)

**Refund on Cancellation:**
- If order is cancelled, used coins are refunded to wallet
- Stock is restored for all products in cancelled order

### Order Status Flow

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
           ↓
      CANCELLED (from PENDING or CONFIRMED only)
```

### Automatic Actions by Status

**CONFIRMED:**
- Set confirmedAt timestamp

**SHIPPED:**
- Set shippedAt timestamp

**DELIVERED:**
- Set deliveredAt timestamp
- Award coins to customer wallet

**CANCELLED:**
- Set cancelledAt timestamp
- Refund used coins
- Restore product stock
- Decrement product sales count

---

## 5. Testing Commands

### Create Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "addressId": "address-uuid",
    "paymentMethod": "CREDIT_CARD",
    "coinsToUse": 50
  }'
```

### Get User Orders
```bash
curl -X GET "http://localhost:3001/api/orders?page=1&limit=10&status=DELIVERED" \
  -b cookies.txt
```

### Get Single Order
```bash
curl -X GET http://localhost:3001/api/orders/order-uuid \
  -b cookies.txt
```

### Get Order by Number
```bash
curl -X GET http://localhost:3001/api/orders/number/ORD-1705320000000-ABC123XYZ \
  -b cookies.txt
```

### Cancel Order
```bash
curl -X PATCH http://localhost:3001/api/orders/order-uuid/cancel \
  -b cookies.txt
```

### Update Order Status (Admin/Vendor)
```bash
curl -X PATCH http://localhost:3001/api/orders/order-uuid/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "orderStatus": "SHIPPED"
  }'
```

### Get Vendor Orders
```bash
curl -X GET "http://localhost:3001/api/orders/vendor/my-orders?page=1&status=CONFIRMED" \
  -b cookies.txt
```

### Get Vendor Stats
```bash
curl -X GET http://localhost:3001/api/orders/vendor/stats \
  -b cookies.txt
```

---

## 6. Phase 4 Completion Checklist

- [ ] Orders module created with all DTOs
- [ ] Order creation with cart conversion
- [ ] Coins spending during checkout (max 50% of subtotal)
- [ ] Automatic coins earning on delivery (1% cashback)
- [ ] Order status management with automatic actions
- [ ] Customer order listing and filtering
- [ ] Order cancellation with coin refund and stock restoration
- [ ] Vendor order listing (only their products)
- [ ] Vendor order statistics
- [ ] Product stock deduction on order creation
- [ ] Product stock restoration on order cancellation
- [ ] Sales count increment/decrement
- [ ] All order endpoints tested
- [ ] Coin redemption limits enforced
- [ ] Order number generation working

---

## Next Steps

After completing Phase 4, proceed to:
- **Phase 5**: Vendor Dashboard APIs (vendor profile management, analytics)
- **Phase 6**: Admin Dashboard and Search functionality
- **Phase 7**: File Upload module for Supabase Storage integration

---

**Phase 4 Complete!** Full order management with coins integration is now functional.
