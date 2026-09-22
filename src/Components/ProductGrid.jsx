import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";

import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { List, LayoutGrid, Search } from "lucide-react";

// Redux
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const db = getFirestore(app);

export function ProductGrid({ selectedCategory, filters, onCategoryChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [showCount, setShowCount] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  // ✅ Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        const orderA = typeof a.sortOrder === "number" ? a.sortOrder : 999999;
        const orderB = typeof b.sortOrder === "number" ? b.sortOrder : 999999;
        if (orderA !== orderB) return orderA - orderB;
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeA - timeB;
      });
      setCategories(data);
    });
    return () => unsub();
  }, []);

  let filtered = [...products];

  // ✅ Filter by Search Query
  if (searchQuery.trim()) {
    const qLower = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title?.toLowerCase().includes(qLower) || 
      p.category?.toLowerCase().includes(qLower)
    );
  }

  // ✅ Filter by selected category (navbar)
  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.categoryId === selectedCategory);
  }

  // ✅ Filter by sidebar categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter((p) => filters.categories.includes(p.categoryId));
  }

  // ✅ Filter by stock/sale status
  if (filters.status.length > 0) {
    filtered = filtered.filter((p) => {
      if (filters.status.includes("in-stock") && p.inStock) return true;
      if (filters.status.includes("out-of-stock") && !p.inStock) return true;
      if (filters.status.includes("on-sale") && p.isOnSale) return true;
      return false;
    });
  }

  // ✅ Price filter
  if (filters?.price && (filters.price.min !== null || filters.price.max !== null)) {
    filtered = filtered.filter((p) => {
      const price = Number(p.price) || Number(p.originalPrice) || 0;
      return (
        (filters.price.min === null || price >= filters.price.min) &&
        (filters.price.max === null || price <= filters.price.max)
      );
    });
  }

  // ✅ Sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "default": {
        const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 999999;
        const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 999999;
        if (orderA !== orderB) return orderA - orderB;
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      }
      case "price-low":
        return (a.price || a.originalPrice) - (b.price || b.originalPrice);
      case "price-high":
        return (b.price || b.originalPrice) - (a.price || a.originalPrice);
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const displayed =
    showCount === "all" ? sorted : sorted.slice(0, parseInt(showCount));

  return (
    <div className="flex-1">
      {/* ✅ Controls */}
      <div className="flex flex-col xl:flex-row items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-card gap-4">
        {/* Search & Category */}
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Select 
            value={selectedCategory} 
            onValueChange={(val) => onCategoryChange && onCategoryChange(val)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View & Sorting */}
        <div className="flex flex-col sm:flex-row w-full xl:w-auto justify-between sm:justify-end gap-4 items-center">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort: Custom Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Sort: Custom Order</SelectItem>
              <SelectItem value="name-asc">Sort: A to Z</SelectItem>
              <SelectItem value="name-desc">Sort: Z to A</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              size="icon"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              size="icon"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Grid / List View */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {displayed.length > 0 ? (
          displayed.map((p) => (
            <div
              key={p.id}
              className={
                viewMode === "list"
                  ? "w-full bg-white border rounded-lg shadow-sm p-4 flex items-center gap-6 hover:shadow-md transition"
                  : ""
              }
            >
              <ProductCard
                product={p}
                viewMode={viewMode}
                onAddToCart={() =>
                  dispatch(addToCart({ ...p, quantity: 1 }))
                }
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-12">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
