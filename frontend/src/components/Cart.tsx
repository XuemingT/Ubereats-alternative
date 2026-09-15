import type { ProductPrice } from '../services/api';

interface CartProps {
  selectedProducts: { [key: number]: number };
  products: ProductPrice[];
  onRemoveProduct: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const Cart = ({ selectedProducts, products: _products, onRemoveProduct, onUpdateQuantity }: CartProps) => {
  const getProductInfo = (productId: number) => {
    const mockProducts = [
      { productId: 1, price: 12.99, name: "🍔 Classic Burger" },
      { productId: 2, price: 8.99, name: "🍕 Margherita Pizza" },
      { productId: 3, price: 6.99, name: "🍜 Chicken Noodles" },
      { productId: 4, price: 9.99, name: "🥗 Caesar Salad" },
      { productId: 5, price: 4.99, name: "🍟 French Fries" },
      { productId: 6, price: 3.99, name: "🥤 Cola" }
    ];
    return mockProducts.find(p => p.productId === productId);
  };

  const getTotalPrice = () => {
    return Object.entries(selectedProducts).reduce((total, [productId, quantity]) => {
      const product = getProductInfo(parseInt(productId));
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedProducts).reduce((total, quantity) => total + quantity, 0);
  };

  const cartItems = Object.entries(selectedProducts).filter(([_, quantity]) => quantity > 0);

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛒 Your Cart</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <p className="text-gray-400 text-sm">Add some delicious food to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {getTotalItems()} items
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        {cartItems.map(([productId, quantity]) => {
          const product = getProductInfo(parseInt(productId));
          if (!product) return null;
          
          return (
            <div key={productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600">${product.price} each</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(parseInt(productId), Math.max(0, quantity - 1))}
                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-sm"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(parseInt(productId), quantity + 1)}
                  className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white text-sm"
                >
                  +
                </button>
              </div>
              
              <div className="text-right ml-4">
                <p className="font-semibold text-gray-800">${(product.price * quantity).toFixed(2)}</p>
                <button
                  onClick={() => onRemoveProduct(parseInt(productId))}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
