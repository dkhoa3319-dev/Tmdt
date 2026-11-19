import React, { Component, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Music,
  Heart,
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Lock,
  Upload,
  Link2,
  Image as ImageIcon,
  Package,
  TrendingUp,
  Settings,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  FolderPlus,
  Layers,
  Star,
  Sparkles,
  ClipboardPaste,
  Send,
  RefreshCw,
  Copy
} from 'lucide-react';

/**
 * ============================================================================
 * 1. ERROR BOUNDARY & LƯU TRỮ AN TOÀN (CHỐNG LỖI TRẮNG TRANG TRÊN MOBILE/WEBVIEW)
 * ============================================================================
 */
const memoryStorageFallback = {};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Đã xảy ra gián đoạn hiển thị tạm thời.'
    };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('Maison Harmonie ErrorBoundary:', error, errorInfo);
    }
  }

  handleResetApp = () => {
    const keys = [
      'mh_categories_v8',
      'mh_products_v8',
      'mh_orders_v8',
      'mh_company_v8',
      'mh_emailjs_v8'
    ];
    keys.forEach((k) => {
      delete memoryStorageFallback[k];
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(k);
        }
      } catch (e) {
        // Bỏ qua lỗi SecurityError trên Mobile WebView
      }
    });
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E8E2D9] shadow-xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-[#926F14] flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-[#16213E]">
              Khôi Phục Phiên Làm Việc Maison Harmonie
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ứng dụng vừa gặp gián đoạn nhỏ ({this.state.errorMessage}). Nhấn nút bên dưới để làm mới dữ liệu cửa hàng.
            </p>
            <button
              type="button"
              onClick={this.handleResetApp}
              className="w-full py-3 px-4 rounded-xl bg-[#16213E] hover:bg-[#C59B27] text-white text-sm font-bold transition"
            >
              Khôi Phục Ứng Dụng
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const safeGetStorage = (key, fallbackValue) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed !== null && parsed !== undefined) {
          memoryStorageFallback[key] = parsed;
          return parsed;
        }
      }
    }
  } catch (e) {
    // Fallback sang bộ nhớ RAM nếu localStorage bị chặn
  }

  if (Object.prototype.hasOwnProperty.call(memoryStorageFallback, key)) {
    return memoryStorageFallback[key];
  }
  return fallbackValue;
};

const safeSetStorage = (key, value) => {
  memoryStorageFallback[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
  } catch (e) {
    // Đã lưu an toàn vào memoryStorageFallback
  }
  return false;
};

/**
 * ============================================================================
 * 2. DỊCH VỤ GỬI EMAIL XÁC NHẬN ĐƠN HÀNG THẬT QUA EMAILJS REST API
 * ============================================================================
 */
const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

const INITIAL_EMAILJS_CONFIG = {
  enabled: true,
  serviceId: '',
  templateId: '',
  publicKey: ''
};

const EMAILJS_TEMPLATE_VARIABLES = [
  '{{to_email}}',
  '{{to_name}}',
  '{{customer_name}}',
  '{{customer_phone}}',
  '{{customer_address}}',
  '{{company_name}}',
  '{{company_email}}',
  '{{company_phone}}',
  '{{order_id}}',
  '{{order_date}}',
  '{{delivery_date}}',
  '{{payment_method}}',
  '{{bank_info}}',
  '{{items_list}}',
  '{{total_amount}}',
  '{{message}}'
];

const EMAILJS_SAMPLE_TEMPLATE_TEXT = `Kính chào Quý khách {{customer_name}},

Cảm ơn Quý khách đã tin tưởng và đặt hàng tại {{company_name}}. Đơn hàng của Quý khách đã được hệ thống ghi nhận và đang chuẩn bị giao vận:

- Mã đơn hàng: {{order_id}}
- Ngày đặt hàng: {{order_date}}
- Ngày giao hàng dự kiến: {{delivery_date}}
- Người nhận: {{customer_name}} ({{customer_phone}})
- Địa chỉ giao hàng: {{customer_address}}
- Phương thức thanh toán: {{payment_method}}
{{bank_info}}

DANH SÁCH SẢN PHẨM ĐẶT MUA:
{{items_list}}

TỔNG THANH TOÁN: {{total_amount}}

Nếu Quý khách cần hỗ trợ, vui lòng liên hệ Bộ phận CSKH:
- Email: {{company_email}}
- Hotline: {{company_phone}}

Trân trọng,
{{company_name}}`;

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(Math.round(Number(amount) || 0)) + ' ₫';
};

const formatDateVN = (dateInput) => {
  const d = new Date(dateInput);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatShortDateVN = (dateInput) => {
  const d = new Date(dateInput);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const addDays = (dateInput, days) => {
  const d = new Date(dateInput);
  d.setDate(d.getDate() + days);
  return d;
};

const generateOrderCode = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DH-${y}${m}${d}-${rand}`;
};

/**
 * Hàm gọi EmailJS REST API gửi email xác nhận đơn hàng thật
 */
const sendOrderEmailViaEmailJS = async (order, companySettings, emailJsConfig) => {
  if (!emailJsConfig || !emailJsConfig.enabled) {
    return {
      status: 'unconfigured',
      error: 'Chức năng gửi email thật qua EmailJS đang tắt trong Cài đặt Admin.'
    };
  }

  const serviceId = (emailJsConfig.serviceId || '').trim();
  const templateId = (emailJsConfig.templateId || '').trim();
  const publicKey = (emailJsConfig.publicKey || '').trim();

  if (!serviceId || !templateId || !publicKey) {
    return {
      status: 'unconfigured',
      error:
        'Chưa cấu hình đầy đủ Service ID, Template ID hoặc Public Key trong Admin -> Cài đặt.'
    };
  }

  const paymentMethodLabel =
    order.paymentMethod === 'BANK_TRANSFER'
      ? 'Chuyển khoản ngân hàng'
      : 'Thanh toán tiền mặt khi nhận hàng (COD)';

  const bankInfoLabel =
    order.paymentMethod === 'BANK_TRANSFER'
      ? `Thông tin chuyển khoản: ${companySettings.bankName} - STK: ${companySettings.bankAccountNumber} - Chủ TK: ${companySettings.bankAccountHolder}`
      : 'Thanh toán trực tiếp cho nhân viên giao vận khi kiểm tra nhận hàng.';

  const itemsListFormatted = order.items
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.name} (SL: ${it.quantity} x ${formatVND(it.price)}) = ${formatVND(
          it.price * it.quantity
        )}`
    )
    .join('\n');

  const fullMessageBody = `Kính chào Quý khách ${order.customer.fullName},

Cảm ơn Quý khách đã tin tưởng và đặt hàng tại ${companySettings.companyName}.
- Mã đơn hàng: ${order.id}
- Ngày đặt hàng: ${order.orderDateFormatted}
- Ngày giao hàng dự kiến: ${order.estimatedDeliveryDate}
- Địa chỉ giao hàng: ${order.customer.address}
- Phương thức thanh toán: ${paymentMethodLabel}
- ${bankInfoLabel}

DANH SÁCH SẢN PHẨM:
${itemsListFormatted}

Tổng thanh toán: ${formatVND(order.grandTotal)}
Liên hệ CSKH: ${companySettings.supportEmail} | Hotline: ${companySettings.phone}`;

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: order.customer.email,
      to_name: order.customer.fullName,
      customer_name: order.customer.fullName,
      customer_phone: order.customer.phone,
      customer_address: order.customer.address,
      company_name: companySettings.companyName,
      company_email: companySettings.supportEmail,
      company_phone: companySettings.phone,
      order_id: order.id,
      order_date: order.orderDateFormatted,
      delivery_date: order.estimatedDeliveryDate,
      payment_method: paymentMethodLabel,
      bank_info: bankInfoLabel,
      items_list: itemsListFormatted,
      total_amount: formatVND(order.grandTotal),
      message: fullMessageBody
    }
  };

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return {
        status: 'sent',
        sentAt: formatDateVN(new Date()),
        error: ''
      };
    }

    let serverDetail = '';
    try {
      serverDetail = await response.text();
    } catch (readErr) {
      serverDetail = `HTTP ${response.status}`;
    }

    return {
      status: 'failed',
      error: serverDetail || `Lỗi từ máy chủ EmailJS (Mã ${response.status})`
    };
  } catch (networkError) {
    return {
      status: 'failed',
      error:
        networkError?.message ||
        'Không thể kết nối tới máy chủ EmailJS. Vui lòng kiểm tra kết nối mạng.'
    };
  }
};

/**
 * ============================================================================
 * 3. XỬ LÝ & KIỂM TRA HÌNH ẢNH THỰC TẾ (URL VALIDATION, GOOGLE DRIVE, FILE, CLIPBOARD)
 * ============================================================================
 */
const SHARE_PAGE_ERROR_TEXT =
  'Liên kết này là trang web chia sẻ (không phải tệp ảnh trực tiếp). Trên điện thoại/trình duyệt, hãy nhấn giữ vào bức ảnh và chọn "Sao chép địa chỉ hình ảnh" (Copy image address) rồi dán vào đây.';

const normalizeAndInspectImageUrl = (rawInput) => {
  let url = (rawInput || '').trim();
  if (!url) {
    return { ok: false, error: 'Vui lòng dán đường dẫn hình ảnh vào ô nhập bên trên.' };
  }

  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://') &&
    !url.startsWith('data:image/') &&
    !url.startsWith('blob:')
  ) {
    url = `https://${url}`;
  }

  const lower = url.toLowerCase();
  if (
    lower.includes('share.google/') ||
    lower.includes('google.com/imgres') ||
    lower.includes('google.com/search') ||
    lower.includes('photos.app.goo.gl/')
  ) {
    return { ok: false, error: SHARE_PAGE_ERROR_TEXT };
  }

  // Tự động chuyển đổi link chia sẻ Google Drive sang URL ảnh trực tiếp
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    url = `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  } else {
    const driveIdParamMatch = url.match(/drive\.google\.com\/(?:open|uc)\?.*[?&]id=([a-zA-Z0-9_-]+)/i);
    if (driveIdParamMatch && driveIdParamMatch[1]) {
      url = `https://lh3.googleusercontent.com/d/${driveIdParamMatch[1]}`;
    }
  }

  return { ok: true, url };
};

const verifyImageUrlLoads = (candidateUrl, timeoutMs = 8000) => {
  return new Promise((resolve) => {
    if (!candidateUrl) {
      resolve({ ok: false, error: SHARE_PAGE_ERROR_TEXT });
      return;
    }

    if (candidateUrl.startsWith('data:image/') || candidateUrl.startsWith('blob:')) {
      resolve({ ok: true, url: candidateUrl });
      return;
    }

    let settled = false;
    const img = new window.Image();

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        img.src = '';
      } catch (e) {}
      resolve({ ok: false, error: SHARE_PAGE_ERROR_TEXT });
    }, timeoutMs);

    img.onload = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve({ ok: true, url: candidateUrl });
      } else {
        resolve({ ok: false, error: SHARE_PAGE_ERROR_TEXT });
      }
    };

    img.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: false, error: SHARE_PAGE_ERROR_TEXT });
    };

    img.src = candidateUrl;
  });
};

const readAndCompressImageBlob = (fileOrBlob) => {
  return new Promise((resolve, reject) => {
    if (!fileOrBlob) {
      reject(new Error('Không tìm thấy tệp hình ảnh.'));
      return;
    }

    const fallbackToObjectUrl = () => {
      try {
        if (typeof URL !== 'undefined' && URL.createObjectURL) {
          const objUrl = URL.createObjectURL(fileOrBlob);
          if (objUrl) {
            resolve(objUrl);
            return;
          }
        }
      } catch (e) {}
      reject(new Error('Trình duyệt không thể đọc tệp ảnh này.'));
    };

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event?.target?.result;
        if (!rawDataUrl || typeof rawDataUrl !== 'string') {
          fallbackToObjectUrl();
          return;
        }

        if (fileOrBlob.type === 'image/svg+xml' || fileOrBlob.size < 350 * 1024) {
          resolve(rawDataUrl);
          return;
        }

        try {
          const img = new window.Image();
          img.onload = () => {
            try {
              let { width, height } = img;
              const maxDim = 1400;
              if (width > maxDim || height > maxDim) {
                if (width >= height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(rawDataUrl);
                return;
              }
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.88);
              resolve(compressed || rawDataUrl);
            } catch (canvasErr) {
              resolve(rawDataUrl);
            }
          };
          img.onerror = () => resolve(rawDataUrl);
          img.src = rawDataUrl;
        } catch (imgErr) {
          resolve(rawDataUrl);
        }
      };

      reader.onerror = () => {
        fallbackToObjectUrl();
      };

      reader.readAsDataURL(fileOrBlob);
    } catch (e) {
      fallbackToObjectUrl();
    }
  });
};

/**
 * ============================================================================
 * 4. DANH MỤC KHỞI TẠO (6 DÒNG NHẠC CỤ) & THƯ VIỆN ẢNH STUDIO VECTOR SẮC NÉT
 * ============================================================================
 */
const INITIAL_CATEGORIES = [
  {
    id: 'cat-piano',
    name: 'Piano',
    description: 'Đại dương cầm hòa nhạc, Piano cơ đứng và Piano điện biểu diễn'
  },
  {
    id: 'cat-violin',
    name: 'Violin',
    description: 'Đàn vĩ cầm cổ điển chế tác thủ công từ gỗ vân sam & gỗ thích'
  },
  {
    id: 'cat-dantranh',
    name: 'Đàn tranh',
    description: 'Đàn tranh truyền thống 16 - 21 dây khảm xà cừ tinh xảo'
  },
  {
    id: 'cat-danbau',
    name: 'Đàn bầu',
    description: 'Độc huyền cầm gỗ trắc, gỗ hương nguyên khối nghệ nhân'
  },
  {
    id: 'cat-saotruc',
    name: 'Sáo trúc',
    description: 'Sáo trúc, sáo nứa Bắc già tuyển chọn chuẩn âm học biểu diễn'
  },
  {
    id: 'cat-guitar',
    name: 'Guitar',
    description: 'Đàn Guitar Acoustic & Classic gỗ nguyên tấm Full Solid'
  }
];

const encodeSvgDataUri = (svgContent) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

const createStudioSvgArtwork = (category, title, subtitle, viewIdx = 0) => {
  const palettes = {
    Piano: { bg1: '#FAF8F5', bg2: '#EDE4D3', accent: '#926F14', dark: '#16213E', gold: '#C59B27' },
    Violin: { bg1: '#FDF8F3', bg2: '#F1E1D1', accent: '#9A3412', dark: '#1C1917', gold: '#C59B27' },
    'Đàn tranh': { bg1: '#FEF9F2', bg2: '#F2E4CE', accent: '#92400E', dark: '#1E1B18', gold: '#D97706' },
    'Đàn bầu': { bg1: '#FAF7F2', bg2: '#EAE0D2', accent: '#78350F', dark: '#16213E', gold: '#C59B27' },
    'Sáo trúc': { bg1: '#F7FAF5', bg2: '#E4EDE0', accent: '#3F6212', dark: '#14261C', gold: '#CA8A04' },
    Guitar: { bg1: '#FCF7F1', bg2: '#EFE2D1', accent: '#92400E', dark: '#1C1917', gold: '#C59B27' }
  };
  const p = palettes[category] || {
    bg1: '#FAF8F5',
    bg2: '#EDE6D8',
    accent: '#926F14',
    dark: '#16213E',
    gold: '#C59B27'
  };
  const labels = ['Góc Chính Diện Studio', 'Cận Cảnh Chất Liệu', 'Chi Tiết Chế Tác'];

  let art = '';
  if (category === 'Piano') {
    if (viewIdx === 1) {
      art = `
        <rect x="130" y="185" width="540" height="230" rx="14" fill="#16213E" stroke="${p.gold}" stroke-width="3.5"/>
        <rect x="150" y="215" width="500" height="175" rx="6" fill="#FFFFFF"/>
        ${Array.from({ length: 15 }).map((_, i) => `<line x1="${150 + i * 33.3}" y1="215" x2="${150 + i * 33.3}" y2="390" stroke="#CBD5E1" stroke-width="1.5"/>`).join('')}
        ${[0,1,3,4,5,7,8,10,11,12].map((k) => `<rect x="${173 + k * 33.3}" y="215" width="18" height="108" rx="3" fill="#0F172A" stroke="${p.gold}" stroke-width="0.8"/>`).join('')}
        <text x="400" y="162" font-family="serif" font-size="15" font-weight="bold" fill="${p.accent}" text-anchor="middle">BÀN PHÍM GỖ MUN &amp; NGÀ TỔNG HỢP 88 PHÍM</text>
      `;
    } else if (viewIdx === 2) {
      art = `
        <path d="M180 410 Q230 160 580 185 L615 410 Z" fill="#B45309" stroke="#451A03" stroke-width="4"/>
        <path d="M205 395 Q248 185 562 205 L592 395 Z" fill="#D97706"/>
        ${Array.from({ length: 18 }).map((_, i) => `<line x1="${230 + i * 19}" y1="210" x2="${220 + i * 19}" y2="390" stroke="#FDE68A" stroke-width="1.8"/>`).join('')}
        <path d="M215 315 Q395 270 580 335" fill="none" stroke="#16213E" stroke-width="10" stroke-linecap="round"/>
        <circle cx="460" cy="270" r="22" fill="${p.gold}" stroke="#16213E" stroke-width="3"/>
      `;
    } else {
      art = `
        <ellipse cx="400" cy="465" rx="240" ry="22" fill="rgba(22,33,62,0.12)"/>
        <path d="M180 275 L345 145 L585 205 L585 335 L180 335 Z" fill="#16213E" stroke="${p.gold}" stroke-width="3"/>
        <line x1="345" y1="145" x2="345" y2="275" stroke="${p.gold}" stroke-width="4"/>
        <rect x="165" y="275" width="435" height="62" rx="6" fill="#1E293B" stroke="${p.gold}" stroke-width="2.5"/>
        <rect x="178" y="294" width="408" height="36" rx="2" fill="#FFFFFF"/>
        ${Array.from({ length: 24 }).map((_, i) => `<line x1="${178 + i * 17}" y1="294" x2="${178 + i * 17}" y2="330" stroke="#CBD5E1" stroke-width="1"/>`).join('')}
        ${[0,1,3,4,5,7,8,10,11,12,14,15,17,18,19,21,22].map((k) => `<rect x="${190 + k * 17}" y="294" width="9" height="22" fill="#16213E"/>`).join('')}
        <rect x="205" y="337" width="18" he
