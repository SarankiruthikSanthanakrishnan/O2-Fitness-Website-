import { Link } from "react-router-dom";
import { Badge } from "/src/Components/ui/badge";
import { Button } from "/src/Components/ui/button";
import { Card, CardContent } from "/src/Components/ui/card";

export function ProductCard({ product, onAddToCart, viewMode = "grid" }) {
  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp) || price;

  const discount =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // ✅ Generate SEO slug
  const createSlug = (title) =>
    title
      ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      : "product";

  const productSlug = createSlug(product.title);

  // ✅ Ensure fallback image
  const productImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png";

  return (
    <Card
      className={`relative group bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300 flex h-full w-full
        ${viewMode === "list" ? "flex-row items-center gap-6 p-4" : "flex-col"}
        ${viewMode === "grid" ? "max-w-[360px] mx-auto" : ""}`}
    >
      {/* 🔹 Discount Badge */}
      {discount > 0 && (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 z-10">
          {discount}% OFF
        </Badge>
      )}

      {/* 🔹 Product Image */}
      <Link
        to={`/products/${productSlug}`}
        onClick={() => window.scrollTo(0, 0)}
        className={viewMode === "list" ? "flex-shrink-0 w-28 h-28" : "block"}
      >
        <div
          className={`flex items-center justify-center bg-white ${viewMode === "list" ? "w-full h-full" : "w-full h-40 md:h-48 p-2"
            }`}
        >
          <img
            src={productImage}
            alt={product.title || "Product"}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* 🔹 Product Details */}
      <CardContent
        className={`${viewMode === "list" ? "flex-1 p-0 space-y-2" : "p-4 flex flex-col flex-1"
          }`}
      >
        <Link
          to={`/products/${productSlug}`}
          onClick={() => window.scrollTo(0, 0)}
          className={viewMode === "grid" ? "flex flex-col h-full" : "block"}
        >
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              {product.category || "Uncategorized"}
            </p>

            <h3
              className={`font-semibold text-gray-800 mb-1 ${viewMode === "list"
                ? "line-clamp-1"
                : "line-clamp-2 min-h-[2.5rem]"
                }`}
              title={product.title}
            >
              {product.title || "Untitled Product"}
            </h3>
          </div>

          <div className={`${viewMode === "grid" ? "mt-auto pt-2" : ""}`}>
            {/* 🔹 Price Section */}
            <div className="mt-2 mb-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">₹{price}</span>
              {mrp > price && (
                <span className="text-sm text-gray-500 line-through">₹{mrp}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-medium text-green-600">
                  {discount}% off
                </span>
              )}
            </div>

            {/* 🔹 Stock Status */}
            <div className="flex items-center justify-between mt-2 mb-4">
              <span
                className={`text-[10px] md:text-xs font-medium px-2 py-1 rounded-full ${product.inStock
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
                  }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* 🔹 CTA Button */}
            <Button
              className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs md:text-sm font-medium shadow-md hover:opacity-90 transition-all ${viewMode === "list" ? "mt-2" : ""
                }`}
            >
              View More
            </Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
