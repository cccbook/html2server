import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onRemoveItem, onClearCart, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

  if (cartItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <p className="text-lg font-medium">購物車是空的</p>
        <p className="text-sm">快去選購好喝的飲料吧！</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 text-lg flex items-center">
          <span className="mr-2">🛒</span> 訂單明細
          <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">{cartItems.length}</span>
        </h2>
        <button 
          onClick={onClearCart}
          className="text-xs text-red-500 hover:text-red-700 hover:underline px-2 py-1"
        >
          清空
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {cartItems.map((item) => (
          <div key={item.cartId} className="flex flex-col bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <span className="font-bold text-gray-900">${item.finalPrice}</span>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex flex-wrap gap-1">
                 <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.sugarLevel}</span>
                 <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.iceLevel}</span>
              </div>
              {item.selectedToppings.length > 0 && (
                 <div className="text-yellow-600">
                   + {item.selectedToppings.map(t => t.name).join(', ')}
                 </div>
              )}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                 <span className="text-gray-400">x {item.quantity}</span>
                 <button 
                    onClick={() => onRemoveItem(item.cartId)}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Remove"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4 text-gray-600">
           <span>小計</span>
           <span>${total}</span>
        </div>
        <div className="flex justify-between items-center mb-4 text-xl font-bold text-gray-900">
           <span>總金額</span>
           <span>${total}</span>
        </div>
        <button 
          onClick={onCheckout}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all transform hover:scale-[1.02] active:scale-95"
        >
          結帳收款
        </button>
      </div>
    </div>
  );
};

export default Cart;