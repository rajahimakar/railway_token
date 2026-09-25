-- Make sure the service-role can actually access the tables.
-- This is required because the project is using a privileged server-side client.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.roles to service_role;
grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.cost_settings to service_role;
grant select, insert, update, delete on public.tokens to service_role;
grant select, insert, update, delete on public.token_history to service_role;
grant select, insert, update, delete on public.notifications to service_role;
grant select, insert, update, delete on public.audit_logs to service_role;

-- Enable RLS on all sensitive tables
alter table roles enable row level security;
alter table profiles enable row level security;
alter table cost_settings enable row level security;
alter table tokens enable row level security;
alter table token_history enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

-- Drop existing policies first so this script can be re-run safely
-- without hitting "policy already exists" errors in Supabase.
drop policy if exists "roles readable by authenticated users" on roles;
drop policy if exists "profiles readable by authenticated users" on profiles;
drop policy if exists "profiles insertable by authenticated users" on profiles;
drop policy if exists "profiles updatable by authenticated users" on profiles;
drop policy if exists "cost settings readable by authenticated users" on cost_settings;
drop policy if exists "cost settings updatable by authenticated users" on cost_settings;
drop policy if exists "tokens readable by authenticated users" on tokens;
drop policy if exists "tokens insertable by authenticated users" on tokens;
drop policy if exists "tokens updatable by authenticated users" on tokens;
drop policy if exists "token history readable by authenticated users" on token_history;
drop policy if exists "token history insertable by authenticated users" on token_history;
drop policy if exists "notifications readable by authenticated users" on notifications;
drop policy if exists "notifications insertable by authenticated users" on notifications;
drop policy if exists "notifications updatable by authenticated users" on notifications;
drop policy if exists "audit logs readable by authenticated users" on audit_logs;
drop policy if exists "audit logs insertable by authenticated users" on audit_logs;
drop policy if exists "demo allow tokens select" on tokens;
drop policy if exists "demo allow tokens insert" on tokens;
drop policy if exists "demo allow tokens update" on tokens;
drop policy if exists "demo allow notifications select" on notifications;
drop policy if exists "demo allow notifications insert" on notifications;
drop policy if exists "demo allow notifications update" on notifications;
drop policy if exists "demo allow history select" on token_history;
drop policy if exists "demo allow history insert" on token_history;
drop policy if exists "demo allow costs select" on cost_settings;
drop policy if exists "demo allow costs update" on cost_settings;

-- Roles are readable by authenticated users
create policy "roles readable by authenticated users"
on roles for select
using (auth.role() = 'authenticated');

-- Profiles are readable by authenticated users
create policy "profiles readable by authenticated users"
on profiles for select
using (auth.role() = 'authenticated');

create policy "profiles insertable by authenticated users"
on profiles for insert
with check (auth.role() = 'authenticated');

create policy "profiles updatable by authenticated users"
on profiles for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Cost settings are readable by authenticated users
create policy "cost settings readable by authenticated users"
on cost_settings for select
using (auth.role() = 'authenticated');

create policy "cost settings updatable by authenticated users"
on cost_settings for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Tokens: authenticated users can read and write
create policy "tokens readable by authenticated users"
on tokens for select
using (auth.role() = 'authenticated');

create policy "tokens insertable by authenticated users"
on tokens for insert
with check (auth.role() = 'authenticated');

create policy "tokens updatable by authenticated users"
on tokens for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Token history is readable by authenticated users
create policy "token history readable by authenticated users"
on token_history for select
using (auth.role() = 'authenticated');

create policy "token history insertable by authenticated users"
on token_history for insert
with check (auth.role() = 'authenticated');

-- Notifications are readable by authenticated users
create policy "notifications readable by authenticated users"
on notifications for select
using (auth.role() = 'authenticated');

create policy "notifications insertable by authenticated users"
on notifications for insert
with check (auth.role() = 'authenticated');

create policy "notifications updatable by authenticated users"
on notifications for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Audit logs are readable by authenticated users
create policy "audit logs readable by authenticated users"
on audit_logs for select
using (auth.role() = 'authenticated');

create policy "audit logs insertable by authenticated users"
on audit_logs for insert
with check (auth.role() = 'authenticated');

-- Demo-phase fallback for the live prototype
-- This keeps the app usable while the project is still in the zero-cost live demo stage.
-- Tighten these policies later before production rollout.
create policy "demo allow tokens select"
on tokens for select
using (true);

create policy "demo allow tokens insert"
on tokens for insert
with check (true);

create policy "demo allow tokens update"
on tokens for update
using (true)
with check (true);

create policy "demo allow notifications select"
on notifications for select
using (true);

create policy "demo allow notifications insert"
on notifications for insert
with check (true);

create policy "demo allow notifications update"
on notifications for update
using (true)
with check (true);

create policy "demo allow history select"
on token_history for select
using (true);

create policy "demo allow history insert"
on token_history for insert
with check (true);

create policy "demo allow costs select"
on cost_settings for select
using (true);

create policy "demo allow costs update"
on cost_settings for update
using (true)
with check (true);
