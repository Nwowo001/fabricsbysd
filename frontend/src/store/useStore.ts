import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Product, CartItem } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setHydrated: () => void;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[], totalItems: number, totalPrice: number) => void;
}

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i._id === item._id && i.size === item.size && i.color === item.color
          );
          
          if (existingItem) {
            const updatedItems = state.items.map((i) =>
              i._id === item._id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
            return { items: updatedItems, totalItems, totalPrice };
          } else {
            const newItems = [...state.items, item];
            const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
            const totalPrice = newItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
            return { items: newItems, totalItems, totalPrice };
          }
        }),
      removeItem: (itemId) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item._id !== itemId);
          const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
          return { items: updatedItems, totalItems, totalPrice };
        }),
      updateQuantity: (itemId, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          );
          const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
          return { items: updatedItems, totalItems, totalPrice };
        }),
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
      setCart: (items, totalItems, totalPrice) => set({ items, totalItems, totalPrice }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
