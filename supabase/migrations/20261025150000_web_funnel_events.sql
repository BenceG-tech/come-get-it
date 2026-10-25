-- Cookieless, anonymous funnel events from the public landing page.
-- One random visit_id per page load (kept in memory only), no IP, no e-mail.
create table if not exists public.web_funnel_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visit_id text not null check (char_length(visit_id) <= 64),
  event text not null check (char_length(event) <= 64),
  props jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 2048),
  path text check (char_length(path) <= 200),
  device text check (device in ('mobile', 'desktop')),
  in_app text check (char_length(in_app) <= 20),
  utm_source text check (char_length(utm_source) <= 100),
  utm_medium text check (char_length(utm_medium) <= 100),
  utm_campaign text check (char_length(utm_campaign) <= 150),
  utm_content text check (char_length(utm_content) <= 150),
  referrer text check (char_length(referrer) <= 200)
);

create index if not exists web_funnel_events_created_at_idx on public.web_funnel_events (created_at desc);
create index if not exists web_funnel_events_visit_idx on public.web_funnel_events (visit_id);

alter table public.web_funnel_events enable row level security;

-- Visitors may only add rows; nobody but admins can read them.
drop policy if exists "Anyone can insert funnel events" on public.web_funnel_events;
create policy "Anyone can insert funnel events" on public.web_funnel_events
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins read funnel events" on public.web_funnel_events;
create policy "Admins read funnel events" on public.web_funnel_events
  for select to authenticated using (public.has_role(auth.uid(), 'admin'::app_role));

grant insert on public.web_funnel_events to anon, authenticated;

-- Daily drop-off funnel for the landing page: how many visits reached each step.
create or replace view public.web_funnel_daily
with (security_invoker = true) as
select
  (created_at at time zone 'Europe/Budapest')::date as day,
  device,
  coalesce(utm_source, in_app, referrer, 'direct') as source,
  count(distinct visit_id) filter (where event = 'page_view') as visits,
  count(distinct visit_id) filter (where event = 'scroll_depth' and (props->>'percent')::int >= 25) as scrolled_25,
  count(distinct visit_id) filter (where event = 'scroll_depth' and (props->>'percent')::int >= 50) as scrolled_50,
  count(distinct visit_id) filter (where event = 'scroll_depth' and (props->>'percent')::int >= 75) as scrolled_75,
  count(distinct visit_id) filter (where event = 'cta_click') as clicked_cta,
  count(distinct visit_id) filter (where event = 'section_view' and props->>'section' = 'signup') as saw_form,
  count(distinct visit_id) filter (where event = 'signup_form_start') as started_form,
  count(distinct visit_id) filter (where event = 'signup_success') as signed_up,
  count(distinct visit_id) filter (where event = 'signup_error') as had_error
from public.web_funnel_events
where path = '/'
group by 1, 2, 3;

-- Where visits stop: the last landing section each visit saw.
create or replace view public.web_funnel_last_section
with (security_invoker = true) as
select last_section, count(*) as visits
from (
  select distinct on (visit_id) visit_id, props->>'section' as last_section
  from public.web_funnel_events
  where event = 'section_view' and path = '/'
  order by visit_id, created_at desc
) s
group by 1
order by 2 desc;
