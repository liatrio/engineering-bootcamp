/**
 * Transaction Script Pattern - Order Processing
 * 
 * This example demonstrates the Transaction Script pattern where business logic
 * is organized as procedural functions. Each function handles a complete transaction.
 */

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  customerId: number;
  customerName: string;
  items: OrderItem[];
  couponCode?: string;
}

export interface ProcessedOrder {
  orderId: number;
  customerId: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  timestamp: Date;
}

// Simple in-memory storage
const orders: ProcessedOrder[] = [];
let nextOrderId = 1;

/**
 * Validates order data
 */
export function validateOrder(orderData: OrderData): void {
  if (!orderData.customerId) {
    throw new Error('Customer ID is required');
  }
  
  if (!orderData.items || orderData.items.length === 0) {
    throw new Error('Order must have at least one item');
  }
  
  for (const item of orderData.items) {
    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for ${item.productName}`);
    }
    if (item.price < 0) {
      throw new Error(`Invalid price for ${item.productName}`);
    }
  }
}

/**
 * Calculates the subtotal for all items in the order
 */
export function calculateSubtotal(items: OrderItem[]): number {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  return subtotal;
}

/**
 * Applies discount based on coupon code
 */
export function calculateDiscount(subtotal: number, couponCode?: string): number {
  if (!couponCode) {
    return 0;
  }
  
  // Simple coupon logic
  switch (couponCode.toUpperCase()) {
    case 'SAVE10':
      return subtotal * 0.10;
    case 'SAVE20':
      return subtotal * 0.20;
    case 'WELCOME':
      return subtotal * 0.15;
    default:
      return 0;
  }
}

/**
 * Saves order to storage
 */
export function saveOrder(order: ProcessedOrder): void {
  orders.push(order);
  console.log(`Order #${order.orderId} saved to database`);
}

/**
 * Sends order confirmation (simulated)
 */
export function sendOrderConfirmation(order: ProcessedOrder, customerName: string): void {
  console.log(`\n📧 Sending confirmation to ${customerName}`);
  console.log(`   Order #${order.orderId}`);
  console.log(`   Total: $${order.total.toFixed(2)}`);
}

/**
 * Main transaction script - processes a complete order
 * This is the "script" that handles the entire transaction
 */
export function processOrder(orderData: OrderData): ProcessedOrder {
  console.log(`\n🔄 Processing order for ${orderData.customerName}...`);
  
  // Step 1: Validate
  validateOrder(orderData);
  
  // Step 2: Calculate subtotal
  const subtotal = calculateSubtotal(orderData.items);
  console.log(`   Subtotal: $${subtotal.toFixed(2)}`);
  
  // Step 3: Apply discount
  const discount = calculateDiscount(subtotal, orderData.couponCode);
  if (discount > 0) {
    console.log(`   Discount (${orderData.couponCode}): -$${discount.toFixed(2)}`);
  }
  
  // Step 4: Calculate total
  const total = subtotal - discount;
  
  // Step 5: Create order record
  const processedOrder: ProcessedOrder = {
    orderId: nextOrderId++,
    customerId: orderData.customerId,
    items: orderData.items,
    subtotal,
    discount,
    total,
    timestamp: new Date()
  };
  
  // Step 6: Save to database
  saveOrder(processedOrder);
  
  // Step 7: Send confirmation
  sendOrderConfirmation(processedOrder, orderData.customerName);
  
  console.log(`✅ Order #${processedOrder.orderId} completed`);
  
  return processedOrder;
}

/**
 * Retrieves order by ID
 */
export function getOrderById(orderId: number): ProcessedOrder | undefined {
  return orders.find(order => order.orderId === orderId);
}

/**
 * Gets all orders for a customer
 */
export function getCustomerOrders(customerId: number): ProcessedOrder[] {
  return orders.filter(order => order.customerId === customerId);
}

/**
 * Calculates total revenue
 */
export function calculateTotalRevenue(): number {
  return orders.reduce((sum, order) => sum + order.total, 0);
}
