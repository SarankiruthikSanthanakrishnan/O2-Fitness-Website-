import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot, query, where } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { ProductCard } from "../ProductCard";
import { motion } from "framer-motion";

const db = getFirestore(app);

const ShopCategory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), where("subCategory", "==", "Top Rated Products"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      />
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">
          Top Rated Products
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12 text-sm md:text-base">
          Handpicked for your comfort — explore our best-selling massage chairs and wellness essentials.
        </p>

        {products.length === 0 ? (
          <p className="text-gray-500">No Top Rated Products found.</p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <ProductCard product={product} viewMode="grid" size="medium" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ShopCategory;
