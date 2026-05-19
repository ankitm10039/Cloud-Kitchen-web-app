import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveOrder, OrderStatus } from '../types';

interface OrderState {
  activeOrder: ActiveOrder | null;
  orders: ActiveOrder[];
}

const mockOrders: ActiveOrder[] = [
  {
    id: "ORD-9482",
    items: [
      {
        id: "ln-1",
        name: "Charcoal Smoked Butter Chicken Thali",
        price: 450,
        description: "Tender tandoori chicken cooked in a rich, velvety tomato-butter gravy...",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600",
        category: "nonveg",
        timing: "Lunch",
        isChefSpecial: true,
        rating: 4.9,
        deliveryTime: 25,
        calories: 920,
        tags: ["Bestseller", "Premium Thali"],
        spiceLevel: 2,
        ingredients: ["Tandoori Chicken", "Tomatoes", "Amul Butter"],
        quantity: 1
      },
      {
        id: "bf-5",
        name: "South Indian Idli-Vada Combo",
        price: 160,
        description: "Two soft, fluffy steamed rice-and-lentil cakes...",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600",
        category: "veg",
        timing: "Breakfast",
        isChefSpecial: false,
        rating: 4.7,
        deliveryTime: 15,
        calories: 310,
        tags: ["Healthy", "Gluten-Free"],
        spiceLevel: 1,
        ingredients: ["Rice Flour", "Black Gram"],
        quantity: 2
      }
    ],
    subtotal: 770,
    tax: 38.5,
    deliveryFee: 40,
    total: 848.5,
    status: 'delivered',
    estimatedDeliveryTime: "Delivered",
    shippingAddress: {
      fullName: "Ankit Meena",
      street: "Sector 62, Highrise Apartments",
      city: "Noida",
      phone: "+91 9876543210"
    },
    paymentMethod: "UPI",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    statusLogs: [
      { status: 'placed', timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000).toISOString() },
      { status: 'confirmed', timestamp: new Date(Date.now() - 24.4 * 60 * 60 * 1000).toISOString() },
      { status: 'cooking', timestamp: new Date(Date.now() - 24.2 * 60 * 60 * 1000).toISOString() },
      { status: 'delivering', timestamp: new Date(Date.now() - 24.0 * 60 * 60 * 1000).toISOString() },
      { status: 'delivered', timestamp: new Date(Date.now() - 23.8 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

const initialState: OrderState = {
  activeOrder: null,
  orders: mockOrders,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<ActiveOrder>) => {
      state.activeOrder = action.payload;
      state.orders.unshift(action.payload); // Add to the top of order history
    },
    updateOrderStatus: (state, action: PayloadAction<OrderStatus>) => {
      if (state.activeOrder) {
        state.activeOrder.status = action.payload;
        state.activeOrder.statusLogs.push({
          status: action.payload,
          timestamp: new Date().toISOString()
        });

        // Update in history as well
        const orderInHistory = state.orders.find(o => o.id === state.activeOrder?.id);
        if (orderInHistory) {
          orderInHistory.status = action.payload;
          orderInHistory.statusLogs.push({
            status: action.payload,
            timestamp: new Date().toISOString()
          });
        }
      }
    },
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    }
  }
});

export const { placeOrder, updateOrderStatus, clearActiveOrder } = orderSlice.actions;
export default orderSlice.reducer;
