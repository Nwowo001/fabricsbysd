'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/store/useStore';
import { ordersAPI } from '@/lib/api';
import PaystackButton from '@/components/payment/PaystackButton';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [isAuthenticated, items.length, router]);

  const calculateShipping = () => totalPrice > 5000 ? 0 : 500;
  const calculateTax = () => Math.round(totalPrice * 0.075);
  const calculateTotal = () => totalPrice + calculateShipping() + calculateTax();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const requestQuote = async () => {
    try {
      setLoading(true);
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images?.[0]?.url
        })),
        shippingAddress
      };

      const response = await ordersAPI.createOrder(orderData);
      if (response.data.success) {
        clearCart();
        toast.success('Quote request submitted! We\'ll review and get back to you soon.');
        router.push('/orders');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error submitting quote request');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state) {
      toast.error('Please fill in all required fields');
      return;
    }
    requestQuote();
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    name="state"
                    required
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select State</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Kano">Kano</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Kaduna">Kaduna</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code (Optional)</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • Color: ${item.color}`}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {calculateShipping() === 0 ? 'Free' : `₦${calculateShipping().toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (7.5%)</span>
                <span className="font-medium">₦{calculateTax().toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleProceed}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Request Quote'}
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                We'll review your order and provide a final quote including delivery fees
              </p>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Final price may vary based on delivery location and additional services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}