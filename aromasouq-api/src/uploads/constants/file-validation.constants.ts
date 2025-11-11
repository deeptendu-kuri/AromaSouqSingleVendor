export const FILE_VALIDATION = {
  // Image validation
  IMAGE_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],

  // Video validation
  VIDEO_MIME_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  VIDEO_MAX_SIZE: 50 * 1024 * 1024, // 50MB in bytes
  VIDEO_EXTENSIONS: ['.mp4', '.webm', '.mov'],

  // Document validation
  DOCUMENT_MIME_TYPES: ['application/pdf'],
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  DOCUMENT_EXTENSIONS: ['.pdf'],

  // General limits
  MAX_FILES_PER_UPLOAD: 10,
};

export enum UploadType {
  PRODUCT_IMAGE = 'product_image',
  PRODUCT_VIDEO = 'product_video',
  USER_AVATAR = 'user_avatar',
  REVIEW_IMAGE = 'review_image',
  BRAND_LOGO = 'brand_logo',
  BRAND_BANNER = 'brand_banner',
  VENDOR_DOCUMENT = 'vendor_document',
}

export const BUCKET_NAMES = {
  PRODUCTS: 'products',
  USERS: 'users',
  BRANDS: 'brands',
  DOCUMENTS: 'documents',
};
