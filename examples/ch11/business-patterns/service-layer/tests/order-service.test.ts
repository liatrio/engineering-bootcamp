import {
  OrderService,
  ConsoleEmailService,
  SimpleInventoryService,
  CreateOrderRequest
} from '../src/services/order-service';
import {
  InMemoryOrderRepository,
  InMemoryProductRepository,
  InMemoryCustomerRepository
} from '../src/repositories/repositories';

describe('Service Layer - Order Service', () => {
  let orderService: OrderService;
  let orderRepo: InMemoryOrderRepository;
  let productRepo: InMemoryProductRepository;
  let customerRepo: InMemoryCustomerRepository;
  
  beforeEach(() => {
    // Setup fresh dependencies for each test
    orderRepo = new InMemoryOrderRepository();
    productRepo = new InMemoryProductRepository();
    customerRepo = new InMemoryCustomerRepository();
    const emailService = new ConsoleEmailService();
    const inventoryService = new SimpleInventoryService(productRepo);
    
    orderService = new OrderService(
      orderRepo,
      productRepo,
      customerRepo,
      emailService,
      inventoryService
    );
  });
  
  describe('createOrder', () => {
    it('should create valid order successfully', async () => {
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 2 }
        ]
      };
      
      const result = await orderService.createOrder(request);
      
      expect(result.orderId).toBeGreaterThan(0);
      expect(result.customerId).toBe(101);
      expect(result.customerName).toBe('Alice Johnson');
      expect(result.items.length).toBe(2);
      expect(result.total).toBeGreaterThan(0);
    });
    
    it('should calculate total correctly', async () => {
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [
          { productId: 1, quantity: 1 } // Laptop: $999.99
        ]
      };
      
      const result = await orderService.createOrder(request);
      
      expect(result.total).toBeCloseTo(999.99, 2);
    });
    
    it('should reject order for non-existent customer', async () => {
      const request: CreateOrderRequest = {
        customerId: 999,
        items: [{ productId: 1, quantity: 1 }]
      };
      
      await expect(orderService.createOrder(request)).rejects.toThrow('Customer 999 not found');
    });
    
    it('should reject order with non-existent product', async () => {
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [{ productId: 999, quantity: 1 }]
      };
      
      await expect(orderService.createOrder(request)).rejects.toThrow('Product 999 not found');
    });
    
    it('should reject order with insufficient stock', async () => {
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [{ productId: 1, quantity: 1000 }] // More than available stock
      };
      
      await expect(orderService.createOrder(request)).rejects.toThrow('Insufficient stock');
    });
    
    it('should reserve inventory when order is created', async () => {
      const productBefore = await productRepo.findById(1);
      const initialStock = productBefore!.stock;
      
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [{ productId: 1, quantity: 2 }]
      };
      
      await orderService.createOrder(request);
      
      const productAfter = await productRepo.findById(1);
      expect(productAfter!.stock).toBe(initialStock - 2);
    });
    
    it('should create multiple orders independently', async () => {
      const request1: CreateOrderRequest = {
        customerId: 101,
        items: [{ productId: 1, quantity: 1 }]
      };
      
      const request2: CreateOrderRequest = {
        customerId: 102,
        items: [{ productId: 2, quantity: 1 }]
      };
      
      const order1 = await orderService.createOrder(request1);
      const order2 = await orderService.createOrder(request2);
      
      expect(order1.orderId).not.toBe(order2.orderId);
      expect(order1.customerId).not.toBe(order2.customerId);
    });
  });
  
  describe('getOrder', () => {
    it('should retrieve created order', async () => {
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [{ productId: 1, quantity: 1 }]
      };
      
      const created = await orderService.createOrder(request);
      const retrieved = await orderService.getOrder(created.orderId);
      
      expect(retrieved).not.toBeNull();
      expect(retrieved!.orderId).toBe(created.orderId);
      expect(retrieved!.total).toBeCloseTo(created.total, 2);
    });
    
    it('should return null for non-existent order', async () => {
      const result = await orderService.getOrder(999);
      expect(result).toBeNull();
    });
    
    it('should include product details in retrieved order', async () => {
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [{ productId: 1, quantity: 1 }]
      };
      
      const created = await orderService.createOrder(request);
      const retrieved = await orderService.getOrder(created.orderId);
      
      expect(retrieved!.items[0].productName).toBe('Laptop');
      expect(retrieved!.items[0].price).toBeCloseTo(999.99, 2);
    });
  });
  
  describe('getCustomerOrders', () => {
    it('should retrieve all orders for a customer', async () => {
      // Create two orders for the same customer
      await orderService.createOrder({
        customerId: 101,
        items: [{ productId: 1, quantity: 1 }]
      });
      
      await orderService.createOrder({
        customerId: 101,
        items: [{ productId: 2, quantity: 1 }]
      });
      
      const orders = await orderService.getCustomerOrders(101);
      
      expect(orders.length).toBe(2);
      expect(orders.every(o => o.customerId === 101)).toBe(true);
    });
    
    it('should return empty array for customer with no orders', async () => {
      const orders = await orderService.getCustomerOrders(103);
      expect(orders.length).toBe(0);
    });
    
    it('should reject request for non-existent customer', async () => {
      await expect(orderService.getCustomerOrders(999)).rejects.toThrow('Customer 999 not found');
    });
  });
  
  describe('Transaction boundaries', () => {
    it('should not save order if inventory check fails', async () => {
      const request: CreateOrderRequest = {
        customerId: 101,
        items: [{ productId: 1, quantity: 1000 }]
      };
      
      try {
        await orderService.createOrder(request);
      } catch (error) {
        // Expected to fail
      }
      
      // Order should not be saved
      const orders = await orderService.getCustomerOrders(101);
      expect(orders.length).toBe(0);
    });
  });
});
