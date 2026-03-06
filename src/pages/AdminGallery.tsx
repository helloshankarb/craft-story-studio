import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { galleryApi, GalleryProduct } from "@/lib/supabase";

const AdminGallery = () => {
  const [products, setProducts] = useState<GalleryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GalleryProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageBase64: ""
  });

  const ADMIN_PASSWORD = "craftadmin123";

  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await galleryApi.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
      loadProducts();
    } else {
      alert("Invalid password");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // Update existing
        const result = await galleryApi.updateProduct(editingProduct.id, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_base64: formData.imageBase64 || undefined
        });

        if (result) {
          await loadProducts();
          closeModal();
        }
      } else {
        // Create new
        if (!formData.imageBase64) {
          alert("Please select an image");
          setIsSubmitting(false);
          return;
        }

        const result = await galleryApi.createProduct({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_base64: formData.imageBase64
        });

        if (result) {
          await loadProducts();
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
      imageBase64: ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const success = await galleryApi.deleteProduct(id);
      if (success) {
        await loadProducts();
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
      imageBase64: ""
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
      imageBase64: ""
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="text-muted-foreground">Enter password to access admin panel</p>
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gallery Admin</h1>
            <p className="text-muted-foreground">Manage your gallery products</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products yet. Click "Add Product" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {product.description || "No description"}
                  </p>
                  <p className="font-bold text-lg mt-2">₹{product.price}</p>
                  {product.category && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {product.category}
                    </span>
                  )}
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

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
                  {(formData.imageBase64 || editingProduct?.image_url) && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageBase64 || editingProduct?.image_url} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
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
      </div>
    </div>
  );
};

export default AdminGallery;
