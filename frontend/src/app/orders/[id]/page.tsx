'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { ordersAPI } from '@/lib/api';
import PaystackButton from '@/components/payment/PaystackButton';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const paymentMethod = 'bank_transfer';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (params.id) {
      fetchOrder();
    }
  }, [params.id, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getOrder(params.id as string);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      toast.error('Order not found');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteResponse = async (action: 'accept' | 'decline') => {
    setResponding(true);
    try {
      const response = await ordersAPI.respondToQuote(params.id as string, {
        action,
        paymentMethod: action === 'accept' ? 'bank_transfer' : undefined
      });

      if (response.data.success) {
        toast.success(`Quote ${action}ed successfully`);
        fetchOrder();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Error ${action}ing quote`);
    } finally {
      setResponding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_quote': return 'bg-yellow-100 text-yellow-800';
      case 'quote_ready': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order?.orderNumber}</h1>
              <p className="text-gray-600 mt-2">Placed on {new Date(order?.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}>
              {order?.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            
            <div className="space-y-4">
              {order?.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} • ₦{item.price?.toLocaleString()}
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • Color: ${item.color}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span>₦{order?.itemsPrice?.toLocaleString()}</span>
                </div>
                
                {order?.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₦{order.deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₦{order?.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {order?.adminNotes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Note:</p>
                  <p className="text-sm text-blue-800">{order.adminNotes}</p>
                </div>
              )}
            </div>

            {order?.status === 'quote_ready' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Quote Ready</h2>
                <p className="text-gray-600 mb-4">
                  Payment will be processed via bank transfer through Paystack.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleQuoteResponse('accept')}
                    disabled={responding}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {responding ? 'Processing...' : 'Accept Quote & Pay'}
                  </button>
                  
                  <button
                    onClick={() => handleQuoteResponse('decline')}
                    disabled={responding}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Decline Quote
                  </button>
                </div>
              </div>
            )}

            {order?.status === 'confirmed' && !order?.isPaid && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
                <p className="text-gray-600 mb-4">
                  Your order is confirmed. Complete payment to proceed with delivery.
                </p>
                
                <PaystackButton
                  amount={order.totalPrice}
                  email={order.user?.email || ''}
                  orderId={order._id}
                  onSuccess={() => {
                    setTimeout(() => fetchOrder(), 1000);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}