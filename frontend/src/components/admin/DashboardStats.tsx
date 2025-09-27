'use client';

import { 
  ShoppingBagIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface StatsProps {
  stats: {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalRevenue: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const statItems = [
    {
      name: 'Total Revenue',
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: ShoppingBagIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: UsersIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`inline-flex items-center justify-center rounded-md p-3 ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="text-lg font-semibold text-gray-900">{item.value}</dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}