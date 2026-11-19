import React, { useState, useEffect, useRef, useMemo } from 'react';

// ==========================================
// 1. INLINE SVG ICONS (Zero external deps)
// ==========================================
const Icon = ({ name, className = "w-5 h-5", fill = "none" }) => {
  const icons = {
    music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
    volume2: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>,
    volumeX: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    zoomIn: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></>,
    zoomOut: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    minus: <line x1="5" y1="12" x2="19" y2="12" />,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    checkCircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    truck: <><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
    creditCard: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    banknote: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></>,
    barChart: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
    package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
    folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name] || null}
    </svg>
  );
};

// ==========================================
// 2. ERROR BOUNDARY
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Đã xảy ra sự cố hiển thị</h2>
            <p className="text-sm text-slate-500 mb-6">
              Dữ liệu bộ nhớ tạm có thể bị xung đột. Nhấn nút bên dưới để khôi phục trạng thái ban đầu.
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch (e) {}
                window.location.reload();
              }}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Khôi phục hệ thống
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 3. ISOLATED CUSTOMER SESSION & STORAGE HELPERS
// ==========================================
// Mỗi phiên truy cập (tab / khách hàng riêng) được cấp một Session ID độc lập
// để giỏ hàng và danh sách yêu thích không bao giờ bị trùng hoặc rò rỉ giữa các khách hàng.
const getCustomerSessionId = () => {
  try {
    let sid = sessionStorage.getItem('ms_customer_session_id');
    if (!sid) {
      const rand =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sid = `cust_${rand}`;
      sessionStorage.setItem('ms_customer_session_id', sid);
    }
    return sid;
  } catch (e) {
    return `cust_mem_${Date.now()}`;
  }
};

const resetCustomerSessionId = () => {
  try {
    const oldSid = sessionStorage.getItem('ms_customer_session_id');
    if (oldSid) {
      sessionStorage.removeItem(`ms_cart_${oldSid}`);
      sessionStorage.removeItem(`ms_fav_${oldSid}`);
    }
    const rand =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const newSid = `cust_${rand}`;
    sessionStorage.setItem('ms_customer_session_id', newSid);
    return newSid;
  } catch (e) {
    return `cust_mem_${Date.now()}`;
  }
};

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);
};

// Dữ liệu dùng chung toàn cửa hàng (Sản phẩm, Danh mục, Đơn hàng, Cấu hình) -> localStorage
const safeLoadSharedStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch (e) {
    return fallback;
  }
};

const safeSaveSharedStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
};

// Dữ liệu riêng biệt cho từng phiên khách hàng (Giỏ hàng, Yêu thích) -> sessionStorage theo Session ID
const safeLoadSessionData = (key, fallback) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

const safeSaveSessionData = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
};

// Tự động chuyển đổi link Google Drive & Google Images sang link hiển thị trực tiếp
const normalizeImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();

  if (url.includes('google.com/imgres') || url.includes('imgurl=')) {
    try {
      const parsed = new URL(url);
      const imgUrl = parsed.searchParams.get('imgurl');
      if (imgUrl) return decodeURIComponent(imgUrl);
    } catch (e) {}
  }

  const drivePatterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/,
    /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of drivePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  return url;
};

// Nén ảnh tải lên từ thiết bị qua HTML5 Canvas
const compressImageFile = (file, maxWidth = 900, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Định dạng ảnh không hợp lệ'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Tai nghe & Loa', description: 'Tai nghe chống ồn, loa Bluetooth di động cao cấp' },
  { id: 'cat-2', name: 'Nhạc cụ', description: 'Đàn Guitar, Piano điện, Ukulele chính hãng' },
  { id: 'cat-3', name: 'Thiết bị phòng thu', description: 'Micro thu âm, Soundcard, tai nghe kiểm âm' },
  { id: 'cat-4', name: 'Phụ kiện âm thanh', description: 'Dây cáp, chân micro, giá đỡ nhạc cụ' },
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-101',
    name: 'Tai nghe Studio Không Dây Sony WH-1000XM5',
    category: 'Tai nghe & Loa',
    price: 6490000,
    stock: 18,
    description: 'Công nghệ chống ồn chủ động hàng đầu với 8 micro, thời lượng pin 30 giờ, hỗ trợ âm thanh Hi-Res Audio LDAC sắc nét từng chi tiết.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'prod-102',
    name: 'Loa Bluetooth Marshall Acton III Vintage',
    category: 'Tai nghe & Loa',
    price: 7290000,
    stock: 12,
    description: 'Thiết kế cổ điển bọc da sang trọng, âm trường rộng mở đặc trưng của Marshall với công suất 60W mạnh mẽ cho không gian sống.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'prod-103',
    name: 'Đàn Guitar Acoustic Gỗ Nguyên Tấm Yamaha FG800',
    category: 'Nhạc cụ',
    price: 5850000,
    stock: 9,
    description: 'Mặt đàn gỗ Vân Sam nguyên tấm (Solid Spruce) cho âm thanh vang ấm, cân bằng hoàn hảo cho cả đệm hát và Fingerstyle.',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'prod-104',
    name: 'Micro Thu Âm Condenser Chuyên Nghiệp Rode NT1',
    category: 'Thiết bị phòng thu',
    price: 6190000,
    stock: 15,
    description: 'Độ ồn tự thân cực thấp chỉ 4dBA, dải tần rộng trung thực, lý tưởng cho thu âm giọng hát, podcast và nhạc cụ phòng thu.',
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'prod-105',
    name: 'Đàn Piano Điện Roland FP-30X 88 Phím Nặng',
    category: 'Nhạc cụ',
    price: 16900000,
    stock: 6,
    description: 'Bàn phím PHA-4 Standard mô phỏng độ nặng phím đàn cơ chân thực, công nghệ âm thanh SuperNATURAL Piano sống động.',
    images: [
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'prod-106',
    name: 'Bộ Dây Đeo & Cáp Âm Thanh Chống Nhiễu Cao Cấp',
    category: 'Phụ kiện âm thanh',
    price: 490000,
    stock: 40,
    description: 'Lõi đồng nguyên chất mạ vàng 24K chống oxy hóa, truyền tải tín hiệu ổn định không suy hao.',
    images: [
      'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80',
    ],
  },
];

const DEFAULT_SETTINGS = {
  companyName: 'Melody Store',
  hotline: '1900 6868',
  supportEmail: 'cskh@melodystore.vn',
  companyAddress: '128 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  bankName: 'Vietcombank (VCB)',
  bankAccountNumber: '1029384756',
  bankAccountName: 'CONG TY TNHH MELODY STORE',
  bgMusicEnabled: true,
  fallingNotesEnabled: true,
  bannerBadge: 'Trải nghiệm mua sắm & âm thanh đỉnh cao',
  bannerTitle: 'Chào mừng đến với Melody Store',
  bannerSubtitle: 'Khám phá bộ sưu tập thiết bị âm thanh, nhạc cụ và phụ kiện chính hãng. Nhấn biểu tượng trái tim để lưu ngay sản phẩm yêu thích vào giỏ hàng!',
  bannerGradient: 'from-slate-900 via-indigo-950 to-purple-900',
  bannerImageUrl: '',
  adminUsername: 'admin',
  adminPassword: '123',
};

const DEFAULT_ORDERS = [
  {
    id: 'MS-20261118-8421',
    customerName: 'Nguyễn Minh Anh',
    phone: '0909123456',
    email: 'minhanh@example.com',
    address: '45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
    paymentMethod: 'COD',
    items: [
      { id: 'prod-101', name: 'Tai nghe Studio Không Dây Sony WH-1000XM5', price: 6490000, quantity: 1 },
    ],
    totalAmount: 6490000,
    status: 'Hoàn thành',
    createdAt: '18/11/2026 14:20',
    estimatedDelivery: '21/11/2026',
  },
];

// ==========================================
// 4. WEB AUDIO SYNTHESIZER (Nhạc nền nhẹ)
// ==========================================
class AmbientMelodyPlayer {
  constructor() {
    this.ctx = null;
    this.interval = null;
    this.isPlaying = false;
    this.step = 0;
    this.notes = [261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63];
  }

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx) this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.isPlaying = true;
      this.playNote();
      this.interval = setInterval(() => this.playNote(), 900);
    } catch (e) {}
  }

  playNote() {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.notes[this.step % this.notes.length], this.ctx.currentTime);
      this.step++;

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.86);
    } catch (e) {}
  }

  stop() {
    this.isPlaying = false;
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
}

// ==========================================
// 5. FALLING MUSIC NOTES OVERLAY (5 GIÂY)
// ==========================================
const FallingNotesOverlay = ({ active }) => {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [active]);

  const notes = useMemo(() => {
    const symbols = ['♪', '♫', '♩', '♬'];
    const colors = ['text-indigo-500', 'text-purple-500', 'text-pink-500', 'text-sky-500', 'text-amber-500'];
    return Array.from({ length: 24 }, (_, idx) => ({
      id: idx,
      symbol: symbols[idx % symbols.length],
      color: colors[idx % colors.length],
      left: `${(idx * 4.1 + 2) % 96}%`,
      delay: `${(idx % 8) * 0.28}s`,
      duration: `${2.8 + (idx % 4) * 0.55}s`,
      size: `${20 + (idx % 4) * 7}px`,
    }));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes melodyFall {
          0% { transform: translateY(-60px) rotate(0deg) scale(0.8); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.85; }
          100% { transform: translateY(105vh) rotate(360deg) scale(1.1); opacity: 0; }
        }
      `}</style>
      {notes.map((n) => (
        <span
          key={n.id}
          className={`absolute top-0 font-bold select-none drop-shadow-sm ${n.color}`}
          style={{
            left: n.left,
            fontSize: n.size,
            animation: `melodyFall ${n.duration} ease-in ${n.delay} forwards`,
          }}
        >
          {n.symbol}
        </span>
      ))}
    </div>
  );
};

// ==========================================
// 6. SMART IMAGE COMPONENT (Fallback Drive)
// ==========================================
const SmartProductImage = ({ src, alt, className = "" }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setTriedFallback(false);
  }, [src]);

  const handleError = () => {
    if (!triedFallback && currentSrc && currentSrc.includes('lh3.googleusercontent.com/d/')) {
      const id = currentSrc.split('/d/')[1];
      setTriedFallback(true);
      setCurrentSrc(`https://drive.google.com/thumbnail?id=${id}&sz=w1000`);
      return;
    }
    setCurrentSrc('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80');
  };

  return <img src={currentSrc} alt={alt} onError={handleError} className={className} />;
};

// ==========================================
// 7. MAIN APPLICATION
// ==========================================
function MelodyStoreMain() {
  // Dọn dẹp khóa giỏ hàng/yêu thích dùng chung cũ (nếu có) để chống rò rỉ giữa các khách hàng
  useEffect(() => {
    try {
      localStorage.removeItem('ms_cart_v2');
      localStorage.removeItem('ms_favorites_v2');
      localStorage.removeItem('melody_cart');
    } catch (e) {}
  }, []);

  // Mã phiên khách hàng độc lập cho từng tab / từng khách truy cập
  const [sessionId, setSessionId] = useState(() => getCustomerSessionId());

  // Dữ liệu dùng chung của Cửa hàng (Sản phẩm, Danh mục, Cấu hình, Đơn hàng)
  const [products, setProducts] = useState(() => safeLoadSharedStorage('ms_products_v2', DEFAULT_PRODUCTS));
  const [categories, setCategories] = useState(() => safeLoadSharedStorage('ms_categories_v2', DEFAULT_CATEGORIES));
  const [settings, setSettings] = useState(() => safeLoadSharedStorage('ms_settings_v2', DEFAULT_SETTINGS));
  const [orders, setOrders] = useState(() => safeLoadSharedStorage('ms_orders_v2', DEFAULT_ORDERS));

  // Dữ liệu GIỎ HÀNG & YÊU THÍCH RIÊNG BIỆT theo từng phiên khách hàng (mặc định trống [])
  const [favorites, setFavorites] = useState(() => safeLoadSessionData(`ms_fav_${sessionId}`, []));
  const [cart, setCart] = useState(() => safeLoadSessionData(`ms_cart_${sessionId}`, []));

  // Sync Shared Data -> localStorage
  useEffect(() => { safeSaveSharedStorage('ms_products_v2', products); }, [products]);
  useEffect(() => { safeSaveSharedStorage('ms_categories_v2', categories); }, [categories]);
  useEffect(() => { safeSaveSharedStorage('ms_settings_v2', settings); }, [settings]);
  useEffect(() => { safeSaveSharedStorage('ms_orders_v2', orders); }, [orders]);

  // Sync Isolated Customer Session Data -> sessionStorage (chỉ thuộc về phiên khách hàng hiện tại)
  useEffect(() => { safeSaveSessionData(`ms_fav_${sessionId}`, favorites); }, [favorites, sessionId]);
  useEffect(() => { safeSaveSessionData(`ms_cart_${sessionId}`, cart); }, [cart, sessionId]);

  // Lắng nghe sự kiện storage từ tab khác: chỉ đồng bộ sản phẩm/danh mục/cấu hình, KHÔNG bao giờ đồng bộ giỏ hàng của khách khác
  useEffect(() => {
    const handleStorageSync = (e) => {
      if (!e.key || !e.newValue) return;
      try {
        if (e.key === 'ms_products_v2') setProducts(JSON.parse(e.newValue));
        if (e.key === 'ms_categories_v2') setCategories(JSON.parse(e.newValue));
        if (e.key === 'ms_settings_v2') setSettings(JSON.parse(e.newValue));
        if (e.key === 'ms_orders_v2') setOrders(JSON.parse(e.newValue));
      } catch (err) {}
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // UI Navigation & Filters
  const [viewMode, setViewMode] = useState('store'); // 'store' | 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => safeLoadSessionData('ms_admin_auth', false));
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  // Modals & Drawers
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrderEmail, setConfirmedOrderEmail] = useState(null);

  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    email: '',
    paymentMethod: '', // 'COD' | 'BANK'
  });
  const [submittedOrderIds, setSubmittedOrderIds] = useState([]);

  // Audio Player
  const playerRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    playerRef.current = new AmbientMelodyPlayer();
    return () => {
      if (playerRef.current) playerRef.current.stop();
    };
  }, []);

  const toggleMusic = () => {
    if (!playerRef.current) return;
    if (musicPlaying) {
      playerRef.current.stop();
      setMusicPlaying(false);
    } else {
      playerRef.current.start();
      setMusicPlaying(true);
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Xác thực đăng nhập trang quản trị Admin
  const handleRequestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAdminLoginForm({ username: '', password: '' });
      setAdminLoginError('');
      setShowAdminPass(false);
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    const expectedUser = (settings.adminUsername || 'admin').trim();
    const expectedPass = settings.adminPassword || '123';
    if (adminLoginForm.username.trim() === expectedUser && adminLoginForm.password === expectedPass) {
      setIsAdminAuthenticated(true);
      safeSaveSessionData('ms_admin_auth', true);
      setIsAdminLoginOpen(false);
      setAdminLoginError('');
      setViewMode('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Đăng nhập quản trị thành công!', 'success');
    } else {
      setAdminLoginError('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    safeSaveSessionData('ms_admin_auth', false);
    setViewMode('store');
    showToast('Đã đăng xuất khỏi trang quản trị', 'info');
  };

  // Bắt đầu phiên mua sắm mới (nếu nhiều khách dùng chung 1 máy/trình duyệt tại quầy)
  const handleNewCustomerSession = () => {
    const freshSid = resetCustomerSessionId();
    setSessionId(freshSid);
    setFavorites([]);
    setCart([]);
    setCheckoutForm({ customerName: '', phone: '', address: '', email: '', paymentMethod: '' });
    showToast('Đã tạo giỏ hàng mới cho khách hàng tiếp theo!', 'info');
  };

  // ==========================================
  // FAVORITE & CART LOGIC (Cô lập tuyệt đối theo từng khách hàng)
  // ==========================================
  const toggleFavorite = (product, e) => {
    if (e) e.stopPropagation();
    const isFav = favorites.includes(product.id);
    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== product.id));
      showToast(`Đã bỏ yêu thích "${product.name}"`, 'info');
    } else {
      if (product.stock <= 0) {
        showToast('Sản phẩm hiện đã hết hàng!', 'error');
        return;
      }
      setFavorites((prev) => [...prev, product.id]);
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) return prev;
        return [...prev, { productId: product.id, quantity: 1 }];
      });
      showToast(`Đã thích & thêm "${product.name}" vào giỏ hàng của bạn!`, 'success');
    }
  };

  const addToCart = (product, qty = 1) => {
    if (product.stock <= 0) {
      showToast('Sản phẩm tạm hết hàng!', 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + qty);
        return prev.map((item) => (item.productId === product.id ? { ...item, quantity: nextQty } : item));
      }
      return [...prev, { productId: product.id, quantity: Math.min(product.stock, qty) }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng của bạn`, 'success');
  };

  const updateCartQty = (productId, delta) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > product.stock) {
            showToast(`Chỉ còn ${product.stock} sản phẩm trong kho`, 'error');
            return item;
          }
          return { ...item, quantity: newQty };
        })
        .filter(Boolean)
    );
  };

  const removeCartItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Enriched Cart Items (Chỉ tính từ giỏ hàng riêng của khách hiện tại)
  const cartDetails = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...item, product, subtotal: product.price * item.quantity };
      })
      .filter(Boolean);
  }, [cart, products]);

  const totalCartItems = useMemo(() => cartDetails.reduce((sum, i) => sum + i.quantity, 0), [cartDetails]);
  const totalCartAmount = useMemo(() => cartDetails.reduce((sum, i) => sum + i.subtotal, 0), [cartDetails]);

  // ==========================================
  // CHECKOUT VALIDATION & ORDER SUBMISSION
  // ==========================================
  const checkoutErrors = useMemo(() => {
    const errs = {};
    if (!checkoutForm.customerName.trim() || checkoutForm.customerName.trim().length < 2) {
      errs.customerName = 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự)';
    }
    const cleanPhone = checkoutForm.phone.replace(/\s+/g, '');
    if (!/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(cleanPhone)) {
      errs.phone = 'Số điện thoại Việt Nam không hợp lệ (VD: 0909123456)';
    }
    if (!checkoutForm.address.trim() || checkoutForm.address.trim().length < 8) {
      errs.address = 'Vui lòng nhập địa chỉ giao hàng đầy đủ';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.email.trim())) {
      errs.email = 'Địa chỉ email không đúng định dạng';
    }
    if (!checkoutForm.paymentMethod) {
      errs.paymentMethod = 'Vui lòng chọn 1 phương thức thanh toán';
    }
    return errs;
  }, [checkoutForm]);

  const isCheckoutValid = Object.keys(checkoutErrors).length === 0 && cartDetails.length > 0;

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!isCheckoutValid) return;

    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MS-${datePart}-${randPart}`;

    if (submittedOrderIds.includes(orderId)) return;

    const deliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const formattedOrderDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const formattedDeliveryDate = `${String(deliveryDate.getDate()).padStart(2, '0')}/${String(deliveryDate.getMonth() + 1).padStart(2, '0')}/${deliveryDate.getFullYear()}`;

    const newOrder = {
      id: orderId,
      sessionId,
      customerName: checkoutForm.customerName.trim(),
      phone: checkoutForm.phone.trim(),
      email: checkoutForm.email.trim(),
      address: checkoutForm.address.trim(),
      paymentMethod: checkoutForm.paymentMethod,
      items: cartDetails.map((c) => ({
        id: c.product.id,
        name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
      })),
      totalAmount: totalCartAmount,
      status: 'Chờ xác nhận',
      createdAt: formattedOrderDate,
      estimatedDelivery: formattedDeliveryDate,
    };

    setSubmittedOrderIds((prev) => [...prev, orderId]);
    setOrders((prev) => [newOrder, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const bought = cartDetails.find((c) => c.product.id === p.id);
        if (!bought) return p;
        return { ...p, stock: Math.max(0, p.stock - bought.quantity) };
      })
    );
    // Làm sạch giỏ hàng & yêu thích của phiên hiện tại sau khi đặt hàng thành công
    setCart([]);
    setFavorites([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCheckoutForm({ customerName: '', phone: '', address: '', email: '', paymentMethod: '' });
    setConfirmedOrderEmail(newOrder);
    showToast(`Đặt hàng thành công! Mã đơn ${orderId}`, 'success');
  };

  // Filtered Storefront Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // ==========================================
  // ADMIN STATE & HANDLERS
  // ==========================================
  const [adminTab, setAdminTab] = useState('stats'); // 'stats' | 'products' | 'categories' | 'orders' | 'settings'
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    images: [],
  });
  const [imageLinkInput, setImageLinkInput] = useState('');
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  const openAddProductModal = () => {
    setEditingProduct({ isNew: true });
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Tai nghe & Loa',
      price: '',
      stock: '10',
      description: '',
      images: [],
    });
    setImageLinkInput('');
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
      images: [...(product.images || [])],
    });
    setImageLinkInput('');
  };

  const handleUploadProductFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ', 'error');
      return;
    }
    setIsUploadingImg(true);
    try {
      const compressed = await Promise.all(files.map((f) => compressImageFile(f)));
      setProductForm((prev) => ({ ...prev, images: [...prev.images, ...compressed] }));
      showToast(`Đã tải lên ${compressed.length} hình ảnh!`, 'success');
    } catch (err) {
      showToast('Lỗi xử lý hình ảnh từ thiết bị', 'error');
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleAddImageLink = () => {
    const normalized = normalizeImageUrl(imageLinkInput);
    if (!normalized || !/^https?:\/\//i.test(normalized)) {
      showToast('Vui lòng dán đường dẫn ảnh hoặc link Google Drive hợp lệ', 'error');
      return;
    }
    setProductForm((prev) => ({ ...prev, images: [...prev.images, normalized] }));
    setImageLinkInput('');
    showToast('Đã thêm đường dẫn ảnh!', 'success');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || Number(productForm.price) <= 0) {
      showToast('Vui lòng nhập tên sản phẩm và giá bán hợp lệ', 'error');
      return;
    }
    const finalImages =
      productForm.images.length > 0
        ? productForm.images
        : ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'];

    const payload = {
      id: editingProduct.isNew ? `prod-${Date.now()}` : editingProduct.id,
      name: productForm.name.trim(),
      category: productForm.category || categories[0]?.name || 'Khác',
      price: Number(productForm.price),
      stock: Math.max(0, Number(productForm.stock) || 0),
      description: productForm.description.trim(),
      images: finalImages,
    };

    if (editingProduct.isNew) {
      setProducts((prev) => [payload, ...prev]);
      showToast('Đã thêm sản phẩm mới!', 'success');
    } else {
      setProducts((prev) => prev.map((p) => (p.id === payload.id ? payload : p)));
      showToast('Đã cập nhật sản phẩm!', 'success');
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
    setFavorites((prev) => prev.filter((fid) => fid !== id));
    showToast('Đã xóa sản phẩm', 'info');
  };

  // Category CRUD
  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Tên danh mục đã tồn tại!', 'error');
      return;
    }
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, name: trimmed, description: newCatDesc.trim() || 'Danh mục sản phẩm chính hãng' },
    ]);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Đã thêm danh mục "${trimmed}"`, 'success');
  };

  const handleSaveEditCategory = (cat) => {
    const trimmed = editCatName.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, name: trimmed, description: editCatDesc.trim() } : c))
    );
    setProducts((prev) => prev.map((p) => (p.category === cat.name ? { ...p, category: trimmed } : p)));
    setEditingCatId(null);
    showToast('Đã cập nhật danh mục!', 'success');
  };

  const handleDeleteCategory = (cat) => {
    if (categories.length <= 1) {
      showToast('Cần giữ lại ít nhất 1 danh mục!', 'error');
      return;
    }
    const fallbackCat = categories.find((c) => c.id !== cat.id)?.name || 'Khác';
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setProducts((prev) => prev.map((p) => (p.category === cat.name ? { ...p, category: fallbackCat } : p)));
    showToast(`Đã xóa danh mục "${cat.name}"`, 'info');
  };

  const handleBannerUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const compressed = await compressImageFile(file, 1200, 0.82);
      setSettings((prev) => ({ ...prev, bannerImageUrl: compressed }));
      showToast('Đã tải ảnh nền Banner!', 'success');
    } catch (e) {
      showToast('Không thể tải ảnh Banner', 'error');
    }
  };

  // Admin Revenue Stats
  const revenueStats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Đã hủy');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const completedRevenue = orders
      .filter((o) => o.status === 'Hoàn thành')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    return { totalRevenue, completedRevenue, totalOrders: orders.length, totalStock };
  }, [orders, products]);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Hiệu ứng nốt nhạc rơi 5 giây đầu */}
      <FallingNotesOverlay active={settings.fallingNotesEnabled && viewMode === 'store'} />

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-5 right-5 z-[70] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium flex items-center gap-2 transition-all ${
            toastMsg.type === 'error'
              ? 'bg-rose-600'
              : toastMsg.type === 'info'
              ? 'bg-slate-800'
              : 'bg-emerald-600'
          }`}
        >
          <Icon name={toastMsg.type === 'error' ? 'alert' : 'checkCircle'} className="w-4 h-4 shrink-0" />
          <span>{toastMsg.message}</span>
        </div>
      )}

      {/* ==========================================
          HEADER
      ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <button
            onClick={() => {
              setViewMode('store');
              setSelectedCategory('Tất cả');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <Icon name="music" className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent block leading-none">
                {settings.companyName}
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Âm thanh & Nhạc cụ Chính hãng
              </span>
            </div>
          </button>

          {/* Search bar on Storefront */}
          {viewMode === 'store' && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
              <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tai nghe, loa, đàn guitar, micro..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent focus:border-indigo-400 focus:bg-white rounded-full text-sm outline-none transition"
              />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {settings.bgMusicEnabled && (
              <button
                onClick={toggleMusic}
                title={musicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền thư giãn'}
                className={`p-2.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition ${
                  musicPlaying
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon name={musicPlaying ? 'volume2' : 'volumeX'} className="w-4 h-4" />
                <span className="hidden lg:inline">{musicPlaying ? 'Đang phát nhạc' : 'Nhạc nền'}</span>
              </button>
            )}

            {viewMode === 'admin' && isAdminAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('store')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition shadow-sm"
                >
                  <Icon name="arrowLeft" className="w-4 h-4" />
                  <span>Cửa hàng</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  title="Đăng xuất tài khoản Admin"
                  className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs sm:text-sm font-semibold hover:bg-rose-100 flex items-center gap-1.5 transition"
                >
                  <Icon name="logOut" className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 text-sm font-semibold transition shadow-sm"
              >
                <Icon name="cart" className="w-4 h-4" />
                <span className="hidden sm:inline">Giỏ hàng</span>
                <span className="bg-white text-indigo-700 text-xs font-extrabold px-1.5 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==========================================
          STOREFRONT VIEW
      ========================================== */}
      {viewMode === 'store' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          {/* HERO BANNER */}
          <section
            className={`relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br ${settings.bannerGradient} text-white p-7 sm:p-12`}
          >
            {settings.bannerImageUrl && (
              <>
                <SmartProductImage
                  src={settings.bannerImageUrl}
                  alt="Banner"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px]" />
              </>
            )}
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-medium text-indigo-100 border border-white/15">
                <span>♪</span>
                <span>{settings.bannerBadge}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {settings.bannerTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {settings.bannerSubtitle}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#product-catalog"
                  className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-indigo-50 transition shadow-lg"
                >
                  Khám phá sản phẩm
                </a>
              </div>
            </div>
          </section>

          {/* MOBILE SEARCH & CATEGORY FILTER */}
          <section id="product-catalog" className="space-y-4">
            <div className="md:hidden relative">
              <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedCategory('Tất cả')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                    selectedCategory === 'Tất cả'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tất cả ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.name).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                        selectedCategory === cat.name
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-slate-500">
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </span>
            </div>
          </section>

          {/* PRODUCT GRID */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 font-medium">Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isFav = favorites.includes(product.id);
                const mainImg = product.images?.[0] || '';
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      setActiveProduct(product);
                      setActiveImageIdx(0);
                      setZoomLevel(1);
                    }}
                    className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <SmartProductImage
                        src={mainImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-sm text-white text-xs font-medium">
                        {product.category}
                      </span>

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(product, e)}
                        title={isFav ? 'Bỏ yêu thích' : 'Yêu thích & tự động thêm vào giỏ hàng'}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition ${
                          isFav
                            ? 'bg-rose-500 text-white scale-105'
                            : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
                        }`}
                      >
                        <Icon name="heart" className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                      </button>

                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                          <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-indigo-600 transition">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{product.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-lg font-extrabold text-indigo-600">{formatVND(product.price)}</div>
                          <div className="text-[11px] text-slate-400">Kho: {product.stock} sản phẩm</div>
                        </div>

                        <button
                          type="button"
                          disabled={product.stock <= 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                            setIsCheckoutOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-indigo-600 disabled:bg-slate-300 transition flex items-center gap-1.5"
                        >
                          <Icon name="cart" className="w-3.5 h-3.5" />
                          <span>Mua hàng</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </main>
      )}

      {/* ==========================================
          ADMIN DASHBOARD VIEW
      ========================================== */}
      {viewMode === 'admin' && isAdminAuthenticated && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Bảng Quản Trị Admin</h1>
              <p className="text-sm text-slate-500">
                Quản lý toàn diện sản phẩm, danh mục, đơn hàng, doanh thu và cấu hình {settings.companyName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'stats', label: 'Thống kê', icon: 'barChart' },
                { id: 'products', label: `Sản phẩm (${products.length})`, icon: 'package' },
                { id: 'categories', label: `Danh mục (${categories.length})`, icon: 'folder' },
                { id: 'orders', label: `Đơn hàng (${orders.length})`, icon: 'clipboard' },
                { id: 'settings', label: 'Cấu hình & Banner', icon: 'settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                    adminTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: THỐNG KÊ DOANH THU */}
          {adminTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Tổng doanh thu dự kiến</span>
                  <div className="text-2xl font-extrabold text-indigo-600 mt-2">
                    {formatVND(revenueStats.totalRevenue)}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Doanh thu đã hoàn thành</span>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-2">
                    {formatVND(revenueStats.completedRevenue)}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Tổng số đơn hàng</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{revenueStats.totalOrders} đơn</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Tổng tồn kho</span>
                  <div className="text-2xl font-extrabold text-purple-600 mt-2">{revenueStats.totalStock} sản phẩm</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Đơn hàng gần nhất</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                      <tr>
                        <th className="p-3">Mã đơn</th>
                        <th className="p-3">Khách hàng</th>
                        <th className="p-3">Thanh toán</th>
                        <th className="p-3">Tổng tiền</th>
                        <th className="p-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td className="p-3 font-bold text-indigo-600">{o.id}</td>
                          <td className="p-3">{o.customerName}</td>
                          <td className="p-3">{o.paymentMethod === 'BANK' ? 'Chuyển khoản' : 'Tiền mặt (COD)'}</td>
                          <td className="p-3 font-semibold">{formatVND(o.totalAmount)}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUẢN LÝ SẢN PHẨM */}
          {adminTab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-bold text-slate-900">Danh sách Sản phẩm</h2>
                <button
                  onClick={openAddProductModal}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
                >
                  <Icon name="plus" className="w-4 h-4" />
                  <span>Thêm sản phẩm mới</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3">Danh mục</th>
                      <th className="p-3">Giá bán</th>
                      <th className="p-3">Tồn kho</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="p-3 flex items-center gap-3">
                          <SmartProductImage
                            src={p.images?.[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-xs text-slate-400">{p.images?.length || 0} hình ảnh</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-indigo-600">{formatVND(p.price)}</td>
                        <td className="p-3">{p.stock}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 inline-flex"
                            title="Sửa"
                          >
                            <Icon name="edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 inline-flex"
                            title="Xóa"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUẢN LÝ DANH MỤC */}
          {adminTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form
                onSubmit={handleAddCategory}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 h-fit"
              >
                <h3 className="font-bold text-slate-900 text-base">Thêm Danh mục mới</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tên danh mục *</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="VD: Loa kiểm âm, Mixer..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả ngắn</label>
                  <textarea
                    rows={3}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Mô tả dòng sản phẩm..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  + Thêm danh mục
                </button>
              </form>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Danh sách Danh mục hiện có</h3>
                <div className="divide-y divide-slate-100">
                  {categories.map((cat) => {
                    const prodCount = products.filter((p) => p.category === cat.name).length;
                    const isEditing = editingCatId === cat.id;
                    return (
                      <div key={cat.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {isEditing ? (
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                              className="w-full px-3 py-1.5 border border-indigo-400 rounded-lg text-sm font-semibold"
                            />
                            <input
                              type="text"
                              value={editCatDesc}
                              onChange={(e) => setEditCatDesc(e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{cat.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                                {prodCount} sản phẩm
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEditCategory(cat)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={() => setEditingCatId(null)}
                                className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
                              >
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCatId(cat.id);
                                  setEditCatName(cat.name);
                                  setEditCatDesc(cat.description);
                                }}
                                className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                              >
                                <Icon name="edit" className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                              >
                                <Icon name="trash" className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUẢN LÝ ĐƠN HÀNG */}
          {adminTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Quản lý Đơn hàng Khách hàng</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-extrabold text-indigo-600 text-base">{order.id}</span>
                        <span className="text-xs text-slate-400 ml-3">{order.createdAt}</span>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const nextStatus = e.target.value;
                          setOrders((prev) =>
                            prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
                          );
                          showToast(`Đã cập nhật trạng thái đơn ${order.id}`, 'success');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 outline-none focus:border-indigo-500"
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <p><strong>Khách hàng:</strong> {order.customerName} — {order.phone}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Địa chỉ:</strong> {order.address}</p>
                      </div>
                      <div>
                        <p>
                          <strong>Thanh toán:</strong>{' '}
                          {order.paymentMethod === 'BANK' ? 'Chuyển khoản ngân hàng' : 'Tiền mặt (COD)'}
                        </p>
                        <p><strong>Dự kiến giao:</strong> {order.estimatedDelivery}</p>
                        <p className="text-sm font-extrabold text-indigo-600 mt-1">
                          Tổng thanh toán: {formatVND(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-semibold">{formatVND(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CẤU HÌNH HỆ THỐNG & BANNER */}
          {adminTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cài đặt Banner Trang chủ */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                  Tùy chỉnh Banner Trang chủ
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nhãn nhỏ phía trên (Badge)</label>
                  <input
                    type="text"
                    value={settings.bannerBadge}
                    onChange={(e) => setSettings({ ...settings, bannerBadge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tiêu đề chính Banner</label>
                  <input
                    type="text"
                    value={settings.bannerTitle}
                    onChange={(e) => setSettings({ ...settings, bannerTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả giới thiệu</label>
                  <textarea
                    rows={3}
                    value={settings.bannerSubtitle}
                    onChange={(e) => setSettings({ ...settings, bannerSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tông màu nền Gradient</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Tím Đêm Nhạc', val: 'from-slate-900 via-indigo-950 to-purple-900' },
                      { label: 'Xanh Đại Dương', val: 'from-slate-900 via-blue-950 to-cyan-900' },
                      { label: 'Đỏ Ruby Sân Khấu', val: 'from-zinc-900 via-rose-950 to-purple-950' },
                      { label: 'Xanh Ngọc Lục Bảo', val: 'from-slate-900 via-emerald-950 to-teal-900' },
                    ].map((g) => (
                      <button
                        key={g.val}
                        type="button"
                        onClick={() => setSettings({ ...settings, bannerGradient: g.val })}
                        className={`p-2 rounded-xl border text-xs font-semibold text-left flex items-center gap-2 ${
                          settings.bannerGradient === g.val ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${g.val} shrink-0`} />
                        <span>{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Ảnh nền Banner (Tùy chọn — tải từ máy hoặc dán link/Google Drive)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.bannerImageUrl}
                      onChange={(e) => setSettings({ ...settings, bannerImageUrl: normalizeImageUrl(e.target.value) })}
                      placeholder="Dán link ảnh hoặc để trống dùng màu Gradient..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold cursor-pointer shrink-0">
                      Tải ảnh
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleBannerUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Thông tin công ty, Ngân hàng, CSKH & Hiệu ứng */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                  Thông tin Công ty, Ngân hàng & Hiệu ứng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tên thương hiệu / Công ty</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email CSKH</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ngân hàng</label>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Số tài khoản</label>
                    <input
                      type="text"
                      value={settings.bankAccountNumber}
                      onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Chủ tài khoản</label>
                    <input
                      type="text"
                      value={settings.bankAccountName}
                      onChange={(e) => setSettings({ ...settings, bankAccountName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-3 space-y-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Icon name="lock" className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Tài khoản đăng nhập Admin</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Tên đăng nhập Admin</label>
                      <input
                        type="text"
                        value={settings.adminUsername ?? 'admin'}
                        onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Mật khẩu Admin</label>
                      <input
                        type="text"
                        value={settings.adminPassword ?? '123'}
                        onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5 border-t border-slate-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-slate-700">Hiệu ứng nốt nhạc rơi 5 giây khi vào web</span>
                    <input
                      type="checkbox"
                      checked={settings.fallingNotesEnabled}
                      onChange={(e) => setSettings({ ...settings, fallingNotesEnabled: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-slate-700">Hiển thị nút phát nhạc nền trên Header</span>
                    <input
                      type="checkbox"
                      checked={settings.bgMusicEnabled}
                      onChange={(e) => setSettings({ ...settings, bgMusicEnabled: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Đã lưu toàn bộ cấu hình hệ thống!', 'success')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
                >
                  Lưu cấu hình
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ==========================================
          FOOTER (Truy cập Admin qua dòng bản quyền)
      ========================================== */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <Icon name="music" className="w-5 h-5 text-indigo-400" />
              <span>{settings.companyName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống phân phối thiết bị âm thanh, nhạc cụ và phụ kiện phòng thu chính hãng chất lượng cao.
            </p>
          </div>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="text-white font-bold text-sm mb-2">Liên hệ & Hỗ trợ</div>
            <p>Địa chỉ: {settings.companyAddress}</p>
            <p>Hotline: {settings.hotline}</p>
            <p>Email CSKH: {settings.supportEmail}</p>
          </div>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="text-white font-bold text-sm mb-2">Thanh toán & Giao hàng</div>
            <p>Thanh toán tiền mặt khi nhận hàng (COD)</p>
            <p>Chuyển khoản ngân hàng {settings.bankName}</p>
            <p>Giao hàng toàn quốc từ 2 – 4 ngày làm việc</p>
          </div>
        </div>

        <div className="border-t border-slate-800/90 py-5 px-4 text-center">
          <button
            type="button"
            onClick={handleRequestAdminAccess}
            className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            Bản quyền thuộc về © Tiendat 2026
          </button>
        </div>
      </footer>

      {/* ==========================================
          MODAL 1: CHI TIẾT SẢN PHẨM & ZOOM ẢNH
      ========================================== */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl grid grid-cols-1 md:grid-cols-2">
            {/* Gallery + Zoom Controls */}
            <div className="bg-slate-100 p-5 flex flex-col justify-between gap-4">
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                <div
                  className="w-full h-full transition-transform duration-200 flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <SmartProductImage
                    src={activeProduct.images?.[activeImageIdx] || activeProduct.images?.[0]}
                    alt={activeProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Zoom Buttons */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/80 text-white px-2.5 py-1.5 rounded-full backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(1, Number((z - 0.5).toFixed(1))))}
                    className="p-1 hover:text-indigo-300"
                    title="Thu nhỏ"
                  >
                    <Icon name="zoomOut" className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-1">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(3, Number((z + 0.5).toFixed(1))))}
                    className="p-1 hover:text-indigo-300"
                    title="Phóng to"
                  >
                    <Icon name="zoomIn" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {activeProduct.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {activeProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setZoomLevel(1);
                      }}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
                        activeImageIdx === idx ? 'border-indigo-600' : 'border-transparent opacity-70'
                      }`}
                    >
                      <SmartProductImage src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                    {activeProduct.category}
                  </span>
                  <button
                    onClick={() => setActiveProduct(null)}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">{activeProduct.name}</h2>
                <div className="text-2xl font-extrabold text-indigo-600">{formatVND(activeProduct.price)}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{activeProduct.description}</p>
                <div className="text-xs font-semibold text-slate-500">
                  Tình trạng: <span className="text-emerald-600">Còn {activeProduct.stock} sản phẩm</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(activeProduct, e)}
                  className={`px-4 py-3 rounded-xl border font-semibold text-sm flex items-center gap-2 transition ${
                    favorites.includes(activeProduct.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    name="heart"
                    className="w-4 h-4"
                    fill={favorites.includes(activeProduct.id) ? 'currentColor' : 'none'}
                  />
                  <span>{favorites.includes(activeProduct.id) ? 'Đã thích' : 'Yêu thích'}</span>
                </button>

                <button
                  type="button"
                  disabled={activeProduct.stock <= 0}
                  onClick={() => {
                    addToCart(activeProduct, 1);
                    setActiveProduct(null);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:bg-slate-300 transition"
                >
                  Thêm vào giỏ & Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DRAWER 2: GIỎ HÀNG RIÊNG BIỆT CỦA KHÁCH HÀNG
      ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Icon name="cart" className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-extrabold text-lg text-slate-900">Giỏ hàng của bạn ({totalCartItems})</h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Icon name="user" className="w-3 h-3" />
                    Phiên riêng: {sessionId.slice(0, 12)}
                  </span>
                  {cartDetails.length > 0 && (
                    <button
                      type="button"
                      onClick={handleNewCustomerSession}
                      title="Làm mới giỏ hàng cho khách hàng khác"
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <Icon name="refresh" className="w-3 h-3" />
                      <span>Khách mới</span>
                    </button>
                  )}
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartDetails.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <p className="text-slate-500 text-sm">Giỏ hàng của bạn đang trống.</p>
                  <p className="text-xs text-slate-400">
                    Nhấn biểu tượng trái tim trên sản phẩm để lưu yêu thích và tự động thêm vào giỏ hàng riêng của bạn!
                  </p>
                </div>
              ) : (
                cartDetails.map(({ product, quantity, subtotal }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 rounded-2xl border border-slate-200/90 bg-slate-50/50"
                  >
                    <SmartProductImage
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{product.name}</h4>
                          <button
                            onClick={() => removeCartItem(product.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-indigo-600 mt-0.5">{formatVND(product.price)}</div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateCartQty(product.id, -1)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600"
                          >
                            <Icon name="minus" className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold">{quantity}</span>
                          <button
                            onClick={() => updateCartQty(product.id, 1)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600"
                          >
                            <Icon name="plus" className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">{formatVND(subtotal)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartDetails.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Tổng thanh toán:</span>
                  <span className="text-xl font-extrabold text-indigo-600">{formatVND(totalCartAmount)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 transition shadow-lg"
                >
                  MUA HÀNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: ĐẶT HÀNG & CHỌN THANH TOÁN
      ========================================== */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmOrder}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-extrabold text-slate-900">Thông tin Đặt hàng</h2>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={checkoutForm.customerName}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, customerName: e.target.value })}
                  placeholder="Nhập họ và tên người nhận"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                />
                {checkoutForm.customerName && checkoutErrors.customerName && (
                  <p className="text-xs text-rose-600 mt-1">{checkoutErrors.customerName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    placeholder="0909 123 456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                  {checkoutForm.phone && checkoutErrors.phone && (
                    <p className="text-xs text-rose-600 mt-1">{checkoutErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email nhận xác nhận *</label>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                  {checkoutForm.email && checkoutErrors.email && (
                    <p className="text-xs text-rose-600 mt-1">{checkoutErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ giao hàng *</label>
                <input
                  type="text"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                />
                {checkoutForm.address && checkoutErrors.address && (
                  <p className="text-xs text-rose-600 mt-1">{checkoutErrors.address}</p>
                )}
              </div>

              {/* Phương thức thanh toán (Chỉ chọn 1) */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Phương thức thanh toán * (Chọn 1)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      checkoutForm.paymentMethod === 'COD'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon name="banknote" className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Tiền mặt (COD)</div>
                      <div className="text-[11px] text-slate-500">Thanh toán khi nhận hàng</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'BANK' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      checkoutForm.paymentMethod === 'BANK'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon name="creditCard" className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Chuyển khoản</div>
                      <div className="text-[11px] text-slate-500">{settings.bankName}</div>
                    </div>
                  </button>
                </div>

                {checkoutForm.paymentMethod === 'BANK' && (
                  <div className="mt-3 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-1 text-slate-700">
                    <div className="font-bold text-indigo-900">Thông tin chuyển khoản:</div>
                    <p>Ngân hàng: <strong>{settings.bankName}</strong></p>
                    <p>Số tài khoản: <strong>{settings.bankAccountNumber}</strong></p>
                    <p>Chủ tài khoản: <strong>{settings.bankAccountName}</strong></p>
                    <p>Số tiền: <strong className="text-indigo-700">{formatVND(totalCartAmount)}</strong></p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span>Tổng cộng ({totalCartItems} sản phẩm):</span>
                <span className="text-indigo-600 text-lg">{formatVND(totalCartAmount)}</span>
              </div>

              <button
                type="submit"
                disabled={!isCheckoutValid}
                className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-md"
              >
                XÁC NHẬN MUA HÀNG
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          MODAL 4: EMAIL XÁC NHẬN ĐƠN HÀNG TỰ ĐỘNG
      ========================================== */}
      {confirmedOrderEmail && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5 text-emerald-600">
                <Icon name="mail" className="w-6 h-6" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Email Xác Nhận Đơn Hàng Đã Gửi</h3>
                  <p className="text-xs text-slate-500">Đã gửi tới: {confirmedOrderEmail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmedOrderEmail(null)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>
                Xin chào <strong>{confirmedOrderEmail.customerName}</strong>,
              </p>
              <p>
                Cảm ơn bạn đã tin tưởng và đặt hàng tại <strong>{settings.companyName}</strong>. Đơn hàng của bạn đã được
                hệ thống ghi nhận thành công với thông tin chi tiết như sau:
              </p>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                <p><strong>Mã đơn hàng:</strong> <span className="text-indigo-600 font-bold">{confirmedOrderEmail.id}</span></p>
                <p><strong>Ngày đặt hàng:</strong> {confirmedOrderEmail.createdAt}</p>
                <p><strong>Địa chỉ giao hàng:</strong> {confirmedOrderEmail.address}</p>
                <p><strong>Ngày giao hàng dự kiến:</strong> {confirmedOrderEmail.estimatedDelivery}</p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{' '}
                  {confirmedOrderEmail.paymentMethod === 'BANK' ? 'Chuyển khoản ngân hàng' : 'Tiền mặt khi nhận hàng (COD)'}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-slate-900">Danh sách sản phẩm:</div>
                {confirmedOrderEmail.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs border-b border-slate-200/70 pb-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">{formatVND(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-extrabold text-sm text-indigo-700 pt-1">
                  <span>Tổng thanh toán:</span>
                  <span>{formatVND(confirmedOrderEmail.totalAmount)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 pt-2">
                Mọi thắc mắc xin liên hệ {settings.supportEmail} hoặc Hotline {settings.hotline}. Trân trọng,{' '}
                <strong>{settings.companyName}</strong>!
              </p>
            </div>

            <button
              onClick={() => setConfirmedOrderEmail(null)}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition"
            >
              Hoàn tất & Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 5: ADMIN THÊM / SỬA SẢN PHẨM
      ========================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingProduct.isNew ? 'Thêm Sản phẩm mới' : 'Chỉnh sửa Sản phẩm'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Danh mục *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tồn kho *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              {/* Upload nhiều ảnh từ máy & Dán link Google Drive / URL */}
              <div className="sm:col-span-2 space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700">
                  Hình ảnh sản phẩm (Tải nhiều ảnh từ máy hoặc dán link ảnh / Google Drive)
                </label>

                <div className="flex flex-wrap gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer flex items-center gap-1.5">
                    <Icon name="upload" className="w-4 h-4" />
                    <span>{isUploadingImg ? 'Đang nén ảnh...' : 'Tải nhiều ảnh từ máy'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadProductFiles(e.target.files)}
                    />
                  </label>

                  <div className="flex-1 flex gap-1.5 min-w-[220px]">
                    <input
                      type="text"
                      value={imageLinkInput}
                      onChange={(e) => setImageLinkInput(e.target.value)}
                      placeholder="Dán link ảnh hoặc link chia sẻ Google Drive..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageLink}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                    >
                      Thêm link
                    </button>
                  </div>
                </div>

                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2">
                    {productForm.images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border bg-white">
                        <SmartProductImage src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100"
                        >
                          <Icon name="x" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
              >
                Lưu sản phẩm
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          MODAL 6: ĐĂNG NHẬP QUẢN TRỊ ADMIN
      ========================================== */}
      {isAdminLoginOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAdminLoginSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Icon name="lock" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Đăng nhập Quản trị</h3>
                  <p className="text-xs text-slate-500">Vui lòng xác thực tài khoản Admin để tiếp tục</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminLoginOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            {adminLoginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <Icon name="alert" className="w-4 h-4 shrink-0" />
                <span>{adminLoginError}</span>
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên đăng nhập *</label>
                <div className="relative">
                  <Icon name="user" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={adminLoginForm.username}
                    onChange={(e) => {
                      setAdminLoginForm({ ...adminLoginForm, username: e.target.value });
                      if (adminLoginError) setAdminLoginError('');
                    }}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu *</label>
                <div className="relative">
                  <Icon name="lock" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    value={adminLoginForm.password}
                    onChange={(e) => {
                      setAdminLoginForm({ ...adminLoginForm, password: e.target.value });
                      if (adminLoginError) setAdminLoginError('');
                    }}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass((s) => !s)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    title={showAdminPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    <Icon name={showAdminPass ? 'eyeOff' : 'eye'} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-500">
              Tài khoản mặc định: <strong className="text-slate-700">{settings.adminUsername || 'admin'}</strong> / Mật khẩu: <strong className="text-slate-700">{settings.adminPassword || '123'}</strong> (có thể đổi trong phần Cấu hình Admin).
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAdminLoginOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition shadow-md"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MelodyStoreMain />
    </ErrorBoundary>
  );
}
