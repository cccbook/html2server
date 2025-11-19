import React from 'react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onConfirm: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, items, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">結帳確認</h2>
            <p className="text-gray-400 text-sm">請確認訂單內容與金額</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Body - Order Summary */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <h3 className="text-gray-500 text-xs font-bold mb-3 uppercase tracking-wider border-b border-gray-100 pb-2">消費明細</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.cartId} className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-800 text-sm">
                      {item.name} <span className="text-gray-400 text-xs ml-1">x{item.quantity}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.sugarLevel} / {item.iceLevel}
                      {item.selectedToppings.length > 0 && (
                        <span className="text-yellow-600 block">
                          + {item.selectedToppings.map(t => t.name).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-gray-700 text-sm">${item.finalPrice}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span className="text-gray-600 font-medium">總計</span>
              <span className="text-xl font-bold text-gray-900">${total}</span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
             <div className="flex items-center gap-3">
               <div className="bg-orange-100 p-2 rounded-full">
                 <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               </div>
               <div>
                 <p className="text-orange-800 font-bold text-sm">應收金額</p>
                 <p className="text-2xl font-bold text-orange-600">${total}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="p-5 border-t border-gray-100 bg-white flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
          >
            返回修改
          </button>
          <button 
            onClick={onConfirm}
            className="flex-[2] bg-gray-900 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            收款完成 (下一位)
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;