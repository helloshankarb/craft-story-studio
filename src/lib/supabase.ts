import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API Base URL - uses current domain for Vercel compatibility
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  // In production (Vercel), use the same domain
  if (import.meta.env.PROD) return '';
  // In development, use localhost
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

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

// Helper to build API URL - uses relative path in production
const buildApiUrl = (endpoint: string) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  // In production, use relative URL (same domain)
  return endpoint;
};

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

      const response = await fetch(buildApiUrl(`/api/gallery?${params.toString()}`));
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
      const response = await fetch(buildApiUrl(`/api/gallery/${id}`));
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

      const response = await fetch(buildApiUrl('/api/gallery'), {
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

      const response = await fetch(buildApiUrl(`/api/gallery/${id}`), {
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
      const response = await fetch(buildApiUrl(`/api/gallery/${id}`), {
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
      const response = await fetch(buildApiUrl('/api/gallery/categories'));
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      };
    }
  }
};

