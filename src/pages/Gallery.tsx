import Layout from "@/components/Layout";
import PageBanner from "@/components/PageBanner";
import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { galleryApi, GalleryProduct } from "@/lib/supabase";

// Fallback images for demo when API is not connected
const fallbackImages = [
  { src: "/images/WhatsApp Image 2026-03-04 at 10.32.29 AM.jpeg", alt: "Leather Craft Item 1", title: "Handcrafted Leather Wallet", price: 1500, description: "Genuine leather wallet with intricate stitching" },
  { src: "/images/WhatsApp Image 2026-03-04 at 10.32.31 AM.jpeg", alt: "Leather Craft Item 2", title: "Leather Belt", price: 1200, description: "Classic leather belt with brass buckle" },
  { src: "/images/WhatsApp Image 2026-03-04 at 10.32.36 AM.jpeg", alt: "Leather Craft Item 3", title: "Leather Bag", price: 3500, description: "Spacious leather bag for daily use" },
  { src: "/images/WhatsApp Image 2026-03-04 at 10.32.38 AM.jpeg", alt: "Leather Craft Item 4", title: "Leather Journal", price: 800, description: "Handbound leather journal" },
  { src: "/images/WhatsApp Image 2026-03-04 at 10.32.40 AM.jpeg", alt: "Leather Craft Item 5", title: "Phone Case", price: 500, description: "Premium leather phone case" },
  { src: "/images/WhatsApp Image 2026-03-04 at 10.32.44 AM.jpeg", alt: "Leather Craft Item 6", title: "Key Chain", price: 300, description: "Leather key chain with metal accents" },
];

const Gallery = () => {
  const [products, setProducts] = useState<GalleryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GalleryProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null as File | null
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const response = await galleryApi.getProducts();
    if (response.success && response.data) {
      setProducts(response.data);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // Update existing product
        const response = await galleryApi.updateProduct(editingProduct.id, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image || undefined
        });

        if (response.success) {
          fetchProducts();
          closeModal();
        }
      } else {
        // Create new product
        if (!formData.image) {
          alert("Please select an image");
          setIsSubmitting(false);
          return;
        }

        const response = await galleryApi.createProduct({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image
        });

        if (response.success) {
          fetchProducts();
          closeModal();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: GalleryProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      image: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const response = await galleryApi.deleteProduct(id);
      if (response.success) {
        fetchProducts();
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      image: null
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      image: null
    });
  };

  // Display products from API or fallback images
  const displayProducts = products.length > 0 ? products : fallbackImages.map((img, index) => ({
    id: `fallback-${index}`,
    title: img.title,
    description: img.description,
    price: img.price,
    image_url: img.src,
    image_path: null,
    category: "Leather Craft",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return (
    <Layout>
      <PageBanner title="Gallery" />
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
                  onClick={() => setLightbox(product.image_url)}
                >
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-foreground text-sm font-body transition-opacity">
                      View
                    </span>
                  </div>
                  
                  {/* Product Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-sm truncate">{product.title}</p>
                    <p className="text-white/90 text-xs">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightbox}
            alt="Gallery item"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title *</label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">Price (₹) *</label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Leather Craft, Wood Work"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Product Image {editingProduct ? "(leave empty to keep current)" : "*"}
                </label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingProduct}
                />
                {editingProduct && (
                  <p className="text-xs text-muted-foreground">
                    Current image will be kept if no new image is selected
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
