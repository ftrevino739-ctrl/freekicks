-- Daily ranking of Free Kick Legends: table and permissions in Supabase.
-- How to use: in the Supabase project panel, open "SQL Editor", paste all this and click "Run".
-- Then copy, in "Project Settings > API", the "Project URL" and the "anon public" key to js/config.js
-- (field `ranking`: url and key).

create table if not exists public.ranking (
  id bigint generated always as identity primary key,
  dia text not null check (dia ~ '^\d{4}-\d{2}-\d{2}$'),      -- 2026-10-10
  nome text not null check (char_length(nome) between 1 and 24),
  gols integer not null check (gols between 1 and 200),
  criado_em timestamptz not null default now()
);

create index if not exists ranking_dia_gols on public.ranking (dia, gols desc);

-- Row security: the public key can only READ and INSERT; no one deletes or edits via the game.
alter table public.ranking enable row level security;

drop policy if exists "read ranking" on public.ranking;
create policy "read ranking" on public.ranking for select to anon using (true);

drop policy if exists "enter ranking" on public.ranking;
create policy "enter ranking" on public.ranking for insert to anon with check (true);
