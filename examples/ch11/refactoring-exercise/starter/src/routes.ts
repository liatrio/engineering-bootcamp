import { Request, Response, Router } from 'express';
import { dbRun, dbGet, dbAll } from './database';
import { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  Product, 
  Customer,
  OrderItem 
} from './types';

const router = Router();

// ============================================================================
// POST /orders - Create a new order
// THIS IS A GOD OBJECT - VIOLATES MULTIPLE SOLID PRINCIPLES
// This single endpoint handler contains ALL business logic:
// - Input validation
// - Database queries
// - Payment processing logic
// - Shipping calculation logic
// - Inventory management
// - Response formatting
// ============================================================================
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const orderRequest: CreateOrderRequest = req.body;

    // ========================================================================
    // VALIDATION LOGIC (Lines 28-68)
    // Anti-pattern: Validation mixed with business logic
    // Should be: Separate ValidationService
    // ========================================================================
    
    // Validate customer_id
    if (!orderRequest.customer_id) {
      return res.status(400).json({ error: 'customer_id is required' });
    }

    // Validate items
    if (!orderRequest.items || !Array.isArray(orderRequest.items) || orderRequest.items.length === 0) {
      return res.status(400).json({ error: 'items array is required and must not be empty' });
    }

    // Validate each item
    for (const item of orderRequest.items) {
      if (!item.product_id || typeof item.product_id !== 'number') {
        return res.status(400).json({ error: 'Each item must have a valid product_id' });
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ error: 'Each item must have a valid quantity greater than 0' });
      }
    }

    // Validate payment_type
    const validPaymentTypes = ['credit_card', 'paypal', 'bitcoin'];
    if (!orderRequest.payment_type || !validPaymentTypes.includes(orderRequest.payment_type)) {
      return res.status(400).json({ 
        error: 'payment_type must be one of: credit_card, paypal, bitcoin' 
      });
    }

    // Validate shipping_method
    const validShippingMethods = ['standard', 'express', 'overnight'];
    if (!orderRequest.shipping_method || !validShippingMethods.includes(orderRequest.shipping_method)) {
      return res.status(400).json({ 
        error: 'shipping_method must be one of: standard, express, overnight' 
      });
    }

    // ========================================================================
    // DATABASE QUERIES - CUSTOMER VERIFICATION (Lines 72-80)
    // Anti-pattern: Direct database access in route handler
    // Violates: DIP (depends on concrete SQLite), SRP (data access + business logic)
    // Should be: CustomerRepository with interface
    // ========================================================================
    
    const customer = await dbGet<Customer>(
      'SELECT * FROM customers WHERE id = ?',
      [orderRequest.customer_id]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // ========================================================================
    // INVENTORY CHECKING LOGIC (Lines 84-140)
    // Anti-pattern: Mixed concerns - data access + business logic
    // Violates: SRP (too many responsibilities), DIP (direct DB dependency)
    // Should be: InventoryService + ProductRepository
    // ========================================================================
    
    const itemsWithDetails: Array<{
      product_id: number;
      quantity: number;
      price: number;
      name: string;
      available_stock: number;
    }> = [];

    let subtotal = 0;

    // Check stock and calculate subtotal
    for (const item of orderRequest.items) {
      const product = await dbGet<Product>(
        'SELECT * FROM products WHERE id = ?',
        [item.product_id]
      );

      if (!product) {
        return res.status(404).json({ 
          error: `Product with id ${item.product_id} not found` 
        });
      }

      // Check if enough stock is available
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
        });
      }

      itemsWithDetails.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        available_stock: product.stock_quantity
      });

      subtotal += product.price * item.quantity;
    }

    // Round subtotal to 2 decimal places
    subtotal = Math.round(subtotal * 100) / 100;

    // ========================================================================
    // PAYMENT FEE CALCULATION (Lines 144-172)
    // Anti-pattern: if/else chain for type checking
    // Violates: OCP (must modify to add new payment type), SRP
    // Should be: Strategy Pattern with PaymentStrategy interface
    // CODE SMELL: This is a "type code" smell - perfect for Strategy Pattern
    // ========================================================================
    
    let paymentFee = 0;
    
    if (orderRequest.payment_type === 'credit_card') {
      // Credit card charges 3% fee
      paymentFee = subtotal * 0.03;
    } else if (orderRequest.payment_type === 'paypal') {
      // PayPal charges 3.5% fee
      paymentFee = subtotal * 0.035;
    } else if (orderRequest.payment_type === 'bitcoin') {
      // Bitcoin charges flat $1.50 fee
      paymentFee = 1.50;
    } else {
      // This should never happen due to validation above, but defensive programming
      return res.status(400).json({ 
        error: 'Invalid payment type' 
      });
    }

    // Round payment fee to 2 decimal places
    paymentFee = Math.round(paymentFee * 100) / 100;

    // ========================================================================
    // SHIPPING COST CALCULATION (Lines 176-214)
    // Anti-pattern: Another if/else chain for type checking
    // Violates: OCP (must modify to add new shipping method), SRP
    // Should be: Strategy Pattern with ShippingStrategy interface
    // CODE SMELL: Duplicate pattern - same problem as payment fee calculation
    // ========================================================================
    
    let shippingCost = 0;
    let shippingDays = 0;

    if (orderRequest.shipping_method === 'standard') {
      // Standard shipping: $5.99, 7 days
      shippingCost = 5.99;
      shippingDays = 7;
    } else if (orderRequest.shipping_method === 'express') {
      // Express shipping: $12.99, 3 days
      shippingCost = 12.99;
      shippingDays = 3;
    } else if (orderRequest.shipping_method === 'overnight') {
      // Overnight shipping: $24.99, 1 day
      shippingCost = 24.99;
      shippingDays = 1;
    } else {
      // This should never happen due to validation above, but defensive programming
      return res.status(400).json({ 
        error: 'Invalid shipping method' 
      });
    }

    // ========================================================================
    // TOTAL CALCULATION (Lines 218-220)
    // Business logic mixed with everything else
    // ========================================================================
    
    const total = Math.round((subtotal + paymentFee + shippingCost) * 100) / 100;

    // ========================================================================
    // DATABASE TRANSACTION - ORDER CREATION (Lines 224-266)
    // Anti-pattern: Complex database operations in route handler
    // Violates: SRP, DIP (direct database dependency)
    // Should be: OrderRepository.create() method
    // PROBLEM: No transaction management - partial failures could corrupt data
    // ========================================================================
    
    // Create the order record
    const orderResult = await dbRun(
      `INSERT INTO orders 
       (customer_id, status, payment_type, payment_fee, shipping_method, 
        shipping_cost, shipping_days, subtotal, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderRequest.customer_id,
        'confirmed',
        orderRequest.payment_type,
        paymentFee,
        orderRequest.shipping_method,
        shippingCost,
        shippingDays,
        subtotal,
        total
      ]
    );

    const orderId = orderResult.lastID;

    // Create order_items records
    for (const item of itemsWithDetails) {
      await dbRun(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price_at_order)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // ========================================================================
    // INVENTORY DECREMENT LOGIC (Lines 270-282)
    // Anti-pattern: Data mutation logic in route handler
    // Violates: SRP (inventory management shouldn't be here)
    // Should be: InventoryService.decrementStock() method
    // PROBLEM: No rollback mechanism if this fails after order creation
    // ========================================================================
    
    // Decrement stock for each product
    for (const item of itemsWithDetails) {
      await dbRun(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // ========================================================================
    // RESPONSE FORMATTING (Lines 286-304)
    // Anti-pattern: Response formatting mixed with business logic
    // Violates: SRP (formatting shouldn't be in business logic)
    // Should be: Separate response formatting layer or serializer
    // ========================================================================
    
    const response: CreateOrderResponse = {
      order_id: orderId,
      customer_id: orderRequest.customer_id,
      items: itemsWithDetails.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      payment_fee: paymentFee,
      shipping_cost: shippingCost,
      shipping_days: shippingDays,
      total,
      status: 'confirmed'
    };

    return res.status(201).json(response);

  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// GET /orders/:id - Get order details
// Anti-pattern: Direct database queries in route handler
// Less egregious than POST, but still violates SRP and DIP
// ============================================================================
router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await dbGet(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await dbAll<OrderItem>(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    return res.status(200).json({
      ...order,
      items
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// GET /products - List all products
// Anti-pattern: Direct database query in route handler
// ============================================================================
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await dbAll<Product>(
      'SELECT * FROM products WHERE stock_quantity > 0 ORDER BY name'
    );

    return res.status(200).json({ products });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// GET /products/:id - Get product details
// Anti-pattern: Direct database query in route handler
// ============================================================================
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await dbGet<Product>(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
