import express from 'express';
import './database'; // Import to establish database connection
import { OrderRepository } from './repositories/OrderRepository';
import { ProductRepository } from './repositories/ProductRepository';
import { PaymentStrategyFactory } from './factories/PaymentStrategyFactory';
import { ShippingStrategyFactory } from './factories/ShippingStrategyFactory';
import { ValidationService } from './services/ValidationService';
import { InventoryService } from './services/InventoryService';
import { OrderService } from './services/OrderService';
import { createOrderRoutes } from './routes/orderRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ============================================================================
// DEPENDENCY INJECTION WIRING
// This section demonstrates proper dependency injection:
// - Creates all dependencies in the correct order
// - Injects dependencies into constructors (Dependency Inversion Principle)
// - Makes dependencies explicit and testable
// ============================================================================

// Data access layer - repositories (no constructor params needed - use dbHelper functions)
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();

// Strategy factories (no dependencies)
const paymentFactory = new PaymentStrategyFactory();
const shippingFactory = new ShippingStrategyFactory();

// Services - validation and inventory (depend on repositories)
const validationService = new ValidationService();
const inventoryService = new InventoryService(productRepository);

// Main service - orchestrates everything (depends on all above)
const orderService = new OrderService(
  orderRepository,
  productRepository,
  paymentFactory,
  shippingFactory,
  validationService,
  inventoryService
);

// HTTP layer - routes (depend on services and repositories)
const orderRoutes = createOrderRoutes(orderService, orderRepository, productRepository);

// Wire routes to app
app.use('/api', orderRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Only start server if this file is run directly (not during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
