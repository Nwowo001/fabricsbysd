'use client';

import { useEffect, useState } from 'react';
import { ordersAPI, productsAPI, usersAPI } from '@/lib/api';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrders from '@/components/admin/RecentOrders';
import SalesChart from '@/components/admin/SalesChart';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        ordersAPI.getAllOrders({ limit: 10 }),
        productsAPI.getProducts({ limit: 1 }),
        usersAPI.getUsers({ limit: 1 }),
      ]);

      console.log('Orders response:', ordersRes.data);
      console.log('Products response:', productsRes.data);
      console.log('Users response:', usersRes.data);

      const orders = ordersRes.data.orders || ordersRes.data.data?.orders || [];
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

      setStats({
        totalOrders: ordersRes.data.total || ordersRes.data.data?.total || 0,
        totalProducts: productsRes.data.total || productsRes.data.data?.total || 0,
        totalUsers: usersRes.data.total || usersRes.data.data?.total || 0,
        totalRevenue,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}