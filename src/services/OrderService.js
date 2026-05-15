import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const ordersRef = collection(db, "orders");

// ✅ Fetch all orders
const getOrders = async () => {
  try {
    const snapshot = await getDocs(ordersRef);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// ✅ Fetch orders by payment status
const getOrdersByStatus = async (status) => {
  try {
    const q = query(ordersRef, where("paymentStatus", "==", status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error fetching filtered orders:", error);
    return [];
  }
};

// ✅ Search orders by name, phone, or order number
const searchOrders = async (searchQuery) => {
  try {
    const allOrders = await getOrders();
    const lower = searchQuery.toLowerCase();

    return allOrders.filter(
      (order) =>
        order.customer?.name?.toLowerCase().includes(lower) ||
        order.customer?.phone?.includes(lower) ||
        order.orderNumber?.toLowerCase().includes(lower)
    );
  } catch (error) {
    console.error("Error searching orders:", error);
    return [];
  }
};

// ✅ Update payment status
const updateOrderPaymentStatus = async (
  orderId,
  newStatus,
  paidAmount = 0,
  paymentMethod = "manual"
) => {
  try {
    const orderDoc = doc(db, "orders", orderId);
    await updateDoc(orderDoc, {
      paymentStatus: newStatus,
      paidAmount: paidAmount || 0,
      paymentMethod,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
};

// ✅ Delete an order
const deleteOrder = async (orderId) => {
  try {
    const orderDoc = doc(db, "orders", orderId);
    await deleteDoc(orderDoc);
  } catch (error) {
    console.error("Error deleting order:", error);
  }
};

export const orderService = {
  getOrders,
  getOrdersByStatus,
  searchOrders,
  updateOrderPaymentStatus,
  deleteOrder,
};
