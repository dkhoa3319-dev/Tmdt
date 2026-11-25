-- CASE STUDIO: Production PostgreSQL / Supabase Schema + Row Level Security (RLS)
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. User Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  addresses jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 2. Device Compatibility Tree (Brand -> Series -> Exact Model)
create table if not exists public.devices (
  id uuid default uuid_generate_v4() primary key,
  category text not null check (category in ('phone', 'ipad')),
  brand text not null,
  series text not null,
  model text not null unique,
  dimensions_mm text,
  camera_layout text default 'square-triple',
  aspect_ratio numeric default 0.48,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. Products Catalog
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  sku text unique not null,
  name text not null,
  category text not null check (category in ('phone', 'ipad')),
  price integer not null check (price >= 0),
  original_price integer,
  stock integer not null default 0 check (stock >= 0),
  material text not null,
  color text not null,
  style text not null,
  case_type text not null,
  shockproof_level text not null,
  compatible_models text[] not null default '{}',
  image_url text not null,
  description text,
  rating numeric(2,1) default 5.0,
  review_count integer default 0,
  is_bestseller boolean default false,
  is_featured boolean default false,
  is_new boolean default false,
  created_at timestamptz default now()
);

-- 4. Saved Custom Designs (linked to Supabase Storage private bucket)
create table if not exists public.custom_designs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  device_model text not null,
  case_type text not null,
  design_name text not null,
  preview_storage_path text not null,
  original_assets jsonb default '[]'::jsonb,
  canvas_state jsonb not null,
  unit_price integer not null,
  created_at timestamptz default now()
);

-- 5. Coupons / Promotions
create table if not exists public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'fixed', 'freeship')),
  discount_value integer not null default 0,
  min_order_amount integer not null default 0,
  max_uses integer not null default 100,
  used_count integer not null default 0,
  expires_at timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 6. Orders & Order Items
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_code text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  shipping_address text not null,
  note text,
  payment_method text not null check (payment_method in ('COD', 'BANK_TRANSFER', 'MOMO', 'VNPAY')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  status text not null default 'Chờ xác nhận' check (status in (
    'Chờ xác nhận', 'Đã xác nhận', 'Đang sản xuất', 'Đang giao hàng', 'Đã hoàn thành', 'Đã hủy'
  )),
  subtotal integer not null,
  discount_amount integer not null default 0,
  shipping_fee integer not null default 30000,
  total_amount integer not null,
  coupon_code text,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  custom_design_id uuid references public.custom_designs(id) on delete set null,
  product_name text not null,
  device_model text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null,
  design_download_url text
);

-- 7. Reviews & Chatbot Knowledge Base
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now()
);

create table if not exists public.chatbot_faqs (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  question text not null,
  answer text not null,
  updated_at timestamptz default now()
);

create table if not exists public.chat_logs (
  id uuid default uuid_generate_v4() primary key,
  session_id text not null,
  user_message text not null,
  bot_reply text not null,
  resolved boolean default true,
  created_at timestamptz default now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.products enable row level security;
alter table public.custom_designs enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.chatbot_faqs enable row level security;
alter table public.chat_logs enable row level security;

-- Helper function to verify admin role securely
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Public read access for catalog, active devices, reviews, FAQs
create policy "Public read active products" on public.products for select using (true);
create policy "Admin manage products" on public.products for all using (public.is_admin());

create policy "Public read active devices" on public.devices for select using (is_active = true or public.is_admin());
create policy "Admin manage devices" on public.devices for all using (public.is_admin());

create policy "Users view own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users manage own custom designs" on public.custom_designs for all using (auth.uid() = user_id or public.is_admin());
create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Authenticated create orders" on public.orders for insert with check (true);
create policy "Admin update orders" on public.orders for update using (public.is_admin());

create policy "Public read reviews" on public.reviews for select using (true);
create policy "Authenticated insert reviews" on public.reviews for insert with check (auth.uid() = user_id);

create policy "Public read chatbot FAQs" on public.chatbot_faqs for select using (true);
create policy "Admin manage chatbot FAQs" on public.chatbot_faqs for all using (public.is_admin());
create policy "Admin read chat logs" on public.chat_logs for select using (public.is_admin());
