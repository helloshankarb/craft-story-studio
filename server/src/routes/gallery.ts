import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../services/galleryService.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: message });
  }
});

// GET single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: message });
  }
});

// POST create product
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description, price, category } = req.body;
    
    if (!title || !price) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and price are required' 
      });
    }

    const product = await createProduct({
      title,
      description,
      price: parseFloat(price),
      category,
      image: req.file
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: message });
  }
});

// PUT update product
router.put('/:id', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, is_active } = req.body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (is_active !== undefined) updateData.is_active = is_active === 'true';

    const product = await updateProduct(req.params.id, {
      ...updateData,
      image: req.file
    } as any);

    res.json({ success: true, data: product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'Product not found' ? 404 : 500;
    res.status(status).json({ success: false, error: message });
  }
});

// DELETE product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'Product not found' ? 404 : 500;
    res.status(status).json({ success: false, error: message });
  }
});

export default router;
