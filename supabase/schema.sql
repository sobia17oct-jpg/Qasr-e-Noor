-- Qasr-e-Noor Wedding Hall (Mingora, Swat) — Supabase Schema
-- Run this script once in your Supabase Dashboard -> SQL Editor:
-- https://supabase.com/dashboard/project/kgweeslcywiqrixzhxxt/sql/new

create table if not exists public.booking_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  event_type text not null,
  preferred_date date not null,
  event_shift text not null check (event_shift in ('Day / Lunch', 'Night / Dinner')),
  estimated_guests integer not null check (estimated_guests >= 50 and estimated_guests <= 1500),
  package_id text not null check (package_id in ('silver', 'gold', 'royal')),
  package_name text not null,
  estimated_total_pkr integer not null check (estimated_total_pkr > 0),
  hall_preference text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled'))
);

create index if not exists idx_booking_inquiries_date_shift
  on public.booking_inquiries (preferred_date, event_shift, status);

alter table public.booking_inquiries enable row level security;

-- Allow website visitors to submit booking inquiries
drop policy if exists "Allow public booking inquiry inserts" on public.booking_inquiries;
create policy "Allow public booking inquiry inserts"
  on public.booking_inquiries
  for insert
  to anon, authenticated
  with check (true);

-- Privacy-safe RPC to check confirmed/pending date & shift availability without exposing guest PII
create or replace function public.get_booked_slots(target_date date)
returns table (
  event_shift text,
  hall_preference text,
  status text
)
language sql
security definer
set search_path = public
as $$
  select
    b.event_shift,
    b.hall_preference,
    b.status
  from public.booking_inquiries b
  where b.preferred_date = target_date
    and b.status in ('pending', 'confirmed');
$$;

grant execute on function public.get_booked_slots(date) to anon, authenticated;

-- Privacy-safe RPC allowing a guest to check their own inquiry status using Reference ID + Phone
create or replace function public.lookup_booking_inquiry(
  ref_prefix text,
  phone_query text
)
returns table (
  reference_code text,
  full_name text,
  event_type text,
  preferred_date date,
  event_shift text,
  estimated_guests integer,
  package_name text,
  estimated_total_pkr integer,
  hall_preference text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    upper(left(b.id::text, 8)) as reference_code,
    b.full_name,
    b.event_type,
    b.preferred_date,
    b.event_shift,
    b.estimated_guests,
    b.package_name,
    b.estimated_total_pkr,
    b.hall_preference,
    b.status,
    b.created_at
  from public.booking_inquiries b
  where upper(left(b.id::text, 8)) = upper(trim(replace(ref_prefix, '#', '')))
    and regexp_replace(b.phone, '\D', '', 'g') = regexp_replace(phone_query, '\D', '', 'g')
  limit 1;
$$;

grant execute on function public.lookup_booking_inquiry(text, text) to anon, authenticated;
