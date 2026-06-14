const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Order = require('../models/order');
const dotenv = require("dotenv");
dotenv.config();

// Initialize Razorpay
const isPlaceholderKey = (value) => {
  return !value || value.includes('your_key') || value.includes('your_key_id_here') || value.includes('your_key_secret_here');
};

console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET EXISTS:", !!process.env.RAZORPAY_KEY_SECRET);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const router = express.Router();

// Validate Razorpay Keys
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in server/.env');
} else if (isPlaceholderKey(process.env.RAZORPAY_KEY_ID) || isPlaceholderKey(process.env.RAZORPAY_KEY_SECRET)) {
  console.warn('⚠️  WARNING: Razorpay keys in server/.env look like placeholders. Replace them with your real Razorpay test keys.');
}

// Debug endpoint to check key loading quickly
router.get('/debug-keys', (req, res) => {
  const keyIdPresent = !!process.env.RAZORPAY_KEY_ID;
  const keySecretPresent = !!process.env.RAZORPAY_KEY_SECRET;
  const keyIdPlaceholder = isPlaceholderKey(process.env.RAZORPAY_KEY_ID);
  const keySecretPlaceholder = isPlaceholderKey(process.env.RAZORPAY_KEY_SECRET);

  res.json({
    keyIdPresent,
    keySecretPresent,
    keyIdPlaceholder,
    keySecretPlaceholder,
    keyIdPreview: process.env.RAZORPAY_KEY_ID ? (process.env.RAZORPAY_KEY_ID.length > 12 ? process.env.RAZORPAY_KEY_ID.slice(0,8) + '...' : process.env.RAZORPAY_KEY_ID) : null,
  });
});

// Create Razorpay Order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, deliveryInfo } = req.body;
    const userId = req.user?.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!deliveryInfo || !deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.addressLine1 || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.pincode) {
      return res.status(400).json({ message: 'Delivery address and contact details are required' });
    }

    const deliveryAddress = `${deliveryInfo.addressLine1}, ${deliveryInfo.city}, ${deliveryInfo.state}, ${deliveryInfo.pincode}` + (deliveryInfo.landmark ? `, Landmark: ${deliveryInfo.landmark}` : '');

    // Create order in Razorpay
    const options = {
      amount: Math.round(totalAmount * 100), // Convert to paise (smallest unit)
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        items: items.map(item => item.name).join(', '),
        deliveryName: deliveryInfo.fullName,
        deliveryPhone: deliveryInfo.phone,
        deliveryAddress,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error.message);

    if (isPlaceholderKey(process.env.RAZORPAY_KEY_ID) || isPlaceholderKey(process.env.RAZORPAY_KEY_SECRET)) {
      return res.status(500).json({
        message: 'Razorpay keys in server/.env are placeholders. Replace them with your real Razorpay test keys.',
        error: 'Placeholder API Key',
      });
    }

    if (error.message && (error.message.includes('Invalid API Key') || error.statusCode === 401 || error.statusCode === 400)) {
      return res.status(500).json({
        message: 'Invalid Razorpay API Key or credentials. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env',
        error: error.message,
      });
    }

    res.status(500).json({
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
});

// Verify Razorpay Payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount,
      deliveryInfo,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    if (!items || items.length === 0 || !totalAmount || !deliveryInfo) {
      return res.status(400).json({ message: 'Missing order details for verification' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    const deliveryAddress = `${deliveryInfo.addressLine1}, ${deliveryInfo.city}, ${deliveryInfo.state}, ${deliveryInfo.pincode}` +
      (deliveryInfo.landmark ? `, Landmark: ${deliveryInfo.landmark}` : '');

    const order = new Order({
      userId: req.userId,
      userEmail: req.userEmail,
      userName: req.userName || '',
      items,
      totalAmount,
      deliveryInfo: {
        ...deliveryInfo,
        address: deliveryAddress,
      },
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'paid',
    });

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      message: 'Payment verification failed',
      error: error.message,
    });
  }
});

router.post('/create-cod-order', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, deliveryInfo } = req.body;

    if (!items || items.length === 0 || !totalAmount || !deliveryInfo) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.addressLine1 || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.pincode) {
      return res.status(400).json({ message: 'Delivery address and contact details are required' });
    }

    const deliveryAddress = `${deliveryInfo.addressLine1}, ${deliveryInfo.city}, ${deliveryInfo.state}, ${deliveryInfo.pincode}` +
      (deliveryInfo.landmark ? `, Landmark: ${deliveryInfo.landmark}` : '');

    const order = new Order({
      userId: req.userId,
      userEmail: req.userEmail,
      userName: req.userName || '',
      items,
      totalAmount,
      deliveryInfo: {
        ...deliveryInfo,
        address: deliveryAddress,
      },
      paymentMethod: 'cod',
      status: 'pending',
      razorpayOrderId: `COD_${req.userId}_${Date.now()}`,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully. Payment will be collected at delivery.',
      order_id: order._id,
    });
  } catch (error) {
    console.error('COD order creation error:', error);
    res.status(500).json({
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

router.get('/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load admin orders', error: error.message });
  }
});

module.exports = router;

