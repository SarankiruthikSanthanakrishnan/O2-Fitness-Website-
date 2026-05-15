
// src/pages/UserDashboard/Reviews.jsx
export default function Reviews({ userReviews, editReview }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
      {userReviews.map(review => (
        <div key={review.id} className="border p-4 rounded mb-3">
          <p>{review.content}</p>
          <button onClick={() => editReview(review.id)} className="text-blue-600 mt-2">Edit</button>
        </div>
      ))}
    </div>
  );
}
