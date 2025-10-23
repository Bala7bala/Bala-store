export type Language = 'en' | 'te';

export interface LocalizedString {
  en: string;
  te: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  image: string;
}

export interface Product {
  id: string;
  name: LocalizedString;
  price: number;
  image: string;
  categoryId: string;
  size?: string;
  stockStatus: 'In Stock' | 'Out of Stock';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Out for Delivery' | 'Delivered';
  paymentMethod: 'COD' | 'UPI';
  paymentStatus: 'Pending' | 'Paid';
}