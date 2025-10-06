import axios from 'axios';

// API基础配置
const API_BASE_URL = 'http://localhost:8080';
const PRODUCT_API_URL = 'http://localhost:8082';
const DISCOUNT_API_URL = 'http://localhost:8083';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 产品API客户端
const productApiClient = axios.create({
  baseURL: PRODUCT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 折扣API客户端
const discountApiClient = axios.create({
  baseURL: DISCOUNT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 类型定义
export interface ProductRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  cart: ProductRequest[];
  discountCode?: string;
  paymentType: PaymentType;
}

export interface OrderResponse {
  orderId: string;
  cart: ProductRequest[];
  status: string;
  discountCode?: string;
  paymentType: PaymentType;
}

export interface ProductPrice {
  productId: number;
  price: number;
}

export interface DiscountResponse {
  discountCode: string;
  discountAmount: number;
  isValid: boolean;
}

export enum PaymentType {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
}

// API服务类
export class OrderApiService {
  // 创建订单
  static async createOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    try {
      const response = await apiClient.post('/order/payment', orderRequest);
      return response.data;
    } catch (error) {
      console.error('创建订单失败:', error);
      throw error;
    }
  }

  // 获取产品价格
  static async getProductPrices(productIds: number[]): Promise<ProductPrice[]> {
    try {
      const response = await productApiClient.get('/product/price', {
        params: { ids: productIds.join(',') }
      });
      return response.data;
    } catch (error) {
      console.error('获取产品价格失败:', error);
      throw error;
    }
  }

  // 验证折扣码
  static async validateDiscount(discountCode: string): Promise<DiscountResponse> {
    try {
      const response = await discountApiClient.get('/discount', {
        params: { 'discount-code': discountCode }
      });
      return response.data;
    } catch (error) {
      console.error('验证折扣码失败:', error);
      throw error;
    }
  }
}

export default OrderApiService;
