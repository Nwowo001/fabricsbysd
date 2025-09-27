import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Verify Paystack payment
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { reference } = req.body;

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      // Find and update order
      const order = await Order.findOne({ 
        'paymentResult.reference': reference 
      });

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'processing';
        order.paymentResult = {
          reference: data.data.reference,
          status: data.data.status,
          gateway_response: data.data.gateway_response,
          paid_at: data.data.paid_at
        };

        await order.save();

        res.json({
          success: true,
          message: 'Payment verified successfully',
          order
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Paystack webhook
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;

      if (event.event === 'charge.success') {
        const { reference } = event.data;
        
        const order = await Order.findOne({ 
          'paymentResult.reference': reference 
        });

        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.status = 'processing';
          await order.save();
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook error');
  }
});

export default router;