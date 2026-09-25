create extension if not exists pgcrypto;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  employee_id text,
  role_id uuid not null references roles(id),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cost_settings (
  id uuid primary key default gen_random_uuid(),
  bike_hourly_rate numeric(10,2) not null default 20,
  bike_daily_max numeric(10,2) not null default 100,
  car_hourly_rate numeric(10,2) not null default 40,
  car_daily_max numeric(10,2) not null default 200,
  monthly_pass_price numeric(10,2) not null default 2000,
  grace_period_minutes integer not null default 10,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists tokens (
  id uuid primary key default gen_random_uuid(),
  token_number text not null unique,
  vehicle_number text not null,
  driver_name text not null,
  driver_phone text,
  vehicle_type text not null check (vehicle_type in ('bike','car')),
  pass_type text not null check (pass_type in ('hourly','monthly')),
  spot text not null,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  entry_at timestamptz not null default now(),
  exit_at timestamptz,
  paid_minutes integer not null default 60,
  paid_amount numeric(10,2) not null default 0,
  monthly_locked_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists token_history (
  id uuid primary key default gen_random_uuid(),
  token_id uuid not null references tokens(id) on delete cascade,
  event_type text not null,
  event_details jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  token_id uuid not null references tokens(id) on delete cascade,
  recipient_role text not null check (recipient_role in ('owner','employee')),
  vehicle_number text not null,
  overdue_minutes integer not null default 0,
  paid_minutes integer not null default 0,
  current_elapsed_minutes integer not null default 0,
  status text not null default 'open' check (status in ('open','resolved','dismissed')),
  message text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid,
  action text not null,
  details jsonb,
  actor_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_tokens_status on tokens(status);
create index if not exists idx_tokens_entry_at on tokens(entry_at);
create index if not exists idx_notifications_status on notifications(status);
create index if not exists idx_token_history_token_id on token_history(token_id);
create index if not exists idx_audit_logs_table_record on audit_logs(table_name, record_id);

insert into roles (name)
values ('siteowner'), ('siteemployee'), ('business'), ('master')
on conflict (name) do nothing;

insert into cost_settings (
  bike_hourly_rate,
  bike_daily_max,
  car_hourly_rate,
  car_daily_max,
  monthly_pass_price,
  grace_period_minutes
)
values (20, 100, 40, 200, 2000, 10)
on conflict do nothing;
