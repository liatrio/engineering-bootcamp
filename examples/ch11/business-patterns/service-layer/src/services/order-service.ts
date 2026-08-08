/**
 * Service Layer - Order Service
 * 
 * The Service Layer defines application boundaries and coordinates domain objects.
 * It orchestrates business operations, manages transactions, and provides
 * a clear API for the presentation layer.
 */

import { Order, OrderItem } from '../domain/entities';
import { OrderRepository, ProductRepository, CustomerRepository } from '../repositories/repositories';

export interface CreateOrderRequest {
  customerId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface OrderDTO {
  orderId: number;
  customerId: number;
  customerName: string;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  createdAt: Date;
}

export class OrderService {
  private nextOrderId = 1;
  
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private customerRepository: CustomerRepository,
    private emailService: EmailService,
    private inventoryService: InventoryService
  ) {}
  
  /**
   * Creates a new order - this is the main use case
   * 
   * This method demonstrates the Service Layer pattern by:
   * 1. Defining a transaction boundary
   * 2. Coordinating multiple domain objects and repositories
   * 3. Handling business rules and validations
   * 4. Managing cross-cutting concerns (email, inventory)
   */
  async createOrder(request: CreateOrderRequest): Promise<OrderDTO> {
    console.log(`\n📦 Creating order for customer ${request.customerId}...`);
    
    // Transaction boundary starts here
    try {
      // Step 1: Validate customer exists
      const customer = await this.customerRepository.findById(request.customerId);
      if (!customer) {
        throw new Error(`Customer ${request.customerId} not found`);
      }
      
      // Step 2: Validate products and check inventory
      const orderItems: OrderItem[] = [];
      const productDetails: Array<{ id: number; name: string; price: number }> = [];
      
      for (const item of request.items) {
        const product = await this.productRepository.findById(item.productId);
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        
        // Check inventory availability
        if (!await this.inventoryService.checkAvailability(item.productId, item.quantity)) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        
        orderItems.push(new OrderItem(item.productId, item.quantity, product.price));
        productDetails.push({ id: product.id, name: product.name, price: product.price });
      }
      
      // Step 3: Create order domain object
      const order = new Order(
        this.nextOrderId++,
        request.customerId,
        orderItems
      );
      
      // Step 4: Reserve inventory
      for (const item of request.items) {
        await this.inventoryService.reserveStock(item.productId, item.quantity);
      }
      
      // Step 5: Save order
      await this.orderRepository.save(order);
      console.log(`   ✓ Order #${order.id} saved`);
      
      // Step 6: Send confirmation email (async, doesn't block)
      this.emailService.sendOrderConfirmation(customer.email, order.id, order.getTotal())
        .catch(err => console.error('Failed to send email:', err));
      
      // Step 7: Return DTO (Data Transfer Object)
      const dto = this.mapToDTO(order, customer.name, productDetails);
      console.log(`   ✓ Order #${order.id} completed - Total: $${dto.total.toFixed(2)}`);
      
      return dto;
      
    } catch (error) {
      // Transaction rollback - would restore inventory, etc.
      console.error(`   ✗ Order creation failed: ${(error as Error).message}`);
      throw error;
    }
  }
  
  /**
   * Retrieves order details
   */
  async getOrder(orderId: number): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      return null;
    }
    
    const customer = await this.customerRepository.findById(order.customerId);
    if (!customer) {
      throw new Error('Customer not found for order');
    }
    
    // Fetch product details for each item
    const productDetails = await Promise.all(
      order.items.map(async item => {
        const product = await this.productRepository.findById(item.productId);
        return {
          id: item.productId,
          name: product?.name || 'Unknown',
          price: item.price
        };
      })
    );
    
    return this.mapToDTO(order, customer.name, productDetails);
  }
  
  /**
   * Gets all orders for a customer
   */
  async getCustomerOrders(customerId: number): Promise<OrderDTO[]> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }
    
    const orders = await this.orderRepository.findByCustomerId(customerId);
    
    // Map each order to DTO
    return Promise.all(
      orders.map(async order => {
        const productDetails = await Promise.all(
          order.items.map(async item => {
            const product = await this.productRepository.findById(item.productId);
            return {
              id: item.productId,
              name: product?.name || 'Unknown',
              price: item.price
            };
          })
        );
        return this.mapToDTO(order, customer.name, productDetails);
      })
    );
  }
  
  /**
   * Maps domain object to DTO
   * DTOs are used to transfer data across boundaries without exposing domain objects
   */
  private mapToDTO(
    order: Order,
    customerName: string,
    productDetails: Array<{ id: number; name: string; price: number }>
  ): OrderDTO {
    return {
      orderId: order.id,
      customerId: order.customerId,
      customerName,
      items: order.items.map(item => {
        const product = productDetails.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown',
          quantity: item.quantity,
          price: item.price,
          total: item.getTotal()
        };
      }),
      total: order.getTotal(),
      createdAt: order.createdAt
    };
  }
}

/**
 * Email Service - handles email notifications
 */
export interface EmailService {
  sendOrderConfirmation(email: string, orderId: number, total: number): Promise<void>;
}

export class ConsoleEmailService implements EmailService {
  async sendOrderConfirmation(email: string, orderId: number, total: number): Promise<void> {
    console.log(`   📧 Email sent to ${email}: Order #${orderId} confirmed ($${total.toFixed(2)})`);
  }
}

/**
 * Inventory Service - manages product stock
 */
export interface InventoryService {
  checkAvailability(productId: number, quantity: number): Promise<boolean>;
  reserveStock(productId: number, quantity: number): Promise<void>;
}

export class SimpleInventoryService implements InventoryService {
  constructor(private productRepository: ProductRepository) {}
  
  async checkAvailability(productId: number, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findById(productId);
    if (!product) return false;
    return product.stock >= quantity;
  }
  
  async reserveStock(productId: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for product ${productId}`);
    }
    
    // Reduce stock
    await this.productRepository.updateStock(productId, -quantity);
    console.log(`   ✓ Reserved ${quantity}x ${product.name}`);
  }
}
