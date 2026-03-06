import { supabaseAdmin, STORAGE_BUCKET } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  /**
   * Upload an image to Supabase Storage
   */
  static async uploadImage(file: Express.Multer.File): Promise<{ url: string; path: string }> {
    // Ensure bucket exists before uploading
    await this.ensureBucketExists();
    
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `gallery/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  }

  /**
   * Delete an image from Supabase Storage
   */
  static async deleteImage(imagePath: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([imagePath]);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Check if a storage bucket exists, create if not
   */
  static async ensureBucketExists(): Promise<void> {
    // Check if bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);

    if (!bucketExists) {
      // Create the bucket (public)
      const { error } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
        public: true
      });

      if (error) {
        console.error('Error creating bucket:', error.message);
      }
    }
  }
}
