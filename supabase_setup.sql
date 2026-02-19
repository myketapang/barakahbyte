-- ============================================================
-- BarakahByte — Supabase Setup Script
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create listings table
create table if not exists public.listings (
  id          bigint generated always as identity primary key,
  seller      text not null,
  location    text not null,
  item        text not null,
  quantity    integer not null default 1,
  posted_at   text,
  status      text not null default 'available'
                check (status in ('available', 'claimed', 'completed')),
  image_url   text,
  category    text default 'food',
  created_at  timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.listings enable row level security;

-- 3. Public read policy (anyone can view listings)
create policy "Public can read listings"
  on public.listings for select
  using (true);

-- 4. Public insert policy (anyone can post a listing)
create policy "Public can insert listings"
  on public.listings for insert
  with check (true);

-- 5. Public update policy (anyone can update status)
create policy "Public can update listing status"
  on public.listings for update
  using (true)
  with check (true);

-- 6. Create Storage bucket
insert into storage.buckets (id, name, public)
values ('barakahbyte', 'barakahbyte', true)
on conflict (id) do nothing;

-- 7. Storage policies — public read
create policy "Public can read barakahbyte bucket"
  on storage.objects for select
  using (bucket_id = 'barakahbyte');

-- 8. Storage policies — public upload
create policy "Public can upload to barakahbyte bucket"
  on storage.objects for insert
  with check (bucket_id = 'barakahbyte');

-- 9. Seed some initial data (optional)
insert into public.listings (seller, location, item, quantity, posted_at, status, image_url, category)
values
  ('Pak Mat Murtabak', 'Bazaar TTDI', 'Murtabak Daging Kambing', 12, '19:45', 'available',
   'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&w=400&q=80', 'food'),
  ('Kak Som Drinks', 'Bazaar Kampung Baru', 'Air Katira & Bandung', 25, '20:10', 'available',
   'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&w=400&q=80', 'drinks'),
  ('Ustaz Halim Kurma', 'Bazaar Masjid India', 'Kurma Ajwa Premium', 5, '20:30', 'available',
   'https://images.unsplash.com/photo-1590080877897-f00f6cb15e24?auto=format&fit=crop&w=400&q=80', 'food')
on conflict do nothing;
