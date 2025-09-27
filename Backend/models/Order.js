import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: String,
  color: String,
  image: String
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    country: { type: String, default: 'Nigeria' }
  },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'bank_transfer', 'cash_on_delivery'],
    default: 'paystack'
  },
  paymentResult: {
    reference: String,
    status: String,
    gateway_response: String,
    paid_at: Date
  },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  paymentMethod: {
    type: String,
    enum: ['bank_transfer'],
    default: 'bank_transfer'
  },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  status: {
    type: String,
    enum: ['pending_quote', 'quote_ready', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'declined'],
    default: 'pending_quote'
  },
  quotePrice: {
    type: Number,
    default: null
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  adminNotes: {
    type: String,
    default: ''
  },
  quotedAt: Date,
  confirmedAt: Date,
  notes: String
}, {
  timestamps: true
});



export default mongoose.model('Order', orderSchema);