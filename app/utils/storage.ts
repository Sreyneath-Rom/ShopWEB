// app/utils/storage.ts

export const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  CART: 'cart',
  RECENT_PURCHASES: 'recent_purchases',
  ORDERS: 'orders'
} as const;

export interface StorageError {
  code: string;
  message: string;
}

export const tryParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
};

export const getFavorites = (): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
};

export const setFavorites = (favorites: number[]): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Failed to set favorites:', error);
    return false;
  }
};

export const toggleFavorite = (productId: number): number[] => {
  const favorites = getFavorites();
  const newFavorites = favorites.includes(productId)
    ? favorites.filter(id => id !== productId)
    : [...favorites, productId];
  setFavorites(newFavorites);
  return newFavorites;
};

export const clearFavorites = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    return true;
  } catch (error) {
    console.error('Failed to clear favorites:', error);
    return false;
  }
};

// Orders
export const getOrders = (): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get orders:', error);
    return [];
  }
};

export const setOrders = (orders: any[]): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Failed to set orders:', error);
    return false;
  }
};

export const addOrder = (order: any): any[] => {
  const orders = getOrders();
  const newOrders = [order, ...orders];
  setOrders(newOrders);
  return newOrders;
};

export const clearOrders = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    return true;
  } catch (error) {
    console.error('Failed to clear orders:', error);
    return false;
  }
};

// User (simple client-side auth)
export const USER_KEY = 'current_user';

export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
};

export const setUser = (user: any): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Failed to set user:', error);
    return false;
  }
};

export const clearUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear user:', error);
    return false;
  }
};
