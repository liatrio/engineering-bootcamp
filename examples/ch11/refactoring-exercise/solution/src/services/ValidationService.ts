import { CreateOrderRequest } from '../domain/types';

/**
 * Validation Service
 * Handles all input validation logic
 * Demonstrates Single Responsibility Principle - only responsible for validation
 */
export class ValidationService {
  /**
   * Validate an order creation request
   * @param request Order request to validate
   * @throws Error if validation fails with descriptive message
   */
  validateOrderRequest(request: CreateOrderRequest): void {
    // Validate customer_id
    if (!request.customer_id) {
      throw new Error('customer_id is required');
    }

    // Validate items
    if (!request.items || !Array.isArray(request.items) || request.items.length === 0) {
      throw new Error('items array is required and must not be empty');
    }

    // Validate each item
    for (const item of request.items) {
      if (!item.product_id || typeof item.product_id !== 'number') {
        throw new Error('Each item must have a valid product_id');
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error('Each item must have a valid quantity greater than 0');
      }
    }

    // Validate payment_type
    const validPaymentTypes = ['credit_card', 'paypal', 'bitcoin'];
    if (!request.payment_type || !validPaymentTypes.includes(request.payment_type)) {
      throw new Error('payment_type must be one of: credit_card, paypal, bitcoin');
    }

    // Validate shipping_method
    const validShippingMethods = ['standard', 'express', 'overnight'];
    if (!request.shipping_method || !validShippingMethods.includes(request.shipping_method)) {
      throw new Error('shipping_method must be one of: standard, express, overnight');
    }
  }
}
