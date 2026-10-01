import { CreateOrderRequest, CreateOrderResponse, Customer } from '../domain/types';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { PaymentStrategyFactory } from '../factories/PaymentStrategyFactory';
import { ShippingStrategyFactory } from '../factories/ShippingStrategyFactory';
import { ValidationService } from './ValidationService';
import { InventoryService } from './InventoryService';
import { dbGet } from '../database';

/**
 * Order Service
 * Orchestrates order creation business logic
 * Demonstrates Service Layer Pattern:
 * - Coordinates multiple operations (validation, inventory, payment, shipping, persistence)
 * - Separates business logic from HTTP concerns
 * - Uses dependency injection for all dependencies (DIP)
 * - Single responsibility: order creation workflow
 */
export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private paymentFactory: PaymentStrategyFactory,
    private shippingFactory: ShippingStrategyFactory,
    private validationService: ValidationService,
    private inventoryService: InventoryService
  ) {}

  /**
   * Create a new order
   * Orchestrates the complete order creation workflow
   * @param request Order creation request
   * @returns Created order details
   * @throws Error if validation fails, customer not found, or insufficient stock
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    // Step 1: Validate input
    this.validationService.validateOrderRequest(request);

    // Step 2: Verify customer exists
    const customer = await dbGet<Customer>(
      'SELECT * FROM customers WHERE id = ?',
      [request.customer_id]
    );

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Step 3: Check inventory availability
    await this.inventoryService.checkAvailability(request.items);

    // Step 4: Gather product details and calculate subtotal
    const itemsWithDetails = await Promise.all(
      request.items.map(async (item) => {
        const product = await this.productRepository.findById(item.product_id);
        if (!product) {
          throw new Error(`Product with id ${item.product_id} not found`);
        }
        return {
          product_id: product.id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
        };
      })
    );

    const subtotal = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const roundedSubtotal = Math.round(subtotal * 100) / 100;

    // Step 5: Calculate payment fee using Strategy Pattern
    const paymentStrategy = this.paymentFactory.getStrategy(request.payment_type);
    const paymentFee = paymentStrategy.calculateFee(roundedSubtotal);

    // Step 6: Calculate shipping cost using Strategy Pattern
    const shippingStrategy = this.shippingFactory.getStrategy(request.shipping_method);
    const shippingCost = shippingStrategy.calculateCost();
    const shippingDays = shippingStrategy.getDeliveryDays();

    // Step 7: Calculate total
    const total = Math.round((roundedSubtotal + paymentFee + shippingCost) * 100) / 100;

    // Step 8: Create order in database
    const orderId = await this.orderRepository.create({
      customer_id: request.customer_id,
      status: 'confirmed',
      payment_type: request.payment_type,
      payment_fee: paymentFee,
      shipping_method: request.shipping_method,
      shipping_cost: shippingCost,
      shipping_days: shippingDays,
      subtotal: roundedSubtotal,
      total,
    });

    // Step 9: Add order items
    await this.orderRepository.addItems(
      orderId,
      itemsWithDetails.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price,
      }))
    );

    // Step 10: Decrement inventory
    await this.inventoryService.decrementStock(request.items);

    // Step 11: Return response
    return {
      order_id: orderId,
      customer_id: request.customer_id,
      items: itemsWithDetails.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: roundedSubtotal,
      payment_fee: paymentFee,
      shipping_cost: shippingCost,
      shipping_days: shippingDays,
      total,
      status: 'confirmed',
    };
  }
}
