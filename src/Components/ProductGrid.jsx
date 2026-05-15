import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
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
import { List, LayoutGrid } from "lucide-react";

// Redux
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const db = getFirestore(app);

export function ProductGrid({ selectedCategory, filters }) {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [showCount, setShowCount] = useState("12");
  const dispatch = useDispatch();

  // ✅ Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  let filtered = [...products];

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
      case "price-low":
        return (a.price || a.originalPrice) - (b.price || b.originalPrice);
      case "price-high":
        return (b.price || b.originalPrice) - (a.price || a.originalPrice);
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const displayed =
    showCount === "all" ? sorted : sorted.slice(0, parseInt(showCount));

  return (
    <div className="flex-1">
      {/* ✅ Controls */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-card">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Sorting Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Default sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="name">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
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
