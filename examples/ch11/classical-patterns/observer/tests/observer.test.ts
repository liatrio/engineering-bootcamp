/**
 * Unit tests for Observer Pattern implementation
 */

import { StockPrice } from '../src/subject';
import { ChartDisplay, TableDisplay, AlertSystem, Logger, Observer } from '../src/observer';

describe('Observer Pattern', () => {
  describe('StockPrice (Subject)', () => {
    it('should create with initial price', () => {
      const stock = new StockPrice('AAPL', 150.00);
      expect(stock.getSymbol()).toBe('AAPL');
      expect(stock.getPrice()).toBe(150.00);
    });

    it('should attach observers', () => {
      const stock = new StockPrice('AAPL', 150.00);
      const observer = new ChartDisplay();
      
      stock.attach(observer);
      expect(stock.getObserverCount()).toBe(1);
    });

    it('should not attach same observer twice', () => {
      const stock = new StockPrice('AAPL', 150.00);
      const observer = new ChartDisplay();
      
      stock.attach(observer);
      stock.attach(observer);
      expect(stock.getObserverCount()).toBe(1);
    });

    it('should detach observers', () => {
      const stock = new StockPrice('AAPL', 150.00);
      const observer = new ChartDisplay();
      
      stock.attach(observer);
      stock.detach(observer);
      expect(stock.getObserverCount()).toBe(0);
    });

    it('should update price and notify observers', () => {
      const stock = new StockPrice('AAPL', 150.00);
      const observer = new ChartDisplay();
      const updateSpy = jest.spyOn(observer, 'update');
      
      stock.attach(observer);
      stock.setPrice(155.00);
      
      expect(stock.getPrice()).toBe(155.00);
      expect(updateSpy).toHaveBeenCalledWith(155.00);
    });

    it('should throw error for negative price', () => {
      const stock = new StockPrice('AAPL', 150.00);
      expect(() => stock.setPrice(-10)).toThrow('Price cannot be negative');
    });
  });

  describe('ChartDisplay (Observer)', () => {
    it('should update with new price', () => {
      const chart = new ChartDisplay('Test Chart');
      chart.update(150.00);
      
      const history = chart.getHistory();
      expect(history).toEqual([150.00]);
    });

    it('should maintain price history', () => {
      const chart = new ChartDisplay();
      chart.update(150.00);
      chart.update(155.00);
      chart.update(160.00);
      
      const history = chart.getHistory();
      expect(history).toEqual([150.00, 155.00, 160.00]);
    });

    it('should return observer name', () => {
      const chart = new ChartDisplay('My Chart');
      expect(chart.getName()).toBe('My Chart');
    });
  });

  describe('TableDisplay (Observer)', () => {
    it('should track update count', () => {
      const table = new TableDisplay();
      expect(table.getUpdateCount()).toBe(0);
      
      table.update(150.00);
      expect(table.getUpdateCount()).toBe(1);
      
      table.update(155.00);
      expect(table.getUpdateCount()).toBe(2);
    });
  });

  describe('AlertSystem (Observer)', () => {
    it('should trigger alert when price exceeds threshold', () => {
      const alert = new AlertSystem(180.00);
      expect(alert.getAlerts()).toHaveLength(0);
      
      alert.update(185.00);  // Above threshold
      expect(alert.getAlerts()).toHaveLength(1);
    });

    it('should not trigger alert when price is below threshold', () => {
      const alert = new AlertSystem(180.00);
      alert.update(175.00);  // Below threshold
      
      expect(alert.getAlerts()).toHaveLength(0);
    });

    it('should return threshold', () => {
      const alert = new AlertSystem(180.00);
      expect(alert.getThreshold()).toBe(180.00);
    });
  });

  describe('Logger (Observer)', () => {
    it('should log price updates', () => {
      const logger = new Logger();
      logger.update(150.00);
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toContain('150.00');
    });

    it('should maintain log history', () => {
      const logger = new Logger();
      logger.update(150.00);
      logger.update(155.00);
      logger.update(160.00);
      
      expect(logger.getLogs()).toHaveLength(3);
    });
  });

  describe('Observer Pattern Integration', () => {
    it('should notify all observers when price changes', () => {
      const stock = new StockPrice('AAPL', 150.00);
      const chart = new ChartDisplay();
      const table = new TableDisplay();
      const alert = new AlertSystem(180.00);
      
      stock.attach(chart);
      stock.attach(table);
      stock.attach(alert);
      
      stock.setPrice(155.00);
      
      expect(chart.getHistory()).toContain(155.00);
      expect(table.getUpdateCount()).toBe(1);
    });

    it('should not notify detached observers', () => {
      const stock = new StockPrice('AAPL', 150.00);
      const observer = new ChartDisplay();
      const updateSpy = jest.spyOn(observer, 'update');
      
      stock.attach(observer);
      stock.detach(observer);
      stock.setPrice(155.00);
      
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should allow dynamic observer management', () => {
      const stock = new StockPrice('AAPL', 150.00);
      const observer1 = new ChartDisplay('Chart 1');
      const observer2 = new ChartDisplay('Chart 2');
      
      stock.attach(observer1);
      expect(stock.getObserverCount()).toBe(1);
      
      stock.attach(observer2);
      expect(stock.getObserverCount()).toBe(2);
      
      stock.detach(observer1);
      expect(stock.getObserverCount()).toBe(1);
      expect(stock.getObserverNames()).toEqual(['Chart 2']);
    });
  });

  describe('Dependency Inversion Principle', () => {
    it('should accept any observer implementing the interface', () => {
      // This test demonstrates DIP: StockPrice depends on Observer interface
      class CustomObserver implements Observer {
        private updated = false;
        
        update(price: number): void {
          this.updated = true;
        }
        
        getName(): string {
          return 'Custom Observer';
        }
        
        wasUpdated(): boolean {
          return this.updated;
        }
      }
      
      const stock = new StockPrice('AAPL', 150.00);
      const custom = new CustomObserver();
      
      stock.attach(custom);
      stock.setPrice(155.00);
      
      expect(custom.wasUpdated()).toBe(true);
      // StockPrice works with ANY Observer implementation without modification
    });
  });
});
