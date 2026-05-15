import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaChartLine, FaBoxOpen, FaStar, FaTicketAlt } from "react-icons/fa";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where
} from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Overview() {
  const [orders, setOrders] = useState([]);
  const [todaySales, setTodaySales] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [topProduct, setTopProduct] = useState("-");
  const [pendingTickets, setPendingTickets] = useState(0); 
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const orderList = snapshot.docs.map(doc => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt ?? null,
    total: data.total ?? 0,
    items: data.items ?? [],
  };
});


        setOrders(orderList);

        const today = new Date();
        const todayTotal = orderList
          .filter(order => {
            const orderDate = order.createdAt?.toDate();
            return (
              orderDate?.getDate() === today.getDate() &&
              orderDate?.getMonth() === today.getMonth() &&
              orderDate?.getFullYear() === today.getFullYear()
            );
          })
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setTodaySales(todayTotal);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        const weeklyCount = orderList.filter(order => {
          const orderDate = order.createdAt?.toDate();
          return orderDate >= oneWeekAgo;
        }).length;

        setWeeklyOrders(weeklyCount);

        const productCount = {};
        orderList.forEach(order => {
          (order.items || []).forEach(item => {
            productCount[item.title] = (productCount[item.title] || 0) + item.quantity;
          });
        });

        const top = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];
        setTopProduct(top ? top[0] : "-");

        const chartMap = {};
        orderList.forEach(order => {
          const orderDate = order.createdAt?.toDate();
          const label = orderDate?.toISOString().split("T")[0]; // yyyy-mm-dd
          if (label) {
            chartMap[label] = (chartMap[label] || 0) + (order.total || 0);
          }
        });

        const formattedChartData = Object.entries(chartMap).map(([date, total]) => ({
          date,
          total,
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        setChartData(formattedChartData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch order data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="flex items-center gap-4">
            <FaChartLine className="text-3xl text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Today's Sales</p>
              <h2 className="text-xl font-bold text-blue-800">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(todaySales)}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="flex items-center gap-4">
            <FaBoxOpen className="text-3xl text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Orders This Week</p>
              <h2 className="text-xl font-bold text-green-800">
                {weeklyOrders}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-100">
          <CardContent className="flex items-center gap-4">
            <FaStar className="text-3xl text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Top Product</p>
              <h2 className="text-lg font-medium text-yellow-800">
                {topProduct}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-100">
          <CardContent className="flex items-center gap-4">
            <FaTicketAlt className="text-3xl text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Pending Tickets</p>
              <h2 className="text-xl font-bold text-red-800">{pendingTickets}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-3">Sales Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="total" fill="#0d6efd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
