create table if not exists public.preach_flow_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  app_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.preach_flow_user_state enable row level security;

drop policy if exists "Users can read their own Preach Flow state" on public.preach_flow_user_state;
create policy "Users can read their own Preach Flow state"
on public.preach_flow_user_state
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own Preach Flow state" on public.preach_flow_user_state;
create policy "Users can insert their own Preach Flow state"
on public.preach_flow_user_state
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own Preach Flow state" on public.preach_flow_user_state;
create policy "Users can update their own Preach Flow state"
on public.preach_flow_user_state
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own Preach Flow state" on public.preach_flow_user_state;
create policy "Users can delete their own Preach Flow state"
on public.preach_flow_user_state
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- ---- Sharing and Delivery Center ----
-- Read-only share links. Anonymous visitors can ONLY read a payload through
-- the token-gated function below; the table itself is never selectable by anon.
create table if not exists public.preach_flow_shared_views (
  token text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  sermon_id text not null,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  revoked boolean not null default false,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.preach_flow_shared_views enable row level security;

drop policy if exists "Owners manage their shared views" on public.preach_flow_shared_views;
create policy "Owners manage their shared views"
on public.preach_flow_shared_views
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.preach_flow_get_shared_view(share_token text)
returns jsonb
language sql
security definer
stable
set search_path = public
as $$
  select payload || jsonb_build_object('updatedAt', updated_at, 'kind', kind)
  from public.preach_flow_shared_views
  where token = share_token
    and revoked = false
    and (expires_at is null or expires_at > now());
$$;

grant execute on function public.preach_flow_get_shared_view(text) to anon, authenticated;
