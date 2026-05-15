import React, { useEffect, useState, useContext } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import jsPDF from "jspdf";
import { AuthContext } from "@/contexts/AuthContext";
import logo from "../../assets/HomeImage/Logo.png"; 
import autoTable from "jspdf-autotable"; 

export default function Orders() {
  const { user, role } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTracking, setEditTracking] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), where("userEmail", "==", user?.email));
      const snapshot = await getDocs(q);
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
      setLoading(false);
    };
    if (user?.email) fetchOrders();
  }, [user]);

const downloadInvoice = async (order) => {
  const doc = new jsPDF();

  // ✅ Convert imported image to base64 using fetch
  const getImageBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const logoBase64 = await getImageBase64(logo);

  // ✅ Add logo
  doc.addImage(logoBase64, "PNG", 14, 10, 40, 20); // (image, type, x, y, width, height)

  // Header Info
   const headerStartY = 35;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Invoice for Order ID: ${order.id}`, 14, headerStartY);
  doc.text(`Customer Email: ${order.userEmail}`, 14, headerStartY + 6);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 14, headerStartY + 12);

  const rows = order.items.map((item, i) => [
    i + 1,
    item.title,
    item.quantity,
    `₹${item.price}`,
    `₹${(item.price * item.quantity).toFixed(0)}`
  ]);

  // Table
  autoTable(doc, {
    startY: 50,
    head: [["#", "Product", "Quantity", "Price", "Subtotal"]],
    body: rows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [255, 115, 0] }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Amount: ₹${order.total}`, 14, finalY);
  doc.text("Thank you for shopping with us!", 14, finalY + 10);

  doc.save(`invoice-${order.id}.pdf`);
};

  const trackShipment = (trackingId) => {
    if (!trackingId) return alert("No tracking ID available.");
    const url = `https://www.aftership.com/track/${trackingId}`;
    window.open(url, "_blank");
  };

  const handleTrackingChange = (orderId, value) => {
    setEditTracking(prev => ({ ...prev, [orderId]: value }));
  };

  const saveTrackingId = async (orderId) => {
    const trackingId = editTracking[orderId];
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { trackingId });
    alert("Tracking ID saved.");
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm bg-white">
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600">
              <div>Order ID: <span className="font-medium text-gray-800">{order.id}</span></div>
              <div>Status: <span className="capitalize text-blue-600 font-semibold">{order.status || "Pending"}</span></div>
            </div>

            <div className="mt-2 text-gray-700">
              <ul className="list-disc ml-5">
                {order.items?.map((item, idx) => (
                  <li key={idx}>{item.title} × {item.quantity} – ₹{item.price}</li>
                ))}
              </ul>
            </div>

            <div className="mt-2 font-semibold text-gray-800">Total: ₹{order.total}</div>

            {role === "admin" && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter tracking ID"
                  value={editTracking[order.id] || order.trackingId || ""}
                  onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                  className="border px-3 py-1 rounded w-full max-w-xs"
                />
                <button
                  onClick={() => saveTrackingId(order.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4">
              <button
                onClick={() => downloadInvoice(order)}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Download Invoice
              </button>

              <button
                onClick={() => trackShipment(order.trackingId)}
                className="text-sm text-green-600 hover:underline"
              >
                Track Shipment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
