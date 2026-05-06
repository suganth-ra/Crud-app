import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useCallback } from 'react';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearCoupon,
  clearCart,
} from '../redux/cartSlice';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateGST,
  calculateTotal,
} from '../utils/calculations';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, coupon, discount } = useSelector((state) => state.cart);

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const discountAmount = useMemo(
    () => calculateDiscount(subtotal, discount),
    [subtotal, discount]
  );
  const gst = useMemo(
    () => calculateGST(subtotal - discountAmount),
    [subtotal, discountAmount]
  );
  const total = useMemo(
    () => calculateTotal(subtotal, discountAmount, gst),
    [subtotal, discountAmount, gst]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const handleAddToCart = useCallback(
    (product) => dispatch(addToCart(product)),
    [dispatch]
  );

  const handleRemoveFromCart = useCallback(
    (id) => dispatch(removeFromCart(id)),
    [dispatch]
  );

  const handleUpdateQuantity = useCallback(
    (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    [dispatch]
  );

  const handleApplyCoupon = useCallback(
    (code, discountValue) =>
      dispatch(applyCoupon({ code, discount: discountValue })),
    [dispatch]
  );

  const handleClearCoupon = useCallback(
    () => dispatch(clearCoupon()),
    [dispatch]
  );

  const handleClearCart = useCallback(
    () => dispatch(clearCart()),
    [dispatch]
  );

  return {
    items,
    coupon,
    discount,
    subtotal,
    discountAmount,
    gst,
    total,
    totalItems,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    applyCoupon: handleApplyCoupon,
    clearCoupon: handleClearCoupon,
    clearCart: handleClearCart,
  };
};
