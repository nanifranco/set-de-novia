-- Users (only nani and maria)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null check (username in ('nani', 'maria')),
  display_name text not null,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  last_habit_date date,
  created_at timestamptz default now()
);

-- Habits per user
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  icon text not null default '✨',
  xp_reward integer not null default 20,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Log of completed habits
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  xp_earned integer not null,
  completed_at timestamptz default now()
);

-- Messages between the two
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.users(id) on delete cascade,
  receiver_id uuid references public.users(id) on delete cascade,
  content text not null,
  type text not null default 'text' check (type in ('text', 'congrats', 'love')),
  read boolean not null default false,
  created_at timestamptz default now()
);

-- María's watchlist
create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  director text,
  year integer,
  genre text,
  notes text,
  watched boolean not null default false,
  added_at timestamptz default now()
);

-- Seed users
insert into public.users (username, display_name) values
  ('nani', 'Nani'),
  ('maria', 'María');

-- Seed Nani's default habits
insert into public.habits (user_id, name, icon, xp_reward)
select id, habit_name, habit_icon, habit_xp
from public.users, (values
  ('Trabajar en el taller',   '🔧', 30),
  ('Soldar algo nuevo',       '🔥', 25),
  ('Proyecto de carpintería', '🪚', 25),
  ('Aprender electrónica',    '🔌', 20),
  ('Avanzar con el robot',    '🤖', 35),
  ('Limpiar y organizar',     '🧹', 15)
) as t(habit_name, habit_icon, habit_xp)
where username = 'nani';

-- Seed María's default habits
insert into public.habits (user_id, name, icon, xp_reward)
select id, habit_name, habit_icon, habit_xp
from public.users, (values
  ('Ver una película',         '🎬', 20),
  ('Escribir guión',           '📝', 30),
  ('Estudiar para la carrera', '📚', 25),
  ('Ver una serie',            '📺', 15),
  ('Investigar directores',    '🎞️', 20),
  ('Escribir reseña',          '✍️', 20)
) as t(habit_name, habit_icon, habit_xp)
where username = 'maria';

-- RLS (open for the two users — no auth needed)
alter table public.users enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.messages enable row level security;
alter table public.watchlist enable row level security;

create policy "allow all" on public.users for all using (true);
create policy "allow all" on public.habits for all using (true);
create policy "allow all" on public.habit_logs for all using (true);
create policy "allow all" on public.messages for all using (true);
create policy "allow all" on public.watchlist for all using (true);
