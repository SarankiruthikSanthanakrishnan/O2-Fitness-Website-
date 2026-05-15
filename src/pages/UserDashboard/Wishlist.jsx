export default function Wishlist({ wishlist = [], moveToCart, removeFromWishlist }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        wishlist.map(item => (
          <div key={item.id} className="border p-4 rounded mb-3 flex justify-between">
            <div>{item.title}</div>
            <div className="flex gap-2">
              <button onClick={() => moveToCart(item)} className="text-green-600">Move to Cart</button>
              <button onClick={() => removeFromWishlist(item.id)} className="text-red-600">Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
