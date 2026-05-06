export const GST_RATE = 0.18;

export const calculateSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const calculateDiscount = (subtotal, discountPercent) =>
  (subtotal * discountPercent) / 100;

export const calculateGST = (amount) => amount * GST_RATE;

export const calculateTotal = (subtotal, discount, gst) =>
  subtotal - discount + gst;

export const formatPrice = (price) =>
  `$${Number(price).toFixed(2)}`;
