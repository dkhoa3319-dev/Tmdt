import React, { useState, useEffect, useMemo } from 'react';
import {
  Music, Heart, ShoppingBag, Search, Plus, Minus, Trash2, Edit3, Eye,
  ZoomIn, ZoomOut, X, ShieldCheck, Sparkles, Lock, Mail, Send,
  Package, Settings, Phone, MapPin, LogOut, CheckCircle2
} from 'lucide-react';

const CATS = ['Tất cả', 'Piano', 'Guitar', 'Violin', 'Trống', 'Phụ kiện'];
const ITEMS = [
  { id: '1', name: 'Steinway & Sons Model B Grand Piano', category: 'Piano', price: 285000000, badge: 'Tuyệt tác', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80', specs: 'Dài 211cm • Gỗ vân sam Sitka', description: 'Đại dương cầm biểu tượng phòng hòa nhạc với âm sắc trầm ấm.' },
  { id: '2', name: 'Fender Custom Shop 1960 Stratocaster', category: 'Guitar', price: 94500000, badge: 'Bán chạy', image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=800&q=80', specs: 'Thân Alder • Cần Rosewood', description: 'Chế tác thủ công tại Mỹ với chất âm vintage đặc trưng.' },
  { id: '3', name: 'Cremona Maestro Stradivari Violin 4/4', category: 'Violin', price: 42000000, badge: 'Thủ công', image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=800&q=80', specs: 'Gỗ thông Spruce • Véc-ni hổ phách', description: 'Âm thanh vang sáng, giàu nội lực kèm hộp sợi carbon.' },
  { id: '4', name: 'Yamaha U3 Upright Piano Nội Địa Nhật', category: 'Piano', price: 118000000, badge: 'Ưa chuộng', image: 'https://images.unsplash.com/photo-1552422554-0d5af0c79fc6?auto=format&fit=crop&w=800&q=80', specs: 'Cao 131cm • 88 phím tiêu chuẩn', description: 'Dòng upright piano chuẩn mực cho luyện tập và biểu diễn.' },
  { id: '5', name: 'Roland VAD507 V-Drums Acoustic Design', category: 'Trống', price: 129000000, badge: 'Mới', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80', specs: 'Vỏ trống gỗ thật • Module TD-27', description: 'Ngoại hình trống cơ bề thế kết hợp âm thanh kỹ thuật số.' },
  { id: '6', name: 'Dây Elixir Nanoweb & Máy Lên Dây Korg', category: 'Phụ kiện', price: 1450000, badge: 'Combo', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80', specs: 'Phủ chống gỉ • Tuner OLED', description: 'Bộ phụ kiện bảo dưỡng và lên dây chuẩn xác.' }
];
const vnd = (n) => new Intl.NumberFormat('vi-VN').format(Number(n) || 0) + ' ₫';

export default function App() {
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
  const [products, setProducts] = useState(() => get('mh_p3', ITEMS));
  const [orders, setOrders] = useState(() => get('mh_o3', []));
  const [cfg, setCfg] = useState(() => get('mh_e3', { serviceId: '', templateId: '', publicKey: '', adminEmail: 'admin@harmonie.vn' }));
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [cat, setCat] = useState('Tất cả');
  const [q, setQ] = useState('');
  const [onlyWish, setOnlyWish] = useState(false);
  const [view, setView] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', method: 'QR' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [taps, setTaps] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [admMail, setAdmMail] = useState('');
  const [admPass, setAdmPass] = useState('');
  const [admErr, setAdmErr] = useState('');
  const [tab, setTab] = useState('products');
  const [editP, setEditP] = useState(null);
  const [pForm, setPForm] = useState({ name: '', category: 'Piano', price: '', image: '', specs: '' });
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem('mh_p3', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('mh_o3', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('mh_e3', JSON.stringify(cfg)); }, [cfg]);

  const msg = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };
  const list = useMemo(() => products.filter((i) => (cat === 'Tất cả' || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase()) && (!onlyWish || wish.includes(i.id))), [products, cat, q, onlyWish, wish]);
  const addCart = (p) => { setCart((prev) => prev.some((i) => i.id === p.id) ? prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }]); msg('Đã thêm vào giỏ'); };
  const chgQty = (id, d) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty + d } : i).filter((i) => i.qty > 0));
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalAmt = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const onFooterTap = () => {
    const n = taps + 1;
    if (n >= 3) { setTaps(0); if (!authed) setLoginOpen(true); }
    else { setTaps(n); setTimeout(() => setTaps(0), 1500); }
  };

  const onLogin = (e) => {
    e.preventDefault();
    if (admMail.trim() === 'admin@harmonie.vn' && admPass === 'admin123') { setAuthed(true); setLoginOpen(false); setAdmErr(''); msg('Đã đăng nhập quản trị'); }
    else setAdmErr('Sai email hoặc mật khẩu.');
  };

  const onOrder = async (e) => {
    e.preventDefault(); setBusy(true);
    const id = 'MH-' + Math.floor(100000 + Math.random() * 900000);
    const payLabel = form.method === 'QR' ? 'Chuyển khoản QR' : 'Thanh toán COD';
    const ord = { id, customerName: form.name, customerEmail: form.email, customerPhone: form.phone, address: form.address, paymentMethod: payLabel, items: cart, total: totalAmt, status: 'Chờ xác nhận', createdAt: new Date().toLocaleString('vi-VN') };
    let sent = false;
    if (cfg.serviceId && cfg.templateId && cfg.publicKey) {
      try {
        const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id: cfg.serviceId, template_id: cfg.templateId, user_id: cfg.publicKey, template_params: { to_name: form.name, to_email: form.email, reply_to: cfg.adminEmail, order_id: id, order_items: cart.map((i) => i.name + ' x' + i.qty).join(', '), total_amount: vnd(totalAmt), payment_method: payLabel, shipping_address: form.address } })
        });
        sent = r.ok;
      } catch { sent = false; }
    }
    setOrders([ord, ...orders]); setDone({ ...ord, sent }); setCart([]); setBusy(false);
  };

  const onSaveP = (e) => {
    e.preventDefault();
    const item = { id: editP ? editP.id : String(Date.now()), name: pForm.name, category: pForm.category, price: Number(pForm.price), badge: 'Mới', image: pForm.image || ITEMS[0].image, specs: pForm.specs || 'Tiêu chuẩn Maison Harmonie', description: 'Nhạc cụ tuyển chọn chính hãng.' };
    setProducts(editP ? products.map((p) => p.id === editP.id ? item : p) : [item, ...products]);
    msg(editP ? 'Đã cập nhật' : 'Đã thêm mới'); setEditP(null); setPForm({ name: '', category: 'Piano', price: '', image: '', specs: '' });
  };
     return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans">
      {toast && <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-amber-400" />{toast}</div>}

      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div onClick={() => { setCat('Tất cả'); setOnlyWish(false); setQ(''); }} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center"><Music className="w-5 h-5" /></div>
            <div><h1 className="text-base font-serif font-bold leading-none">MAISON HARMONIE</h1><p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-0.5">Atelier Nhạc Cụ</p></div>
          </div>
          <div className="hidden md:flex items-center flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm piano, guitar, violin..." className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOnlyWish(!onlyWish)} className={'relative p-2.5 rounded-full border ' + (onlyWish ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-stone-200')}>
              <Heart className={'w-4 h-4 ' + (onlyWish ? 'fill-rose-600' : '')} />
              {wish.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">{wish.length}</span>}
            </button>
            <button onClick={() => setCartOpen(true)} className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900 text-white text-sm font-medium">
              <ShoppingBag className="w-4 h-4 text-amber-300" /><span className="hidden sm:inline">Giỏ hàng</span>
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-400 text-stone-950 font-bold">{totalQty}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-10">
        <div className="rounded-3xl bg-stone-900 text-white p-7 sm:p-11">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs mb-3"><Sparkles className="w-3.5 h-3.5" />Bộ Sưu Tập Tuyển Chọn 2026</div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-2">Nghệ Thuật Chế Tác & Thanh Âm Nguyên Bản</h2>
          <p className="text-stone-300 text-sm max-w-xl mb-4">Nhạc cụ danh tiếng thẩm định bởi nghệ nhân, bảo hành chính hãng toàn quốc.</p>
          <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-xs text-amber-200"><ShieldCheck className="w-4 h-4" />Bảo hành 5 năm • Lên dây miễn phí</span>
        </div>

        <div className="mt-4 md:hidden relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm nhạc cụ..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-5">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ' + (cat === c ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200')}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => {
            const fav = wish.includes(p.id);
            return (
              <div key={p.id} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  {p.badge && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-stone-900/85 text-amber-300 text-xs">{p.badge}</span>}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button onClick={() => setWish(fav ? wish.filter((x) => x !== p.id) : [...wish, p.id])} className="p-2 rounded-full bg-white/90 shadow-sm"><Heart className={'w-4 h-4 ' + (fav ? 'fill-rose-600 text-rose-600' : '')} /></button>
                    <button onClick={() => { setView(p); setZoom(1); }} className="p-2 rounded-full bg-white/90 shadow-sm"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-medium text-amber-700 uppercase">{p.category}</span>
                  <h3 className="text-base font-semibold mt-1 mb-1">{p.name}</h3>
                  <p className="text-xs text-stone-500 mb-4">{p.specs}</p>
                  <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-base font-bold">{vnd(p.price)}</span>
                    <button onClick={() => addCart(p)} className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium"><Plus className="w-3.5 h-3.5" />Thêm vào giỏ</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Quận 1, TP.HCM</span>
            <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />1900 6868</span>
          </div>
          <button onClick={onFooterTap} className="select-none">© 2026 Maison Harmonie. Bảo lưu mọi quyền.</button>
        </div>
      </footer>
                  {view && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b">
              <span className="text-xs font-bold uppercase text-amber-700">{view.category}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setZoom((z) => Math.max(1, z - 0.3))} className="p-1.5 rounded-lg border"><ZoomOut className="w-4 h-4" /></button>
                <button onClick={() => setZoom((z) => Math.min(2.2, z + 0.3))} className="p-1.5 rounded-lg border"><ZoomIn className="w-4 h-4" /></button>
                <button onClick={() => setView(null)} className="p-1.5 rounded-lg bg-stone-100 ml-1"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 p-5">
              <div className="aspect-square rounded-2xl bg-stone-100 overflow-hidden"><img src={view.image} alt={view.name} style={{ transform: 'scale(' + zoom + ')' }} className="w-full h-full object-cover transition" /></div>
              <div className="flex flex-col">
                <h3 className="text-lg font-serif font-bold">{view.name}</h3>
                <p className="text-lg font-bold text-amber-700 mt-1">{vnd(view.price)}</p>
                <p className="text-xs text-stone-500 mt-2 bg-stone-50 p-2.5 rounded-xl">{view.specs}</p>
                <p className="text-sm text-stone-600 mt-3">{view.description}</p>
                <button onClick={() => { addCart(view); setView(null); }} className="mt-auto w-full py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium">Thêm vào giỏ hàng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between"><h3 className="font-bold">Giỏ hàng ({totalQty})</h3><button onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button></div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? <p className="text-sm text-stone-500 text-center py-10">Giỏ hàng trống.</p> : cart.map((i) => (
                <div key={i.id} className="flex gap-3 border-b pb-3">
                  <img src={i.image} alt={i.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">{i.name}</h4>
                    <p className="text-xs font-bold text-amber-700">{vnd(i.price)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => chgQty(i.id, -1)} className="p-1 rounded border"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold">{i.qty}</span>
                      <button onClick={() => chgQty(i.id, 1)} className="p-1 rounded border"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => chgQty(i.id, -i.qty)} className="ml-auto text-stone-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t bg-stone-50">
                <div className="flex justify-between mb-3 font-bold"><span>Tổng cộng</span><span>{vnd(totalAmt)}</span></div>
                <button onClick={() => { setCartOpen(false); setDone(null); setPayOpen(true); }} className="w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold">Đặt hàng ngay</button>
              </div>
            )}
          </div>
        </div>
      )}

      {payOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <div className="flex justify-between pb-3 border-b"><h3 className="font-serif font-bold text-lg">Xác Nhận Đơn Hàng</h3><button onClick={() => setPayOpen(false)}><X className="w-5 h-5" /></button></div>
            {done ? (
              <div className="py-6 text-center space-y-2.5">
                <CheckCircle2 className="w-11 h-11 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg">Đặt hàng thành công!</h4>
                <p className="text-sm">Mã đơn: <b>{done.id}</b></p>
                <p className="text-xs text-stone-500">{done.sent ? 'Đã gửi email tới ' + done.customerEmail : 'Đơn hàng đã được lưu.'}</p>
                <button onClick={() => setPayOpen(false)} className="mt-3 px-5 py-2 rounded-xl bg-stone-900 text-white text-sm">Đóng</button>
              </div>
            ) : (
              <form onSubmit={onOrder} className="mt-4 space-y-3">
                <input required placeholder="Họ và tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border text-sm" />
                <input type="email" required placeholder="Email nhận hóa đơn" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border text-sm" />
                <input required placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border text-sm" />
                <input required placeholder="Địa chỉ giao hàng" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setForm({ ...form, method: 'QR' })} className={'p-2.5 rounded-xl border text-xs font-semibold ' + (form.method === 'QR' ? 'bg-stone-900 text-white' : '')}>Chuyển khoản QR</button>
                  <button type="button" onClick={() => setForm({ ...form, method: 'COD' })} className={'p-2.5 rounded-xl border text-xs font-semibold ' + (form.method === 'COD' ? 'bg-stone-900 text-white' : '')}>Thanh toán COD</button>
                </div>
                {form.method === 'QR' && <p className="p-3 rounded-xl bg-stone-50 border text-center text-xs font-bold">VIETCOMBANK • 9988668899 • MAISON HARMONIE</p>}
                <div className="flex justify-between font-bold text-sm pt-1"><span>Tổng cộng:</span><span className="text-amber-700">{vnd(totalAmt)}</span></div>
                <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold">{busy ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}</button>
              </form>
            )}
          </div>
        </div>
      )}

      {loginOpen && !authed && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6">
            <div className="flex justify-between mb-4"><span className="font-bold flex items-center gap-1.5"><Lock className="w-4 h-4 text-amber-600" />Cổng Quản Trị</span><button onClick={() => setLoginOpen(false)}><X className="w-4 h-4" /></button></div>
            <form onSubmit={onLogin} className="space-y-3">
              <input type="email" required placeholder="Email quản trị" value={admMail} onChange={(e) => setAdmMail(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border text-sm" />
              <input type="password" required placeholder="Mật khẩu" value={admPass} onChange={(e) => setAdmPass(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border text-sm" />
              {admErr && <p className="text-xs text-rose-600">{admErr}</p>}
              <button type="submit" className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold">Đăng nhập</button>
            </form>
          </div>
        </div>
      )}

      {authed && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 bg-stone-900 text-white flex justify-between items-center">
              <span className="font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-amber-400" />Quản Trị Maison Harmonie</span>
              <button onClick={() => setAuthed(false)} className="px-3 py-1 rounded-lg bg-white/10 text-xs flex items-center gap-1"><LogOut className="w-3.5 h-3.5" />Đóng</button>
            </div>
            <div className="flex border-b bg-stone-50 px-3">
              {[{ id: 'products', label: 'Sản phẩm', icon: Package }, { id: 'orders', label: 'Đơn hàng (' + orders.length + ')', icon: ShoppingBag }, { id: 'emailjs', label: 'EmailJS', icon: Settings }].map((t) => {
                const Icon = t.icon;
                return <button key={t.id} onClick={() => setTab(t.id)} className={'flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 ' + (tab === t.id ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500')}><Icon className="w-3.5 h-3.5" />{t.label}</button>;
              })}
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {tab === 'products' && (
                <>
                  <form onSubmit={onSaveP} className="bg-stone-50 p-4 rounded-2xl border space-y-2.5">
                    <div className="grid sm:grid-cols-3 gap-2">
                      <input required placeholder="Tên nhạc cụ" value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} className="px-3 py-2 rounded-xl border bg-white text-sm" />
                      <select value={pForm.category} onChange={(e) => setPForm({ ...pForm, category: e.target.value })} className="px-3 py-2 rounded-xl border bg-white text-sm">{CATS.filter((c) => c !== 'Tất cả').map((c) => <option key={c}>{c}</option>)}</select>
                      <input type="number" required placeholder="Giá bán (VNĐ)" value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: e.target.value })} className="px-3 py-2 rounded-xl border bg-white text-sm" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <input placeholder="Link ảnh (URL)" value={pForm.image} onChange={(e) => setPForm({ ...pForm, image: e.target.value })} className="px-3 py-2 rounded-xl border bg-white text-sm" />
                      <input placeholder="Thông số ngắn" value={pForm.specs} onChange={(e) => setPForm({ ...pForm, specs: e.target.value })} className="px-3 py-2 rounded-xl border bg-white text-sm" />
                    </div>
                    <button type="submit" className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold">{editP ? 'Cập nhật' : 'Lưu sản phẩm'}</button>
                  </form>
                  <div className="space-y-2">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl border gap-2">
                        <div className="flex items-center gap-2.5 min-w-0"><img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" /><div className="min-w-0"><p className="text-sm font-bold truncate">{p.name}</p><p className="text-xs text-stone-500">{p.category} • {vnd(p.price)}</p></div></div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditP(p); setPForm(p); }} className="p-2 rounded-lg border"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => setProducts(products.filter((x) => x.id !== p.id))} className="p-2 rounded-lg border text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === 'orders' && (
                <div className="space-y-2.5">
                  {orders.length === 0 ? <p className="text-sm text-stone-500 text-center py-6">Chưa có đơn hàng.</p> : orders.map((o) => (
                    <div key={o.id} className="p-3.5 rounded-2xl border space-y-1">
                      <div className="flex justify-between text-sm font-bold"><span>{o.id} • {o.customerName}</span><span className="text-xs text-stone-500">{o.createdAt}</span></div>
                      <p className="text-xs text-stone-600">{o.customerPhone} • {o.customerEmail} • {o.address}</p>
                      <div className="flex justify-between items-center pt-2 border-t"><span className="font-bold text-amber-700 text-sm">{vnd(o.total)}</span>
                        <select value={o.status} onChange={(e) => setOrders(orders.map((x) => x.id === o.id ? { ...x, status: e.target.value } : x))} className="px-2 py-1 rounded-lg border text-xs"><option>Chờ xác nhận</option><option>Đã thanh toán</option><option>Đang giao hàng</option><option>Hoàn thành</option></select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'emailjs' && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <input placeholder="Service ID" value={cfg.serviceId} onChange={(e) => setCfg({ ...cfg, serviceId: e.target.value })} className="px-3 py-2 rounded-xl border text-sm" />
                    <input placeholder="Template ID" value={cfg.templateId} onChange={(e) => setCfg({ ...cfg, templateId: e.target.value })} className="px-3 py-2 rounded-xl border text-sm" />
                    <input placeholder="Public Key" value={cfg.publicKey} onChange={(e) => setCfg({ ...cfg, publicKey: e.target.value })} className="px-3 py-2 rounded-xl border text-sm" />
                    <input placeholder="Email phản hồi" value={cfg.adminEmail} onChange={(e) => setCfg({ ...cfg, adminEmail: e.target.value })} className="px-3 py-2 rounded-xl border text-sm" />
                  </div>
                  <button type="button" onClick={() => msg('Đã lưu cấu hình EmailJS')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"><Send className="w-3.5 h-3.5" />Lưu Cấu Hình</button>
                  <p className="text-xs text-stone-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-700" />Biến EmailJS: to_name, to_email, order_id, order_items, total_amount, payment_method, shipping_address</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
                  }
                                                                                                               
