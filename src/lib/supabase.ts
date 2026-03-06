import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GalleryProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  image_base64: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const galleryApi = {
  // Get all products
  getProducts: async (): Promise<GalleryProduct[]> => {
    try {
      const { data, error } = await supabase
        .from('gallery_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Create product
  createProduct: async (product: {
    title: string;
    description?: string;
    price: number;
    category?: string;
    image_base64?: string;
  }): Promise<GalleryProduct | null> => {
    try {
      const { data, error } = await supabase
        .from('gallery_products')
        .insert({
          title: product.title,
          description: product.description || null,
          price: product.price,
          category: product.category || null,
          image_url: product.image_base64 || null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },

  // Update product
  updateProduct: async (id: string, product: {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    image_base64?: string;
  }): Promise<GalleryProduct | null> => {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      };
      
      if (product.title) updateData.title = product.title;
      if (product.description !== undefined) updateData.description = product.description;
      if (product.price) updateData.price = product.price;
      if (product.category !== undefined) updateData.category = product.category;
      if (product.image_base64) updateData.image_url = product.image_base64;

      const { data, error } = await supabase
        .from('gallery_products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gallery_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
};
