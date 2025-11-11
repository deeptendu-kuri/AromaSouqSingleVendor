export interface UploadResult {
  url: string;
  path: string;
  bucket: string;
}

export interface DeleteResult {
  success: boolean;
  message: string;
}
