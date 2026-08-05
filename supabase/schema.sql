-- Ejecuta este archivo una sola vez en Supabase > SQL Editor.
create table if not exists public.rsvp_confirmations (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 80),
  attending boolean not null,
  adults integer not null default 0 check (adults between 0 and 50),
  children integer not null default 0 check (children between 0 and 50),
  note text check (note is null or char_length(note) <= 180),
  created_at timestamptz not null default now(),
  constraint rsvp_attendance_counts check (
    (attending = false and adults = 0 and children = 0)
    or
    (attending = true and adults + children > 0)
  )
);

create index if not exists rsvp_confirmations_created_at_idx
  on public.rsvp_confirmations (created_at desc);

-- Los invitados nunca consultan Supabase directamente. Solo las funciones
-- privadas de Vercel usan la llave secreta del servidor.
alter table public.rsvp_confirmations enable row level security;
revoke all on table public.rsvp_confirmations from anon, authenticated;
