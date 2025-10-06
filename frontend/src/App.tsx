/**
 * UberEats Alternative - Modern Food Delivery Platform
 * 
 * Frontend built on React + TypeScript + Tailwind CSS
 * Backend microservices architecture based on original work by Samet YILDIZ
 * 
 * Original Author: Samet YILDIZ (@harchiki)
 * Original Repository: https://github.com/harchiki/order-management
 * 
 * Enhanced by: Xueming Tang (@XuemingT)
 */

import React, { useState, useEffect } from 'react';
import { OrderApiService, ProductPrice, PaymentType } from './services/api';
import ProductSelector from './components/ProductSelector';
import Cart from './components/Cart';
import DiscountCode from './components/DiscountCode';
import PaymentMethod from './components/PaymentMethod';
import OrderSummary from './components/OrderSummary';
import { ProductRequest } from './services/api';

function App() {
  const [products, setProducts] = useState<ProductPrice[]>([]);
  const [cart, setCart] = useState<ProductRequest[]>([]);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CREDIT_CARD);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 加载产品价格
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productIds = [1, 2, 3]; // 根据你的API，这些是现有的产品ID
        const productPrices = await OrderApiService.getProductPrices(productIds);
        setProducts(productPrices);
      } catch (error) {
        console.error('加载产品失败:', error);
      }
    };

    loadProducts();
  }, []);

  // 添加到购物车
  const addToCart = (productId: number, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity }];
      }
    });
  };

  // 从购物车移除
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  // 更新购物车数量
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // 提交订单
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert('购物车为空，请先添加商品');
      return;
    }

    setLoading(true);
    try {
      const orderRequest = {
        cart,
        discountCode: discountCode || undefined,
        paymentType,
      };

      const result = await OrderApiService.createOrder(orderRequest);
      setOrderResult(result);
      alert('订单创建成功！');
    } catch (error) {
      console.error('订单创建失败:', error);
      alert('订单创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">🍔 UberEats Alternative</h1>
          <p className="mt-2 text-lg text-gray-600">Modern food delivery platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：产品选择和购物车 */}
          <div className="lg:col-span-2 space-y-6">
            <ProductSelector
              products={products}
              onAddToCart={addToCart}
            />
            
            <Cart
              cart={cart}
              products={products}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
            />
          </div>

          {/* 右侧：订单信息 */}
          <div className="space-y-6">
            <DiscountCode
              value={discountCode}
              onChange={setDiscountCode}
            />

            <PaymentMethod
              value={paymentType}
              onChange={setPaymentType}
            />

            <OrderSummary
              cart={cart}
              products={products}
              discountCode={discountCode}
              paymentType={paymentType}
              onSubmit={handleSubmitOrder}
              loading={loading}
            />

            {orderResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">订单创建成功</h3>
                <div className="text-sm text-green-700">
                  <p><strong>订单ID:</strong> {orderResult.orderId}</p>
                  <p><strong>状态:</strong> {orderResult.status}</p>
                  {orderResult.discountCode && (
                    <p><strong>折扣码:</strong> {orderResult.discountCode}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;