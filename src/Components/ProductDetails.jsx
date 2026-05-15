import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { addToCart } from "@/redux/cartSlice";
import { Button } from "/src/Components/ui/button";
import { Minus, Plus, Truck, Star, X } from "lucide-react";
import { ProductCard } from "/src/Components/ProductCard";
import ProductSchema from "/src/pages/sections/ProductSchema";
import ReviewForm from "/src/Components/ReviewForm";
import ReviewDisplay from "/src/Components/ReviewDisplay";
import { toast } from "sonner";

const db = getFirestore(app);

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviewPopup, setReviewPopup] = useState(false);

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let productData = null;
        const slugQuery = query(collection(db, "products"), where("slug", "==", slug));
        const slugSnap = await getDocs(slugQuery);

        if (!slugSnap.empty) {
          productData = { id: slugSnap.docs[0].id, ...slugSnap.docs[0].data() };
        } else {
          const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const titleQuery = query(collection(db, "products"), where("title", "==", title));
          const titleSnap = await getDocs(titleQuery);
          if (!titleSnap.empty) {
            productData = { id: titleSnap.docs[0].id, ...titleSnap.docs[0].data() };
          }
        }

        if (productData) {
          setProduct(productData);
          if (productData.images?.length > 0) setSelectedImage(productData.images[0]);
        } else {
          console.warn("⚠️ Product not found for slug:", slug);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // ✅ Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      try {
        const q = query(collection(db, "products"), where("category", "==", product.category));
        const snap = await getDocs(q);
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.title !== product.title);
        setRelated(list);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };
    fetchRelated();
  }, [product]);

  // ✅ Add to Cart Handler (works perfectly now)
  const handleAddToCart = () => {
    if (!product?.inStock) return;

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: selectedImage || product.images?.[0],
        quantity,
        slug: product.slug || slug,
      })
    );

    toast.success("Added to cart!", {
      description: `${quantity}x ${product.title}`,
    });

    // ✅ Redirect to Cart page after short delay
    setTimeout(() => {
      navigate("/cart");
    }, 1000);
  };

  if (loading) return <p className="text-center py-10 text-gray-600">Loading...</p>;
  if (!product) return <p className="text-center text-red-500 py-10">Product not found</p>;

  const displayedBulletPoints = product.inStock
    ? product.bulletPoints?.length
      ? product.bulletPoints
      : ["Free delivery", "Cash on Delivery eligible", "1-Year Warranty"]
    : ["Out of Stock ❌", "Restocking Soon", "Add to wishlist for updates"];

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {product && <ProductSchema product={product} />}

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* LEFT IMAGES */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex lg:flex-col gap-3 overflow-x-auto scrollbar-hide">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`cursor-pointer w-16 h-16 rounded-md overflow-hidden border-2 transition-transform ${selectedImage === img
                    ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                    : "border-gray-200 hover:border-orange-400"
                    }`}
                >
                  <img src={img} alt={`thumb-${i}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="relative w-full bg-white rounded-2xl overflow-hidden">
                <img src={selectedImage} alt={product.title} className="object-contain w-full h-[400px] sm:h-[520px]" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-800 leading-snug">{product.title}</h1>

          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded-md">
              4.9 <Star size={14} className="ml-1 fill-white" />
            </span>
            <span className="text-gray-500">(120+ Ratings & Reviews)</span>
          </div>

          {/* Price Section */}
          <div className="mt-4 mb-6">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.mrp}</span>
                  <span className="text-lg font-medium text-green-600">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          <p className={`font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
            {product.inStock ? "In Stock ✅" : "Out of Stock ❌"}
          </p>

          <ul className="text-gray-700 list-disc pl-5 space-y-1">
            {displayedBulletPoints.map((bp, i) => (
              <li key={i}>{bp}</li>
            ))}
          </ul>

          <div className="flex items-start gap-2 text-gray-600 mt-3">
            <Truck className="h-5 w-5 text-orange-500" />
            <p>
              <strong>Estimated Delivery:</strong> 3–5 business days
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-8 bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Features</h3>
              <ul className="space-y-2 text-justify">
                {product.features.map((f, i) => (
                  <li key={i}>
                    <span className="font-semibold text-gray-800">{f.title}: </span>
                    <span className="text-gray-600">{f.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-6">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                className="p-2 hover:bg-gray-100 transition"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                className="p-2 hover:bg-gray-100 transition"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
            >
              Add to Cart
            </Button>
            <Button
              onClick={() => {
                handleAddToCart();
                setTimeout(() => navigate("/cart"), 500);
              }}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-14 bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🧘‍♂️ Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
            {product.description}
          </p>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🗣️ Customer Reviews</h2>
          <Button onClick={() => setReviewPopup(true)} className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg">
            Rate This Product
          </Button>
        </div>
        <ReviewDisplay productId={product.id} />
      </div>

      {reviewPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl relative p-6">
            <button className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl" onClick={() => setReviewPopup(false)}>
              <X size={22} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">✍️ Write a Review</h3>
            <ReviewForm productId={product.id} onReviewAdded={() => setReviewPopup(false)} />
          </div>
        </div>
      )}

      {/* Related */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Related Products</h2>
        {related.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {related.map((rp) => (
              <div key={rp.id} className="flex-shrink-0 snap-center w-[300px]">
                <ProductCard product={rp} viewMode="grid" size="small" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No related products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
