-- JanArogya Supabase schema
-- Run this in Supabase SQL Editor as a single script.

create extension if not exists "pgcrypto";

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text default '',
  last_name text default '',
  location text default '',
  default_language text default 'en',
  emergency_alerts_enabled boolean not null default true,
  auto_translate_enabled boolean not null default true,
  audio_autoplay_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trauma_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text,
  image_url text,
  severity integer not null check (severity between 0 and 10),
  urgency text not null check (urgency in ('low','medium','high','critical')),
  actions jsonb not null default '[]'::jsonb,
  equipment jsonb not null default '[]'::jsonb,
  diagnosis text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.scribe_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  audio_path text,
  audio_url text,
  language text not null default 'Unknown',
  main_issue text not null default '',
  symptoms jsonb not null default '[]'::jsonb,
  history text not null default '',
  risk_notes text not null default '',
  care_plan jsonb not null default '[]'::jsonb,
  next_steps text not null default '',
  simple_summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.rx_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text,
  image_url text,
  language text not null default 'en',
  medicines jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text not null check (category in ('emergency_services','hospitals','poison_control','helplines')),
  name text not null,
  phone text not null,
  is_global boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  kind text not null default 'info',
  is_read boolean not null default false,
  related_table text,
  related_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null,
  status text not null default 'generated' check (status in ('generated','pending','failed')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_trauma_checks_user_created on public.trauma_checks(user_id, created_at desc);
create index if not exists idx_scribe_entries_user_created on public.scribe_entries(user_id, created_at desc);
create index if not exists idx_rx_scans_user_created on public.rx_scans(user_id, created_at desc);
create index if not exists idx_notifications_user_created on public.notifications(user_id, created_at desc);
create index if not exists idx_activity_logs_user_created on public.activity_logs(user_id, created_at desc);
create index if not exists idx_reports_user_created on public.reports(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.trauma_checks enable row level security;
alter table public.scribe_entries enable row level security;
alter table public.rx_scans enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.reports enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id);

drop policy if exists "trauma_select_own" on public.trauma_checks;
create policy "trauma_select_own" on public.trauma_checks for select using (auth.uid() = user_id);
drop policy if exists "trauma_insert_own" on public.trauma_checks;
create policy "trauma_insert_own" on public.trauma_checks for insert with check (auth.uid() = user_id);

drop policy if exists "scribe_select_own" on public.scribe_entries;
create policy "scribe_select_own" on public.scribe_entries for select using (auth.uid() = user_id);
drop policy if exists "scribe_insert_own" on public.scribe_entries;
create policy "scribe_insert_own" on public.scribe_entries for insert with check (auth.uid() = user_id);

drop policy if exists "rx_select_own" on public.rx_scans;
create policy "rx_select_own" on public.rx_scans for select using (auth.uid() = user_id);
drop policy if exists "rx_insert_own" on public.rx_scans;
create policy "rx_insert_own" on public.rx_scans for insert with check (auth.uid() = user_id);

drop policy if exists "contacts_select_user_or_global" on public.emergency_contacts;
create policy "contacts_select_user_or_global" on public.emergency_contacts
for select
using (is_global = true or auth.uid() = user_id);

drop policy if exists "contacts_insert_own" on public.emergency_contacts;
create policy "contacts_insert_own" on public.emergency_contacts
for insert
with check (auth.uid() = user_id and is_global = false);

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "notifications_insert_own" on public.notifications;
create policy "notifications_insert_own" on public.notifications for insert with check (auth.uid() = user_id);
drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications for update using (auth.uid() = user_id);

drop policy if exists "activity_select_own" on public.activity_logs;
create policy "activity_select_own" on public.activity_logs for select using (auth.uid() = user_id);
drop policy if exists "activity_insert_own" on public.activity_logs;
create policy "activity_insert_own" on public.activity_logs for insert with check (auth.uid() = user_id);

drop policy if exists "reports_select_own" on public.reports;
create policy "reports_select_own" on public.reports for select using (auth.uid() = user_id);
drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports for insert with check (auth.uid() = user_id);

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

insert into public.emergency_contacts (category, name, phone, is_global)
values
  ('emergency_services', 'Police', '+91-100', true),
  ('emergency_services', 'Fire', '+91-101', true),
  ('emergency_services', 'Ambulance', '+91-102', true),
  ('hospitals', 'District Hospital', '+91-98765-43210', true),
  ('hospitals', 'Taluk Government Hospital', '+91-91234-56780', true),
  ('hospitals', 'Nearest Emergency Center', '+91-90000-11223', true),
  ('poison_control', 'National Poison Control', '+91-80000-12345', true),
  ('helplines', 'Mental Health Helpline', '+91-91522-12345', true),
  ('helplines', 'Women Helpline', '+91-78290-00000', true),
  ('helplines', 'Child Helpline', '+91-1098', true)
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('trauma-images', 'trauma-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('scribe-audio', 'scribe-audio', true, 20971520, array['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg']),
  ('rx-prescriptions', 'rx-prescriptions', true, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "trauma_storage_read" on storage.objects;
create policy "trauma_storage_read"
on storage.objects for select
using (bucket_id = 'trauma-images');

drop policy if exists "trauma_storage_insert" on storage.objects;
create policy "trauma_storage_insert"
on storage.objects for insert
with check (
  bucket_id = 'trauma-images'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "scribe_storage_read" on storage.objects;
create policy "scribe_storage_read"
on storage.objects for select
using (bucket_id = 'scribe-audio');

drop policy if exists "scribe_storage_insert" on storage.objects;
create policy "scribe_storage_insert"
on storage.objects for insert
with check (
  bucket_id = 'scribe-audio'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "rx_storage_read" on storage.objects;
create policy "rx_storage_read"
on storage.objects for select
using (bucket_id = 'rx-prescriptions');

drop policy if exists "rx_storage_insert" on storage.objects;
create policy "rx_storage_insert"
on storage.objects for insert
with check (
  bucket_id = 'rx-prescriptions'
  and auth.uid()::text = split_part(name, '/', 1)
);

do $$
declare
  target_table text;
  tables text[] := array[
    'profiles',
    'trauma_checks',
    'scribe_entries',
    'rx_scans',
    'emergency_contacts',
    'notifications',
    'activity_logs',
    'reports'
  ];
begin
  foreach target_table in array tables
  loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = target_table
    ) then
      execute format('alter publication supabase_realtime add table public.%I', target_table);
    end if;
  end loop;
end $$;
