-- snaily: sending postcards by link. Run once in the Supabase SQL editor.
-- Also turn on Authentication → Sign In / Providers → "Allow anonymous sign-ins".

-- postcards: one row per sent card; the id is what goes in the link
create table public.postcards (
  id text primary key default substr(replace(gen_random_uuid()::text,'-',''),1,12),
  owner uuid not null default auth.uid() references auth.users on delete cascade,
  sender text not null default '' check (char_length(sender) <= 60),
  deliver_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.postcards enable row level security;
create policy "send as yourself" on public.postcards for insert to authenticated with check (owner = auth.uid());
create policy "see your own" on public.postcards for select to authenticated using (owner = auth.uid());

-- anyone with the link can see who it's from and when it arrives (not the images)
create or replace function public.get_postcard(pid text)
returns table (sender text, deliver_at timestamptz, arrived boolean)
language sql security definer set search_path = public stable as $$
  select sender, deliver_at, deliver_at <= now() from postcards where id = pid;
$$;
grant execute on function public.get_postcard(text) to anon, authenticated;

-- helpers the storage rules use
create or replace function public.postcard_mine(pid text) returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from postcards where id = pid and owner = auth.uid());
$$;
create or replace function public.postcard_open(pid text) returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from postcards where id = pid and (deliver_at <= now() or owner = auth.uid()));
$$;

-- private bucket for the images: <id>/front.jpg and <id>/back.jpg, readable once the card has arrived
insert into storage.buckets (id, name, public) values ('postcards', 'postcards', false);
create policy "upload to your postcards" on storage.objects for insert to authenticated
  with check (bucket_id = 'postcards' and public.postcard_mine((storage.foldername(name))[1]));
create policy "read arrived postcards" on storage.objects for select to anon, authenticated
  using (bucket_id = 'postcards' and public.postcard_open((storage.foldername(name))[1]));
