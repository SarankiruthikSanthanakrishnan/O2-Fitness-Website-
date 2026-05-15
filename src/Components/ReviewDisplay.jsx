import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "/src/Components/ui/card";
import { format } from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";

const db = getFirestore(app);

const ReviewDisplay = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) {
        setError("Missing product ID");
        setLoading(false);
        return;
      }

      try {
        // ✅ Correct path for your Firestore structure
        const reviewRef = collection(db, "products", productId, "reviews");
        const q = query(reviewRef, where("status", "==", "approved"));
        const snap = await getDocs(q);

        const reviewList = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(reviewList);
      } catch (err) {
        console.error("Error fetching approved reviews:", err);
        setError("Failed to load reviews. Check Firestore rules or index.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading)
    return <p className="text-center text-gray-500 py-4">Loading reviews...</p>;

  if (error)
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );

  if (reviews.length === 0)
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No reviews yet. Be the first to review this product!
        </CardContent>
      </Card>
    );

  const averageRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

  return (
    <div className="space-y-6 mt-8 sm:mt-10">
      {/* === Summary === */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Average Rating */}
            <div className="text-center sm:text-left">
              <div className="text-4xl font-bold text-orange-600">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center sm:justify-start mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2 w-full sm:w-auto">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length;
                const percent =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div
                    key={rating}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-6 text-gray-600">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-6 text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === Individual Reviews === */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {review.name || "Anonymous"}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {review.createdAt?.toDate
                      ? format(review.createdAt.toDate(), "MMM dd, yyyy")
                      : "—"}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {review.content || ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewDisplay;
