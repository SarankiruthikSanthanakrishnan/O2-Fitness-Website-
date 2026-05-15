import { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";

const db = getFirestore(app);

export function CategoryNavigation({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data.filter((c) => !c.isHidden));
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white shadow-card rounded-lg p-6 mb-8">
      <div className="flex justify-center gap-6 overflow-x-auto pb-2">
        {/* Shop All option */}
        <div
          className={`flex flex-col items-center gap-3 cursor-pointer group min-w-fit ${
            selectedCategory === "all" ? "scale-105" : "hover:scale-105"
          }`}
          onClick={() => onCategoryChange("all")}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center 
              shadow-card p-2 ${
                selectedCategory === "all" ? "ring-2 ring-success" : ""
              }`}
          >
            <span className="text-lg font-bold">All</span>
          </div>
          <span
            className={`text-sm font-medium ${
              selectedCategory === "all" ? "text-category-active" : "text-foreground"
            }`}
          >
            Shop All
          </span>
        </div>

        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`flex flex-col items-center gap-3 cursor-pointer group min-w-fit ${
              selectedCategory === cat.id ? "scale-105" : "hover:scale-105"
            }`}
            onClick={() => onCategoryChange(cat.id)}
          >
            <div
              className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center 
                shadow-card p-2 ${
                  selectedCategory === cat.id ? "ring-2 ring-success" : ""
                }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className={`text-sm font-medium ${
                selectedCategory === cat.id ? "text-category-active" : "text-foreground"
              }`}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
