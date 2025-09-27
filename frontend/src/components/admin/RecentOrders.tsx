'use client';

import Link from 'next/link';
import { Order } from '@/types';

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No orders yet</p>
        ) : (
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₦{order.totalPrice?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}