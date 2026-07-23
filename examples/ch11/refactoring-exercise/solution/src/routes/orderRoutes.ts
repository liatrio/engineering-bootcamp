import { Request, Response, Router } from 'express';
import { OrderService } from '../services/OrderService';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { dbAll } from '../database';
import { Product } from '../domain/types';

/**
 * Create order routes
 * Thin HTTP layer that delegates to services
 * Demonstrates separation of concerns:
 * - Routes only handle HTTP request/response
 * - All business logic delegated to OrderService
 * - < 50 lines compared to 450+ in starter version
 */
export function createOrderRoutes(
  orderService: OrderService,
  orderRepository: IOrderRepository,
  productRepository: IProductRepository
): Router {
  const router = Router();

  // POST /orders - Create a new order
  router.post('/orders', async (req: Request, res: Response) => {
    try {
      const result = await orderService.createOrder(req.body);
      return res.status(201).json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Determine appropriate status code based on error message
      if (errorMessage.includes('not found')) {
        return res.status(404).json({ error: errorMessage });
      }
      if (errorMessage.includes('required') || 
          errorMessage.includes('must') || 
          errorMessage.includes('Insufficient') ||
          errorMessage.includes('Unsupported')) {
        return res.status(400).json({ error: errorMessage });
      }
      
      console.error('Error creating order:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        details: errorMessage
      });
    }
  });

  // GET /orders/:id - Get order details
  router.get('/orders/:id', async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);

      if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const order = await orderRepository.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const items = await orderRepository.findItemsByOrderId(orderId);

      return res.status(200).json({
        ...order,
        items,
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /products - List all products
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

  // GET /products/:id - Get product details
  router.get('/products/:id', async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);

      if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }

      const product = await productRepository.findById(productId);

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

  return router;
}
