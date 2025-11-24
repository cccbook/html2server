import { Product, Category, CartItem, DailyReport } from '../types';
import { PRODUCTS } from '../constants';

// Define window interface for sql.js
declare global {
  interface Window {
    initSqlJs: (config: any) => Promise<any>;
  }
}

class DatabaseService {
  private db: any = null;
  private SQL: any = null;
  private readonly DB_KEY = 'formosa_pos_sqlite_db';

  async init() {
    if (this.db) return;

    try {
      // Initialize SQL.js
      this.SQL = await window.initSqlJs({
        locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // Try to load existing DB from localStorage
      const savedDb = localStorage.getItem(this.DB_KEY);
      
      if (savedDb) {
        const binary = this.base64ToUint8Array(savedDb);
        this.db = new this.SQL.Database(binary);
        console.log("Loaded database from localStorage");
      } else {
        this.db = new this.SQL.Database();
        console.log("Created new database instance");
        this.initTables();
        this.seedProducts();
      }
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }

  private initTables() {
    // Create Products Table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        image_url TEXT
      );
    `);

    // Create Orders Table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        total_amount INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        items_json TEXT NOT NULL
      );
    `);
    
    this.save();
  }

  private seedProducts() {
    // Check if products exist
    const result = this.db.exec("SELECT count(*) as count FROM products");
    const count = result[0].values[0][0];

    if (count === 0) {
      console.log("Seeding products...");
      const stmt = this.db.prepare(`
        INSERT INTO products (id, name, price, category, description, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      PRODUCTS.forEach(p => {
        stmt.run([p.id, p.name, p.price, p.category, p.description, p.imageUrl]);
      });

      stmt.free();
      this.save();
    }
  }

  // --- Public API ---

  getAllProducts(): Product[] {
    if (!this.db) return [];
    
    const result = this.db.exec("SELECT * FROM products");
    if (result.length === 0) return [];

    const columns = result[0].columns;
    const values = result[0].values;

    return values.map((row: any[]) => {
      const product: any = {};
      columns.forEach((col: string, index: number) => {
        // Convert snake_case to camelCase for JS
        const key = col === 'image_url' ? 'imageUrl' : col;
        product[key] = row[index];
      });
      return product as Product;
    });
  }

  createOrder(items: CartItem[]): string {
    if (!this.db) throw new Error("Database not initialized");

    const orderId = 'ord_' + Date.now();
    const totalAmount = items.reduce((sum, item) => sum + item.finalPrice, 0);
    const createdAt = new Date().toISOString();
    const itemsJson = JSON.stringify(items);

    this.db.run(`
      INSERT INTO orders (id, total_amount, created_at, items_json)
      VALUES (?, ?, ?, ?)
    `, [orderId, totalAmount, createdAt, itemsJson]);

    this.save();
    return orderId;
  }

  getRecentOrders(limit: number = 5): any[] {
    if (!this.db) return [];
    
    const result = this.db.exec(`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT ${limit}
    `);

    if (result.length === 0) return [];

    return result[0].values.map((row: any[]) => ({
      id: row[0],
      totalAmount: row[1],
      createdAt: row[2],
      items: JSON.parse(row[3])
    }));
  }

  getDailyReport(): DailyReport {
    if (!this.db) {
      return { date: new Date().toLocaleDateString(), totalRevenue: 0, totalOrders: 0, orders: [] };
    }

    // Construct local start and end of day strings for comparison
    // Note: In a real app, date handling might need a library like date-fns, 
    // but here we use native Date to get ISO strings.
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startStr = start.toISOString();

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const endStr = end.toISOString();

    // Query orders within the current day range
    const result = this.db.exec(`
      SELECT * FROM orders 
      WHERE created_at >= '${startStr}' AND created_at <= '${endStr}'
      ORDER BY created_at DESC
    `);

    if (result.length === 0) {
       return { date: new Date().toLocaleDateString(), totalRevenue: 0, totalOrders: 0, orders: [] };
    }

    const orders = result[0].values.map((row: any[]) => ({
      id: row[0],
      totalAmount: row[1],
      createdAt: row[2],
      items: JSON.parse(row[3])
    }));

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);

    return {
      date: new Date().toLocaleDateString(),
      totalRevenue,
      totalOrders: orders.length,
      orders
    };
  }

  // --- Persistence Helper ---

  private save() {
    try {
      const binary = this.db.export();
      const base64 = this.uint8ArrayToBase64(binary);
      localStorage.setItem(this.DB_KEY, base64);
    } catch (e) {
      console.error("Failed to save DB to localStorage (likely quota exceeded)", e);
    }
  }

  private uint8ArrayToBase64(u8: Uint8Array): string {
    let binary = '';
    const len = u8.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    return window.btoa(binary);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export const db = new DatabaseService();