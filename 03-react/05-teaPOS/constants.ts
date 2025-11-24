import { Category, Product, Topping } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '經典珍珠奶茶',
    price: 60,
    category: Category.MILK_TEA,
    description: '香醇錫蘭紅茶搭配Q彈珍珠，台灣經典風味。',
    imageUrl: 'https://picsum.photos/id/431/400/400'
  },
  {
    id: 'p2',
    name: '黑糖波霸鮮奶',
    price: 75,
    category: Category.MILK_TEA,
    description: '濃郁手炒黑糖與鮮乳的完美融合，無法抗拒。',
    imageUrl: 'https://picsum.photos/id/425/400/400'
  },
  {
    id: 'p3',
    name: '大甲芋頭鮮奶',
    price: 80,
    category: Category.PURE_TEA,
    description: '嚴選大甲芋頭，口感綿密，芋頭控必點。',
    imageUrl: 'https://picsum.photos/id/325/400/400'
  },
  {
    id: 'p4',
    name: '百香雙響炮',
    price: 65,
    category: Category.FRUIT_TEA,
    description: '新鮮百香果粒加上珍珠與椰果，口感豐富。',
    imageUrl: 'https://picsum.photos/id/102/400/400'
  },
  {
    id: 'p5',
    name: '四季春青茶',
    price: 40,
    category: Category.PURE_TEA,
    description: '南投四季春，茶湯金黃透亮，甘醇順口。',
    imageUrl: 'https://picsum.photos/id/225/400/400'
  },
  {
    id: 'p6',
    name: '葡萄柚綠茶',
    price: 70,
    category: Category.FRUIT_TEA,
    description: '滿滿新鮮葡萄柚果肉，清爽解膩首選。',
    imageUrl: 'https://picsum.photos/id/292/400/400'
  },
  {
    id: 'p7',
    name: '鐵觀音拿鐵',
    price: 65,
    category: Category.PURE_TEA,
    description: '重烘焙鐵觀音茶香與鮮奶的成熟大人味。',
    imageUrl: 'https://picsum.photos/id/493/400/400'
  },
  {
    id: 'p8',
    name: '靜岡抹茶拿鐵',
    price: 85,
    category: Category.PURE_TEA,
    description: '日本進口抹茶粉，苦甜適中，層次豐富。',
    imageUrl: 'https://picsum.photos/id/430/400/400'
  },
  {
    id: 'p9',
    name: '楊枝甘露',
    price: 90,
    category: Category.SPECIAL,
    description: '芒果、西米露、葡萄柚與椰奶的港式經典復刻。',
    imageUrl: 'https://picsum.photos/id/1080/400/400'
  },
  {
    id: 'p10',
    name: '金鑽鳳梨冰茶',
    price: 65,
    category: Category.FRUIT_TEA,
    description: '古早味鳳梨醬熬煮，酸甜開胃。',
    imageUrl: 'https://picsum.photos/id/106/400/400'
  },
  {
    id: 'p11',
    name: '冬瓜檸檬露',
    price: 55,
    category: Category.FRUIT_TEA,
    description: '手工熬煮冬瓜露配上新鮮檸檬汁，消暑聖品。',
    imageUrl: 'https://picsum.photos/id/401/400/400'
  },
  {
    id: 'p12',
    name: '阿薩姆紅茶',
    price: 35,
    category: Category.PURE_TEA,
    description: '印度阿薩姆產區，茶味濃厚，適合單喝或加奶。',
    imageUrl: 'https://picsum.photos/id/366/400/400'
  }
];

export const TOPPINGS: Topping[] = [
  { id: 't1', name: '珍珠', price: 10 },
  { id: 't2', name: '椰果', price: 10 },
  { id: 't3', name: '布丁', price: 15 },
  { id: 't4', name: '仙草', price: 10 },
  { id: 't5', name: '寒天', price: 15 },
  { id: 't6', name: '蘆薈', price: 15 },
];