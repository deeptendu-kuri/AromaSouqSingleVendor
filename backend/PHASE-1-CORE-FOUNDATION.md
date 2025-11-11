# Backend Phase 1: Core Foundation

## Overview
This phase establishes the core foundation including complete database schema migration, authentication with httpOnly cookies, and the Categories module.

---

## 1. Complete Prisma Schema Migration

### Current Schema Analysis
**Existing Models (12)**: User, Vendor, Category, Brand, Product, Address, Order, OrderItem, CartItem, WishlistItem, Review

**Existing Enums (6)**: UserRole, UserStatus, VendorStatus, OrderStatus, PaymentStatus, PaymentMethod

### Updated Complete Schema

Replace the entire content of `aromasouq-api/prisma/schema.prisma` with:

```prisma
// This is your Prisma schema file for AromaSouq MVP v2
// Luxury fragrance marketplace for UAE/GCC market

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================================================
// ENUMS
// ============================================================================

enum UserRole {
  ADMIN
  CUSTOMER
  VENDOR
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum VendorStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  WALLET
  CASH_ON_DELIVERY
}

enum CoinTransactionType {
  EARNED
  SPENT
  REFUNDED
  EXPIRED
  ADMIN_ADJUSTMENT
}

enum CoinSource {
  ORDER_PURCHASE
  PRODUCT_REVIEW
  REFERRAL
  PROMOTION
  REFUND
  ADMIN
}

enum VoteType {
  HELPFUL
  NOT_HELPFUL
}

// ============================================================================
// USER MODEL
// ============================================================================

model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  firstName String     @map("first_name")
  lastName  String     @map("last_name")
  phone     String?
  avatar    String?
  role      UserRole   @default(CUSTOMER)
  status    UserStatus @default(ACTIVE)

  // New fields for MVP v2
  emailVerified    Boolean  @default(false) @map("email_verified")
  preferredLanguage String  @default("en") @map("preferred_language")

  // Addresses
  addresses Address[]

  // Orders
  orders Order[]

  // Reviews
  reviews Review[]
  reviewVotes ReviewVote[]

  // Wishlist
  wishlist WishlistItem[]

  // Cart
  cartItems CartItem[]

  // Vendor Profile (if role is VENDOR)
  vendorProfile Vendor?

  // Wallet for coins
  wallet Wallet?

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

// ============================================================================
// VENDOR MODEL
// ============================================================================

model Vendor {
  id              String       @id @default(uuid())
  userId          String       @unique @map("user_id")
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  businessName    String       @map("business_name")
  businessNameAr  String?      @map("business_name_ar")
  description     String?
  descriptionAr   String?      @map("description_ar")
  logo            String?
  banner          String?

  // New fields for MVP v2
  tagline         String?
  taglineAr       String?      @map("tagline_ar")
  brandStory      String?      @map("brand_story")
  brandStoryAr    String?      @map("brand_story_ar")

  // Social Media
  instagramUrl    String?      @map("instagram_url")
  facebookUrl     String?      @map("facebook_url")
  twitterUrl      String?      @map("twitter_url")
  tiktokUrl       String?      @map("tiktok_url")

  // WhatsApp
  whatsappNumber  String?      @map("whatsapp_number")
  whatsappEnabled Boolean      @default(false) @map("whatsapp_enabled")

  // Business Details
  tradeLicense    String?      @map("trade_license")
  taxNumber       String?      @map("tax_number")

  // Contact
  businessEmail   String       @map("business_email")
  businessPhone   String       @map("business_phone")
  website         String?

  // Status
  status          VendorStatus @default(PENDING)
  verifiedAt      DateTime?    @map("verified_at")

  // Products
  products        Product[]

  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  @@map("vendors")
}

// ============================================================================
// CATEGORY MODEL
// ============================================================================

model Category {
  id          String    @id @default(uuid())
  name        String
  nameAr      String?   @map("name_ar")
  slug        String    @unique
  description String?
  descriptionAr String? @map("description_ar")
  icon        String?
  image       String?

  // Hierarchy
  parentId    String?   @map("parent_id")
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")

  // Products
  products    Product[]

  // Display Order
  sortOrder   Int       @default(0) @map("sort_order")
  isActive    Boolean   @default(true) @map("is_active")

  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("categories")
}

// ============================================================================
// BRAND MODEL
// ============================================================================

model Brand {
  id          String   @id @default(uuid())
  name        String
  nameAr      String?  @map("name_ar")
  slug        String   @unique
  description String?
  descriptionAr String? @map("description_ar")
  logo        String?
  banner      String?

  // Products
  products    Product[]

  isActive    Boolean  @default(true) @map("is_active")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("brands")
}

// ============================================================================
// PRODUCT MODEL
// ============================================================================

model Product {
  id             String   @id @default(uuid())

  // Basic Info
  name           String
  nameAr         String?  @map("name_ar")
  slug           String   @unique
  description    String?
  descriptionAr  String?  @map("description_ar")

  // Pricing
  price          Float
  compareAtPrice Float?   @map("compare_at_price")
  cost           Float?

  // Inventory
  sku            String   @unique
  barcode        String?
  stock          Int      @default(0)
  lowStockAlert  Int      @default(10) @map("low_stock_alert")

  // Media
  images         String[]
  video          String?

  // Relations
  categoryId     String   @map("category_id")
  category       Category @relation(fields: [categoryId], references: [id])

  brandId        String?  @map("brand_id")
  brand          Brand?   @relation(fields: [brandId], references: [id])

  vendorId       String   @map("vendor_id")
  vendor         Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  // Basic Specifications
  size           String?
  concentration  String?
  gender         String?
  notes          String?

  // NEW: Enhanced Scent Profile for MVP v2
  topNotes       String?  @map("top_notes")
  heartNotes     String?  @map("heart_notes")
  baseNotes      String?  @map("base_notes")
  scentFamily    String?  @map("scent_family")
  longevity      String?  // e.g., "6-8 hours"
  sillage        String?  // e.g., "Moderate"
  season         String?  // e.g., "Summer, Spring"

  // NEW: WhatsApp Integration
  enableWhatsapp Boolean  @default(false) @map("enable_whatsapp")
  whatsappNumber String?  @map("whatsapp_number")

  // NEW: Coins System
  coinsToAward   Int      @default(0) @map("coins_to_award")

  // NEW: Product Stats
  viewCount      Int      @default(0) @map("view_count")
  salesCount     Int      @default(0) @map("sales_count")

  // SEO
  metaTitle      String?  @map("meta_title")
  metaDescription String? @map("meta_description")

  // Status
  isActive       Boolean  @default(true) @map("is_active")
  isFeatured     Boolean  @default(false) @map("is_featured")

  // Reviews
  reviews        Review[]
  averageRating  Float    @default(0) @map("average_rating")
  reviewCount    Int      @default(0) @map("review_count")

  // NEW: Product Variants (sizes, variations)
  variants       ProductVariant[]

  // NEW: Product Videos
  videos         ProductVideo[]

  // Wishlist & Cart
  wishlistItems  WishlistItem[]
  cartItems      CartItem[]
  orderItems     OrderItem[]

  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  @@map("products")
}

// ============================================================================
// PRODUCT VARIANT MODEL (NEW)
// ============================================================================

model ProductVariant {
  id          String   @id @default(uuid())
  productId   String   @map("product_id")
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  name        String   // e.g., "50ml", "100ml", "Travel Size"
  nameAr      String?  @map("name_ar")
  sku         String   @unique
  price       Float
  stock       Int      @default(0)

  // Optional variant-specific fields
  image       String?
  compareAtPrice Float? @map("compare_at_price")

  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("product_variants")
}

// ============================================================================
// PRODUCT VIDEO MODEL (NEW)
// ============================================================================

model ProductVideo {
  id          String   @id @default(uuid())
  productId   String   @map("product_id")
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  url         String
  title       String?
  titleAr     String?  @map("title_ar")
  thumbnail   String?
  duration    Int?     // in seconds

  sortOrder   Int      @default(0) @map("sort_order")
  isActive    Boolean  @default(true) @map("is_active")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("product_videos")
}

// ============================================================================
// WALLET MODEL (NEW)
// ============================================================================

model Wallet {
  id            String   @id @default(uuid())
  userId        String   @unique @map("user_id")
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  balance       Int      @default(0) // Coin balance
  lifetimeEarned Int     @default(0) @map("lifetime_earned")
  lifetimeSpent  Int     @default(0) @map("lifetime_spent")

  transactions  CoinTransaction[]

  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("wallets")
}

// ============================================================================
// COIN TRANSACTION MODEL (NEW)
// ============================================================================

model CoinTransaction {
  id          String              @id @default(uuid())
  walletId    String              @map("wallet_id")
  wallet      Wallet              @relation(fields: [walletId], references: [id], onDelete: Cascade)

  amount      Int                 // Positive for earned, negative for spent
  type        CoinTransactionType
  source      CoinSource
  description String?

  // Reference IDs
  orderId     String?             @map("order_id")
  reviewId    String?             @map("review_id")
  productId   String?             @map("product_id")

  // Balance after this transaction
  balanceAfter Int                @map("balance_after")

  // Expiry for earned coins (optional)
  expiresAt   DateTime?           @map("expires_at")

  createdAt   DateTime            @default(now()) @map("created_at")

  @@map("coin_transactions")
  @@index([walletId])
}

// ============================================================================
// ADDRESS MODEL
// ============================================================================

model Address {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  fullName     String   @map("full_name")
  phone        String

  // Address Details
  addressLine1 String   @map("address_line1")
  addressLine2 String?  @map("address_line2")
  city         String
  state        String
  country      String   @default("UAE")
  zipCode      String   @map("zip_code")

  // Flags
  isDefault    Boolean  @default(false) @map("is_default")

  // Orders
  orders       Order[]

  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("addresses")
}

// ============================================================================
// ORDER MODEL
// ============================================================================

model Order {
  id              String        @id @default(uuid())
  orderNumber     String        @unique @map("order_number")

  userId          String        @map("user_id")
  user            User          @relation(fields: [userId], references: [id])

  addressId       String        @map("address_id")
  address         Address       @relation(fields: [addressId], references: [id])

  // Order Details
  items           OrderItem[]

  // Pricing
  subtotal        Float
  tax             Float
  shippingFee     Float         @map("shipping_fee")
  discount        Float         @default(0)
  total           Float

  // NEW: Coins Integration
  coinsEarned     Int           @default(0) @map("coins_earned")
  coinsUsed       Int           @default(0) @map("coins_used")

  // Status
  orderStatus     OrderStatus   @default(PENDING) @map("order_status")
  paymentStatus   PaymentStatus @default(PENDING) @map("payment_status")
  paymentMethod   PaymentMethod @map("payment_method")

  // Payment
  paymentId       String?       @map("payment_id")

  // Tracking
  trackingNumber  String?       @map("tracking_number")

  // Timestamps
  confirmedAt     DateTime?     @map("confirmed_at")
  shippedAt       DateTime?     @map("shipped_at")
  deliveredAt     DateTime?     @map("delivered_at")
  cancelledAt     DateTime?     @map("cancelled_at")

  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  @@map("orders")
}

// ============================================================================
// ORDER ITEM MODEL
// ============================================================================

model OrderItem {
  id        String  @id @default(uuid())

  orderId   String  @map("order_id")
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String  @map("product_id")
  product   Product @relation(fields: [productId], references: [id])

  quantity  Int
  price     Float

  createdAt DateTime @default(now()) @map("created_at")

  @@map("order_items")
}

// ============================================================================
// CART ITEM MODEL
// ============================================================================

model CartItem {
  id        String   @id @default(uuid())

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  productId String   @map("product_id")
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  quantity  Int      @default(1)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([userId, productId])
  @@map("cart_items")
}

// ============================================================================
// WISHLIST ITEM MODEL
// ============================================================================

model WishlistItem {
  id        String   @id @default(uuid())

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  productId String   @map("product_id")
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, productId])
  @@map("wishlist_items")
}

// ============================================================================
// REVIEW MODEL
// ============================================================================

model Review {
  id        String   @id @default(uuid())

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  productId String   @map("product_id")
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  rating    Int
  title     String?
  comment   String?
  images    String[]

  // NEW: Vendor Reply
  vendorReply     String?   @map("vendor_reply")
  vendorRepliedAt DateTime? @map("vendor_replied_at")

  // NEW: Helpful/Not Helpful voting
  helpfulCount    Int       @default(0) @map("helpful_count")
  notHelpfulCount Int       @default(0) @map("not_helpful_count")

  // Status
  isVerifiedPurchase Boolean @default(false) @map("is_verified_purchase")
  isPublished        Boolean @default(true) @map("is_published")

  // NEW: Review Images relation
  reviewImages ReviewImage[]

  // NEW: Review Votes
  votes        ReviewVote[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([userId, productId])
  @@map("reviews")
}

// ============================================================================
// REVIEW IMAGE MODEL (NEW)
// ============================================================================

model ReviewImage {
  id        String   @id @default(uuid())
  reviewId  String   @map("review_id")
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  url       String
  sortOrder Int      @default(0) @map("sort_order")

  createdAt DateTime @default(now()) @map("created_at")

  @@map("review_images")
}

// ============================================================================
// REVIEW VOTE MODEL (NEW)
// ============================================================================

model ReviewVote {
  id        String   @id @default(uuid())
  reviewId  String   @map("review_id")
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  voteType  VoteType @map("vote_type")

  createdAt DateTime @default(now()) @map("created_at")

  @@unique([reviewId, userId])
  @@map("review_votes")
}
```

---

## 2. Migration Commands

### Step 1: Create Migration
```bash
cd aromasouq-api
npx prisma migrate dev --name mvp_v2_complete_schema
```

This will:
- Generate a new migration file in `prisma/migrations/`
- Apply the migration to your database
- Preserve all existing data
- Add new tables: `product_variants`, `product_videos`, `wallets`, `coin_transactions`, `review_images`, `review_votes`
- Add new columns to existing tables (User, Vendor, Product, Order, Review)

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

This regenerates the Prisma Client with the new schema types.

### Step 3: Verify Migration
```bash
npx prisma studio
```

Open Prisma Studio to verify all tables and columns are created correctly.

---

## 3. Install Required Dependencies

```bash
cd aromasouq-api
npm install cookie-parser
npm install --save-dev @types/cookie-parser
npm install class-validator class-transformer
```

---

## 4. Update Main Application for Cookie-Based Auth

### File: `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cookie parser middleware
  app.use(cookieParser());

  // CORS configuration for cookie-based auth
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
```

---

## 5. Update Auth Module for httpOnly Cookies

### File: `src/auth/auth.controller.ts`

Update the login and register methods to set httpOnly cookies:

```typescript
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);

    // Set httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data without token
    return {
      message: 'Registration successful',
      user: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set httpOnly cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data without token
    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear the cookie
    res.clearCookie('access_token');

    return {
      message: 'Logout successful',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const userId = req.user['sub'];
    const user = await this.authService.findUserById(userId);

    return {
      user,
    };
  }
}
```

### File: `src/auth/auth.service.ts`

Add the `findUserById` method:

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
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
      },
    });

    // Create wallet for user
    await this.prisma.wallet.create({
      data: {
        userId: user.id,
      },
    });

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async findUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        preferredLanguage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
```

### File: `src/auth/strategies/jwt.strategy.ts`

Update to extract JWT from cookies:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException();
    }

    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
```

---

## 6. Create Roles Decorator and Guard

### File: `src/auth/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

### File: `src/auth/guards/roles.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

---

## 7. Categories Module

### File: `src/categories/categories.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
```

### File: `src/categories/dto/create-category.dto.ts`

```typescript
import { IsString, IsOptional, IsBoolean, IsInt, IsUUID } from 'class-validator';

export class CreateCategoryDto {
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
  icon?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

### File: `src/categories/dto/update-category.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
```

### File: `src/categories/categories.service.ts`

```typescript
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
```

### File: `src/categories/categories.controller.ts`

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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Public endpoints
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('with-product-count')
  findAllWithProducts() {
    return this.categoriesService.findAllWithProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  // Admin-only endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
```

---

## 8. Update App Module

### File: `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 9. API Endpoints Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user and set httpOnly cookie.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+971501234567"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+971501234567",
    "avatar": null,
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Cookies Set:**
- `access_token`: JWT token (httpOnly, secure in production, sameSite: strict, 7 days expiry)

---

#### POST /api/auth/login
Login user and set httpOnly cookie.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+971501234567",
    "avatar": null,
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Cookies Set:**
- `access_token`: JWT token (httpOnly, secure in production, sameSite: strict, 7 days expiry)

---

#### POST /api/auth/logout
Logout user and clear cookie.

**Headers:**
```
Cookie: access_token=<jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

**Cookies Cleared:**
- `access_token`

---

#### GET /api/auth/me
Get current user profile.

**Headers:**
```
Cookie: access_token=<jwt-token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+971501234567",
    "avatar": null,
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "emailVerified": false,
    "preferredLanguage": "en",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### Categories Endpoints

#### GET /api/categories
Get all active categories with their children (public).

**Response (200 OK):**
```json
[
  {
    "id": "uuid-1",
    "name": "Men's Fragrances",
    "nameAr": "عطور رجالية",
    "slug": "mens-fragrances",
    "description": "Luxurious fragrances for men",
    "descriptionAr": "عطور فاخرة للرجال",
    "icon": "https://...",
    "image": "https://...",
    "parentId": null,
    "sortOrder": 1,
    "isActive": true,
    "children": [
      {
        "id": "uuid-2",
        "name": "Oud",
        "nameAr": "عود",
        "slug": "oud",
        "description": "Traditional oud fragrances",
        "descriptionAr": "عطور العود التقليدية",
        "icon": null,
        "image": "https://...",
        "parentId": "uuid-1",
        "sortOrder": 1,
        "isActive": true
      }
    ],
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

---

#### GET /api/categories/with-product-count
Get all categories with product count (public).

**Response (200 OK):**
```json
[
  {
    "id": "uuid-1",
    "name": "Men's Fragrances",
    "nameAr": "عطور رجالية",
    "slug": "mens-fragrances",
    "description": "Luxurious fragrances for men",
    "icon": "https://...",
    "image": "https://...",
    "parentId": null,
    "sortOrder": 1,
    "isActive": true,
    "children": [...],
    "_count": {
      "products": 45
    }
  }
]
```

---

#### GET /api/categories/:id
Get single category by ID (public).

**Response (200 OK):**
```json
{
  "id": "uuid-1",
  "name": "Men's Fragrances",
  "nameAr": "عطور رجالية",
  "slug": "mens-fragrances",
  "description": "Luxurious fragrances for men",
  "descriptionAr": "عطور فاخرة للرجال",
  "icon": "https://...",
  "image": "https://...",
  "parentId": null,
  "sortOrder": 1,
  "isActive": true,
  "children": [...],
  "parent": null,
  "_count": {
    "products": 45
  },
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

---

#### GET /api/categories/slug/:slug
Get single category by slug (public).

**Response (200 OK):**
Same as GET /api/categories/:id

---

#### POST /api/categories
Create a new category (Admin only).

**Headers:**
```
Cookie: access_token=<admin-jwt-token>
```

**Request Body:**
```json
{
  "name": "Women's Fragrances",
  "nameAr": "عطور نسائية",
  "slug": "womens-fragrances",
  "description": "Luxurious fragrances for women",
  "descriptionAr": "عطور فاخرة للنساء",
  "icon": "https://...",
  "image": "https://...",
  "parentId": null,
  "sortOrder": 2,
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-new",
  "name": "Women's Fragrances",
  "nameAr": "عطور نسائية",
  "slug": "womens-fragrances",
  "description": "Luxurious fragrances for women",
  "descriptionAr": "عطور فاخرة للنساء",
  "icon": "https://...",
  "image": "https://...",
  "parentId": null,
  "sortOrder": 2,
  "isActive": true,
  "children": [],
  "parent": null,
  "createdAt": "2025-01-15T11:00:00.000Z",
  "updatedAt": "2025-01-15T11:00:00.000Z"
}
```

---

#### PATCH /api/categories/:id
Update a category (Admin only).

**Headers:**
```
Cookie: access_token=<admin-jwt-token>
```

**Request Body:**
```json
{
  "description": "Updated description",
  "sortOrder": 3
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-1",
  "name": "Women's Fragrances",
  "nameAr": "عطور نسائية",
  "slug": "womens-fragrances",
  "description": "Updated description",
  "descriptionAr": "عطور فاخرة للنساء",
  "icon": "https://...",
  "image": "https://...",
  "parentId": null,
  "sortOrder": 3,
  "isActive": true,
  "children": [],
  "parent": null,
  "createdAt": "2025-01-15T11:00:00.000Z",
  "updatedAt": "2025-01-15T11:30:00.000Z"
}
```

---

#### DELETE /api/categories/:id
Soft delete a category (Admin only).

**Headers:**
```
Cookie: access_token=<admin-jwt-token>
```

**Response (200 OK):**
```json
{
  "id": "uuid-1",
  "name": "Women's Fragrances",
  "slug": "womens-fragrances",
  "isActive": false,
  ...
}
```

---

## 10. Testing Commands

### Start Development Server
```bash
cd aromasouq-api
npm run start:dev
```

### Test Auth Endpoints

**Register:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+971501234567"
  }' \
  -c cookies.txt -v
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }' \
  -c cookies.txt -v
```

**Get Profile:**
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -b cookies.txt -v
```

**Logout:**
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -b cookies.txt -v
```

### Test Categories Endpoints

**Get All Categories:**
```bash
curl -X GET http://localhost:3001/api/categories
```

**Create Category (requires admin auth):**
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test Category",
    "nameAr": "فئة الاختبار",
    "slug": "test-category",
    "description": "Test description",
    "sortOrder": 1
  }'
```

---

## 11. Phase 1 Completion Checklist

- [ ] Prisma schema updated with all MVP v2 models and fields
- [ ] Migration applied successfully (`npx prisma migrate dev`)
- [ ] Prisma Client regenerated (`npx prisma generate`)
- [ ] Dependencies installed (cookie-parser, class-validator, class-transformer)
- [ ] `src/main.ts` updated with cookie-parser and CORS
- [ ] Auth controller updated for httpOnly cookies (register, login, logout)
- [ ] Auth service updated with `findUserById` method
- [ ] JWT strategy updated to extract token from cookies
- [ ] Roles decorator and RolesGuard created
- [ ] Categories module created (module, service, controller, DTOs)
- [ ] AppModule updated with CategoriesModule
- [ ] All auth endpoints tested and working
- [ ] All categories endpoints tested and working
- [ ] Wallet automatically created on user registration

---

## Next Steps

After completing Phase 1, proceed to:
- **Phase 2**: Brands, Products with enhanced features (scent profiles, variants, videos)
- **Phase 3**: Cart, Wishlist, Reviews with images and voting
- **Phase 4**: Orders with coins integration, Wallet/Coins management
- **Phase 5**: Vendor dashboard APIs
- **Phase 6**: Admin dashboard APIs and search functionality

---

**Phase 1 Complete!** This establishes the solid foundation for the AromaSouq MVP v2 backend.
