import React, { useState, useEffect } from 'react';
import { Product, Topping, SUGAR_LEVELS, ICE_LEVELS } from '../types';
import { TOPPINGS } from '../constants';

interface CustomizationModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (
    product: Product,
    sugar: string,
    ice: string,
    toppings: Topping[],
    quantity: number
  ) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm
}) => {
  const [sugar, setSugar] = useState(SUGAR_LEVELS[0]);
  const [ice, setIce] = useState(ICE_LEVELS[0]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (isOpen) {
      setSugar(SUGAR_LEVELS[0]);
      setIce(ICE_LEVELS[0]);
      setSelectedToppings([]);
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.find(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateTotal = () => {
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return (product.price + toppingsPrice) * quantity;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-500">基礎價格: ${product.price}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* Sugar Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-1 h-4 bg-orange-500 rounded-full mr-2"></span>
              甜度選擇
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {SUGAR_LEVELS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSugar(s)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    sugar === s 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200 ring-2 ring-orange-300' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
              冰塊選擇
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {ICE_LEVELS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIce(i)}
                  className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                    ice === i 
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-200 ring-2 ring-blue-300' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-1 h-4 bg-yellow-500 rounded-full mr-2"></span>
              加料配料
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {TOPPINGS.map((t) => {
                const isSelected = selectedToppings.some(st => st.id === t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${
                      isSelected 
                        ? 'bg-yellow-500 text-white shadow-md shadow-yellow-200 ring-2 ring-yellow-300' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-xs opacity-80">+${t.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div>
             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-1 h-4 bg-green-500 rounded-full mr-2"></span>
              數量
            </h3>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 font-bold text-lg"
              >
                -
              </button>
              <span className="text-2xl font-bold text-gray-800 w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-white">
          <button 
            onClick={() => onConfirm(product, sugar, ice, selectedToppings, quantity)}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg flex justify-between px-6 items-center"
          >
            <span>加入購物車</span>
            <span>${calculateTotal()}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomizationModal;