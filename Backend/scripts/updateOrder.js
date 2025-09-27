import mongoose from 'mongoose';
import Order from '../models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const updateOrderToPaid = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const order = await Order.findOne({ orderNumber: 'ORD-1758997280893-0001' });
    
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'processing';
      order.paymentResult = {
        reference: `manual-${Date.now()}`,
        status: 'success',
        gateway_response: 'Manual update',
        paid_at: new Date()
      };
      
      await order.save();
      console.log('Order updated successfully:', order.orderNumber);
    } else {
      console.log('Order not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateOrderToPaid();