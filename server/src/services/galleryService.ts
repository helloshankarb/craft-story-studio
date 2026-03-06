import { supabaseAdmin } from '../config/supabase.js';
import { GalleryProduct, CreateProductInput, UpdateProductInput } from '../types/gallery.js';
import { uploadImage, deleteImage } from './storageService.js';

const TABLE_NAME = 'gallery_products';

export const getAllProducts = async (): Promise<GalleryProduct[]> => {
  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data || [];
};

export const getProductById = async (id: string): Promise<GalleryProduct | null> => {
  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data;
};

export const createProduct = async (input: CreateProductInput): Promise<GalleryProduct> => {
  let image_url = null;
  let image_path = null;

  // Upload image if provided
  if (input.image) {
    const uploadResult = await uploadImage(input.image);
    image_url = uploadResult.url;
    image_path = uploadResult.path;
  }

  const productData = {
    title: input.title,
    description: input.description || null,
    price: input.price,
    category: input.category || null,
    image_url,
    image_path,
    is_active: true
  };

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .insert(productData)
    .select()
    .single();

  if (error) {
    // Clean up uploaded image if DB insert fails
    if (image_path) {
      await deleteImage(image_path);
    }
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return data;
};

export const updateProduct = async (id: string, input: UpdateProductInput): Promise<GalleryProduct> => {
  // Get existing product
  const existing = await getProductById(id);
  if (!existing) {
    throw new Error('Product not found');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  };

  // Handle image update
  if (input.image) {
    // Delete old image if exists
    if (existing.image_path) {
      await deleteImage(existing.image_path);
    }
    
    // Upload new image
    const uploadResult = await uploadImage(input.image);
    updateData.image_url = uploadResult.url;
    updateData.image_path = uploadResult.path;
  }

  // Update other fields
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.price !== undefined) updateData.price = input.price;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;

  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  // Get existing product to delete its image
  const existing = await getProductById(id);
  
  if (existing?.image_path) {
    await deleteImage(existing.image_path);
  }

  const { error } = await supabaseAdmin
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};
