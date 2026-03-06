import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface GalleryProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string;
  image_path: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  data?: GalleryProduct[];
  error?: string;
  count?: number;
}

export interface ProductResponse {
  success: boolean;
  data?: GalleryProduct;
  error?: string;
}

// API Functions
export const galleryApi = {
  /**
   * Get all products
   */
  async getProducts(options?: { category?: string; limit?: number; offset?: number }): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.category) params.append('category', options.category);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`${API_BASE_URL}/gallery?${params.toString()}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      };
    }
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${id}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      };
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData: {
    title: string;
    description?: string;
    price: number;
    category?: string;
    image: File;
  }): Promise<ProductResponse> {
    try {
      const formData = new FormData();
      formData.append('title', productData.title);
      formData.append('price', productData.price.toString());
      if (productData.description) formData.append('description', productData.description);
      if (productData.category) formData.append('category', productData.category);
      formData.append('image', productData.image);

      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        body: formData
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product'
      };
    }
  },

  /**
   * Update a product
   */
  async updateProduct(
    id: string,
    productData: {
      title?: string;
      description?: string;
      price?: number;
      category?: string;
      image?: File;
    }
  ): Promise<ProductResponse> {
    try {
      const formData = new FormData();
      if (productData.title) formData.append('title', productData.title);
      if (productData.price) formData.append('price', productData.price.toString());
      if (productData.description !== undefined) formData.append('description', productData.description);
      if (productData.category !== undefined) formData.append('category', productData.category);
      if (productData.image) formData.append('image', productData.image);

      const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'PUT',
        body: formData
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update product'
      };
    }
  },

  /**
   * Delete a product (soft delete)
   */
  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete product'
      };
    }
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/categories`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      };
    }
  }
};
