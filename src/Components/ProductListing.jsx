import { useState } from "react";
import { Helmet } from "react-helmet-async";

import { CategoryNavigation } from "./CategoryNavigation";
import { FilterSidebar } from "./FilterSidebar";
import { ProductGrid } from "./ProductGrid";
import { PromoBanner } from "./PromoBanner";

import { Button } from "/src/Components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "/src/Components/ui/sheet";
import { Filter } from "lucide-react";

export default function ProductListing() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState({
    categories: [],
    status: [],
    colors: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle Category Change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setFilters((prev) => ({
      ...prev,
      categories: categoryId === "all" ? [] : [categoryId],
    }));
  };

  // Handle Sidebar Filter Updates
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);

    if (newFilters.categories.length === 1) {
      setSelectedCategory(newFilters.categories[0]);
    } else if (newFilters.categories.length === 0) {
      setSelectedCategory("all");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Products | O2 Fitness Health Care</title>
        <meta name="description" content="Explore our wide range of premium wellness and fitness products, including massage chairs, leg massagers, treadmills, and more." />
        <meta name="keywords" content="massage chairs, fitness equipment, wellness products, buy online, O2 fitness shop" />
      </Helmet>
      <PromoBanner />

      <div className="container mx-auto px-4 py-8">
        <CategoryNavigation
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* 🔹 Mobile Filter Button */}
        <div className="lg:hidden flex justify-end mb-4">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>

            {/* 🔹 Scrollable Filter Drawer */}
            <SheetContent
              side="left"
              className="w-[85%] sm:w-[400px] bg-white flex flex-col"
            >
              <SheetHeader className="p-4 border-b sticky top-0 bg-white z-10">
                <SheetTitle className="text-lg font-semibold text-gray-900">
                  Filters
                </SheetTitle>
              </SheetHeader>

              {/* Scrollable Section */}
              <div
                className="flex-1 overflow-y-auto px-4 py-3"
                style={{
                  maxHeight: "calc(100vh - 120px)", // Adjust for header + footer height
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,0,0,0.2) transparent",
                }}
              >
                <FilterSidebar onFiltersChange={handleFiltersChange} />
              </div>

              {/* Sticky Footer */}
              <div className="p-4 border-t bg-white sticky bottom-0 z-20">
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 text-base rounded-lg shadow-md hover:shadow-lg transition-all"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* 🔹 Desktop Layout */}
        <div className="flex gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar onFiltersChange={handleFiltersChange} />
          </div>

          <div className="flex-1">
            <ProductGrid
              selectedCategory={selectedCategory}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
