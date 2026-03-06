import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase admin client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'gallery-images';
const TABLE_NAME = 'gallery_products';

// Helper to build response
const json = (res: VercelResponse, data: any, status = 200) => {
  res.status(status).json(data);
};

// Upload image to Supabase Storage
const uploadImage = async (buffer: Buffer, mimetype: string): Promise<{ url: string; path: string }> => {
  const fileExt = 'jpg';
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: mimetype,
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath
  };
};

// Delete image from Supabase Storage
const deleteImage = async (imagePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([imagePath]);

  if (error) {
    console.error('Failed to delete image:', error.message);
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;

  // Parse URL to get path
  const path = url?.split('/api/gallery')[1] || '/';
  const id = path.split('/').filter(Boolean)[0];

  try {
    switch (method) {
      case 'GET': {
        if (id) {
          // Get single product
          const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            return json(res, { success: false, error: error.message }, 404);
          }
          return json(res, { success: true, data });
        } else {
          // Get all products
          const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) {
            return json(res, { success: false, error: error.message }, 500);
          }
          return json(res, { success: true, data: data || [] });
        }
      }

      case 'POST': {
        // Parse multipart form data
        const formData = await parseFormData(req);
        const { title, description, price, category } = formData;
        const imageFile = formData.image as any;

        if (!title || !price) {
          return json(res, { success: false, error: 'Title and price are required' }, 400);
        }

        let image_url = null;
        let image_path = null;

        if (imageFile?.buffer) {
          const uploadResult = await uploadImage(imageFile.buffer, imageFile.mimetype);
          image_url = uploadResult.url;
          image_path = uploadResult.path;
        }

        const productData = {
          title,
          description: description || null,
          price: parseFloat(price),
          category: category || null,
          image_url,
          image_path,
          is_active: true
        };

        const { data, error } = await supabase
          .from(TABLE_NAME)
          .insert(productData)
          .select()
          .single();

        if (error) {
          if (image_path) await deleteImage(image_path);
          return json(res, { success: false, error: error.message }, 500);
        }

        return json(res, { success: true, data }, 201);
      }

      case 'PUT': {
        if (!id) {
          return json(res, { success: false, error: 'Product ID required' }, 400);
        }

        // Get existing product
        const { data: existing } = await supabase
          .from(TABLE_NAME)
          .select('*')
          .eq('id', id)
          .single();

        if (!existing) {
          return json(res, { success: false, error: 'Product not found' }, 404);
        }

        const formData = await parseFormData(req);
        const { title, description, price, category, is_active } = formData;

        const updateData: Record<string, any> = {
          updated_at: new Date().toISOString()
        };

        // Handle image update
        const imageFile = formData.image as any;
        if (imageFile?.buffer) {
          if (existing.image_path) {
            await deleteImage(existing.image_path);
          }
          const uploadResult = await uploadImage(imageFile.buffer, imageFile.mimetype);
          updateData.image_url = uploadResult.url;
          updateData.image_path = uploadResult.path;
        }

        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price) updateData.price = parseFloat(price);
        if (category !== undefined) updateData.category = category;
        if (is_active !== undefined) updateData.is_active = is_active === 'true';

        const { data, error } = await supabase
          .from(TABLE_NAME)
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          return json(res, { success: false, error: error.message }, 500);
        }

        return json(res, { success: true, data });
      }

      case 'DELETE': {
        if (!id) {
          return json(res, { success: false, error: 'Product ID required' }, 400);
        }

        // Get existing product to delete its image
        const { data: existing } = await supabase
          .from(TABLE_NAME)
          .select('*')
          .eq('id', id)
          .single();

        if (existing?.image_path) {
          await deleteImage(existing.image_path);
        }

        const { error } = await supabase
          .from(TABLE_NAME)
          .delete()
          .eq('id', id);

        if (error) {
          return json(res, { success: false, error: error.message }, 500);
        }

        return json(res, { success: true, message: 'Product deleted successfully' });
      }

      default:
        return json(res, { success: false, error: 'Method not allowed' }, 405);
    }
  } catch (error) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return json(res, { success: false, error: message }, 500);
  }
}

// Simple multipart form data parser for Vercel
async function parseFormData(req: VercelRequest) {
  const result: Record<string, any> = {};
  
  // For simple form fields sent as JSON
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  // For multipart - use a boundary parser would be needed
  // For now, assume JSON body or form-urlencoded
  return result;
}
