create extension if not exists "pgcrypto";

create table if not exists public.patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default '',
  subcategory text not null default '',
  size text not null default '',
  season text not null default '',
  tags text[] not null default '{}',
  notes text not null default '',
  pdf_url text not null default '',
  storage_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patterns_user_created_idx
  on public.patterns (user_id, created_at desc);

create index if not exists patterns_category_idx
  on public.patterns (category);

create index if not exists patterns_tags_idx
  on public.patterns using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists patterns_set_updated_at on public.patterns;
create trigger patterns_set_updated_at
before update on public.patterns
for each row
execute function public.set_updated_at();

alter table public.patterns enable row level security;

drop policy if exists "Users can read own patterns" on public.patterns;
create policy "Users can read own patterns"
on public.patterns for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own patterns" on public.patterns;
create policy "Users can insert own patterns"
on public.patterns for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own patterns" on public.patterns;
create policy "Users can update own patterns"
on public.patterns for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own patterns" on public.patterns;
create policy "Users can delete own patterns"
on public.patterns for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('patterns', 'patterns', false)
on conflict (id) do nothing;

drop policy if exists "Users can read own pattern PDFs" on storage.objects;
create policy "Users can read own pattern PDFs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'patterns'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can upload own pattern PDFs" on storage.objects;
create policy "Users can upload own pattern PDFs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'patterns'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own pattern PDFs" on storage.objects;
create policy "Users can update own pattern PDFs"
on storage.objects for update
to authenticated
using (
  bucket_id = 'patterns'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'patterns'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own pattern PDFs" on storage.objects;
create policy "Users can delete own pattern PDFs"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'patterns'
  and (storage.foldername(name))[1] = auth.uid()::text
);
