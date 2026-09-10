-- Production-ready starting schema for the future hosted version.
-- Apply this in Supabase SQL Editor after creating a project.

create table if not exists public.products (
  id bigint primary key,
  name text not null,
  category text not null,
  price_halalas integer not null check (price_halalas >= 0),
  emoji text not null default '',
  image_url text not null,
  description text not null default '',
  tag text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  total_halalas integer not null check (total_halalas >= 0),
  status text not null default 'simulated',
  payment_provider text,
  provider_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  order_id text references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_halalas integer not null check (unit_price_halalas >= 0),
  primary key (order_id, product_id)
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Anyone can read active products" on public.products;
drop policy if exists "Users can read their own orders" on public.orders;
drop policy if exists "Users can read their own order items" on public.order_items;

create policy "Anyone can read active products"
  on public.products for select
  using (active = true);

create policy "Users can read their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can read their own order items"
  on public.order_items for select
  using (exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.user_id = auth.uid()
  ));
