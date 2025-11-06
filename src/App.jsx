import React, { useEffect, useState } from 'react';

const SAMPLE_PRODUCTS = [
  { id: 'p1', title: 'Fresh Tomatoes (1kg)', price: 60, img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60' },
  { id: 'p2', title: 'Organic Bananas (6 pcs)', price: 50, img: 'https://images.unsplash.com/photo-1574226516831-e1dff420e9a6?auto=format&fit=crop&w=800&q=60' },
  { id: 'p3', title: 'Whole Wheat Flour (5kg)', price: 260, img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=60' },
  { id: 'p4', title: 'Fresh Milk (1L)', price: 55, img: 'https://images.unsplash.com/photo-1572441710266-3b8a5d7f8bda?auto=format&fit=crop&w=800&q=60' },
  { id: 'p5', title: 'Rice (5kg)', price: 420, img: 'https://images.unsplash.com/photo-1562158070-9d6b2a8f6f0b?auto=format&fit=crop&w=800&q=60' },
];

function formatINR(n){
  return '₹' + n.toLocaleString('en-IN');
}

export default function App(){
  const [products] = useState(SAMPLE_PRODUCTS);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState(() => {
    try{
      return JSON.parse(localStorage.getItem('mitlesh_cart') || '{}');
    }catch(e){return {}; }
  });
  const [showCart, setShowCart] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({name:'',phone:'',address:''});
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(()=>{
    localStorage.setItem('mitlesh_cart', JSON.stringify(cart));
  },[cart]);

  function addToCart(product){
    setCart(prev=>{
      const copy = {...prev};
      copy[product.id] = (copy[product.id] || {product, qty:0});
      copy[product.id].qty += 1;
      return copy;
    });
  }

  function changeQty(pid, delta){
    setCart(prev=>{
      const copy = {...prev};
      if(!copy[pid]) return prev;
      copy[pid].qty += delta;
      if(copy[pid].qty <= 0) delete copy[pid];
      return copy;
    });
  }

  function clearCart(){ setCart({}); }

  function subtotal(){
    return Object.values(cart).reduce((s,item)=> s + item.product.price * item.qty, 0);
  }

  function placeOrder(e){
    e.preventDefault();
    if(Object.keys(cart).length === 0) return alert('Cart is empty');
    if(!checkoutInfo.name || !checkoutInfo.phone || !checkoutInfo.address) return alert('Please fill name, phone and address');
    const order = {
      id: 'ORD-' + Date.now(),
      items: cart,
      total: subtotal(),
      info: checkoutInfo,
      placedAt: new Date().toISOString(),
    };
    localStorage.setItem('mitlesh_last_order', JSON.stringify(order));
    setOrderPlaced(order);
    clearCart();
    setShowCart(false);
  }

  const filtered = products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">M</div>
              <div>
                <h1 className="text-lg font-semibold">MitleshTrail Grocery</h1>
                <p className="text-xs text-gray-500">Fresh groceries — local prices</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-4">
              <label className="relative block">
                <input
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                  placeholder="Search for vegetables, rice, milk..."
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={()=>setShowCart(true)}
                className="relative inline-flex items-center px-3 py-2 border rounded-lg bg-white hover:shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M16 11V5a1 1 0 00-1-1H5.414l-.707-.707A1 1 0 003.586 3H2a1 1 0 000 2h1l2.293 10.293A2 2 0 007.293 17h7.414a2 2 0 001.98-1.765L18 8H7.5a.5.5 0 010-1H18a1 1 0 001-1z"/></svg>
                <span className="ml-2 text-sm">Cart</span>
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-white bg-green-500 rounded-full">{Object.keys(cart).length}</span>
              </button>
              <a href="#contact" className="hidden sm:inline-block px-3 py-2 rounded-lg bg-green-600 text-white">Contact</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Popular items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow p-3 flex flex-col">
                <img src={p.img} alt={p.title} className="w-full h-32 object-cover rounded-md mb-3" />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{p.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">{formatINR(p.price)}</div>
                </div>
                <div className="mt-3">
                  <button onClick={()=>addToCart(p)} className="w-full px-3 py-2 rounded-md bg-green-600 text-white">Add</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8" id="about">
          <div className="bg-gradient-to-r from-white to-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold">Why shop at MitleshTrail?</h3>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li>Fresh, daily-sourced vegetables and dairy.</li>
              <li>Easy returns and transparent pricing.</li>
              <li>Quick checkout and simple local delivery.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8" id="contact">
          <h3 className="text-lg font-semibold">Contact / Store Info</h3>
          <div className="mt-3 bg-white rounded-lg p-4 shadow">
            <p className="text-sm">Owner: Mithlesh kumar (MitleshTrail)</p>
            <p className="text-sm">Phone: +918617321498</p>
            <p className="text-sm">Address: Near Sabji-mandi Geyzing basar</p>
            <p className="mt-2 text-sm text-gray-600">Tip: update contact details in source code before publishing.</p>
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} MitleshTrail — Local grocery store</footer>
      </main>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end sm:items-center justify-center z-50">
          <div className="w-full sm:w-2/3 lg:w-1/2 bg-white rounded-t-lg sm:rounded-lg shadow-lg p-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <div>
                <button onClick={()=>{setShowCart(false)}} className="px-3 py-1 rounded-md">Close</button>
                <button onClick={clearCart} className="ml-2 px-3 py-1 rounded-md bg-red-50 text-red-600">Clear</button>
              </div>
            </div>

            <div className="mt-4">
              {Object.keys(cart).length === 0 ? (
                <div className="text-center text-gray-500 py-10">Your cart is empty</div>
              ) : (
                <div>
                  {Object.values(cart).map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 py-3 border-b">
                      <img src={item.product.img} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium">{item.product.title}</div>
                        <div className="text-sm text-gray-500">{formatINR(item.product.price)} × {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={()=>changeQty(item.product.id, -1)} className="px-2 py-1 rounded border">-</button>
                        <div className="px-2">{item.qty}</div>
                        <button onClick={()=>changeQty(item.product.id, 1)} className="px-2 py-1 rounded border">+</button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 text-right">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="text-xl font-semibold">{formatINR(subtotal())}</div>
                  </div>

                  <form onSubmit={placeOrder} className="mt-4 space-y-3 p-3 bg-green-50 rounded">
                    <h4 className="font-medium">Checkout</h4>
                    <input required value={checkoutInfo.name} onChange={(e)=>setCheckoutInfo({...checkoutInfo, name: e.target.value})} placeholder="Full name" className="w-full px-3 py-2 rounded" />
                    <input required value={checkoutInfo.phone} onChange={(e)=>setCheckoutInfo({...checkoutInfo, phone: e.target.value})} placeholder="Phone number" className="w-full px-3 py-2 rounded" />
                    <textarea required value={checkoutInfo.address} onChange={(e)=>setCheckoutInfo({...checkoutInfo, address: e.target.value})} placeholder="Delivery address" className="w-full px-3 py-2 rounded" />
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Place order</button>
                      <button type="button" onClick={()=>{setOrderPlaced(null); setCheckoutInfo({name:'',phone:'',address:''})}} className="px-4 py-2 rounded border">Reset</button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {orderPlaced && (
              <div className="mt-4 bg-white border p-3 rounded">
                <h4 className="font-semibold">Order placed</h4>
                <p className="text-sm">Order ID: {orderPlaced.id}</p>
                <p className="text-sm">Total: {formatINR(orderPlaced.total)}</p>
                <p className="text-sm">We saved the order locally (for demo). Integrate a backend to store orders online.</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
