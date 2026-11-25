// src/app/api/orders/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, shippingAddress, note, paymentMethod, items, couponCode, userId } = body;

    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Thông tin đặt hàng không đầy đủ' }, { status: 400 });
    }

    const subtotal = items.reduce((s: number, it: any) => s + Number(it.unitPrice) * Number(it.quantity), 0);
    let discountAmount = 0;
    let shippingFee = subtotal >= 500000 ? 0 : 30000;

    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();
      if (coupon && subtotal >= coupon.min_order_amount && coupon.used_count < coupon.max_uses) {
        if (coupon.discount_type === 'percent') discountAmount = Math.round(subtotal * coupon.discount_value / 100);
        if (coupon.discount_type === 'fixed') discountAmount = coupon.discount_value;
        if (coupon.discount_type === 'freeship') shippingFee = 0;
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
    const orderCode = `CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        user_id: userId || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        note: note || '',
        payment_method: paymentMethod,
        subtotal,
        discount_amount: discountAmount,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        coupon_code: couponCode || null
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('order_items').insert(
      items.map((it: any) => ({
        order_id: order.id,
        product_id: it.productId || null,
        custom_design_id: it.customDesignId || null,
        product_name: it.name,
        device_model: it.deviceModel,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        design_download_url: it.designDownloadUrl || null
      }))
    );

    // Optional VNPay / MoMo redirect URL builder
    let paymentUrl: string | null = null;
    if (paymentMethod === 'VNPAY' && process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET) {
      const vnpParams = new URLSearchParams({
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: process.env.VNPAY_TMN_CODE,
        vnp_Amount: String(totalAmount * 100),
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderCode,
        vnp_OrderInfo: `Thanh toan don hang ${orderCode}`,
        vnp_ReturnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/callback`
      });
      const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET)
        .update(vnpParams.toString()).digest('hex');
      paymentUrl = `${process.env.VNPAY_URL}?${vnpParams.toString()}&vnp_SecureHash=${hmac}`;
    }

    return NextResponse.json({ order, paymentUrl }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Không thể tạo đơn hàng' }, { status: 500 });
  }
}
