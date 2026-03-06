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

export interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  image: Express.Multer.File;
  category?: string;
}

export interface UpdateProductInput {
  title?: string;
  description?: string | null;
  price?: number;
  image?: Express.Multer.File;
  category?: string | null;
  is_active?: boolean;
}

export interface ProductResponse {
  success: boolean;
  data?: GalleryProduct;
  error?: string;
}

export interface ProductsListResponse {
  success: boolean;
  data?: GalleryProduct[];
  error?: string;
  count?: number;
}
