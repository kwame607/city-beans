-- City Beans security hardening. Safe to run more than once.
-- Run in Supabase -> SQL Editor.

-- 1) create_order: validate quantities and sizes, limit spam per phone,
--    only allow extras that belong to the product and are available.
create or replace function public.create_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_method        text  := payload->>'method';
  v_guest_name    text  := trim(coalesce(payload->>'guest_name',''));
  v_guest_phone   text  := trim(coalesce(payload->>'guest_phone',''));
  v_guest_email   text  := nullif(trim(coalesce(payload->>'guest_email','')), '');
  v_zone_id       uuid  := nullif(payload->>'zone_id','')::uuid;
  v_address       jsonb := payload->'address';
  v_items         jsonb := payload->'items';
  v_item          jsonb;
  v_extra_id      uuid;
  v_qty           int;
  v_product       record;
  v_extra         record;
  v_settings      record;
  v_subtotal      numeric(10,2) := 0;
  v_delivery_fee  numeric(10,2) := 0;
  v_total         numeric(10,2) := 0;
  v_line_total    numeric(10,2);
  v_order_id      uuid;
  v_order_item_id uuid;
  v_order_number  text;
  v_digits        text;
  v_recent        int;
begin
  if v_guest_name = '' then raise exception 'Full name is required'; end if;
  if length(v_guest_name) > 100 then raise exception 'Name is too long'; end if;

  v_digits := regexp_replace(v_guest_phone, '\D', '', 'g');
  if length(v_digits) < 9 or length(v_digits) > 15 then
    raise exception 'Please enter a valid phone number';
  end if;
  if v_guest_email is not null and (length(v_guest_email) > 200 or v_guest_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then
    raise exception 'Please enter a valid email address';
  end if;

  if v_method is null or v_method not in ('DELIVERY','PICKUP') then
    raise exception 'Invalid delivery method';
  end if;
  if v_items is null or jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 then
    raise exception 'Cart is empty';
  end if;
  if jsonb_array_length(v_items) > 30 then
    raise exception 'Too many items in one order';
  end if;

  -- spam guard: max 5 unpaid orders per phone number per hour
  select count(*) into v_recent
  from orders o
  where regexp_replace(o.guest_phone, '\D', '', 'g') = v_digits
    and o.status = 'PENDING'
    and o.created_at > now() - interval '1 hour'
    and not exists (select 1 from payments p where p.order_id = o.id and p.status = 'PAID');
  if v_recent >= 5 then
    raise exception 'Too many pending orders. Please complete payment or try again later.';
  end if;

  select * into v_settings from settings where id = 1;

  if v_method = 'PICKUP' and not coalesce(v_settings.pickup_enabled, true) then
    raise exception 'Pickup is currently unavailable';
  end if;
  if v_method = 'DELIVERY' and not coalesce(v_settings.delivery_enabled, true) then
    raise exception 'Delivery is currently unavailable';
  end if;

  for v_item in select * from jsonb_array_elements(v_items)
  loop
    v_qty := (v_item->>'quantity')::int;
    if v_qty is null or v_qty < 1 or v_qty > 50 then
      raise exception 'Invalid quantity';
    end if;

    select id, name, price, available into v_product
    from products where id = (v_item->>'product_id')::uuid;

    if v_product.id is null then raise exception 'Product not found'; end if;
    if not v_product.available then
      raise exception '% is currently unavailable', v_product.name;
    end if;

    v_line_total := v_product.price * v_qty;

    if v_item ? 'extra_ids' then
      if jsonb_array_length(v_item->'extra_ids') > 20 then
        raise exception 'Too many extras on one item';
      end if;
      for v_extra_id in select jsonb_array_elements_text(v_item->'extra_ids')::uuid
      loop
        select id, name, price into v_extra from extras where id = v_extra_id;
        if v_extra.id is null then raise exception 'Extra not found'; end if;
        v_line_total := v_line_total + v_extra.price * v_qty;
      end loop;
    end if;

    v_subtotal := v_subtotal + v_line_total;
  end loop;

  if v_settings.min_order_amount is not null and v_subtotal < v_settings.min_order_amount then
    raise exception 'Minimum order is GH₵%', v_settings.min_order_amount;
  end if;

  if v_method = 'DELIVERY' then
    if v_zone_id is null then raise exception 'Delivery zone is required'; end if;
    select fee into v_delivery_fee from delivery_zones where id = v_zone_id and active = true;
    if v_delivery_fee is null then raise exception 'Selected delivery zone is unavailable'; end if;
  else
    v_delivery_fee := 0;
  end if;

  v_total := v_subtotal + v_delivery_fee;
  v_order_number := 'CB-' || nextval('order_number_seq');

  insert into orders (order_number, guest_name, guest_phone, guest_email, method, status, subtotal, delivery_fee, total)
  values (v_order_number, v_guest_name, left(v_guest_phone, 30), v_guest_email,
          v_method::delivery_method, 'PENDING', v_subtotal, v_delivery_fee, v_total)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(v_items)
  loop
    select id, name, price into v_product from products where id = (v_item->>'product_id')::uuid;

    insert into order_items (order_id, product_id, name_snapshot, price_snapshot, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.price, (v_item->>'quantity')::int)
    returning id into v_order_item_id;

    if v_item ? 'extra_ids' then
      for v_extra_id in select jsonb_array_elements_text(v_item->'extra_ids')::uuid
      loop
        select id, name, price into v_extra from extras where id = v_extra_id;
        insert into order_item_extras (order_item_id, extra_id, name_snapshot, price_snapshot)
        values (v_order_item_id, v_extra.id, v_extra.name, v_extra.price);
      end loop;
    end if;
  end loop;

  if v_method = 'DELIVERY' then
    insert into delivery_addresses (order_id, region, city, area, ghana_post_gps, house_desc, instructions)
    values (
      v_order_id,
      left(v_address->>'region', 100),
      left(v_address->>'city', 100),
      left(v_address->>'area', 100),
      left(v_address->>'ghana_post_gps', 30),
      left(v_address->>'house_desc', 300),
      left(v_address->>'instructions', 500)
    );
  end if;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total', v_total
  );
end;
$function$;

-- 2) init_payment: refuse cancelled orders
create or replace function public.init_payment(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_order    record;
  v_existing record;
  v_reference text;
begin
  select id, total, status into v_order from orders where id = p_order_id;
  if v_order.id is null then raise exception 'Order not found'; end if;
  if v_order.status = 'CANCELLED' then
    raise exception 'This order was cancelled. Please place a new order.';
  end if;

  select * into v_existing from payments where order_id = p_order_id;

  if v_existing.id is not null then
    if v_existing.status = 'PAID' then
      raise exception 'This order has already been paid';
    end if;
    return jsonb_build_object('reference', v_existing.reference, 'amount', v_order.total);
  end if;

  v_reference := 'CB-PAY-' || replace(p_order_id::text, '-', '') || '-' || floor(extract(epoch from now()))::text;

  insert into payments (order_id, reference, status, amount, currency)
  values (p_order_id, v_reference, 'PENDING', v_order.total, 'GHS');

  return jsonb_build_object('reference', v_reference, 'amount', v_order.total);
end;
$function$;

-- 3) Image bucket: 2 MB limit, images only
update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg','image/png','image/webp']
where id = 'product-images';

