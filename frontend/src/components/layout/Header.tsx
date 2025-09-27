"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore, useCartStore, useUIStore } from "@/store/useStore";
import { authAPI } from "@/lib/api";
import { NotificationBell } from "@/components/notifications/NotificationProvider";
import toast from "react-hot-toast";
import Image from "next/image";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <Image
                  src="/assets/background.png"
                  alt="FabricsBySD Logo"
                  width={40}
                  height={40}
                  className="w-12 h-12 sm:w-10 sm:h-10 rounded-full object-cover shadow-md border-2 border-purple-100"
                />
              </div>
              <div className=" flex-col lg:block hidden ">
                <span className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">FabricsBySD</span>
                <span className="text-xs text-purple-600 font-medium hidden sm:block">African Fashion</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}
            
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden lg:block text-sm">{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile search & menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              <Link
                href="/products"
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
