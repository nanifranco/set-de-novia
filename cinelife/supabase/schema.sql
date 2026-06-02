-- CineLife Database Schema

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null check (username in ('nani', 'maria')),
  display_name text not null,
  career_level int not null default 1,
  career_xp int not null default 0,
  coins int not null default 50,
  streak_days int not null default 0,
  last_habit_date date,
  partner_id uuid references public.users(id),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.user_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  resource_type text not null check (resource_type in ('script','energy','negative','inspiration','prop','credit')),
  quantity int not null default 0,
  unique(user_id, resource_type)
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  category text not null check (category in ('wellness','knowledge','creative','social')),
  icon text not null default '⭐',
  xp_reward int not null default 30,
  coins_reward int not null default 10,
  resources jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  xp_earned int not null,
  completed_at timestamptz not null default now()
);

create table public.movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text,
  genre text,
  synopsis text,
  tagline text,
  director_note text,
  festival text,
  critic_rating numeric(3,1),
  audience_rating numeric(3,1),
  phase int not null default 1 check (phase between 1 and 4),
  resources_invested jsonb not null default '{}',
  habit_log jsonb not null default '{}',
  is_collaborative boolean not null default false,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  director text not null default '',
  year int,
  genre text not null default '',
  notes text not null default '',
  watched boolean not null default false,
  added_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('cheer','gift')),
  content text not null,
  resource_type text,
  resource_qty int,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.user_resources enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.movies enable row level security;
alter table public.watchlist enable row level security;
alter table public.messages enable row level security;

-- Users: can read own + partner
create policy "users_select" on public.users for select
  using (auth.uid() = id or auth.uid() in (select id from public.users where partner_id = users.id));
create policy "users_insert" on public.users for insert with check (auth.uid() = id);
create policy "users_update" on public.users for update using (auth.uid() = id);

-- Resources: own + partner can read
create policy "resources_select" on public.user_resources for select
  using (auth.uid() = user_id or exists (select 1 from public.users where id = auth.uid() and partner_id = user_resources.user_id));
create policy "resources_all" on public.user_resources for all using (auth.uid() = user_id);

-- Habits: own only
create policy "habits_all" on public.habits for all using (auth.uid() = user_id);

-- Habit logs: own only
create policy "habit_logs_all" on public.habit_logs for all using (auth.uid() = user_id);

-- Movies: own + partner can read
create policy "movies_select" on public.movies for select
  using (auth.uid() = user_id or exists (select 1 from public.users where id = auth.uid() and partner_id = movies.user_id));
create policy "movies_write" on public.movies for all using (auth.uid() = user_id);

-- Watchlist: own only
create policy "watchlist_all" on public.watchlist for all using (auth.uid() = user_id);

-- Messages: sender or receiver
create policy "messages_select" on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "messages_insert" on public.messages for insert with check (auth.uid() = sender_id);
create policy "messages_update" on public.messages for update using (auth.uid() = receiver_id);
