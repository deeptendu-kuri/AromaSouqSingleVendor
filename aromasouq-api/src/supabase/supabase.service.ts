import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UploadResult, DeleteResult } from './interfaces/upload-result.interface';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Upload a file to Supabase Storage
   * @param bucket - The storage bucket name
   * @param path - The file path within the bucket
   * @param file - The file buffer to upload
   * @param contentType - The file's MIME type
   * @returns Upload result with public URL
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer,
    contentType: string,
  ): Promise<UploadResult> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType,
          upsert: true, // Allow overwriting existing files
        });

      if (error) {
        throw new InternalServerErrorException(
          `Failed to upload file: ${error.message}`,
        );
      }

      // Get public URL
      const { data: publicUrlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return {
        url: publicUrlData.publicUrl,
        path: data.path,
        bucket,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Unexpected error during file upload: ${error.message}`,
      );
    }
  }

  /**
   * Upload multiple files to Supabase Storage
   * @param bucket - The storage bucket name
   * @param files - Array of files with their paths and buffers
   * @returns Array of upload results
   */
  async uploadMultipleFiles(
    bucket: string,
    files: Array<{ path: string; buffer: Buffer; contentType: string }>,
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(bucket, file.path, file.buffer, file.contentType),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from Supabase Storage
   * @param bucket - The storage bucket name
   * @param path - The file path within the bucket
   * @returns Delete result
   */
  async deleteFile(bucket: string, path: string): Promise<DeleteResult> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path]);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to delete file: ${error.message}`,
        );
      }

      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Unexpected error during file deletion: ${error.message}`,
      );
    }
  }

  /**
   * Delete multiple files from Supabase Storage
   * @param bucket - The storage bucket name
   * @param paths - Array of file paths to delete
   * @returns Delete result
   */
  async deleteMultipleFiles(
    bucket: string,
    paths: string[],
  ): Promise<DeleteResult> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove(paths);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to delete files: ${error.message}`,
        );
      }

      return {
        success: true,
        message: `${paths.length} file(s) deleted successfully`,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Unexpected error during file deletion: ${error.message}`,
      );
    }
  }

  /**
   * Get public URL for a file
   * @param bucket - The storage bucket name
   * @param path - The file path within the bucket
   * @returns Public URL
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * List files in a bucket folder
   * @param bucket - The storage bucket name
   * @param path - The folder path (optional)
   * @returns List of files
   */
  async listFiles(bucket: string, path: string = ''): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .list(path);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to list files: ${error.message}`,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Unexpected error while listing files: ${error.message}`,
      );
    }
  }
}
