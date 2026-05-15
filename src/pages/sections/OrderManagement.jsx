import React, { useState, useEffect } from "react";
import { Search, Eye, CreditCard, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/Components/ui/card";
import { Input } from "/src/Components/ui/input";
import { Button } from "/src/Components/ui/button";
import { Badge } from "/src/Components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "/src/Components/ui/table";
import { orderService } from "/src/services/OrderService";
import { useToast } from "/src/hooks/use-toast";
import PaymentUpdateModal from "/src/Components/PaymentUpdateModal";
import OrderDetailModal from "./OrderDetailModal";

const OrderManagement = ({ status }) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);

  // ✅ Fetch all orders initially
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await orderService.getOrders();
      setOrders(data || []);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, status]);

  // ✅ Filter and Sort Orders
  const filterOrders = async () => {
    let filtered = orders;

    // 🔍 Search filter
    if (searchQuery.trim()) {
      filtered = await orderService.searchOrders(searchQuery);
      if (status) {
        filtered = filtered.filter((order) => order.paymentStatus === status);
      }
    } else if (status) {
      filtered = orders.filter((order) => order.paymentStatus === status);
    }

    // ✅ Sort by orderNumber (O2-001 → O2-010)
    filtered.sort((a, b) => {
      const numA = a.orderNumber
        ? parseInt(a.orderNumber.replace(/\D/g, ""), 10)
        : 0;
      const numB = b.orderNumber
        ? parseInt(b.orderNumber.replace(/\D/g, ""), 10)
        : 0;
      return numB - numA; // 🔁 Show latest first
    });

    setFilteredOrders(filtered);
  };

  // ✅ Format Date
  const formatDate = (dateValue) => {
    const date =
      typeof dateValue === "string"
        ? new Date(dateValue)
        : dateValue?.toDate?.()
        ? dateValue.toDate()
        : new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Status Badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-white">Paid</Badge>;
      case "partially_paid":
        return <Badge className="bg-yellow-500 text-white">Partially Paid</Badge>;
      case "not_paid":
        return <Badge variant="destructive">Not Paid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // ✅ Handlers
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleUpdatePayment = (order) => {
    setOrderToUpdate(order);
    setShowPaymentModal(true);
  };

  const handlePaymentUpdate = async (
    orderId,
    newStatus,
    paidAmount,
    paymentMethod
  ) => {
    await orderService.updateOrderPaymentStatus(
      orderId,
      newStatus,
      paidAmount,
      paymentMethod
    );
    const updated = await orderService.getOrders();
    setOrders(updated);
    setShowPaymentModal(false);
    toast({
      title: "Payment updated successfully",
      description: `Status changed to ${newStatus.replace("_", " ")}.`,
    });
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await orderService.deleteOrder(orderId);
      const updated = await orderService.getOrders();
      setOrders(updated);
      toast({
        title: "Order deleted",
        description: "The order has been successfully removed.",
      });
    }
  };

  const getPageTitle = () => {
    switch (status) {
      case "paid":
        return "Paid Orders";
      case "not_paid":
        return "Unpaid Orders";
      case "partially_paid":
        return "Partially Paid Orders";
      default:
        return "All Orders";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-muted-foreground">
            Manage and track order payments, customer details, and invoices.
          </p>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by order number, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🧾 Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.customer?.name}</TableCell>
                      <TableCell>{order.customer?.phone}</TableCell>
                      <TableCell>{order.totalItems}</TableCell>
                      <TableCell>₹{order.totalAmount?.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdatePayment(order)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {searchQuery
                ? "No orders found for your search."
                : "No orders available yet."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔹 Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showOrderDetail}
          onClose={() => {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }}
          onPaymentUpdate={() => {
            setShowOrderDetail(false);
            handleUpdatePayment(selectedOrder);
          }}
        />
      )}

      {/* 🔹 Payment Modal */}
      {orderToUpdate && (
        <PaymentUpdateModal
          order={orderToUpdate}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setOrderToUpdate(null);
          }}
          onUpdate={handlePaymentUpdate}
        />
      )}
    </div>
  );
};

export default OrderManagement;
