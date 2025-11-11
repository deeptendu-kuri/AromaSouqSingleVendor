# File Upload API Documentation

## Overview

The AromaSouq API provides secure file upload endpoints for product images, user avatars, review images, brand assets, and vendor documents. All uploads are stored in Supabase Storage with automatic file validation and organization.

## Base URL

```
http://localhost:3001/api/uploads
```

## Authentication

Most endpoints require JWT authentication via httpOnly cookies or Authorization header.

**Header Format:**
```
Authorization: Bearer <your-jwt-token>
```

Or use httpOnly cookie (automatically set after login/register)

---

## Endpoints

### 1. Upload Product Images

Upload one or multiple images for a product.

**Endpoint:** `POST /api/uploads/products/:id/images`

**Authentication:** Required (ADMIN or VENDOR role)

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **URL Params:** `id` - Product ID (UUID)
- **Body:**
  - `files` - Array of image files (max 10)

**File Requirements:**
- **Allowed formats:** JPG, JPEG, PNG, WebP
- **Max size per file:** 5 MB
- **Max files per request:** 10

**Example Request (cURL):**
```bash
curl -X POST \
  http://localhost:3001/api/uploads/products/abc123-uuid/images \
  -H 'Authorization: Bearer your-jwt-token' \
  -F 'files=@/path/to/image1.jpg' \
  -F 'files=@/path/to/image2.png'
```

**Example Request (JavaScript/Fetch):**
```javascript
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);

const response = await fetch(
  'http://localhost:3001/api/uploads/products/abc123-uuid/images',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
    credentials: 'include' // for httpOnly cookies
  }
);

const result = await response.json();
```

**Success Response (200 OK):**
```json
{
  "files": [
    {
      "url": "https://owflekosdjmwnkqpjjnn.supabase.co/storage/v1/object/public/products/abc123-uuid/images/uuid-1234567890.jpg",
      "path": "abc123-uuid/images/uuid-1234567890.jpg",
      "bucket": "products"
    },
    {
      "url": "https://owflekosdjmwnkqpjjnn.supabase.co/storage/v1/object/public/products/abc123-uuid/images/uuid-1234567891.png",
      "path": "abc123-uuid/images/uuid-1234567891.png",
      "bucket": "products"
    }
  ],
  "message": "2 image(s) uploaded successfully",
  "count": 2,
  "product": {
    "id": "abc123-uuid",
    "name": "Dior Sauvage",
    "images": [
      "https://..../image1.jpg",
      "https://..../image2.png"
    ],
    // ... other product fields
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - No files provided
{
  "statusCode": 400,
  "message": "No files provided",
  "error": "Bad Request"
}

// 400 Bad Request - Invalid file type
{
  "statusCode": 400,
  "message": "Invalid file type. Allowed types: .jpg, .jpeg, .png, .webp",
  "error": "Bad Request"
}

// 400 Bad Request - File too large
{
  "statusCode": 400,
  "message": "File size exceeds limit of 5MB",
  "error": "Bad Request"
}

// 404 Not Found - Product doesn't exist
{
  "statusCode": 404,
  "message": "Product with ID abc123-uuid not found",
  "error": "Not Found"
}

// 401 Unauthorized - Not authenticated
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}

// 403 Forbidden - Wrong role
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

---

### 2. Upload User Avatar

Upload or update user profile avatar.

**Endpoint:** `POST /api/uploads/users/avatar`

**Authentication:** Required (Any authenticated user)

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Body:**
  - `file` - Single image file

**File Requirements:**
- **Allowed formats:** JPG, JPEG, PNG, WebP
- **Max size:** 5 MB

**Example Request (cURL):**
```bash
curl -X POST \
  http://localhost:3001/api/uploads/users/avatar \
  -H 'Authorization: Bearer your-jwt-token' \
  -F 'file=@/path/to/avatar.jpg'
```

**Example Request (JavaScript/Fetch):**
```javascript
const formData = new FormData();
formData.append('file', avatarFile);

const response = await fetch(
  'http://localhost:3001/api/uploads/users/avatar',
  {
    method: 'POST',
    body: formData,
    credentials: 'include'
  }
);

const result = await response.json();
```

**Success Response (200 OK):**
```json
{
  "url": "https://owflekosdjmwnkqpjjnn.supabase.co/storage/v1/object/public/users/user-uuid/avatar/uuid-1234567890.jpg",
  "path": "user-uuid/avatar/uuid-1234567890.jpg",
  "bucket": "users",
  "message": "Avatar uploaded successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://..../avatar.jpg",
    "role": "CUSTOMER"
  }
}
```

**Notes:**
- Previous avatar is automatically deleted when uploading a new one
- Avatar URL is updated in the user's profile

---

### 3. Upload Review Images

Upload images for a product review.

**Endpoint:** `POST /api/uploads/reviews/:id/images`

**Authentication:** Required (Must be review owner)

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **URL Params:** `id` - Review ID (UUID)
- **Body:**
  - `files` - Array of image files (max 10)

**File Requirements:**
- **Allowed formats:** JPG, JPEG, PNG, WebP
- **Max size per file:** 5 MB
- **Max files per request:** 10

**Example Request (cURL):**
```bash
curl -X POST \
  http://localhost:3001/api/uploads/reviews/review-uuid/images \
  -H 'Authorization: Bearer your-jwt-token' \
  -F 'files=@/path/to/review-photo1.jpg' \
  -F 'files=@/path/to/review-photo2.jpg'
```

**Success Response (200 OK):**
```json
{
  "files": [
    {
      "url": "https://owflekosdjmwnkqpjjnn.supabase.co/storage/v1/object/public/products/reviews/review-uuid/uuid-1234567890.jpg",
      "path": "reviews/review-uuid/uuid-1234567890.jpg",
      "bucket": "products"
    }
  ],
  "message": "1 image(s) uploaded successfully",
  "count": 1
}
```

**Error Responses:**

```json
// 400 Bad Request - Not review owner
{
  "statusCode": 400,
  "message": "You can only upload images to your own reviews",
  "error": "Bad Request"
}
```

**Notes:**
- Only the review author can upload images
- Images are automatically linked to the review with proper sort order
- Creates `ReviewImage` records in the database

---

### 4. Upload Brand Logo

Upload a logo for a brand.

**Endpoint:** `POST /api/uploads/brands/:id/logo`

**Authentication:** Required (ADMIN role only)

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **URL Params:** `id` - Brand ID (UUID)
- **Body:**
  - `file` - Single image file

**File Requirements:**
- **Allowed formats:** JPG, JPEG, PNG, WebP
- **Max size:** 5 MB
- **Recommended size:** 500x500px (square)

**Example Request (cURL):**
```bash
curl -X POST \
  http://localhost:3001/api/uploads/brands/brand-uuid/logo \
  -H 'Authorization: Bearer admin-jwt-token' \
  -F 'file=@/path/to/brand-logo.png'
```

**Success Response (200 OK):**
```json
{
  "url": "https://owflekosdjmwnkqpjjnn.supabase.co/storage/v1/object/public/brands/brand-uuid/logo/uuid-1234567890.png",
  "path": "brand-uuid/logo/uuid-1234567890.png",
  "bucket": "brands",
  "message": "Brand logo uploaded successfully",
  "brand": {
    "id": "brand-uuid",
    "name": "Dior",
    "logo": "https://..../logo.png",
    "banner": "https://..../banner.jpg",
    // ... other brand fields
  }
}
```

**Notes:**
- Previous logo is automatically deleted
- Only admins can upload brand assets

---

### 5. Upload Brand Banner

Upload a banner image for a brand.

**Endpoint:** `POST /api/uploads/brands/:id/banner`

**Authentication:** Required (ADMIN role only)

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **URL Params:** `id` - Brand ID (UUID)
- **Body:**
  - `file` - Single image file

**File Requirements:**
- **Allowed formats:** JPG, JPEG, PNG, WebP
- **Max size:** 5 MB
- **Recommended size:** 1920x400px (landscape)

**Example Request (cURL):**
```bash
curl -X POST \
  http://localhost:3001/api/uploads/brands/brand-uuid/banner \
  -H 'Authorization: Bearer admin-jwt-token' \
  -F 'file=@/path/to/brand-banner.jpg'
```

**Success Response (200 OK):**
```json
{
  "url": "https://owflekosdjmwnkqpjjnn.supabase.co/storage/v1/object/public/brands/brand-uuid/banner/uuid-1234567890.jpg",
  "path": "brand-uuid/banner/uuid-1234567890.jpg",
  "bucket": "brands",
  "message": "Brand banner uploaded successfully",
  "brand": {
    "id": "brand-uuid",
    "name": "Dior",
    "logo": "https://..../logo.png",
    "banner": "https://..../banner.jpg",
    // ... other brand fields
  }
}
```

**Notes:**
- Previous banner is automatically deleted
- Only admins can upload brand assets

---

### 6. Delete File

Delete a file from Supabase Storage.

**Endpoint:** `DELETE /api/uploads/:bucket/:path`

**Authentication:** Required (ADMIN role only)

**Request:**
- **Method:** DELETE
- **URL Params:**
  - `bucket` - Bucket name (products, brands, users, documents)
  - `path` - File path within bucket (can include slashes)

**Example Request (cURL):**
```bash
curl -X DELETE \
  http://localhost:3001/api/uploads/products/abc123-uuid/images/uuid-1234567890.jpg \
  -H 'Authorization: Bearer admin-jwt-token'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

**Error Responses:**

```json
// 500 Internal Server Error - File not found or delete failed
{
  "statusCode": 500,
  "message": "Failed to delete file: Object not found",
  "error": "Internal Server Error"
}
```

---

## File Validation

All uploads are validated for:

### Image Files
- **MIME Types:** image/jpeg, image/jpg, image/png, image/webp
- **Extensions:** .jpg, .jpeg, .png, .webp
- **Max Size:** 5 MB

### Video Files
- **MIME Types:** video/mp4, video/webm, video/quicktime
- **Extensions:** .mp4, .webm, .mov
- **Max Size:** 50 MB

### Document Files
- **MIME Types:** application/pdf
- **Extensions:** .pdf
- **Max Size:** 10 MB

## File Naming Convention

All uploaded files are automatically renamed with a unique identifier:

```
{folder}/{uuid}-{timestamp}{extension}
```

Example:
```
products/abc123/images/550e8400-e29b-41d4-a716-446655440000-1698765432000.jpg
```

## Storage Organization

### Products Bucket
```
products/
├── {productId}/
│   ├── images/
│   │   ├── {uuid}-{timestamp}.jpg
│   │   └── {uuid}-{timestamp}.png
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

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production:

**Recommended limits:**
- Product images: 10 uploads per hour per user
- User avatar: 5 uploads per hour per user
- Review images: 10 uploads per hour per user
- Brand assets: Unlimited for admins

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "statusCode": 400 | 401 | 403 | 404 | 500,
  "message": "Descriptive error message",
  "error": "Error Type"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid input or validation error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server or storage error

## Security Considerations

1. **Authentication Required** - All endpoints require valid JWT token
2. **Role-Based Access** - Certain endpoints restricted to specific roles
3. **File Type Validation** - Only allowed file types can be uploaded
4. **File Size Limits** - Prevents abuse and storage overflow
5. **Ownership Validation** - Users can only upload to their own resources
6. **Automatic Cleanup** - Old files are deleted when replaced

## Testing with Postman

### Setup

1. Create a new request
2. Set method to POST
3. Set URL: `http://localhost:3001/api/uploads/users/avatar`
4. Go to **Authorization** tab
5. Select **Bearer Token**
6. Paste your JWT token

### Body

1. Go to **Body** tab
2. Select **form-data**
3. Add key: `file`
4. Change type to **File** (dropdown)
5. Click **Select Files** and choose your image

### Send

Click **Send** and check the response

## Testing with Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set to POST
4. URL: `http://localhost:3001/api/uploads/users/avatar`
5. **Auth** → Bearer → Paste token
6. **Body** → Form → Add field:
   - Name: `file`
   - Type: File
   - Value: Select your file
7. Click **Send**

## Frontend Integration Examples

### React with Axios

```javascript
import axios from 'axios';

const uploadProductImages = async (productId, files) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post(
      `http://localhost:3001/api/uploads/products/${productId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // for httpOnly cookies
      }
    );

    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response?.data);
    throw error;
  }
};
```

### React with Fetch

```javascript
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    'http://localhost:3001/api/uploads/users/avatar',
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};
```

### Vue.js

```javascript
async uploadBrandLogo(brandId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await this.$http.post(
    `/uploads/brands/${brandId}/logo`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );

  return response.data;
}
```

## Next Steps

1. ✅ Set up Supabase storage buckets (see SUPABASE_BUCKETS_SETUP.md)
2. ✅ Test endpoints with Postman/Thunder Client
3. ✅ Integrate with your frontend application
4. ✅ Implement progress indicators for large file uploads
5. ✅ Add image compression on the frontend before upload
6. ✅ Implement drag-and-drop file upload UI

## Support

For issues or questions:
- Check the error response for specific details
- Verify Supabase buckets are created and configured
- Ensure environment variables are correct
- Check API logs for detailed error messages
