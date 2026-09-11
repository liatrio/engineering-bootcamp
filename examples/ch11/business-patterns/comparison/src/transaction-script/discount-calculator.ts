/**
 * Transaction Script Approach
 * Discount Calculation for Orders
 */

export interface OrderDiscountData {
  orderTotal: number;
  customerType: 'VIP' | 'REGULAR';
  itemCount: number;
  couponCode?: string;
}

/**
 * Calculates volume discount based on order total
 */
export function calculateVolumeDiscount(orderTotal: number): number {
  if (orderTotal > 500) {
    return orderTotal * 0.15; // 15% for orders over $500
  } else if (orderTotal > 200) {
    return orderTotal * 0.10; // 10% for orders over $200
  } else if (orderTotal > 100) {
    return orderTotal * 0.05; // 5% for orders over $100
  }
  return 0;
}

/**
 * Calculates customer type discount
 */
export function calculateCustomerDiscount(orderTotal: number, customerType: 'VIP' | 'REGULAR'): number {
  if (customerType === 'VIP') {
    return orderTotal * 0.10; // 10% VIP discount
  }
  return 0;
}

/**
 * Calculates bulk item discount
 */
export function calculateBulkDiscount(orderTotal: number, itemCount: number): number {
  if (itemCount >= 10) {
    return orderTotal * 0.05; // 5% for 10+ items
  }
  return 0;
}

/**
 * Applies coupon code discount
 */
export function applyCouponDiscount(orderTotal: number, couponCode?: string): number {
  if (!couponCode) return 0;
  
  switch (couponCode.toUpperCase()) {
    case 'SAVE15':
      return orderTotal * 0.15;
    case 'SAVE25':
      return orderTotal * 0.25;
    case 'FIRSTORDER':
      return orderTotal * 0.20;
    default:
      return 0;
  }
}

/**
 * Main function - calculates total discount
 * This is the "script" that orchestrates all discount calculations
 */
export function calculateOrderDiscount(data: OrderDiscountData): number {
  let totalDiscount = 0;
  
  // Calculate each type of discount
  totalDiscount += calculateVolumeDiscount(data.orderTotal);
  totalDiscount += calculateCustomerDiscount(data.orderTotal, data.customerType);
  totalDiscount += calculateBulkDiscount(data.orderTotal, data.itemCount);
  totalDiscount += applyCouponDiscount(data.orderTotal, data.couponCode);
  
  // Apply maximum discount cap of 40%
  const maxDiscount = data.orderTotal * 0.40;
  return Math.min(totalDiscount, maxDiscount);
}

/**
 * Calculates final price after discount
 */
export function calculateFinalPrice(data: OrderDiscountData): number {
  const discount = calculateOrderDiscount(data);
  return data.orderTotal - discount;
}
