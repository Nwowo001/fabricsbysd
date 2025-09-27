import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create new order (Request Quote)
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: items.map(item => ({
        ...item,
        product: item.product._id || item.product
      })),
      shippingAddress,
      itemsPrice,
      shippingPrice: 0, // Will be set by admin
      taxPrice: 0,
      totalPrice: itemsPrice, // Initial price, will be updated with quote
      status: 'pending_quote'
    });

    // Clear user's cart after order creation
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    // Send email notification to customer
    try {
      const { sendOrderConfirmation } = await import('../utils/sendEmail.js');
      await sendOrderConfirmation(order, req.user);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    // TODO: Add admin notification for new order
    // This would typically be sent via WebSocket or stored in database

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Admin: Provide quote for order
// @route   PUT /api/orders/:id/quote
// @access  Private/Admin
router.put('/:id/quote', protect, authorize('admin'), async (req, res) => {
  try {
    const { deliveryFee, adminNotes } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const quotePrice = order.itemsPrice + deliveryFee;
    
    order.deliveryFee = deliveryFee;
    order.quotePrice = quotePrice;
    order.totalPrice = quotePrice;
    order.adminNotes = adminNotes || '';
    order.status = 'quote_ready';
    order.quotedAt = Date.now();

    await order.save();
    await order.populate('user', 'name email');

    // Send email notification to customer
    try {
      const { sendQuoteReady } = await import('../utils/sendEmail.js');
      await sendQuoteReady(order, order.user);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Quote provided successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Customer: Accept/Decline quote
// @route   PUT /api/orders/:id/respond
// @access  Private
router.put('/:id/respond', protect, async (req, res) => {
  try {
    const { action, paymentMethod } = req.body; // action: 'accept' or 'decline'
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (action === 'accept') {
      order.status = 'confirmed';
      order.paymentMethod = paymentMethod || 'cash_on_delivery';
      order.confirmedAt = Date.now();
    } else {
      order.status = 'declined';
    }

    await order.save();

    res.json({
      success: true,
      message: `Quote ${action}ed successfully`,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const { reference, status, gateway_response } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentResult = {
      reference,
      status,
      gateway_response,
      paid_at: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: 'Payment updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'delivered' && { isDelivered: true, deliveredAt: Date.now() })
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;