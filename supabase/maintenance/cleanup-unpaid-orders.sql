-- City Beans: tidy up orders that were saved at checkout but never paid.
-- Run these in the Supabase SQL Editor, one numbered step at a time.
-- Nothing here touches an order that has a PAID payment.

-- 1) PREVIEW — which orders would be cancelled right now? (read-only)
select o.order_number, o.status, o.created_at
from public.orders o
where o.status = 'PENDING'
  and o.created_at < now() - interval '24 hours'
  and not exists (
    select 1 from public.payments p where p.order_id = o.id and p.status = 'PAID'
  )
order by o.created_at;

-- 2) SCHEDULE: every hour, cancel unpaid orders older than 24 hours.
-- (First enable the pg_cron extension: Database -> Extensions -> pg_cron.)
select cron.schedule(
  'cancel-unpaid-orders',
  '15 * * * *',
  $$
    update public.orders o
    set status = 'CANCELLED'
    where o.status = 'PENDING'
      and o.created_at < now() - interval '24 hours'
      and not exists (
        select 1 from public.payments p where p.order_id = o.id and p.status = 'PAID'
      )
  $$
);

-- 3) BEFORE ANY DELETING: check what happens to an order's related rows.
-- Run this and look at the confdeltype column: 'c' means the related rows
-- are removed automatically along with the order. Only continue to step 4
-- if EVERY row says 'c'.
select conrelid::regclass as related_table, confdeltype
from pg_constraint
where confrelid = 'public.orders'::regclass and contype = 'f';

-- 4) OPTIONAL — only after step 3 shows all 'c'.
-- Every night, delete cancelled, never-paid orders older than 7 days.
-- select cron.schedule(
--   'delete-old-unpaid-orders',
--   '30 3 * * *',
--   $$
--     delete from public.orders o
--     where o.status = 'CANCELLED'
--       and o.created_at < now() - interval '7 days'
--       and not exists (
--         select 1 from public.payments p where p.order_id = o.id and p.status = 'PAID'
--       )
--   $$
-- );

-- TO UNDO a schedule:
--   select cron.unschedule('cancel-unpaid-orders');
--   select cron.unschedule('delete-old-unpaid-orders');
