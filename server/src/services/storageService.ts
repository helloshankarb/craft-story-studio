import { supabaseAdmin, STORAGE_BUCKET } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file: Express.Multer.File): Promise<{ url: string; path: string }> => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

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
};

export const deleteImage = async (imagePath: string): Promise<void> => {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove([imagePath]);

  if (error) {
    console.error('Failed to delete image:', error.message);
  }
};
