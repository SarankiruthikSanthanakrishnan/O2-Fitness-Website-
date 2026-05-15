import React from "react";
import { Download, CreditCard, MapPin, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "/src/Components/ui/dialog";
import { Button } from "/src/Components/ui/button";
import { Badge } from "/src/Components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "/src/Components/ui/card";
import { generateInvoicePDF } from "/src/utils/invoiceGenerator";

const OrderDetailModal = ({ order, isOpen, onClose, onPaymentUpdate }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600 text-white">Paid</Badge>;
      case "partially_paid":
        return <Badge className="bg-yellow-500 text-white">Partially Paid</Badge>;
      case "not_paid":
        return <Badge className="bg-red-600 text-white">Not Paid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadInvoice = () => generateInvoicePDF(order);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderNumber}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInvoice}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onPaymentUpdate}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Update Payment
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Order Number:</span>
                <span>{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(order.paymentStatus)}
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Date:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Items:</span>
                <span>{order.totalItems}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount?.toLocaleString()}</span>
              </div>
              {order.paidAmount && (
                <div className="flex justify-between">
                  <span className="font-medium">Paid Amount:</span>
                  <span className="text-green-600">
                    ₹{order.paidAmount?.toLocaleString()}
                  </span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
              )}
              {order.paymentDate && (
                <div className="flex justify-between">
                  <span className="font-medium">Payment Date:</span>
                  <span>{formatDate(order.paymentDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Name:</span>
                <span>{order.customer?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{order.customer?.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <div>{order.customer?.address}</div>
                  <div>{order.customer?.city}</div>
                  <div className="text-sm text-gray-500">
                    Pincode: {order.customer?.postalCode}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left text-sm font-semibold text-gray-700">
                    <th className="py-3 w-[45%]">Item</th>
                    <th className="py-3 text-center w-[15%]">Qty</th>
                    <th className="py-3 text-right w-[20%]">Price</th>
                    <th className="py-3 text-right w-[20%]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 1;
                    const total = price * qty;
                    return (
                      <tr key={index} className="border-b text-sm">
                        <td className="py-3">{item.title || item.productName}</td>
                        <td className="py-3 text-center">{qty}</td>
                        <td className="py-3 text-right">₹{price.toLocaleString()}</td>
                        <td className="py-3 text-right font-medium">
                          ₹{total.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary">
                    <td colSpan={3} className="py-3 font-semibold text-right pr-4">
                      Grand Total:
                    </td>
                    <td className="py-3 font-bold text-right text-lg">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
