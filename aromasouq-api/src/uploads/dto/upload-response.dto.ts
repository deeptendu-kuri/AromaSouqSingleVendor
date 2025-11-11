export class UploadResponseDto {
  url: string;
  path: string;
  bucket: string;
  message?: string;
}

export class MultiUploadResponseDto {
  files: UploadResponseDto[];
  message: string;
  count: number;
}
