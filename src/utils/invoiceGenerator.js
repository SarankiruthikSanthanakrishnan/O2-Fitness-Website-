import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // 🧾 Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TAX INVOICE", pageWidth / 2, 15, { align: "center" });

  // 🏢 Company Info
  doc.setFontSize(12);
  doc.text("O2 Fitness Health Care", 14, 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "No.49, Thirumalai Blood Testing Centre, Junction Main Road, Salem Junction, Suramangalam, Salem - 636005",
    14,
    30,
    { maxWidth: 180 }
  );
  doc.text("Email: o2fitnesshealthcare@gmail.com | Phone: +91-6380907315", 14, 36);
  doc.text("GSTIN: 33BJGPV7021L1ZX", 14, 42);

  // 🧍 Bill To / Ship To
  const customer = order.customer || {};
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 52);
  doc.text("Ship To:", 110, 52);

  doc.setFont("helvetica", "normal");
  doc.text(`${customer.name || ""}`, 14, 57);
  doc.text(`${customer.address || ""}`, 14, 62, { maxWidth: 80 });
  doc.text(`${customer.city || ""} - ${customer.postalCode || ""}`, 14, 67);
  doc.text(`Phone: ${customer.phone || ""}`, 14, 72);

  doc.text(`${customer.name || ""}`, 110, 57);
  doc.text(`${customer.address || ""}`, 110, 62, { maxWidth: 80 });
  doc.text(`${customer.city || ""} - ${customer.postalCode || ""}`, 110, 67);
  doc.text(`Phone: ${customer.phone || ""}`, 110, 72);

  // 🧾 Invoice Info
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Details", 14, 82);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${order.orderNumber}`, 14, 87);
  doc.text(
    `Order Date: ${new Date(
      order.createdAt?.toDate?.() || order.createdAt
    ).toLocaleDateString("en-IN")}`,
    14,
    92
  );
  doc.text(`Payment Status: ${order.paymentStatus}`, 14, 97);
  doc.text(`Shipping: Free Shipping`, 14, 102);

  // ✅ Clean, consistent amount formatter
  const formatAmount = (num) => {
    if (!num || isNaN(num)) return "0";
    return num
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // clean commas only
  };

  // 🧮 Table Items
  const items = order.items.map((item, index) => [
    index + 1,
    item.title || item.productName,
    item.quantity.toString(),
    formatAmount(Number(item.price)),
    formatAmount(Number(item.price) * Number(item.quantity)),
  ]);

  autoTable(doc, {
    startY: 110,
    head: [["#", "Item Description", "Qty", "Price", "Total"]],
    body: items,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: "middle",
    },
    headStyles: {
      fillColor: [4, 120, 87],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", cellWidth: 90 },
      2: { halign: "center", cellWidth: 20 },
      3: { halign: "right", cellWidth: 30 },
      4: { halign: "right", cellWidth: 30 },
    },
  });

  // 💰 Totals
  const subtotal = Math.round(order.totalAmount || 0);
  const finalY = doc.lastAutoTable.finalY + 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  
  doc.text(`Grand Total: Rs.${formatAmount(subtotal)}`, pageWidth - 14, finalY + 7, {
    align: "right",
  });

  // 🧾 Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "Thank you for shopping with O2 Fitness Health Care!",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  doc.save(`Invoice_${order.orderNumber}.pdf`);
};
