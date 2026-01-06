// Type definitions for the e-commerce order system

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  created_at: string;
}

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  status: string;
  payment_type: string;
  payment_fee: number;
  shipping_method: string;
  shipping_cost: number;
  shipping_days: number;
  subtotal: number;
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_order: number;
}

export interface OrderItemRequest {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customer_id: number;
  items: OrderItemRequest[];
  payment_type: 'credit_card' | 'paypal' | 'bitcoin';
  shipping_method: 'standard' | 'express' | 'overnight';
}

export interface CreateOrderResponse {
  order_id: number;
  customer_id: number;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  payment_fee: number;
  shipping_cost: number;
  shipping_days: number;
  total: number;
  status: string;
}
