import React, { useState, useEffect, useRef } from 'react';

// --- ICONS (Inline SVG) ---
const ShoppingCartIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const HeartIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const SettingsIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const MusicIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Đã có lỗi xảy ra!</h2>
          <p className="text-gray-600 mb-6">Ứng dụng gặp sự cố. Vui lòng khôi phục phiên làm việc để làm sạch bộ nhớ.</p>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            Khôi phục phiên làm việc
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- UTILITIES ---
const convertDriveLink = (url) => {
  if (!url) return '';
  const driveRegex = /(?:drive\.google\.com\/.*(?:id=|d\/)|open\?id=)([\w-]+)/;
  const match = url.match(driveRegex);
  return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
};

const safeParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    return fallback;
  }
};

const INITIAL_CONFIG = {
  storeName: 'Melody Store',
  bannerTitle: 'Chào mừng đến với Melody Store',
  bannerSubtitle: 'Trải nghiệm mua sắm & âm thanh đỉnh cao',
  bannerDesc: 'Khám phá bộ sưu tập thiết bị âm thanh, nhạc cụ và phụ kiện chính hãng. Nhấn biểu tượng trái tim để lưu ngay sản phẩm yêu thích vào giỏ hàng!',
  bannerBgColor: 'from-purple-900 to-indigo-900',
  emailContact: 'cskh@melodystore.vn'
};

// --- MAIN APP COMPONENT ---
function MelodyStoreApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [config, setConfig] = useState(() => safeParse('melody_config', INITIAL_CONFIG));
  const [products, setProducts] = useState(() => safeParse('melody_products', []));
  const [cart, setCart] = useState(() => safeParse('melody_cart', []));
  
  useEffect(() => {
    localStorage.setItem('melody_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('melody_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('melody_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle Note Drop Effect on Load
  const [showNotes, setShowNotes] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowNotes(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-purple-700">
            <MusicIcon />
            <h1 className="text-2xl font-extrabold">{config.storeName}</h1>
          </div>
          <div className="flex items-center space-x-6 text-gray-600">
            {isAdmin ? (
               <button onClick={() => setIsAdmin(false)} className="text-sm font-semibold hover:text-purple-600">
                 Quay lại Cửa hàng
               </button>
            ) : (
               <div className="relative cursor-pointer hover:text-purple-600">
                 <ShoppingCartIcon />
                 {cart.length > 0 && (
                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                     {cart.length}
                   </span>
                 )}
               </div>
            )}
          </div>
        </div>
      </header>

      {/* FALLING NOTES EFFECT */}
      {showNotes && !isAdmin && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex justify-around opacity-50">
           <span className="animate-bounce text-4xl text-purple-500 mt-10">♪</span>
           <span className="animate-bounce text-5xl text-indigo-500 mt-32 delay-100">♫</span>
           <span className="animate-bounce text-3xl text-pink-500 mt-20 delay-200">♪</span>
           <span className="animate-bounce text-6xl text-purple-400 mt-5 delay-300">♬</span>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-8 border-b pb-4">
              <SettingsIcon />
              <h2 className="text-3xl font-bold text-gray-800">Quản trị Admin Dashboard</h2>
            </div>
            <p className="text-gray-600 mb-6">Quản lý sản phẩm, danh mục, đơn hàng và cấu hình hệ thống.</p>
            {/* Dummy Admin Content */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
               <h3 className="font-semibold text-purple-800 mb-2">Cấu hình Banner</h3>
               <div className="space-y-4">
                 <input type="text" value={config.bannerTitle} onChange={e => setConfig({...config, bannerTitle: e.target.value})} className="w-full p-2 border rounded" placeholder="Tiêu đề banner" />
                 <textarea value={config.bannerDesc} onChange={e => setConfig({...config, bannerDesc: e.target.value})} className="w-full p-2 border rounded" placeholder="Mô tả banner" />
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* BANNER */}
            <div className={`rounded-3xl p-12 text-white bg-gradient-to-r ${config.bannerBgColor} shadow-2xl relative overflow-hidden`}>
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-sm font-medium mb-4 backdrop-blur-sm">
                  ♪ {config.bannerSubtitle}
                </span>
                <h2 className="text-5xl font-extrabold mb-6 leading-tight">{config.bannerTitle}</h2>
                <p className="text-lg text-purple-100 mb-8">{config.bannerDesc}</p>
                <button className="bg-white text-purple-900 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50 transition transform hover:scale-105">
                  Khám phá ngay
                </button>
              </div>
            </div>
            
            {/* PRODUCT LIST (Placeholder) */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm nổi bật</h3>
              {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500">Chưa có sản phẩm nào. Truy cập Admin để thêm.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Map products here */}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center mt-auto">
        <p>Bản quyền thuộc về © Tiendat 2026</p>
        <button 
          onClick={() => {
            setIsAdmin(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-4 text-xs hover:text-white transition cursor-pointer underline"
        >
          Truy cập Trang Quản trị Admin
        </button>
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <MelodyStoreApp />
    </ErrorBoundary>
  );
}
