import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'gallery-images';

// Multer configuration for Vercel
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  }
});

const parseForm = (req: VercelRequest): Promise<any> => {
  return new Promise((resolve, reject) => {
    upload.any()(req, {} as any, (err: any) => {
      if (err) reject(err);
      else {
        resolve({ 
          fields: req.body, 
          files: (req as any).files || [] 
        });
      }
    });
  });
};

// Helper function to upload image
async function uploadImage(file: any) {
  const ext = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
  const filePath = `gallery/${fileName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file.buffer, { contentType: file.mimetype });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl, path: filePath };
}

// GET /api/gallery - Get all products
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.query.path as string || '';
  
  try {
    // GET /api/gallery
    if (req.method === 'GET' && (!path || path === 'gallery')) {
      const { data, error } = await supabase
        .from('craft_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [], count: data?.length || 0 });
    }

    // GET /api/gallery/categories
    if (req.method === 'GET' && path === 'gallery/categories') {
      const { data, error } = await supabase
        .from('craft_products')
        .select('category')
        .eq('is_active', true)
        .not('category', 'is', null);

      if (error) throw error;
      const categories = [...new Set(data?.map(d => d.category))];
      return res.status(200).json({ success: true, data: categories });
    }

    // GET /api/gallery/:id
    if (req.method === 'GET' && path?.match(/^gallery\/[^/]+$/)) {
      const id = path.split('/')[1];
      const { data, error } = await supabase
        .from('craft_products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        throw error;
      }
      return res.status(200).json({ success: true, data });
    }

    // POST /api/gallery - Create product
    if (req.method === 'POST' && (!path || path === 'gallery')) {
      const { fields, files } = await parseForm(req);
      const file = files.find((f: any) => f.fieldname === 'image');
      
      if (!file) {
        return res.status(400).json({ success: false, error: 'Image is required' });
      }

      const { title, description, price, category } = fields;
      
      if (!title || !price) {
        return res.status(400).json({ success: false, error: 'Title and price are required' });
      }

      // Upload image
      const { url: imageUrl, path: imagePath } = await uploadImage(file);

      // Insert product
      const { data, error } = await supabase
        .from('craft_products')
        .insert({
          title,
          description: description || null,
          price: parseFloat(price),
          image_url: imageUrl,
          image_path: imagePath,
          category: category || null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    // PUT /api/gallery/:id - Update product
    if (req.method === 'PUT' && path?.match(/^gallery\/[^/]+$/)) {
      const id = path.split('/')[1];
      const { fields, files } = await parseForm(req);
      const file = files.find((f: any) => f.fieldname === 'image');

      // Get existing product
      const { data: existing } = await supabase
        .from('craft_products')
        .select('*')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      let imageUrl = existing.image_url;
      let imagePath = existing.image_path;

      // Upload new image if provided
      if (file) {
        const uploaded = await uploadImage(file);
        imageUrl = uploaded.url;
        imagePath = uploaded.path;
        
        // Delete old image
        if (existing.image_path) {
          await supabase.storage.from(STORAGE_BUCKET).remove([existing.image_path]);
        }
      }

      const { title, description, price, category, is_active } = fields;

      const { data, error } = await supabase
        .from('craft_products')
        .update({
          title: title || existing.title,
          description: description !== undefined ? description : existing.description,
          price: price ? parseFloat(price) : existing.price,
          image_url: imageUrl,
          image_path: imagePath,
          category: category !== undefined ? category : existing.category,
          is_active: is_active !== undefined ? is_active === 'true' : existing.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // DELETE /api/gallery/:id - Delete product
    if (req.method === 'DELETE' && path?.match(/^gallery\/[^/]+$/)) {
      const id = path.split('/')[1];
      
      // Get existing product
      const { data: existing } = await supabase
        .from('craft_products')
        .select('*')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // Soft delete
      const { error } = await supabase
        .from('craft_products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Product deleted' });
    }

    // 404 for unmatched routes
    return res.status(404).json({ success: false, error: 'Endpoint not found' });

  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
