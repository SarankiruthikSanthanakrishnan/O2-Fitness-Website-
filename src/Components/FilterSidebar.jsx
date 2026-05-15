import { useState, useEffect } from "react";
import { Button } from "/src/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "/src/Components/ui/card";
import { Checkbox } from "/src/Components/ui/checkbox";
import { Input } from "/src/Components/ui/input";
import { Separator } from "/src/Components/ui/separator";
import { Search } from "lucide-react";

import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";

const db = getFirestore(app);

export function FilterSidebar({ onFiltersChange }) {
  const [searchCategory, setSearchCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  // ✅ Fetch categories dynamically
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(data.filter((c) => !c.isHidden));
    });
    return () => unsub();
  }, []);

  // ✅ Fetch products dynamically
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  // ✅ Calculate category counts
  const categoryCounts = categories.map((cat) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;
    return { ...cat, count };
  });

  // ✅ Status filters (dynamic)
  const statusFilters = [
    { id: "in-stock", label: "In Stock", count: products.filter((p) => p.inStock).length },
    { id: "out-of-stock", label: "Out of Stock", count: products.filter((p) => !p.inStock).length },

  ];

  // ✅ Price ranges
  const priceRanges = [
    { id: "500-1000", label: "₹500 - ₹1,000", min: 500, max: 1000, count: products.filter((p) => p.price > 500 && p.price <= 1000).length },
    { id: "1000-5000", label: "₹1,000 - ₹5,000", min: 1000, max: 5000, count: products.filter((p) => p.price > 1000 && p.price <= 5000).length },
    { id: "5000-10000", label: "₹5,000 - ₹10,000", min: 5000, max: 10000, count: products.filter((p) => p.price > 5000 && p.price <= 10000).length },
    { id: "10000-50000", label: "₹10,000 - ₹50,000", min: 10000, max: 50000, count: products.filter((p) => p.price > 10000 && p.price <= 50000).length },
  ];

  const filteredCategories = categoryCounts.filter((category) =>
    category.name?.toLowerCase().includes(searchCategory.toLowerCase())
  );
  const visibleCategories = showMoreCategories
    ? filteredCategories
    : filteredCategories.slice(0, 8);

  // Handlers
  const handleCategoryChange = (categoryId, checked) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(newCategories);
    onFiltersChange({ categories: newCategories, status: selectedStatus, price: getPriceFilter() });
  };

  const handleStatusChange = (statusId, checked) => {
    const newStatus = checked
      ? [...selectedStatus, statusId]
      : selectedStatus.filter((id) => id !== statusId);
    setSelectedStatus(newStatus);
    onFiltersChange({ categories: selectedCategories, status: newStatus, price: getPriceFilter() });
  };

  const handlePriceRangeChange = (range, checked) => {
    const newRange = checked ? range : null;
    setSelectedPriceRange(newRange);
    setMinPrice("");
    setMaxPrice("");
    onFiltersChange({ categories: selectedCategories, status: selectedStatus, price: newRange });
  };

  const applyPriceFilter = () => {
    const price = {
      min: minPrice ? Number(minPrice) : null,
      max: maxPrice ? Number(maxPrice) : null,
    };
    setSelectedPriceRange(null);
    onFiltersChange({ categories: selectedCategories, status: selectedStatus, price });
  };

  const getPriceFilter = () => {
    if (selectedPriceRange) return selectedPriceRange;
    if (minPrice || maxPrice) return { min: Number(minPrice) || null, max: Number(maxPrice) || null };
    return null;
  };

  return (
    <div className="w-full md:w-80 space-y-6">
      {/* Categories */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
            Categories
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleCategories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                />
                <label htmlFor={category.id} className="text-sm sm:text-base cursor-pointer">
                  {category.name}
                </label>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">{category.count}</span>
            </div>
          ))}
          {filteredCategories.length > 8 && (
            <button
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="text-primary hover:text-primary-hover text-sm font-medium flex items-center gap-1"
            >
              {showMoreCategories ? "Show less" : `+${filteredCategories.length - 8} more`}
            </button>
          )}
        </CardContent>
      </Card>

      {/* Price Filter Removed */}

      {/* Product Status */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statusFilters.map((status) => (
            <div key={status.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={status.id}
                  checked={selectedStatus.includes(status.id)}
                  onCheckedChange={(checked) => handleStatusChange(status.id, !!checked)}
                />
                <label htmlFor={status.id} className="text-sm sm:text-base cursor-pointer">
                  {status.label}
                </label>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">{status.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
