export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'veg' | 'nonveg';
  timing: 'Breakfast' | 'Lunch' | 'Dinner';
  isChefSpecial: boolean;
  rating: number;
  deliveryTime: number;
  calories: number;
  tags: string[];
  spiceLevel: number; // 0 to 3
  ingredients: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  customNotes?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'cooking' | 'delivering' | 'delivered';

export interface ActiveOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  estimatedDeliveryTime: string; // ISO string or minutes remaining
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
  createdAt: string;
  statusLogs: {
    status: OrderStatus;
    timestamp: string;
  }[];
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  addresses: {
    id: string;
    label: string; // Home, Work, etc.
    street: string;
    city: string;
  }[];
  favoriteDishes: string[]; // ids
}
