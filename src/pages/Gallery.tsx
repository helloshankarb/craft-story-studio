import Layout from "@/components/Layout";
import PageBanner from "@/components/PageBanner";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { galleryApi, GalleryProduct } from "@/lib/supabase";

const fallbackImages = [
  { id: 'fallback-1', src: "/images/WhatsApp Image 2026-03-04 at 10.32.29 AM.jpeg", alt: "Leather Craft Item 1", title: "Handcrafted Leather Wallet", price: 1500, description: "Genuine leather wallet with intricate stitching", category: "Leather Craft", image_url: "/images/WhatsApp Image 2026-03-04 at 10.32.29 AM.jpeg", is_active: true, created_at: '', updated_at: '' },
  { id: 'fallback-2', src: "/images/WhatsApp Image 2026-03-04 at 10.32.31 AM.jpeg", alt: "Leather Craft Item 2", title: "Leather Belt", price: 1200, description: "Classic leather belt with brass buckle", category: "Leather Craft", image_url: "/images/WhatsApp Image 2026-03-04 at 10.32.31 AM.jpeg", is_active: true, created_at: '', updated_at: '' },
  { id: 'fallback-3', src: "/images/WhatsApp Image 2026-03-04 at 10.32.36 AM.jpeg", alt: "Leather Craft Item 3", title: "Leather Bag", price: 3500, description: "Spacious leather bag for daily use", category: "Leather Craft", image_url: "/images/WhatsApp Image 2026-03-04 at 10.32.36 AM.jpeg", is_active: true, created_at: '', updated_at: '' },
  { id: 'fallback-4', src: "/images/WhatsApp Image 2026-03-04 at 10.32.38 AM.jpeg", alt: "Leather Craft Item 4", title: "Leather Journal", price: 800, description: "Handbound leather journal", category: "Leather Craft", image_url: "/images/WhatsApp Image 2026-03-04 at 10.32.38 AM.jpeg", is_active: true, created_at: '', updated_at: '' },
  { id: 'fallback-5', src: "/images/WhatsApp Image 2026-03-04 at 10.32.40 AM.jpeg", alt: "Leather Craft Item 5", title: "Phone Case", price: 500, description: "Premium leather phone case", category: "Leather Craft", image_url: "/images/WhatsApp Image 2026-03-04 at 10.32.40 AM.jpeg", is_active: true, created_at: '', updated_at: '' },
  { id: 'fallback-6', src: "/images/WhatsApp Image 2026-03-04 at 10.32.44 AM.jpeg", alt: "Leather Craft Item 6", title: "Key Chain", price: 300, description: "Leather key chain with metal accents", category: "Leather Craft", image_url: "/images/WhatsApp Image 2026-03-04 at 10.32.44 AM.jpeg", is_active: true, created_at: '', updated_at: '' },
];

const Gallery = () => {
  const [products, setProducts] = useState<GalleryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryApi.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products from database');
    }
    setLoading(false);
  };

  // Show admin products first, then fallback images
  const displayProducts = products.length > 0 
    ? products 
    : fallbackImages;

  return (
    <Layout>
      <PageBanner title="Gallery" />
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground mt-2">Make sure Supabase is configured with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {displayProducts.map((product, index) => (
                <div
                  key={product.id || index}
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
    </Layout>
  );
};

export default Gallery;
