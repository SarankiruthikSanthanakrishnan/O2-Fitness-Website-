const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const crypto = require("crypto");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.createRazorpayOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Declare here so catch block can safely reference them
    let orderNumber;
    let amountInPaise;

    try {
      // Initialize Razorpay inside the function to access runtime config
      const razorpay = new Razorpay({
        key_id: functions.config().razorpay.key_id,
        key_secret: functions.config().razorpay.secret_key,
      });

      const { amount } = req.body;
      orderNumber = req.body.orderNumber;
      amountInPaise = Math.round(Number(amount) * 100);

      if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
        return res.status(400).send({ error: "Invalid order amount" });
      }

      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: orderNumber,
        payment_capture: 1, // ⭐ Auto-capture enabled
      };

      console.log("Creating Razorpay order:", {
        orderNumber,
        amountInPaise,
      });

      const order = await razorpay.orders.create(options);

      return res.status(200).send({ order });
    } catch (error) {
      const errorDetails = {
        message: error && error.message ? error.message : String(error),
        code: error && error.code ? error.code : undefined,
        statusCode: error && error.statusCode ? error.statusCode : undefined,
        errorResponse: error && error.error ? error.error : undefined,
      };

      console.error("Razorpay order creation failed:", {
        orderNumber: orderNumber || null,
        amountInPaise: typeof amountInPaise === "number" ? amountInPaise : null,
        error: errorDetails,
      });

      return res.status(errorDetails.statusCode || 500).send({
        error: errorDetails.message,
        code: errorDetails.code,
        details: errorDetails.errorResponse || "No additional details",
      });
    }
  });
});

exports.razorpayWebhook = functions.https.onRequest((req, res) => {
  // We don't use cors here because Razorpay sends server-to-server requests
  try {
    const webhookSecret = functions.config().razorpay.webhook_secret;
    const signature = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !signature) {
      console.error("Missing webhook secret or signature");
      return res.status(400).send("Bad Request");
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    const orderId = payment.order_id; // This is the Razorpay order ID

    console.log(`Received Razorpay webhook event: ${event} for order: ${orderId}`);

    if (event === "payment.captured" || event === "order.paid") {
      const ordersRef = db.collection("orders");

      // Query Firestore by razorpayOrderId
      return ordersRef.where("razorpayOrderId", "==", orderId).get().then(async (snapshot) => {
        if (snapshot.empty) {
          console.log(`Order not found for Razorpay Order ID: ${orderId}`);
          return res.status(404).send("Order not found");
        }

        const docId = snapshot.docs[0].id;

        await ordersRef.doc(docId).update({
          paymentStatus: "paid",
          razorpayPaymentId: payment.id,
          razorpayOrderId: payment.order_id,
          status: "Confirmed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Successfully updated order ${docId} to paid`);
        return res.status(200).send("OK");
      }).catch(err => {
        console.error("Error querying/updating Firestore:", err);
        return res.status(500).send("Internal Server Error");
      });
    }

    return res.status(200).send("Event ignored");
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).send({ error: error.message });
  }
});
