import { db } from '../src/database';
import fs from 'fs';
import path from 'path';

// Setup function to reset database before each test
export async function setupDatabase(): Promise<void> {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  // Split by semicolon and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    await new Promise<void>((resolve, reject) => {
      db.run(statement, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Global test setup
beforeEach(async () => {
  // Reset database to clean state before each test
  await setupDatabase();
});

// Global teardown
afterAll((done) => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    done();
  });
});
