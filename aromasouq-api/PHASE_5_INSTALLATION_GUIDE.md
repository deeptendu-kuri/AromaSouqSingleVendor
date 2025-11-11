# Phase 5: File Upload Installation & Deployment Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Supabase account with project created
- ✅ Database migrations already applied

---

## Step 1: Install Required Dependencies

The file upload feature requires the following npm packages:

```bash
cd aromasouq-api

# Install required packages
npm install uuid @types/uuid @types/multer

# Alternative: If npm fails, try yarn
yarn add uuid @types/uuid @types/multer
```

### Package Details:

| Package | Version | Purpose |
|---------|---------|---------|
| `uuid` | Latest | Generate unique file identifiers |
| `@types/uuid` | Latest | TypeScript types for uuid |
| `@types/multer` | Latest | TypeScript types for file uploads |

**Note:** `multer` itself is already included with `@nestjs/platform-express`

---

## Step 2: Verify Environment Variables

Ensure your `.env` file has the correct Supabase configuration:

```env
# Supabase Configuration
SUPABASE_URL="https://owflekosdjmwnkqpjjnn.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Storage Bucket Names
PRODUCTS_BUCKET="products"
BRANDS_BUCKET="brands"
USERS_BUCKET="users"
DOCUMENTS_BUCKET="documents"
```

### How to Get Supabase Keys:

1. Go to [https://supabase.com](https://supabase.com)
2. Select your AromaSouq project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Security Warning:** Never commit the `.env` file to version control!

---

## Step 3: Create Supabase Storage Buckets

Follow the detailed guide in `SUPABASE_BUCKETS_SETUP.md` to create the required buckets:

1. **products** - For product images and videos
2. **brands** - For brand logos and banners
3. **users** - For user avatars
4. **documents** - For vendor documents

### Quick Setup (via Supabase Dashboard):

```
1. Go to Storage in Supabase Dashboard
2. Click "New bucket" for each:
   - Name: products,  Public: ✅, Size limit: 50MB
   - Name: brands,    Public: ✅, Size limit: 5MB
   - Name: users,     Public: ✅, Size limit: 5MB
   - Name: documents, Public: ❌, Size limit: 10MB
3. Click "Create bucket" for each
```

---

## Step 4: Build the Application

```bash
# Generate Prisma Client (if not already done)
npx prisma generate

# Build the application
npm run build

# Verify build succeeded
ls dist/
```

Expected output:
```
dist/
├── app.controller.d.ts
├── app.controller.js
├── app.module.d.ts
├── app.module.js
├── main.d.ts
├── main.js
├── supabase/
├── uploads/
└── ... other compiled files
```

---

## Step 5: Run the Application

### Development Mode:

```bash
npm run start:dev
```

Expected output:
```
[Nest] 12345  - 10/26/2025, 11:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/26/2025, 11:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 10/26/2025, 11:00:00 AM     LOG [InstanceLoader] SupabaseModule dependencies initialized
[Nest] 12345  - 10/26/2025, 11:00:00 AM     LOG [InstanceLoader] UploadsModule dependencies initialized
...
🚀 AromaSouq API is running on: http://localhost:3001/api
```

### Production Mode:

```bash
# Build
npm run build

# Start
npm run start:prod
```

---

## Step 6: Verify Installation

### Test 1: Check API Health

```bash
curl http://localhost:3001/api
```

Expected response:
```
Hello World!
```

### Test 2: Check if Modules are Loaded

Look for these logs on startup:
```
[InstanceLoader] SupabaseModule dependencies initialized +X ms
[InstanceLoader] UploadsModule dependencies initialized +X ms
```

### Test 3: Test Upload Endpoint (Requires Authentication)

```bash
# First, login to get JWT token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aromasouq.ae","password":"Admin123!"}' \
  -c cookies.txt

# Then test file upload
curl -X POST http://localhost:3001/api/uploads/users/avatar \
  -H "Authorization: Bearer your-jwt-token" \
  -F "file=@path/to/image.jpg"
```

---

## Step 7: Troubleshooting

### Error: "Cannot find module 'uuid'"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall all dependencies
npm install

# Install uuid specifically
npm install uuid @types/uuid
```

### Error: "Supabase configuration is missing"

**Solution:**
- Verify `.env` file exists in project root
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Restart the application after updating `.env`

### Error: "Bucket not found"

**Solution:**
- Verify buckets are created in Supabase Dashboard
- Check bucket names match exactly (case-sensitive)
- Ensure buckets are in the same Supabase project

### Error: "Failed to upload file: Permission denied"

**Solution:**
- Verify using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Check bucket is set to public (for public buckets)
- Review RLS policies in Supabase

### Build Errors

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Clean build
rm -rf dist
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

---

## Step 8: Testing File Uploads

### Using Postman:

1. **Upload User Avatar:**
   - Method: POST
   - URL: `http://localhost:3001/api/uploads/users/avatar`
   - Auth: Bearer Token (from login)
   - Body: form-data
     - Key: `file` (type: File)
     - Value: Select image file

2. **Upload Product Images:**
   - Method: POST
   - URL: `http://localhost:3001/api/uploads/products/{productId}/images`
   - Auth: Bearer Token (ADMIN/VENDOR role required)
   - Body: form-data
     - Key: `files` (type: File, allow multiple)
     - Value: Select image files

### Using cURL:

```bash
# Login first
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aromasouq.ae","password":"Admin123!"}' \
  -s | jq -r '.access_token')

# Upload avatar
curl -X POST http://localhost:3001/api/uploads/users/avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@avatar.jpg"

# Upload product images
curl -X POST http://localhost:3001/api/uploads/products/product-id-here/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

---

## Step 9: Monitoring & Logs

### Check Logs:

```bash
# Development mode (with watch)
npm run start:dev

# Production mode
npm run start:prod 2>&1 | tee app.log
```

### Monitor Supabase Storage:

1. Go to Supabase Dashboard
2. Navigate to **Storage**
3. Click on each bucket to see uploaded files
4. Monitor usage in **Storage** → **Usage**

---

## Step 10: Production Deployment

### Environment-Specific Configuration:

```env
# Production .env
NODE_ENV="production"
PORT=3001

# Supabase (Production)
SUPABASE_URL="https://your-prod-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-prod-service-role-key"

# CORS (Update with production frontend URL)
FRONTEND_URL="https://aromasouq.ae"
```

### Deployment Checklist:

- [ ] ✅ Environment variables set correctly
- [ ] ✅ Supabase buckets created in production project
- [ ] ✅ Database migrations applied
- [ ] ✅ npm packages installed
- [ ] ✅ Application builds successfully
- [ ] ✅ File upload endpoints tested
- [ ] ✅ CORS configured for production domain
- [ ] ✅ SSL/HTTPS enabled
- [ ] ✅ Rate limiting implemented (recommended)
- [ ] ✅ Monitoring and logging configured

### Build for Production:

```bash
# Install production dependencies only
npm ci --only=production

# Build
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start dist/main.js --name aromasouq-api

# Or use node directly
node dist/main.js
```

---

## API Endpoints Summary

All upload endpoints are under `/api/uploads`:

| Endpoint | Method | Auth | Role | Purpose |
|----------|--------|------|------|---------|
| `/users/avatar` | POST | ✅ | Any | Upload user avatar |
| `/products/:id/images` | POST | ✅ | ADMIN/VENDOR | Upload product images |
| `/reviews/:id/images` | POST | ✅ | Owner | Upload review images |
| `/brands/:id/logo` | POST | ✅ | ADMIN | Upload brand logo |
| `/brands/:id/banner` | POST | ✅ | ADMIN | Upload brand banner |
| `/:bucket/:path` | DELETE | ✅ | ADMIN | Delete file |

See `FILE_UPLOAD_API_DOCUMENTATION.md` for complete API documentation.

---

## File Validation Rules

### Images:
- **Formats:** JPG, JPEG, PNG, WebP
- **Max Size:** 5 MB per file
- **Max Files:** 10 per request

### Videos:
- **Formats:** MP4, WebM, MOV
- **Max Size:** 50 MB per file

### Documents:
- **Formats:** PDF
- **Max Size:** 10 MB per file

---

## Security Best Practices

1. ✅ **Never expose service role key** - Keep it server-side only
2. ✅ **Implement rate limiting** - Prevent abuse
3. ✅ **Validate file types** - Check MIME types and extensions
4. ✅ **Set file size limits** - Prevent storage overflow
5. ✅ **Use HTTPS in production** - Encrypt data in transit
6. ✅ **Configure CORS properly** - Only allow your frontend domain
7. ✅ **Monitor storage usage** - Set up alerts in Supabase
8. ✅ **Implement logging** - Track upload operations
9. ✅ **Regular backups** - Backup Supabase storage
10. ✅ **Review permissions** - Audit bucket policies regularly

---

## Support & Documentation

- **Supabase Setup:** `SUPABASE_BUCKETS_SETUP.md`
- **API Documentation:** `FILE_UPLOAD_API_DOCUMENTATION.md`
- **Migration Report:** `MIGRATION_COMPATIBILITY_REPORT.md`
- **Supabase Docs:** https://supabase.com/docs/guides/storage
- **NestJS File Upload:** https://docs.nestjs.com/techniques/file-upload

---

## Congratulations! 🎉

You have successfully installed and configured Phase 5: File Upload & Media Management.

**Next Steps:**
1. Test all upload endpoints
2. Integrate with frontend application
3. Implement Phase 6: Payment Integration
4. Add email notifications (Phase 7)

Happy coding! 🚀
