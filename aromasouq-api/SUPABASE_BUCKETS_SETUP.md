# Supabase Storage Buckets Setup Guide

This guide will help you create the required storage buckets in your Supabase project for the AromaSouq file upload functionality.

## Required Buckets

The application requires the following storage buckets:

1. **products** - For product images and videos
2. **brands** - For brand logos and banners
3. **users** - For user avatars
4. **documents** - For vendor documents (trade licenses, etc.)

## Setup Steps

### 1. Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your AromaSouq project

### 2. Navigate to Storage

1. In the left sidebar, click on **Storage**
2. You'll see the Storage overview page

### 3. Create Each Bucket

For each bucket listed above, follow these steps:

#### Create 'products' Bucket

1. Click **"New bucket"** button
2. Enter bucket details:
   - **Name**: `products`
   - **Public bucket**: ✅ **Enable** (checked)
   - **File size limit**: 50 MB (for videos)
   - **Allowed MIME types**: Leave empty (all types) or specify:
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
     - `video/mp4`
     - `video/webm`
     - `video/quicktime`
3. Click **"Create bucket"**

#### Create 'brands' Bucket

1. Click **"New bucket"** button
2. Enter bucket details:
   - **Name**: `brands`
   - **Public bucket**: ✅ **Enable** (checked)
   - **File size limit**: 5 MB
   - **Allowed MIME types**:
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
3. Click **"Create bucket"**

#### Create 'users' Bucket

1. Click **"New bucket"** button
2. Enter bucket details:
   - **Name**: `users`
   - **Public bucket**: ✅ **Enable** (checked)
   - **File size limit**: 5 MB
   - **Allowed MIME types**:
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
3. Click **"Create bucket"**

#### Create 'documents' Bucket

1. Click **"New bucket"** button
2. Enter bucket details:
   - **Name**: `documents`
   - **Public bucket**: ❌ **Disable** (unchecked) - Private bucket
   - **File size limit**: 10 MB
   - **Allowed MIME types**:
     - `application/pdf`
3. Click **"Create bucket"**

### 4. Configure Bucket Policies (Optional but Recommended)

For better security, you can set up custom policies for each bucket:

#### Products Bucket Policy

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND owner = auth.uid());
```

#### Users Bucket Policy

```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'users'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'users');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'users'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'users'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Documents Bucket Policy (Private)

```sql
-- Only service role can upload
CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'documents');

-- Only authenticated users can read their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 5. Verify Bucket Configuration

1. Go to **Storage** in Supabase Dashboard
2. You should see all 4 buckets listed:
   - ✅ products (Public)
   - ✅ brands (Public)
   - ✅ users (Public)
   - ✅ documents (Private)

### 6. Test File Upload

You can test file upload using the Supabase Dashboard:

1. Click on a bucket (e.g., `products`)
2. Click **"Upload file"**
3. Select a test image
4. After upload, click on the file
5. Copy the public URL
6. Verify you can access the URL in a browser

## Folder Structure

The API will organize files in the following structure:

### Products Bucket
```
products/
├── {productId}/
│   ├── images/
│   │   └── {uuid}-{timestamp}.jpg
│   └── videos/
│       └── {uuid}-{timestamp}.mp4
└── reviews/
    └── {reviewId}/
        └── {uuid}-{timestamp}.jpg
```

### Brands Bucket
```
brands/
└── {brandId}/
    ├── logo/
    │   └── {uuid}-{timestamp}.png
    └── banner/
        └── {uuid}-{timestamp}.jpg
```

### Users Bucket
```
users/
└── {userId}/
    └── avatar/
        └── {uuid}-{timestamp}.jpg
```

### Documents Bucket
```
documents/
└── vendors/
    └── {vendorId}/
        ├── trade-license.pdf
        └── tax-certificate.pdf
```

## Environment Variables

Make sure your `.env` file has the correct Supabase configuration:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Bucket names (should match the buckets you created)
PRODUCTS_BUCKET="products"
BRANDS_BUCKET="brands"
USERS_BUCKET="users"
DOCUMENTS_BUCKET="documents"
```

## Troubleshooting

### Issue: "Bucket not found" error

**Solution**: Verify that:
1. Bucket name in code matches exactly with Supabase
2. Bucket names in `.env` are correct
3. No typos in bucket names

### Issue: "Permission denied" error

**Solution**:
1. Check that public buckets have **Public bucket** enabled
2. Verify RLS policies are correctly set
3. Make sure you're using `SUPABASE_SERVICE_ROLE_KEY` for server-side operations

### Issue: Files upload but URLs don't work

**Solution**:
1. Ensure bucket is set to **Public**
2. Check CORS settings in Supabase
3. Verify the public URL format is correct

### Issue: File size limit exceeded

**Solution**:
1. Go to bucket settings in Supabase
2. Increase the file size limit
3. Or compress files before uploading

## Security Best Practices

1. **Never expose service role key** - Keep it only on the server
2. **Use RLS policies** - Implement row-level security policies for all buckets
3. **Validate file types** - The API already validates, but add extra validation on the client
4. **Set proper CORS** - Configure CORS settings in Supabase to only allow your frontend domain
5. **Monitor storage usage** - Check Supabase dashboard regularly for storage consumption
6. **Implement rate limiting** - Prevent abuse by implementing rate limits on upload endpoints

## Next Steps

After setting up the buckets:

1. ✅ Verify all buckets are created
2. ✅ Test file upload from Supabase Dashboard
3. ✅ Configure RLS policies (optional)
4. ✅ Update environment variables
5. ✅ Test API endpoints with Postman/Thunder Client
6. ✅ Integrate with frontend

## Support

If you encounter any issues:
- Check Supabase documentation: https://supabase.com/docs/guides/storage
- Review API logs for detailed error messages
- Verify environment variables are correctly set
