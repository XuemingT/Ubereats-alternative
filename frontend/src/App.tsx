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

import { useMemo, useState } from 'react';
import './App.css';

type Role = 'customer' | 'courier';
type Account = { name: string; email: string; password: string; role: Role };
type State = 'READY_FOR_PICKUP' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED';
type MenuItem = { id: number; name: string; description: string; price: number };
type Restaurant = { id: number; name: string; cuisine: string; eta: string; menu: MenuItem[] };
type Delivery = { id: string; restaurant: string; customer: string; address: string; total: number; state: State };

const restaurants: Restaurant[] = [
  { id: 1, name: 'Sunset Burger', cuisine: 'Burgers · American', eta: '20–30 min', menu: [{ id: 101, name: 'Classic Smash Burger', description: 'Two beef patties, cheddar, pickles', price: 12.99 }, { id: 102, name: 'Crispy Fries', description: 'Sea salt and house seasoning', price: 4.99 }] },
  { id: 2, name: 'Noodle House', cuisine: 'Asian · Noodles', eta: '25–35 min', menu: [{ id: 201, name: 'Spicy Chicken Ramen', description: 'Slow-cooked broth, egg, scallions', price: 14.5 }, { id: 202, name: 'Vegetable Dumplings', description: 'Six pan-fried dumplings', price: 7.5 }] },
  { id: 3, name: 'Piazza Verde', cuisine: 'Italian · Pizza', eta: '30–40 min', menu: [{ id: 301, name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 15.99 }, { id: 302, name: 'Caesar Salad', description: 'Romaine, parmesan, croutons', price: 8.99 }] },
];
const initialDeliveries: Delivery[] = [{ id: 'ORD-1042', restaurant: 'Sunset Burger', customer: 'Alex Chen', address: '88 Market St', total: 22.97, state: 'READY_FOR_PICKUP' }, { id: 'ORD-1045', restaurant: 'Noodle House', customer: 'Maya Patel', address: '14 Oak Ave', total: 29, state: 'READY_FOR_PICKUP' }];
const nextState: Record<State, State> = { READY_FOR_PICKUP: 'ACCEPTED', ACCEPTED: 'PICKED_UP', PICKED_UP: 'DELIVERING', DELIVERING: 'DELIVERED', DELIVERED: 'DELIVERED' };
const money = (value: number) => `$${value.toFixed(2)}`;

function App() {
  const [account, setAccount] = useState<Account | null>(() => { const saved = localStorage.getItem('food-delivery-session'); return saved ? JSON.parse(saved) as Account : null; });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login'); const [authError, setAuthError] = useState('');
  const [role, setRole] = useState<Role | null>(account?.role ?? null); const [restaurant, setRestaurant] = useState<Restaurant | null>(null); const [cart, setCart] = useState<Record<number, number>>({}); const [deliveries, setDeliveries] = useState(initialDeliveries); const [active, setActive] = useState<string | null>(null); const [confirmation, setConfirmation] = useState<string | null>(null);
  const cartItems = useMemo(() => restaurant?.menu.filter((item) => cart[item.id]) ?? [], [restaurant, cart]); const total = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0);
  const quantity = (id: number, delta: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));
  const signOut = () => { localStorage.removeItem('food-delivery-session'); setAccount(null); setRole(null); };
  if (!account || !role) return <main className="app-shell"><section className="auth-card"><p className="eyebrow">VIRTUAL FOOD DELIVERY</p><h1>{authMode === 'login' ? '欢迎回来' : '创建账户'}</h1><p className="subtitle">登录后将根据你的账户角色进入对应工作台。</p><form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const email = String(data.get('email')).trim().toLowerCase(); const password = String(data.get('password')); const users = JSON.parse(localStorage.getItem('food-delivery-users') ?? '[]') as Account[]; if (authMode === 'register') { const name = String(data.get('name')).trim(); const selectedRole = String(data.get('role')) as Role; if (users.some((user) => user.email === email)) { setAuthError('该邮箱已注册，请直接登录。'); return; } const user = { name, email, password, role: selectedRole }; localStorage.setItem('food-delivery-users', JSON.stringify([...users, user])); localStorage.setItem('food-delivery-session', JSON.stringify(user)); setAccount(user); setRole(user.role); } else { const user = users.find((item) => item.email === email && item.password === password); if (!user) { setAuthError('邮箱或密码不正确。请先注册账户。'); return; } localStorage.setItem('food-delivery-session', JSON.stringify(user)); setAccount(user); setRole(user.role); } }}><>{authMode === 'register' && <><label>姓名<input name="name" required /></label><label>角色<select name="role" defaultValue="customer"><option value="customer">Customer（点餐）</option><option value="courier">Driver（送餐）</option></select></label></>}</><label>邮箱<input name="email" type="email" required /></label><label>密码<input name="password" type="password" minLength={6} required /></label>{authError && <p className="auth-error">{authError}</p>}<button className="primary" type="submit">{authMode === 'login' ? '登录' : '注册并继续'}</button></form><button className="link auth-switch" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}>{authMode === 'login' ? '没有账户？去注册' : '已有账户？去登录'}</button></section></main>;
  if (role === 'courier') return <main className="app-shell"><header><button className="link" onClick={signOut}>退出登录</button><div><p className="eyebrow">DRIVER · {account.name}</p><h1>配送工作台</h1></div><span className="status online">● 在线</span></header><section className="delivery-grid"><div><h2>可接订单</h2>{deliveries.filter((o) => o.state === 'READY_FOR_PICKUP' && o.id !== active).map((o) => <article className="order-card" key={o.id}><div><b>{o.id}</b><p>{o.restaurant} · {money(o.total)}</p><small>送往 {o.address}</small></div><button onClick={() => setActive(o.id)}>接单</button></article>)}</div><div><h2>我的配送</h2>{deliveries.filter((o) => o.id === active).map((o) => <article className="order-card active" key={o.id}><div><b>{o.id}</b><p>{o.restaurant} → {o.customer}</p><small>{o.address}</small><p className="state">{o.state.replaceAll('_', ' ')}</p></div><button onClick={() => setDeliveries((all) => all.map((item) => item.id === o.id ? { ...item, state: nextState[item.state] } : item))}>{o.state === 'ACCEPTED' ? '确认取餐' : o.state === 'PICKED_UP' ? '开始配送' : o.state === 'DELIVERING' ? '确认送达' : '已接单'}</button></article>)}{!active && <p className="muted">选择一笔订单开始配送。</p>}</div></section></main>;
  return <main className="app-shell"><header><button className="link" onClick={signOut}>退出登录</button><div><p className="eyebrow">CUSTOMER · {account.name}</p><h1>附近有什么好吃的？</h1></div><span className="cart-count">🛒 {cartItems.reduce((sum, item) => sum + cart[item.id], 0)}</span></header><div className="customer-layout"><section><h2>虚拟餐厅</h2><div className="restaurant-grid">{restaurants.map((item) => <button key={item.id} className={`restaurant-card ${restaurant?.id === item.id ? 'selected' : ''}`} onClick={() => { setRestaurant(item); setCart({}); setConfirmation(null); }}><span>🍽️</span><h3>{item.name}</h3><p>{item.cuisine}</p><small>{item.eta}</small></button>)}</div>{restaurant && <section className="menu"><p className="eyebrow">MENU</p><h2>{restaurant.name}</h2>{restaurant.menu.map((item) => <article className="menu-item" key={item.id}><div><h3>{item.name}</h3><p>{item.description}</p><b>{money(item.price)}</b></div><div className="quantity"><button onClick={() => quantity(item.id, -1)}>−</button><span>{cart[item.id] ?? 0}</span><button onClick={() => quantity(item.id, 1)}>+</button></div></article>)}</section>}</section><aside className="cart"><h2>你的购物车</h2>{cartItems.length === 0 ? <p className="muted">从一家餐厅选择餐点。</p> : <>{cartItems.map((item) => <p className="cart-line" key={item.id}><span>{item.name} × {cart[item.id]}</span><b>{money(item.price * cart[item.id])}</b></p>)}<hr /><p className="cart-line total"><span>小计</span><b>{money(total)}</b></p><button className="primary" onClick={() => { setConfirmation(`订单已创建：${restaurant?.name} 正在准备餐点。`); setCart({}); }}>下单 · {money(total)}</button></>}{confirmation && <p className="notice">✓ {confirmation}</p>}</aside></div></main>;
}
export default App;
