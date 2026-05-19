import { useAppDispatch, useAppSelector } from '../store';
import { addToCart, removeFromCart, updateQuantity, updateNotes, clearCart } from '../store/cartSlice';
import { MenuItem } from '../types';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // 5% GST for cloud kitchen food orders
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  
  // Delivery charges: Rs. 40, Free delivery on orders above Rs. 500
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  
  const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

  const add = (item: MenuItem, quantity = 1, customNotes = '') => {
    dispatch(addToCart({ item, quantity, customNotes }));
  };

  const remove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const updateQty = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const setNotes = (id: string, notes: string) => {
    dispatch(updateNotes({ id, notes }));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  return {
    items,
    count,
    subtotal,
    tax,
    deliveryFee,
    total,
    add,
    remove,
    updateQty,
    setNotes,
    clear,
  };
};
