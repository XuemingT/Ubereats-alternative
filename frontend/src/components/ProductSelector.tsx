import { useState, useEffect } from 'react';

interface ProductSelectorProps {
  onProductSelect: (productId: number, quantity: number) => void;
  selectedProducts: { [key: number]: number };
}

const ProductSelector = ({ onProductSelect, selectedProducts }: ProductSelectorProps) => {
  const [loading, setLoading] = useState(true);

  // Mock product data for demonstration
  const mockProducts = [
    { productId: 1, price: 12.99, name: "🍔 Classic Burger", description: "Juicy beef patty with fresh lettuce and tomato" },
    { productId: 2, price: 8.99, name: "🍕 Margherita Pizza", description: "Fresh mozzarella, tomato sauce, and basil" },
    { productId: 3, price: 6.99, name: "🍜 Chicken Noodles", description: "Tender chicken with egg noodles in savory broth" },
    { productId: 4, price: 9.99, name: "🥗 Caesar Salad", description: "Crisp romaine lettuce with parmesan and croutons" },
    { productId: 5, price: 4.99, name: "🍟 French Fries", description: "Golden crispy fries with sea salt" },
    { productId: 6, price: 3.99, name: "🥤 Cola", description: "Refreshing cola drink" }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleQuantityChange = (productId: number, quantity: number) => {
    onProductSelect(productId, quantity);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🍽️ Restaurant Menu</h2>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🍽️ Restaurant Menu</h2>
      <div className="space-y-4">
        {mockProducts.map((product) => (
          <div key={product.productId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </div>
              <span className="text-lg font-bold text-green-600">${product.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(product.productId, Math.max(0, (selectedProducts[product.productId] || 0) - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">
                  {selectedProducts[product.productId] || 0}
                </span>
                <button
                  onClick={() => handleQuantityChange(product.productId, (selectedProducts[product.productId] || 0) + 1)}
                  className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Total: ${((selectedProducts[product.productId] || 0) * product.price).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSelector;
