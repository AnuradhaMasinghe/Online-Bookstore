const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Order = require("../models/Order");
const User = require("../models/User");

exports.generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch order with user details
    const order = await Order.findById(orderId).populate("userId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customerName = order.userId.username || order.userId.name || "Customer";
    const totalAmount = order.totalPrice;

    // Create invoices directory if it doesn't exist
    const invoicesDir = path.join(__dirname, "..", "invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const invoiceFileName = `invoice_${orderId}.pdf`;
    const filePath = path.join(invoicesDir, invoiceFileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(18).text(`Invoice - Order #${orderId}`, { align: "center" }).moveDown();
    doc.fontSize(12).text(`Customer Name: ${customerName}`).moveDown();
    doc.text(`Shipping Address: ${order.shippingAddress}`).moveDown();
    if (!Array.isArray(order.items)) {
        return res.status(500).json({ message: "Order items are not formatted correctly." });
      }
    // Items section
    doc.text("Books:");
    order.items.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.title} - $${item.price}`);
    });

    // Footer
    doc.moveDown().text(`Total Amount: $${totalAmount}`);
    doc.moveDown().text("Thank you for your purchase!");

    doc.end();

    res.status(200).json({
      message: "Invoice generated",
      file: `/invoices/${invoiceFileName}`,
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
