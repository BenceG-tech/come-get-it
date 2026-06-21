create unique index if not exists inbox_items_dedupe_key_uidx on public.inbox_items(dedupe_key) where dedupe_key is not null;

create or replace function public.on_outreach_reply_prompt_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_entity_id uuid;
  v_decision record;
begin
  if NEW.replied_at is null then return NEW; end if;
  if TG_OP = 'UPDATE' and OLD.replied_at is not null then return NEW; end if;

  select entity_id into v_entity_id from public.outreach_enrollments where id = NEW.enrollment_id;
  if v_entity_id is null then return NEW; end if;

  for v_decision in
    select id, decision_text from public.decisions
    where entity_id = v_entity_id and outcome is null
    limit 5
  loop
    insert into public.inbox_items (kind, severity, title, entity_kind, entity_id, payload, status, dedupe_key)
    values (
      'decision_review',
      'info',
      'Reply érkezett — értékeld a döntést: ' || left(coalesce(v_decision.decision_text, ''), 80),
      'decision', v_decision.id,
      jsonb_build_object('decision_id', v_decision.id, 'trigger', 'outreach_reply', 'outreach_event_id', NEW.id),
      'open',
      'decision_review_reply_' || v_decision.id::text || '_' || NEW.id::text
    )
    on conflict (dedupe_key) do nothing;
  end loop;

  return NEW;
end;
$$;

drop trigger if exists trg_outreach_reply_decision on public.outreach_events;
create trigger trg_outreach_reply_decision
after insert or update of replied_at on public.outreach_events
for each row execute function public.on_outreach_reply_prompt_decision();