'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import { useAuthStore } from '@/store/useStore';
import { authAPI } from '@/lib/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { token, login } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.data.success) {
            login(response.data.user, token);
          }
        } catch (error) {
          // Token is invalid, clear auth state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
  }, [token, login]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
