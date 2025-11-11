# AromaSouq MVP - Supabase Setup & Usage Guide

**Version:** 1.0  
**Last Updated:** October 24, 2025  
**Purpose:** Complete guide for using Supabase as database and storage solution

---

## 1. Why Supabase for AromaSouq?

Supabase is an open-source Firebase alternative that provides:

✅ **PostgreSQL 15+ Database** (managed, production-ready)  
✅ **Built-in File Storage** (S3-compatible with CDN)  
✅ **Image Transformations** (on-the-fly resizing, format conversion)  
✅ **Authentication** (optional, can use with NestJS JWT)  
✅ **Real-time Subscriptions** (bonus feature for live updates)  
✅ **Row Level Security** (fine-grained access control)  
✅ **Generous Free Tier** (500MB database, 1GB storage, 50k MAU)  
✅ **One Platform** (database + storage + auth in one place)  
✅ **Excellent Developer Experience** (dashboard, SQL editor, logs)

---

## 2. Initial Supabase Setup

### 2.1 Create Supabase Account

1. Visit https://supabase.com
2. Click "Start your project"
3. Sign up with:
   - GitHub (recommended for easy deployment)
   - Google
   - Email

### 2.2 Create New Project

**Project Details:**
```
Organization: Your Company / Personal
Project name: aromasouq-production
Database password: [Generate strong password - SAVE THIS!]
Region: 
  - Singapore (ap-southeast-1) - Closest to UAE
  - OR Frankfurt (eu-central-1) - EU option
Pricing plan: Free (start) → Pro ($25/mo when scaling)
```

**Wait Time:** ~2-3 minutes for project provisioning

### 2.3 Dashboard Overview

Once created, familiarize yourself with these sections:

```
📊 Home - Overview, quick actions
📋 Table Editor - Visual database browser (like phpMyAdmin)
✏️ SQL Editor - Run custom SQL queries
🗄️ Database - Schema, roles, extensions
🔐 Authentication - User management (if using Supabase Auth)
📁 Storage - File buckets and management
📈 Reports - Usage metrics, performance
⚙️ Settings - Project settings, API keys, connection strings
```

---

## 3. Get Your Credentials

### 3.1 API Keys

**Location:** Settings → API

```
ANON KEY (Public):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Use: Client-side (safe to expose in frontend)

SERVICE ROLE KEY (Secret):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Use: Server-side only (NestJS backend)
⚠️ NEVER expose this in frontend code!
```

### 3.2 Database Connection Strings

**Location:** Settings → Database → Connection string

**Direct Connection** (for migrations):
```
URI:
postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

Usage: Prisma migrations (npx prisma migrate dev)
```

**Pooled Connection** (for application):
```
URI with connection pooling:
postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true

Usage: Application runtime (NestJS with Prisma)
```

**Replace placeholders:**
- `[YOUR_PASSWORD]` → Your database password from step 2.2
- `[PROJECT_REF]` → Your project reference (e.g., `abcdefghijk`)

### 3.3 Project URL

```
Format: https://[PROJECT_REF].supabase.co
Example: https://abcdefghijk.supabase.co

Use: Base URL for Supabase client (storage, auth, API)
```

---

## 4. Configure Environment Variables

### 4.1 Backend (.env)

```bash
# Supabase Database Connections
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
DATABASE_URL_POOLER="postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true"

# Supabase API (for Storage and optional Auth)
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Other services (Redis, Stripe, etc.)
REDIS_URL="redis://default:[password]@[hostname]:[port]"
STRIPE_SECRET_KEY="sk_test_..."
# ... other env vars
```

### 4.2 Frontend (.env.local)

```bash
# Public Supabase Config (safe to expose)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"

# Stripe (public key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 5. Database Setup with Prisma

### 5.1 Install Prisma

```bash
cd aromasouq-api
npm install prisma @prisma/client --save-dev
```

### 5.2 Configure Prisma Schema

Create/update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")         // Direct connection for migrations
  directUrl = env("DATABASE_URL_POOLER") // Pooled connection for queries
}

// Models (User, Product, Order, etc.)
// ... copy from Database Schema document
```

### 5.3 Run Initial Migration

```bash
# Create migration and apply to Supabase
npx prisma migrate dev --name init

# Output:
# ✓ Applying migration `20251024000000_init`
# ✓ Generated Prisma Client

# Generate Prisma Client (if not auto-generated)
npx prisma generate
```

### 5.4 Verify Tables in Supabase

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. You should see all your tables:
   - User
   - Vendor
   - Product
   - ProductImage
   - Category
   - Order
   - OrderItem
   - etc.

### 5.5 Seed Database

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aromasouq.ae' },
    update: {},
    create: {
      email: 'admin@aromasouq.ae',
      emailVerified: true,
      firstName: 'Admin',
      lastName: 'User',
      password: await bcrypt.hash('admin123', 10),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Admin created:', admin.email);

  // Create categories
  const categories = [
    { name: 'Perfumes', nameAr: 'عطور', slug: 'perfumes' },
    { name: 'Oud', nameAr: 'عود', slug: 'oud' },
    { name: 'Attars', nameAr: 'عطور زيتية', slug: 'attars' },
    { name: 'Bakhoor', nameAr: 'بخور', slug: 'bakhoor' },
    // ... more categories
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Categories created');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

**Add to package.json:**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

### 5.6 Open Prisma Studio

```bash
npx prisma studio
```

Visit http://localhost:5555 to visually browse your database.

---

## 6. Storage Setup

### 6.1 Create Storage Buckets

**Method 1: Via Dashboard (Recommended)**

1. Dashboard → Storage → "New bucket"
2. Create these buckets:

```
Bucket: products
- Public: Yes
- File size limit: 50 MB
- Allowed MIME types: image/*, video/*

Bucket: brands
- Public: Yes
- File size limit: 10 MB
- Allowed MIME types: image/*

Bucket: users
- Public: Yes
- File size limit: 5 MB
- Allowed MIME types: image/*

Bucket: documents
- Public: No (Private)
- File size limit: 10 MB
- Allowed MIME types: application/pdf, image/*
```

**Method 2: Via SQL**

Run in SQL Editor:

```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 52428800, '{"image/*", "video/*"}'),
  ('brands', 'brands', true, 10485760, '{"image/*"}'),
  ('users', 'users', true, 5242880, '{"image/*"}'),
  ('documents', 'documents', false, 10485760, '{"application/pdf", "image/*"}');
```

### 6.2 Configure Storage Policies (Row Level Security)

**For Public Buckets (products, brands, users):**

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('products', 'brands', 'users') );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id IN ('products', 'brands', 'users') );

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( (bucket_id IN ('products', 'brands', 'users')) AND (auth.uid()::text = owner) );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING ( (bucket_id IN ('products', 'brands', 'users')) AND (auth.uid()::text = owner) );
```

**For Private Bucket (documents):**

```sql
-- Only service role can access
CREATE POLICY "Service role full access"
ON storage.objects
USING ( bucket_id = 'documents' );
```

---

## 7. Backend Integration (NestJS)

### 7.1 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 7.2 Create Storage Service

Create `src/storage/storage.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_KEY')!, // Use service key
    );
  }

  /**
   * Upload product image with optimization
   */
  async uploadProductImage(
    productId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    const fileName = `${productId}/${timestamp}.${ext}`;

    // Optimize image
    const optimizedBuffer = await sharp(file.buffer)
      .resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from('products')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  /**
   * Upload with multiple sizes
   */
  async uploadWithSizes(
    productId: string,
    file: Express.Multer.File,
  ): Promise<{
    original: string;
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
  }> {
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    const baseName = `${productId}/${timestamp}`;

    // Original
    const originalBuffer = await sharp(file.buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    await this.supabase.storage
      .from('products')
      .upload(`${baseName}-original.webp`, originalBuffer, {
        contentType: 'image/webp',
      });

    // Generate other sizes
    const sizes = [
      { name: 'thumbnail', width: 80, height: 80 },
      { name: 'small', width: 240, height: 240 },
      { name: 'medium', width: 480, height: 480 },
      { name: 'large', width: 800, height: 800 },
    ];

    for (const size of sizes) {
      const buffer = await sharp(file.buffer)
        .resize(size.width, size.height, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

      await this.supabase.storage
        .from('products')
        .upload(`${baseName}-${size.name}.webp`, buffer, {
          contentType: 'image/webp',
        });
    }

    const baseUrl = `${this.configService.get('SUPABASE_URL')}/storage/v1/object/public/products`;

    return {
      original: `${baseUrl}/${baseName}-original.webp`,
      thumbnail: `${baseUrl}/${baseName}-thumbnail.webp`,
      small: `${baseUrl}/${baseName}-small.webp`,
      medium: `${baseUrl}/${baseName}-medium.webp`,
      large: `${baseUrl}/${baseName}-large.webp`,
    };
  }

  /**
   * Get URL with transformations (on-the-fly resizing)
   */
  getTransformedUrl(
    bucket: string,
    path: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'origin';
    },
  ): string {
    const baseUrl = `${this.configService.get('SUPABASE_URL')}/storage/v1/render/image/public/${bucket}/${path}`;
    
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.format) params.append('format', options.format);

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Delete file
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(bucket: string, folder: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(folder);

    if (error) throw new Error(error.message);
    return data;
  }
}
```

### 7.3 Create Storage Module

Create `src/storage/storage.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
```

### 7.4 Use in Products Module

```typescript
// products.controller.ts
import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';

@Controller('products')
export class ProductsController {
  constructor(
    private storageService: StorageService,
    private productsService: ProductsService,
  ) {}

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new BadRequestException('Only images allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadImages(
    @Param('id') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = [];

    for (const file of files) {
      // Upload to Supabase
      const imageData = await this.storageService.uploadWithSizes(
        productId,
        file,
      );

      // Save to database
      const image = await this.productsService.createProductImage({
        productId,
        url: imageData.original,
        // Store other sizes in metadata or separate columns
      });

      uploadedImages.push(imageData);
    }

    return {
      success: true,
      images: uploadedImages,
    };
  }
}
```

---

## 8. Frontend Integration (Next.js)

### 8.1 Configure Next.js Image

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      '[your-project-ref].supabase.co', // Replace with your actual ref
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
```

### 8.2 Display Product Images

```typescript
// components/ProductImage.tsx
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function ProductImage({ src, alt, width = 800, height = 800 }: ProductImageProps) {
  // Use Supabase transformation for responsive images
  const getOptimizedUrl = (width: number) => {
    // If src already has query params, add to them
    const url = new URL(src);
    url.searchParams.set('width', width.toString());
    url.searchParams.set('height', width.toString());
    url.searchParams.set('format', 'webp');
    url.searchParams.set('quality', '85');
    return url.toString();
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
      loading="lazy"
      className="object-cover rounded-lg"
    />
  );
}
```

### 8.3 Image Upload Component

```typescript
// components/ImageUpload.tsx
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

interface ImageUploadProps {
  productId: string;
  onUploadComplete?: (images: any[]) => void;
}

export default function ImageUpload({ productId, onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);

    try {
      // Compress images
      const compressed = await Promise.all(
        acceptedFiles.map((file) =>
          imageCompression(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 2000,
            useWebWorker: true,
          })
        )
      );

      // Upload
      const formData = new FormData();
      compressed.forEach((file) => formData.append('images', file));

      const response = await fetch(`/api/products/${productId}/images`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setImages([...images, ...data.images]);
      onUploadComplete?.(data.images);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleRemove = async (imageId: string) => {
    // Call API to delete image
    await fetch(`/api/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
    setImages(images.filter((img) => img.id !== imageId));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-oud-gold bg-oud-gold/10' : 'border-gray-300 hover:border-oud-gold'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div>
          {uploading ? (
            <p className="text-gray-600">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-oud-gold font-semibold">Drop images here...</p>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Up to 10 images, max 10MB each
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <Image
                src={img.thumbnail || img.original}
                alt={`Upload ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <button
                onClick={() => handleRemove(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 9. Image Transformations

Supabase provides automatic image transformations via URL parameters.

### 9.1 Transformation Parameters

```typescript
// Base URL
const baseUrl = 'https://[ref].supabase.co/storage/v1/object/public/products/abc123/image.jpg';

// Original image
const original = baseUrl;

// Resized (800x800, WebP, 85% quality)
const resized = `${baseUrl}?width=800&height=800&format=webp&quality=85`;

// Thumbnail (240x240)
const thumbnail = `${baseUrl}?width=240&height=240&format=webp`;

// Available parameters:
// - width: number (pixels)
// - height: number (pixels)
// - quality: 1-100 (default: 80)
// - format: webp | avif | origin
// - resize: cover | contain | fill (default: cover)
```

### 9.2 Helper Function

```typescript
// utils/imageUrl.ts
export function getImageUrl(
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'origin';
  }
): string {
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${path}`;
  
  if (!options) return baseUrl;

  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);

  return `${baseUrl}?${params.toString()}`;
}

// Usage
const productImage = getImageUrl('product-123/image.jpg', {
  width: 800,
  height: 800,
  quality: 85,
  format: 'webp',
});
```

---

## 10. Monitoring & Maintenance

### 10.1 Check Usage

Dashboard → Reports:
- Database size
- Storage used
- Bandwidth
- API requests
- Database connections

### 10.2 Backups

**Free Tier:** No automatic backups (manual only)

**Manual Backup:**
```bash
pg_dump "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres" > backup.sql
```

**Pro Tier ($25/mo):**
- Daily automatic backups
- 7-day retention
- One-click restore

**Team Tier ($599/mo):**
- Daily backups
- 30-day retention
- Point-in-time recovery

### 10.3 Upgrade Plan

When to upgrade to Pro:
- ✅ Database > 500MB
- ✅ Storage > 1GB
- ✅ Need automatic backups
- ✅ More than 50k monthly active users
- ✅ Need priority support

---

## 11. Troubleshooting

### 11.1 Connection Issues

**Problem:** Can't connect to database

**Solutions:**
1. Check password is correct
2. Verify connection string format
3. Check if project is paused (inactive for 7 days on free tier)
4. Verify IP allowlist (Settings → Database → Connection pooling)

### 11.2 Upload Failures

**Problem:** File upload fails

**Solutions:**
1. Check bucket exists
2. Verify bucket is public (for public files)
3. Check file size limits
4. Verify MIME type is allowed
5. Check storage policies (RLS)
6. Use service_role key in backend (not anon key)

### 11.3 Images Not Displaying

**Problem:** Images return 404

**Solutions:**
1. Verify bucket is public
2. Check file path (no leading slash)
3. Verify RLS policies allow public read
4. Check URL structure is correct
5. Open URL in browser to see exact error

### 11.4 Slow Queries

**Problem:** Database queries are slow

**Solutions:**
1. Add indexes to frequently queried columns
2. Use connection pooling (DATABASE_URL_POOLER)
3. Optimize Prisma queries (select only needed fields)
4. Check query performance in Dashboard → Reports
5. Use Redis caching for frequently accessed data

---

## 12. Best Practices

### 12.1 Security

✅ **DO:**
- Use service_role key only in backend
- Use connection pooling for application
- Enable RLS (Row Level Security) when needed
- Validate file uploads (type, size)
- Use strong database password
- Rotate API keys periodically

❌ **DON'T:**
- Expose service_role key in frontend
- Commit credentials to Git
- Disable RLS without understanding implications
- Allow unlimited file uploads
- Use direct connection for application

### 12.2 Performance

✅ **DO:**
- Use image transformations (don't store multiple sizes if using Supabase)
- Implement caching (Redis)
- Use indexes on frequently queried columns
- Use connection pooling
- Compress images before upload
- Use WebP format

❌ **DON'T:**
- Store huge files (>50MB)
- Make unnecessary database queries
- Skip image optimization
- Use N+1 queries

### 12.3 Cost Optimization

✅ **DO:**
- Monitor usage regularly
- Clean up unused files
- Use image transformations (saves storage)
- Implement pagination
- Cache frequently accessed data

❌ **DON'T:**
- Store unnecessary data
- Duplicate files
- Keep deleted user data indefinitely
- Ignore storage usage

---

## 13. Migration Guide (From Other Databases)

### 13.1 From Railway/Render PostgreSQL

```bash
# Export from old database
pg_dump "$OLD_DATABASE_URL" > export.sql

# Import to Supabase
psql "$SUPABASE_DATABASE_URL" < export.sql

# Verify
npx prisma db pull
```

### 13.2 From MongoDB/MySQL

Use Prisma Migrate:
1. Update schema.prisma with PostgreSQL provider
2. Run `npx prisma db push`
3. Write data migration scripts
4. Test thoroughly

---

## 14. Support & Resources

### 14.1 Official Resources

- **Documentation:** https://supabase.com/docs
- **Discord Community:** https://discord.supabase.com
- **GitHub:** https://github.com/supabase/supabase
- **Status Page:** https://status.supabase.com

### 14.2 Getting Help

1. Check documentation first
2. Search GitHub issues
3. Ask in Discord community
4. Email support (Pro/Team plans get priority)

---

**Document Status:** ✅ Supabase Setup Guide Complete

**Quick Checklist:**
- [ ] Supabase account created
- [ ] Project provisioned
- [ ] Credentials saved securely
- [ ] Storage buckets created
- [ ] Environment variables configured
- [ ] Database tables created (Prisma migrate)
- [ ] Sample data seeded
- [ ] Backend storage service created
- [ ] Frontend image upload tested
- [ ] Can view data in Supabase Dashboard

**You're ready to build with Supabase! 🚀**
