/**
 * Domain Objects for Service Layer Example
 */

export class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number
  ) {}
}

export class Customer {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string
  ) {}
}

export class OrderItem {
  constructor(
    public readonly productId: number,
    public readonly quantity: number,
    public readonly price: number
  ) {}
  
  getTotal(): number {
    return this.price * this.quantity;
  }
}

export class Order {
  constructor(
    public readonly id: number,
    public readonly customerId: number,
    public readonly items: OrderItem[],
    public readonly createdAt: Date = new Date()
  ) {}
  
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.getTotal(), 0);
  }
}
