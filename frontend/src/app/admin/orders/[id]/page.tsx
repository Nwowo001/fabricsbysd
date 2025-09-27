'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { ordersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteData, setQuoteData] = useState({
    deliveryFee: '',
    adminNotes: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getOrder(params.id as string);
      if (response.data.success && response.data.order) {
        setOrder(response.data.order);
        if (response.data.order.deliveryFee) {
          setQuoteData({
            deliveryFee: response.data.order.deliveryFee.toString(),
            adminNotes: response.data.order.adminNotes || ''
          });
        }
      }
    } catch (error) {
      toast.error('Error fetching order');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProvideQuote = async () => {
    if (!quoteData.deliveryFee || parseFloat(quoteData.deliveryFee) < 0) {
      toast.error('Please enter a valid delivery fee');
      return;
    }

    setQuoteLoading(true);
    try {
      const response = await ordersAPI.provideQuote(params.id as string, {
        deliveryFee: parseFloat(quoteData.deliveryFee),
        adminNotes: quoteData.adminNotes
      });

      if (response.data.success) {
        toast.success('Quote provided successfully');
        fetchOrder();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error providing quote');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleCallCustomer = () => {
    if (order?.shippingAddress?.phone) {
      window.open(`tel:${order.shippingAddress.phone}`, '_self');
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order?.orderNumber}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}>
          {order?.status?.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium">{order?.shippingAddress?.fullName}</p>
              <p className="text-gray-600">{order?.user?.email}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{order?.shippingAddress?.phone}</p>
              </div>
              <button
                onClick={handleCallCustomer}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <PhoneIcon className="h-4 w-4" />
                <span>Call Customer</span>
              </button>
            </div>

            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p>{order?.shippingAddress?.address}</p>
              <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quote Management</h2>
          
          {order?.status === 'pending_quote' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Fee (₦)</label>
                <input
                  type="number"
                  value={quoteData.deliveryFee}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, deliveryFee: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md text-gray-900"
                  placeholder="Enter delivery fee"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={quoteData.adminNotes}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, adminNotes: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md text-gray-900"
                  placeholder="Add notes..."
                />
              </div>

              <button
                onClick={handleProvideQuote}
                disabled={quoteLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {quoteLoading ? 'Providing Quote...' : 'Provide Quote'}
              </button>
            </div>
          )}

          {order?.status !== 'pending_quote' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Total: ₦{order?.totalPrice?.toLocaleString()}</p>
              {order?.adminNotes && (
                <p className="text-sm text-gray-600 mt-2">Notes: {order.adminNotes}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order?.items?.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-4 border-b pb-4">
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
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
    </div>
  );
}