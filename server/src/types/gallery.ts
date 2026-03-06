export interface GalleryProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  image_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  category?: string;
  image?: Express.Multer.File;
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: Express.Multer.File;
  is_active?: boolean;
}
