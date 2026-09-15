import { useMemo, useState } from 'react';
import burgerImage from './assets/menu/sunset-burger.png';
import noodleImage from './assets/menu/noodle-house.png';
import pizzaImage from './assets/menu/piazza-verde.png';
import './App.css';

type Role = 'customer' | 'driver';
type DeliveryState = 'READY_FOR_PICKUP' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED';
type Account = { name: string; email: string; password: string; role: Role };
type MenuItem = { id: number; name: string; description: string; price: number };
type Restaurant = { id: number; name: string; cuisine: string; eta: string; image: string; menu: MenuItem[] };
type Delivery = { id: string; restaurant: string; customer: string; address: string; total: number; state: DeliveryState; driverEmail?: string };

const restaurants: Restaurant[] = [
  { id: 1, name: 'Sunset Burger', cuisine: 'Burgers · American', eta: '20–30 min', image: burgerImage, menu: [{ id: 101, name: 'Classic Smash Burger', description: 'Two beef patties, cheddar, and pickles.', price: 12.99 }, { id: 102, name: 'Crispy Fries', description: 'Sea salt and house seasoning.', price: 4.99 }] },
  { id: 2, name: 'Noodle House', cuisine: 'Asian · Noodles', eta: '25–35 min', image: noodleImage, menu: [{ id: 201, name: 'Spicy Chicken Ramen', description: 'Rich broth, egg, and scallions.', price: 14.5 }, { id: 202, name: 'Vegetable Dumplings', description: 'Six pan-fried dumplings.', price: 7.5 }] },
  { id: 3, name: 'Piazza Verde', cuisine: 'Italian · Pizza', eta: '30–40 min', image: pizzaImage, menu: [{ id: 301, name: 'Margherita Pizza', description: 'Tomato, mozzarella, and basil.', price: 15.99 }, { id: 302, name: 'Caesar Salad', description: 'Romaine, parmesan, and croutons.', price: 8.99 }] },
];

const initialDeliveries: Delivery[] = [
  { id: 'ORD-1042', restaurant: 'Sunset Burger', customer: 'Alex Chen', address: '88 Market St', total: 22.97, state: 'READY_FOR_PICKUP' },
  { id: 'ORD-1045', restaurant: 'Noodle House', customer: 'Maya Patel', address: '14 Oak Ave', total: 29, state: 'READY_FOR_PICKUP' },
];
const nextState: Record<DeliveryState, DeliveryState> = { READY_FOR_PICKUP: 'ACCEPTED', ACCEPTED: 'PICKED_UP', PICKED_UP: 'DELIVERING', DELIVERING: 'DELIVERED', DELIVERED: 'DELIVERED' };
const money = (value: number) => `$${value.toFixed(2)}`;
const statusLabel: Record<DeliveryState, string> = { READY_FOR_PICKUP: 'Ready for pickup', ACCEPTED: 'Heading to restaurant', PICKED_UP: 'Order picked up', DELIVERING: 'Out for delivery', DELIVERED: 'Delivered' };

function App() {
  const [account, setAccount] = useState<Account | null>(() => { const saved = localStorage.getItem('food-delivery-session'); return saved ? JSON.parse(saved) as Account : null; });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => { const saved = localStorage.getItem('food-delivery-deliveries'); return saved ? JSON.parse(saved) as Delivery[] : initialDeliveries; });
  const cartItems = useMemo(() => restaurant?.menu.filter((item) => cart[item.id]) ?? [], [restaurant, cart]);
  const total = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0);

  const saveDeliveries = (updater: (current: Delivery[]) => Delivery[]) => setDeliveries((current) => {
    const next = updater(current);
    localStorage.setItem('food-delivery-deliveries', JSON.stringify(next));
    return next;
  });
  const quantity = (id: number, delta: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));
  const signOut = () => { localStorage.removeItem('food-delivery-session'); setAccount(null); setRestaurant(null); setCart({}); };

  if (!account) return <main className="app-shell"><section className="auth-card"><p className="eyebrow">VIRTUAL FOOD DELIVERY</p><h1>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="subtitle">Sign in to access the workspace for your selected role.</p><form onSubmit={(event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const email = String(data.get('email')).trim().toLowerCase(); const password = String(data.get('password')); const users = JSON.parse(localStorage.getItem('food-delivery-users') ?? '[]') as Account[];
    if (authMode === 'register') { const name = String(data.get('name')).trim(); const role = String(data.get('role')) as Role; if (users.some((user) => user.email === email)) { setAuthError('This email already has an account. Please sign in.'); return; } const user = { name, email, password, role }; localStorage.setItem('food-delivery-users', JSON.stringify([...users, user])); localStorage.setItem('food-delivery-session', JSON.stringify(user)); setAccount(user); return; }
    const user = users.find((item) => item.email === email && item.password === password); if (!user) { setAuthError('Email or password is incorrect. Create an account first.'); return; } localStorage.setItem('food-delivery-session', JSON.stringify(user)); setAccount(user);
  }}>
    {authMode === 'register' && <><label>Full name<input name="name" required /></label><label>Role<select name="role" defaultValue="customer"><option value="customer">Customer — order food</option><option value="driver">Driver — deliver orders</option></select></label></>}
    <label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" minLength={6} required /></label>{authError && <p className="auth-error">{authError}</p>}<button className="primary" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'}</button>
  </form><button className="link auth-switch" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}>{authMode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></section></main>;

  if (account.role === 'driver') {
    const available = deliveries.filter((delivery) => delivery.state === 'READY_FOR_PICKUP' && !delivery.driverEmail);
    const mine = deliveries.filter((delivery) => delivery.driverEmail === account.email);
    const advance = (id: string) => saveDeliveries((all) => all.map((delivery) => delivery.id === id ? { ...delivery, state: nextState[delivery.state] } : delivery));
    return <main className="app-shell"><header><button className="link" onClick={signOut}>Sign out</button><div><p className="eyebrow">DRIVER · {account.name}</p><h1>Driver dashboard</h1></div><span className="status online">● Online</span></header><section className="delivery-grid"><div><h2>Available deliveries</h2>{available.map((delivery) => <article className="order-card" key={delivery.id}><div><b>{delivery.id}</b><p>{delivery.restaurant} · {money(delivery.total)}</p><small>Deliver to {delivery.address}</small></div><button onClick={() => saveDeliveries((all) => all.map((item) => item.id === delivery.id ? { ...item, driverEmail: account.email, state: 'ACCEPTED' } : item))}>Accept order</button></article>)}{available.length === 0 && <p className="muted">There are no available deliveries right now.</p>}</div><div><h2>My deliveries</h2>{mine.map((delivery) => <article className="order-card active" key={delivery.id}><div><b>{delivery.id}</b><p>{delivery.restaurant} → {delivery.customer}</p><small>{delivery.address}</small><p className="state">{statusLabel[delivery.state]}</p></div>{delivery.state === 'DELIVERED' ? <span className="completed">Completed</span> : <button onClick={() => advance(delivery.id)}>{delivery.state === 'ACCEPTED' ? 'Confirm pickup' : delivery.state === 'PICKED_UP' ? 'Start delivery' : 'Confirm delivery'}</button>}</article>)}{mine.length === 0 && <p className="muted">Orders you accept are visible only to your driver account.</p>}</div></section></main>;
  }

  return <main className="app-shell"><header><button className="link" onClick={signOut}>Sign out</button><div><p className="eyebrow">CUSTOMER · {account.name}</p><h1>What are you craving?</h1></div><span className="cart-count">🛒 {cartItems.reduce((sum, item) => sum + cart[item.id], 0)}</span></header><div className="customer-layout"><section><h2>Virtual restaurants</h2><div className="restaurant-grid">{restaurants.map((item) => <button key={item.id} className={`restaurant-card ${restaurant?.id === item.id ? 'selected' : ''}`} onClick={() => { setRestaurant(item); setCart({}); setConfirmation(null); }}><img src={item.image} alt="" /><div><h3>{item.name}</h3><p>{item.cuisine}</p><small>{item.eta}</small></div></button>)}</div>{restaurant && <section className="menu"><p className="eyebrow">MENU</p><h2>{restaurant.name}</h2>{restaurant.menu.map((item) => <article className="menu-item" key={item.id}><img className="menu-image" src={restaurant.image} alt={item.name} /><div className="menu-copy"><h3>{item.name}</h3><p>{item.description}</p><b>{money(item.price)}</b></div><div className="quantity"><button onClick={() => quantity(item.id, -1)} aria-label={`Remove ${item.name}`}>−</button><span>{cart[item.id] ?? 0}</span><button onClick={() => quantity(item.id, 1)} aria-label={`Add ${item.name}`}>+</button></div></article>)}</section>}</section><aside className="cart"><h2>Your cart</h2>{cartItems.length === 0 ? <p className="muted">Choose items from one restaurant to get started.</p> : <>{cartItems.map((item) => <p className="cart-line" key={item.id}><span>{item.name} × {cart[item.id]}</span><b>{money(item.price * cart[item.id])}</b></p>)}<hr /><p className="cart-line total"><span>Subtotal</span><b>{money(total)}</b></p><button className="primary" onClick={() => { setConfirmation(`Order placed. ${restaurant?.name} is preparing your food.`); setCart({}); }}>Place order · {money(total)}</button></>}{confirmation && <p className="notice">✓ {confirmation}</p>}</aside></div></main>;
}

export default App;
