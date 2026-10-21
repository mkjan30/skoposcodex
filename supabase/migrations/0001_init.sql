-- Skopos Codex initial schema. Source of truth: docs/05-Backend-Schema.md §3–5.

create extension if not exists pgcrypto;
create extension if not exists citext;

-- Enums ---------------------------------------------------------------------

create type service_type as enum
  ('local_seo', 'ppc', 'branding', 'website_design', 'funnel_building', 'not_sure');

create type lead_status as enum
  ('new', 'contacted', 'qualified', 'won', 'lost', 'spam');

create type onboarding_status as enum
  ('submitted', 'in_review', 'kickoff_scheduled', 'active', 'archived');

-- Tables --------------------------------------------------------------------

create table leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  full_name    text not null check (char_length(full_name) between 1 and 120),
  email        citext not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone        text check (char_length(phone) <= 40),
  company      text check (char_length(company) <= 160),
  service      service_type not null,
  message      text not null check (char_length(message) between 1 and 5000),
  status       lead_status not null default 'new',
  source_page  text check (char_length(source_page) <= 300),
  utm          jsonb not null default '{}',
  ip_hash      text,
  user_agent   text check (char_length(user_agent) <= 500)
);
create index leads_created_at_idx on leads (created_at desc);
create index leads_status_idx on leads (status);
create index leads_email_idx on leads (email);

create table onboarding_submissions (
  id              uuid primary key,          -- client-generated -> idempotent upsert
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  service         service_type not null check (service <> 'not_sure'),
  status          onboarding_status not null default 'submitted',
  business_name   text not null,
  contact_name    text not null,
  contact_email   citext not null,
  contact_phone   text,
  website_url     text,
  monthly_budget  text,
  business        jsonb not null,
  goals           jsonb not null,
  details         jsonb not null,
  schema_version  int  not null default 1,
  lead_id         uuid references leads(id) on delete set null,
  ip_hash         text
);
create index onboarding_created_at_idx on onboarding_submissions (created_at desc);
create index onboarding_service_idx on onboarding_submissions (service);
create index onboarding_status_idx on onboarding_submissions (status);

create table onboarding_files (
  id             uuid primary key default gen_random_uuid(),
  submission_id  uuid not null references onboarding_submissions(id) on delete cascade,
  slot           text not null,
  storage_path   text not null unique,
  file_name      text not null,
  mime_type      text not null,
  size_bytes     int  not null check (size_bytes <= 26214400), -- 25 MB
  created_at     timestamptz not null default now()
);
create index onboarding_files_submission_idx on onboarding_files (submission_id);

create table notes (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  author_email   citext not null,
  lead_id        uuid references leads(id) on delete cascade,
  submission_id  uuid references onboarding_submissions(id) on delete cascade,
  body           text not null check (char_length(body) <= 5000),
  check ((lead_id is null) <> (submission_id is null))  -- exactly one parent
);

create table admins (
  email      citext primary key,
  created_at timestamptz not null default now()
);

create table rate_limits (
  key          text not null,
  window_start timestamptz not null,
  count        int not null default 0,
  primary key (key, window_start)
);

-- updated_at ----------------------------------------------------------------

create function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger onboarding_submissions_updated_at
  before update on onboarding_submissions
  for each row execute function set_updated_at();

-- Rate limiting -------------------------------------------------------------

-- Fixed-window counter; returns true while the caller is within p_max hits per window.
create function hit_rate_limit(p_key text, p_window_seconds int, p_max int) returns boolean
language plpgsql security definer set search_path = public as $$
declare
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  c int;
begin
  insert into rate_limits (key, window_start, count) values (p_key, w, 1)
  on conflict (key, window_start) do update set count = rate_limits.count + 1
  returning count into c;
  return c <= p_max;
end $$;

-- Row-level security --------------------------------------------------------

alter table leads                  enable row level security;
alter table onboarding_submissions enable row level security;
alter table onboarding_files       enable row level security;
alter table notes                  enable row level security;
alter table admins                 enable row level security;
alter table rate_limits            enable row level security;

create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = (auth.jwt() ->> 'email')::citext);
$$;

-- Admin read/write; no anon policies, so the public can neither read nor write.
-- Public forms insert through server actions using the service-role key.
create policy admin_all on leads                  for all using (is_admin()) with check (is_admin());
create policy admin_all on onboarding_submissions for all using (is_admin()) with check (is_admin());
create policy admin_all on onboarding_files       for all using (is_admin()) with check (is_admin());
create policy admin_all on notes                  for all using (is_admin()) with check (is_admin());
create policy admin_read on admins                for select using (is_admin());
-- rate_limits: service role only (no policies).

revoke execute on function hit_rate_limit(text, int, int) from public;
