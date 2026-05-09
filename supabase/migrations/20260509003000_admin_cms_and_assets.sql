create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid unique references auth.users(id) on delete set null,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_admin_users_updated_at
before update on public.admin_users
for each row
execute function public.set_updated_at();

alter table public.messages
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

drop trigger if exists set_messages_updated_at on public.messages;
create trigger set_messages_updated_at
before update on public.messages
for each row
execute function public.set_updated_at();

alter table public.media_assets
  add column if not exists updated_at timestamptz not null default timezone('utc', now()),
  add column if not exists file_name text not null default '',
  add column if not exists public_url text not null default '',
  add column if not exists source_path text not null default '',
  add column if not exists file_size_bytes bigint,
  add column if not exists is_public boolean not null default true;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_assets_bucket_object_path_unique'
  ) then
    alter table public.media_assets
      add constraint media_assets_bucket_object_path_unique unique (bucket, object_path);
  end if;
end $$;

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row
execute function public.set_updated_at();

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users admin_user
    where admin_user.is_active = true
      and (
        admin_user.user_id = (select auth.uid())
        or lower(admin_user.email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
      )
  );
$$;

alter table public.admin_users enable row level security;

create policy "admin users can view admin user rows"
on public.admin_users
for select
to authenticated
using (public.is_admin_user());

create policy "admin users can manage admin user rows"
on public.admin_users
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

grant select, insert, update, delete on public.admin_users to authenticated;

do $$
declare
  table_name text;
  tables text[] := array[
    'profiles',
    'profile_life',
    'profile_tags',
    'profile_list_items',
    'experiences',
    'schools',
    'education_meta',
    'work_meta',
    'jobs',
    'development_skills',
    'projects',
    'project_roles',
    'project_tech_stack',
    'dev_tools',
    'dev_tool_tags',
    'product_items',
    'product_item_tags',
    'hardware_items',
    'creation_items',
    'media_items',
    'performances',
    'contact_methods',
    'platform_accounts',
    'thought_qa',
    'notifications',
    'messages',
    'media_assets'
  ];
begin
  foreach table_name in array tables loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
    execute format('drop policy if exists "admin manage %s" on public.%I', table_name, table_name);
    execute format(
      'create policy "admin manage %s" on public.%I for all to authenticated using (public.is_admin_user()) with check (public.is_admin_user())',
      table_name,
      table_name
    );
  end loop;
end $$;

drop policy if exists "authenticated can manage public assets" on storage.objects;
drop policy if exists "authenticated can manage private assets" on storage.objects;

create policy "admin can manage public assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'public-assets' and public.is_admin_user())
with check (bucket_id = 'public-assets' and public.is_admin_user());

create policy "admin can manage private assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'private-assets' and public.is_admin_user())
with check (bucket_id = 'private-assets' and public.is_admin_user());
