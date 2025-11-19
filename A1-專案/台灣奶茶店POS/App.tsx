import React, { useState, useMemo, useEffect } from 'react';
import { Category, Product, CartItem, Topping, DailyReport } from './types';
import ProductCard from './components/ProductCard';
import CustomizationModal from './components/CustomizationModal';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import ReportModal from './components/ReportModal';
import { getAIRecommendation } from './services/geminiService';
import { db } from './services/database';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDbReady, setIsDbReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [recentOrderCount, setRecentOrderCount] = useState(0);

  // Initialize Database
  useEffect(() => {
    const init = async () => {
      try {
        await db.init();
        const loadedProducts = db.getAllProducts();
        setProducts(loadedProducts);
        
        // Check for recent orders just to show connectivity
        const orders = db.getRecentOrders(1);
        if (orders.length > 0) {
          setRecentOrderCount(orders.length);
        }
        
        setIsDbReady(true);
      } catch (e) {
        console.error("DB Initialization failed", e);
        alert("資料庫初始化失敗，請重新整理頁面");
      }
    };
    init();
  }, []);

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  // Handle clicking a product to open customization
  const handleProductClick = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  // Handle confirming customization
  const handleAddToCart = (
    product: Product,
    sugar: string,
    ice: string,
    toppings: Topping[],
    quantity: number
  ) => {
    const toppingsPrice = toppings.reduce((sum, t) => sum + t.price, 0);
    const finalPrice = (product.price + toppingsPrice) * quantity;

    const newItem: CartItem = {
      ...product,
      cartId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sugarLevel: sugar,
      iceLevel: ice,
      selectedToppings: toppings,
      quantity,
      finalPrice,
    };

    setCartItems([...cartItems, newItem]);
    setIsModalOpen(false);
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems(cartItems.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    if(window.confirm('確定要清空購物車嗎？')) {
      setCartItems([]);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = () => {
    // Save to SQLite
    try {
      const orderId = db.createOrder(cartItems);
      console.log(`Order ${orderId} saved to SQLite`);
      
      setIsCheckoutModalOpen(false);
      setCartItems([]);
      setAiSuggestion('');
      
      // Refresh recent orders check
      const orders = db.getRecentOrders();
      setRecentOrderCount(orders.length);
      
      alert(`訂單 ${orderId} 已成功儲存至資料庫！`);
    } catch (error) {
      console.error("Checkout error", error);
      alert("結帳失敗：資料庫寫入錯誤");
    }
  };

  const handleShowReport = () => {
    const report = db.getDailyReport();
    setDailyReport(report);
    setIsReportModalOpen(true);
  };

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiSuggestion('');
    const suggestion = await getAIRecommendation();
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-bold">正在初始化 SQLite 資料庫...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">F</div>
           <div>
             <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Formosa Tea POS</h1>
             <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded-md">SQLite Connected</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShowReport}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            本日報表
          </button>
          <button 
            onClick={handleAskAI}
            disabled={isAiLoading}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isAiLoading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>AI 智慧推薦</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Menu (2/3 width on lg screens) */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
          
          {/* AI Suggestion Banner */}
          {aiSuggestion && (
            <div className="bg-indigo-50 border-b border-indigo-100 p-4 animate-fade-in-down">
              <div className="max-w-4xl mx-auto flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div className="flex-1">
                   <p className="text-indigo-900 whitespace-pre-line font-medium">{aiSuggestion}</p>
                </div>
                <button onClick={() => setAiSuggestion('')} className="text-indigo-400 hover:text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="px-6 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-gray-200 bg-white">
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                全部商品
              </button>
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={handleProductClick} 
                />
              ))}
            </div>
            {filteredProducts.length === 0 && (
               <div className="text-center text-gray-500 mt-20">此分類暫無商品</div>
            )}
          </div>
        </div>

        {/* Right Side: Cart (1/3 width on lg screens) - Fixed Sidebar */}
        <div className="w-full lg:w-[400px] border-l border-gray-200 bg-white z-20 hidden lg:block shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <Cart 
            cartItems={cartItems} 
            onRemoveItem={handleRemoveItem} 
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
        
        {/* Mobile Cart Drawer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
           <div className="flex justify-between items-center mb-3">
              <span className="font-bold">{cartItems.length} 項商品</span>
              <span className="font-bold text-orange-600">${cartItems.reduce((sum, i) => sum + i.finalPrice, 0)}</span>
           </div>
           <button 
             onClick={handleCheckout}
             className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold"
           >
             查看購物車 / 結帳
           </button>
        </div>

      </main>

      {/* Modals */}
      <CustomizationModal
        isOpen={isModalOpen}
        product={currentProduct}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddToCart}
      />

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        items={cartItems}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        reportData={dailyReport}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default App;