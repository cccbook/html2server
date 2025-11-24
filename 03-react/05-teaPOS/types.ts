export enum Category {
  MILK_TEA = '奶茶系列',
  FRUIT_TEA = '鮮果茶飲',
  PURE_TEA = '純茶/拿鐵',
  SPECIAL = '特調/冰沙'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  imageUrl: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  cartId: string;
  sugarLevel: string;
  iceLevel: string;
  selectedToppings: Topping[];
  finalPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  totalAmount: number;
  createdAt: string;
  items: CartItem[]; // Parsed from JSON
}

export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  orders: Order[];
}

export const SUGAR_LEVELS = ['正常糖 (100%)', '少糖 (80%)', '半糖 (50%)', '微糖 (30%)', '無糖 (0%)'];
export const ICE_LEVELS = ['正常冰', '少冰', '微冰', '去冰', '完全去冰', '溫', '熱'];

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}