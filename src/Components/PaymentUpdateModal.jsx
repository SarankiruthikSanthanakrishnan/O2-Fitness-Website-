    import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "/src/Components/ui/dialog";
import { Button } from "/src/Components/ui/button";
import { Input } from "/src/Components/ui/input";
import { Label } from "/src/Components/ui/label";

const PaymentUpdateModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [paidAmount, setPaidAmount] = useState(order.paidAmount || "");
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || "");
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  const handleSubmit = () => {
    if (!paidAmount) {
      alert("Please enter paid amount");
      return;
    }
    onUpdate(order.id, paymentStatus, paidAmount, paymentMethod);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment - {order.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="paid">Paid</option>
              <option value="not_paid">Not Paid</option>
            </select>
          </div>

          <div>
            <Label>Paid Amount</Label>
            <Input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Netbanking">Netbanking</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentUpdateModal;
