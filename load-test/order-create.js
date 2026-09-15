import http from 'k6/http';
import { check } from 'k6';

export const options = { scenarios: { order_create: { executor: 'constant-arrival-rate', rate: 350, timeUnit: '1s', duration: '2m', preAllocatedVUs: 100, maxVUs: 500 } }, thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<180'] } };
export default function () {
  const body = JSON.stringify({ cart: [{ productId: 1, quantity: 1 }], paymentType: 'CREDIT_CARD' });
  const response = http.post(`${__ENV.ORDER_URL || 'http://localhost:8080'}/order/payment`, body, { headers: { 'Content-Type': 'application/json' } });
  check(response, { 'accepted': (r) => r.status === 200 });
}
