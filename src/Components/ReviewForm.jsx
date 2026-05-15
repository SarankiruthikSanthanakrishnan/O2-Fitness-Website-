import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "/src/Components/ui/button";
import { Input } from "/src/Components/ui/input";
import { Textarea } from "/src/Components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "/src/Components/ui/card";
import { Label } from "/src/Components/ui/label";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [productTitle, setProductTitle] = useState("");

  // ✅ Fetch product title once (for embedding inside review)
  useEffect(() => {
    const fetchProductTitle = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProductTitle(productSnap.data().title || "Unknown Product");
        }
      } catch (error) {
        console.error("Error fetching product title:", error);
      }
    };

    if (productId) fetchProductTitle();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, "products", productId, "reviews"), {
        productId,
        productTitle, // ✅ store product title for moderation and frontend display
        name,
        rating,
        content,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Review submitted successfully! Waiting for admin approval.");
      setName("");
      setRating(0);
      setContent("");
    } catch (error) {
      console.error("❌ Error submitting review:", error);
      alert("Failed to submit review. Please try again later.");
    }

    setSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-base font-medium">Rating *</Label>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHoverRating(index + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      index < (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Reviewer Name */}
          <div>
            <Label htmlFor="reviewerName" className="text-base font-medium">
              Your Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2"
              required
            />
          </div>

          {/* Review Content */}
          <div>
            <Label htmlFor="content" className="text-base font-medium">
              Your Review *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this product..."
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
