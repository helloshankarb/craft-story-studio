import { Router, Request, Response } from 'express';
import multer from 'multer';
import { GalleryService } from '../services/galleryService';
import { GalleryProduct } from '../types/gallery';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'));
    }
  },
});

/**
 * POST /api/gallery
 * Create a new product with image
 */
router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Image is required'
      });
      return;
    }

    const { title, description, price, category } = req.body;

    if (!title || !price) {
      res.status(400).json({
        success: false,
        error: 'Title and price are required'
      });
      return;
    }

    const product = await GalleryService.createProduct({
      title,
      description,
      price: parseFloat(price),
      image: req.file,
      category
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product'
    });
  }
});

/**
 * GET /api/gallery
 * Get all products with optional filtering
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, limit, offset } = req.query;

    const result = await GalleryService.getProducts({
      category: category as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    });

    res.status(200).json({
      success: true,
      data: result.products,
      count: result.count
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch products'
    });
  }
});

/**
 * GET /api/gallery/categories
 * Get all unique categories
 */
router.get('/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await GalleryService.getCategories();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories'
    });
  }
});

/**
 * GET /api/gallery/:id
 * Get a single product by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;
    const product = await GalleryService.getProductById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch product'
    });
  }
});

/**
 * PUT /api/gallery/:id
 * Update a product
 */
router.put('/:id', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;
    const { title, description, price, category, is_active } = req.body;

    const updateData: Partial<GalleryProduct> = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (is_active !== undefined) updateData.is_active = is_active === 'true' || is_active === true;

    // Add the uploaded file if present
    if (req.file) {
      (updateData as any).image = req.file;
    }

    const product = await GalleryService.updateProduct(productId, updateData);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update product'
    });
  }
});

/**
 * DELETE /api/gallery/:id
 * Delete a product (soft delete)
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;
    await GalleryService.deleteProduct(productId);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete product'
    });
  }
});

/**
 * DELETE /api/gallery/:id/permanent
 * Permanently delete a product
 */
router.delete('/:id/permanent', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;
    await GalleryService.permanentlyDeleteProduct(productId);

    res.status(200).json({
      success: true,
      message: 'Product permanently deleted'
    });
  } catch (error) {
    console.error('Error permanently deleting product:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to permanently delete product'
    });
  }
});

export default router;
