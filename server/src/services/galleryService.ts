import { supabaseAdmin } from '../config/supabase';
import { StorageService } from './storageService';
import { GalleryProduct, CreateProductInput, UpdateProductInput } from '../types/gallery';

export class GalleryService {
  /**
   * Create a new product in the gallery
   */
  static async createProduct(input: CreateProductInput): Promise<GalleryProduct> {
    // Upload image to Supabase Storage
    const { url: imageUrl, path: imagePath } = await StorageService.uploadImage(input.image);

    // Insert product into database
    const { data, error } = await supabaseAdmin
      .from('craft_products')
      .insert({
        title: input.title,
        description: input.description || null,
        price: input.price,
        image_url: imageUrl,
        image_path: imagePath,
        category: input.category || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      // Rollback: delete uploaded image if database insert fails
      await StorageService.deleteImage(imagePath);
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all active products
   */
  static async getProducts(options?: {
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ products: GalleryProduct[]; count: number }> {
    let query = supabaseAdmin
      .from('craft_products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      products: data || [],
      count: count || 0
    };
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<GalleryProduct | null> {
    const { data, error } = await supabaseAdmin
      .from('craft_products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return data;
  }

  /**
   * Update a product
   */
  static async updateProduct(id: string, input: UpdateProductInput): Promise<GalleryProduct> {
    // Get existing product
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    let imageUrl = existingProduct.image_url;
    let imagePath = existingProduct.image_path;

    // If new image uploaded, replace the old one
    if (input.image) {
      const { url, path } = await StorageService.uploadImage(input.image);
      imageUrl = url;
      imagePath = path;

      // Delete old image
      if (existingProduct.image_path) {
        await StorageService.deleteImage(existingProduct.image_path);
      }
    }

    // Update product in database
    const updateData: Partial<GalleryProduct> = {
      title: input.title,
      description: input.description,
      price: input.price,
      image_url: imageUrl,
      image_path: imagePath,
      category: input.category,
      is_active: input.is_active,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof GalleryProduct] === undefined) {
        delete updateData[key as keyof GalleryProduct];
      }
    });

    const { data, error } = await supabaseAdmin
      .from('craft_products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a product (soft delete)
   */
  static async deleteProduct(id: string): Promise<void> {
    // Get existing product
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Soft delete - just set is_active to false
    const { error } = await supabaseAdmin
      .from('craft_products')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    // Optionally delete the image from storage
    if (existingProduct.image_path) {
      try {
        await StorageService.deleteImage(existingProduct.image_path);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
  }

  /**
   * Permanently delete a product and its image
   */
  static async permanentlyDeleteProduct(id: string): Promise<void> {
    // Get existing product
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('craft_products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    // Delete image from storage
    if (existingProduct.image_path) {
      await StorageService.deleteImage(existingProduct.image_path);
    }
  }

  /**
   * Get all unique categories
   */
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabaseAdmin
      .from('craft_products')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null);

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    const categories = new Set(data?.map(item => item.category) as string[]);
    return Array.from(categories);
  }
}
