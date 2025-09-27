'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/useStore';
import { cartAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, setCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  // Disable server sync - use only local cart for now

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
    toast.success('Cart updated');
  };

  const handleRemoveItem = (item: any) => {
    removeItem(item._id);
    toast.success('Item removed from cart');
  };

  const calculateShipping = () => {
    return totalPrice > 5000 ? 0 : 500;
  };

  const calculateTax = () => {
    return Math.round(totalPrice * 0.075);
  };

  const calculateTotal = () => {
    return totalPrice + calculateShipping() + calculateTax();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div key={item._id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product.description}
                      </p>
                      {item.size && (
                        <p className="text-sm text-gray-500 mt-1">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-500 mt-1">
                          Color: {item.color}
                        </p>
                      )}
                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        ₦{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Stock: {item.product.stock} available
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
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

                {totalPrice < 5000 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      Add ₦{(5000 - totalPrice).toLocaleString()} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
