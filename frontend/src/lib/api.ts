import axios from 'axios';
import { ApiResponse, PaginationParams } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<ApiResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse>('/auth/login', data),
  
  getMe: () =>
    api.get<ApiResponse>('/auth/me'),
  
  updateProfile: (data: any) =>
    api.put<ApiResponse>('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse>('/auth/change-password', data),
};

// Products API
export const productsAPI = {
  getProducts: (params?: PaginationParams) =>
    api.get<ApiResponse>('/products', { params }),
  
  getProduct: (id: string) =>
    api.get<ApiResponse>(`/products/${id}`),
  
  createProduct: (data: any) =>
    api.post<ApiResponse>('/products', data),
  
  updateProduct: (id: string, data: any) =>
    api.put<ApiResponse>(`/products/${id}`, data),
  
  deleteProduct: (id: string) =>
    api.delete<ApiResponse>(`/products/${id}`),
  
  addReview: (id: string, data: { rating: number; comment?: string }) =>
    api.post<ApiResponse>(`/products/${id}/reviews`, data),
};

// Cart API
export const cartAPI = {
  getCart: () =>
    api.get<ApiResponse>('/cart'),
  
  addToCart: (data: { productId: string; quantity: number; size?: string; color?: string }) =>
    api.post<ApiResponse>('/cart', data),
  
  updateCartItem: (itemId: string, data: { quantity: number }) =>
    api.put<ApiResponse>(`/cart/${itemId}`, data),
  
  removeFromCart: (itemId: string) =>
    api.delete<ApiResponse>(`/cart/${itemId}`),
  
  clearCart: () =>
    api.delete<ApiResponse>('/cart'),
};

// Orders API
// export const ordersAPI = {
//   createOrder: (data: any) =>
//     api.post<ApiResponse>('/orders', data),
  
//   getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
//     api.get<ApiResponse>('/orders', { params }),
  
//   getOrder: (id: string) =>
//     api.get<ApiResponse>(`/orders/${id}`),
  
//   updateOrderStatus: (id: string, data: { status: string; trackingNumber?: string; cancellationReason?: string }) =>
//     api.put<ApiResponse>(`/orders/${id}/status`, data),
  
//   getAllOrders: (params?: any) =>
//     api.get<ApiResponse>('/orders/admin/all', { params }),
// };

// Users API
export const usersAPI = {
  getUsers: (params?: any) =>
    api.get<ApiResponse>('/users', { params }),
  
  getUser: (id: string) =>
    api.get<ApiResponse>(`/users/${id}`),
  
  updateUserRole: (id: string, data: { role: string }) =>
    api.put<ApiResponse>(`/users/${id}/role`, data),
  
  deleteUser: (id: string) =>
    api.delete<ApiResponse>(`/users/${id}`),
  
  createAdmin: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse>('/users/create-admin', data),
};

// Payments API
export const paymentsAPI = {
  initializePayment: (data: { orderId: string; email: string }) =>
    api.post<ApiResponse>('/payments/initialize', data),
  
  verifyPayment: (reference: string) =>
    api.get<ApiResponse>(`/payments/verify/${reference}`),
  
  getPaymentMethods: () =>
    api.get<ApiResponse>('/payments/methods'),
};

// Upload API
export const uploadAPI = {
  uploadProductImages: (formData: FormData) =>
    api.post<ApiResponse>('/upload/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteProductImage: (publicId: string) =>
    api.delete<ApiResponse>(`/upload/products/${publicId}`),
};

export const ordersAPI = {
  createOrder: (data: any) =>
    api.post<ApiResponse>('/orders', data),
  
  getUserOrders: () =>
    api.get<ApiResponse>('/orders'),
  
  getOrder: (id: string) =>
    api.get<ApiResponse>(`/orders/${id}`),
  
  getAllOrders: (params?: any) =>
    api.get<ApiResponse>('/orders/admin/all', { params }),
  
  updateOrderStatus: (id: string, data: { status: string }) =>
    api.put<ApiResponse>(`/orders/${id}/status`, data),
  
  updatePayment: (id: string, data: any) =>
    api.put<ApiResponse>(`/orders/${id}/pay`, data),
  
  provideQuote: (id: string, data: { deliveryFee: number; adminNotes: string }) =>
    api.put<ApiResponse>(`/orders/${id}/quote`, data),
  
  respondToQuote: (id: string, data: { action: 'accept' | 'decline'; paymentMethod?: string }) =>
    api.put<ApiResponse>(`/orders/${id}/respond`, data),
};

// export const paymentsAPI = {
//   verifyPayment: (data: { reference: string }) =>
//     api.post<ApiResponse>('/payments/verify', data),
// };

export default api;
