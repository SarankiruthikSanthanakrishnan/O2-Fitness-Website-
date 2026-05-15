import React, { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  X,
  Pencil,
  Trash,
  Package,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "/src/Components/ui/dialog";
import { Button } from "/src/Components/ui/button";
import { Input } from "/src/Components/ui/input";
import { Label } from "/src/Components/ui/label";
import { Textarea } from "/src/Components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "/src/Components/ui/select";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/firebase/firebaseConfig";

const db = getFirestore(app);
const storage = getStorage(app);

// ✅ SKU Generator
const generateSKU = (title = "", price = "", category = "") => {
  if (!title) return "";
  const catPrefix = category
    ? category.replace(/[^A-Za-z]/g, "").substring(0, 2).toUpperCase()
    : "PR";
  let modelPart = "";
  if (title.includes("-")) {
    modelPart = title.split("-").pop().trim().toUpperCase();
  } else {
    const words = title.trim().split(" ");
    modelPart = words[words.length - 1]
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase();
  }
  const priceTag = price ? `-${Math.round(Number(price))}` : "";
  return `${catPrefix}${modelPart}${priceTag}`;
};

// ✅ Slug Generator
const generateSlug = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ProductManagement = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // ✅ Product form data
  const [formData, setFormData] = useState({
    title: "",
    sku: "",
    mrp: "",
    price: "",
    categoryId: "",
    category: "",
    subCategory: "none",
    inStock: "in",
    bulletPoints: [],
    newBullet: "",
    features: [],
    newFeatureTitle: "",
    newFeatureDetail: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  // ✅ Fetch categories
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    });
    return () => unsub();
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setFiltered(data);
    });
    return () => unsub();
  }, []);

  // ✅ Auto SKU generator
  useEffect(() => {
    if (!editingProduct) {
      setFormData((prev) => ({
        ...prev,
        sku: generateSKU(prev.title, prev.price, prev.category),
      }));
    }
  }, [formData.title, formData.price, formData.category]);

  // ✅ Filtering
  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }
    if (stockFilter !== "all") {
      const inStockValue = stockFilter === "in";
      result = result.filter((p) => p.inStock === inStockValue);
    }
    setFiltered(result);
  }, [searchTerm, categoryFilter, stockFilter, products]);

  const handleInputChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files) => {
    const uploads = files.map(async (file) => {
      const refPath = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(refPath, file);
      return await getDownloadURL(refPath);
    });
    return Promise.all(uploads);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      sku: "",
      mrp: "",
      price: "",
      categoryId: "",
      category: "",
      subCategory: "none",
      inStock: "in",
      bulletPoints: [],
      newBullet: "",
      features: [],
      newFeatureTitle: "",
      newFeatureDetail: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrls = [];
      if (imageFiles.length > 0) imageUrls = await uploadImages(imageFiles);
      if (editingProduct && Array.isArray(imagePreviews)) {
        imageUrls = [
          ...imageUrls,
          ...imagePreviews.filter((p) => p.startsWith("https")),
        ];
      }

      const slug = generateSlug(formData.title);
      const productData = {
        ...formData,
        slug,
        mrp: Number(formData.mrp),
        price: Number(formData.price),
        inStock: formData.inStock === "in",
        images: imageUrls,
        sku: generateSKU(formData.title, formData.price, formData.category),
        updatedAt: Timestamp.now(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: Timestamp.now(),
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      ...p,
      inStock: p.inStock ? "in" : "out",
      newBullet: "",
      newFeatureTitle: "",
      newFeatureDetail: "",
    });
    setImagePreviews(p.images || []);
    setImageFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-gray-500 text-sm">
            Manage, edit, and filter your product listings
          </p>
        </div>

        {/* Add/Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent
            className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white"
          >
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                Fill product details, upload images, and manage features.
              </DialogDescription>
            </DialogHeader>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Product Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      handleInputChange("title", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label>SKU (Auto-generated)</Label>
                  <Input value={formData.sku} readOnly />
                </div>

                <div>
                  <Label>MRP (₹)</Label>
                  <Input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) =>
                      handleInputChange("mrp", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange("price", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => {
                      const selected = categories.find((c) => c.id === value);
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: selected?.id || "",
                        category: selected?.name || "",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subcategory</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) =>
                      handleInputChange("subCategory", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Featured Products">
                        Featured Products
                      </SelectItem>
                      <SelectItem value="Top Rated Products">
                        Top Rated Products
                      </SelectItem>
                      
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stock */}
              <div>
                <Label>Stock Status</Label>
                <Select
                  value={formData.inStock}
                  onValueChange={(value) =>
                    handleInputChange("inStock", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">In Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bullet Points */}
              <div>
                <Label>Bullet Points</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Enter bullet point"
                    value={formData.newBullet}
                    onChange={(e) =>
                      handleInputChange("newBullet", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (formData.newBullet) {
                        setFormData((prev) => ({
                          ...prev,
                          bulletPoints: [...prev.bulletPoints, prev.newBullet],
                          newBullet: "",
                        }));
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {formData.bulletPoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1"
                  >
                    <span>{point}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          bulletPoints: prev.bulletPoints.filter(
                            (_, idx) => idx !== i
                          ),
                        }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Title"
                    value={formData.newFeatureTitle}
                    onChange={(e) =>
                      handleInputChange("newFeatureTitle", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Detail"
                    value={formData.newFeatureDetail}
                    onChange={(e) =>
                      handleInputChange("newFeatureDetail", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (
                        formData.newFeatureTitle &&
                        formData.newFeatureDetail
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          features: [
                            ...prev.features,
                            {
                              title: prev.newFeatureTitle,
                              detail: prev.newFeatureDetail,
                            },
                          ],
                          newFeatureTitle: "",
                          newFeatureDetail: "",
                        }));
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1"
                  >
                    <span>
                      <strong>{f.title}:</strong> {f.detail}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          features: prev.features.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              {/* SEO Tags */}
              <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold text-gray-700">SEO Settings</h3>
                <div>
                  <Label>Meta Title</Label>
                  <Input
                    placeholder="SEO Title (Optional, defaults to Product Title)"
                    value={formData.metaTitle || ""}
                    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea
                    rows={2}
                    placeholder="SEO Description (Optional, defaults to Product Description)"
                    value={formData.metaDescription || ""}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Meta Keywords</Label>
                  <Input
                    placeholder="SEO Keywords (comma separated)"
                    value={formData.metaKeywords || ""}
                    onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <Label>Images</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  <Upload className="h-4 w-4" /> Upload
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative border rounded overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ✅ Filters */}
      <div className="flex flex-col lg:flex-row gap-3 bg-gray-50 border p-4 rounded-lg items-center">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by title or SKU"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full lg:w-1/4">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full lg:w-1/4">
            <SelectValue placeholder="Filter by Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="in">In Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Product Grid */}
      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="mx-auto h-12 w-12 mb-3" />
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={
                    product.images?.[0] ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  <p className="text-sm text-gray-600">
                    Category: {product.category || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Subcategory: {product.subCategory || "None"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="line-through text-gray-400 text-sm">
                        ₹{product.mrp}
                      </span>
                      <span className="text-orange-600 font-semibold ml-2">
                        ₹{product.price}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      className="flex-1"
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
