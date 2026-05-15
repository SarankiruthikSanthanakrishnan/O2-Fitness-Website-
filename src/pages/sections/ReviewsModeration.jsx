import React, { useEffect, useState } from "react";
import { Check, X, Star, Trash2, Eye, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "/src/Components/ui/card";
import { Button } from "/src/Components/ui/button";
import { Badge } from "/src/Components/ui/badge";
import { useToast } from "/src/hooks/use-toast";
import { format } from "date-fns";
import { db } from "@/firebase/firebaseConfig";
import {
  collectionGroup,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const ReviewsModeration = () => {
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();

  // 🔹 Fetch all reviews across all products + their product titles
  useEffect(() => {
    const q = collectionGroup(db, "reviews");
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedReviews = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        ref: docSnap.ref,
      }));

      // ✅ Fetch product title for each review’s parent product
      const reviewsWithTitles = await Promise.all(
        fetchedReviews.map(async (review) => {
          try {
            const productRef = doc(db, "products", review.productId);
            const productSnap = await getDoc(productRef);
            return {
              ...review,
              productTitle: productSnap.exists()
                ? productSnap.data().title
                : "Unknown Product",
            };
          } catch (error) {
            console.error("Error fetching product title:", error);
            return { ...review, productTitle: "Unknown Product" };
          }
        })
      );

      setReviews(reviewsWithTitles);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Approve
  const handleApprove = async (review) => {
    await updateDoc(review.ref, { status: "approved" });
    toast({
      title: "✅ Review Approved",
      description: `Review for "${review.productTitle}" is now visible.`,
    });
  };

  // ✅ Reject
  const handleReject = async (review) => {
    await updateDoc(review.ref, { status: "rejected" });
    toast({
      title: "❌ Review Rejected",
      description: `Review for "${review.productTitle}" has been rejected.`,
    });
  };

  // ✅ Delete
  const handleDelete = async (review) => {
    await deleteDoc(review.ref);
    toast({
      title: "🗑️ Review Deleted",
      description: `Review for "${review.productTitle}" was removed.`,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const pendingReviews = reviews.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Management</h1>
          <p className="text-muted-foreground mt-1">
            Approve or reject customer reviews with product references.
          </p>
        </div>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingReviews.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Pending Reviews
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              Pending Reviews ({pendingReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-4 bg-yellow-50/50"
              >
                {/* Product Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-gray-800">
                    {review.productTitle}
                  </span>
                </div>

                {/* Review Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center gap-1">
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
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {review.createdAt?.toDate
                        ? format(review.createdAt.toDate(), "MMM dd, yyyy")
                        : "—"}
                    </p>
                    <p className="text-foreground mb-3">{review.content}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(review)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(review)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  {/* Product Title */}
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Package className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-800">
                      {review.productTitle}
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex items-center gap-1">
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
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {review.createdAt?.toDate
                          ? format(review.createdAt.toDate(), "MMM dd, yyyy")
                          : "—"}
                      </p>
                      <p className="text-foreground mb-3">{review.content}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {review.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(review)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(review)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsModeration;
