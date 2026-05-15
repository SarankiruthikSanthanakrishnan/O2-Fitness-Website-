import { Edit2, Trash2, Eye, Star } from "lucide-react";
import { Button } from "/src/Components/ui/button";
import { Card, CardContent } from "/src/Components/ui/card";
import { Badge } from "/src/Components/ui/badge";

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-800 text-[#ffffff]";
      case "draft":
        return "bg-warning text-warning-foreground";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 bg-card border-border overflow-hidden 
      w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-sm mx-auto"
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Status Badge */}
        <Badge
          className={`absolute top-3 left-3 capitalize ${getStatusColor(
            product.status
          )}`}
        >
          {product.status}
        </Badge>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 right-3 bg-gray-400 text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onView(product)}
              className="bg-background/90 hover:bg-background"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onEdit(product)}
              className="bg-background/90 hover:bg-background"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(product.id)}
              className="bg-destructive/90 hover:bg-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-2">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-card-foreground line-clamp-2 leading-tight">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-warning text-warning"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating}) • {product.sales} sales
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-foreground">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
