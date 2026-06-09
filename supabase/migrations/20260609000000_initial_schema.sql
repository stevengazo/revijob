-- ============================================================================
-- ReviJob — Esquema inicial
-- ----------------------------------------------------------------------------
-- Modelo de datos para postulaciones de empleo y generador de CV.
-- Cada fila pertenece a un usuario (auth.users) y está protegida con RLS:
-- cada usuario solo ve y modifica sus propios datos.
--
-- Basado en src/types/application.ts y src/types/cv.ts.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensiones
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto" with schema extensions;  -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Tipos
-- ----------------------------------------------------------------------------
-- Estados del kanban (ver APPLICATION_STATUSES en src/types/application.ts).
do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum (
      'Pendiente',
      'En revisión',
      'Entrevista',
      'Rechazada',
      'Aceptada'
    );
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- Función auxiliar: mantener updated_at
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- Tabla: applications  (EmploymentApplication)
-- ============================================================================
create table if not exists public.applications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  company      text not null,
  position     text not null,
  platform     text not null,
  status       public.application_status not null default 'Pendiente',
  applied_date date not null,
  location     text,
  url          text,
  salary       text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.applications is 'Postulaciones de empleo registradas por el usuario.';

create index if not exists applications_user_id_idx       on public.applications (user_id);
create index if not exists applications_user_status_idx   on public.applications (user_id, status);
create index if not exists applications_applied_date_idx  on public.applications (user_id, applied_date);

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Tabla: application_comments  (CommentItem)
-- ============================================================================
create table if not exists public.application_comments (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  text           text not null,
  created_at     timestamptz not null default now()
);

comment on table public.application_comments is 'Comentarios con marca de tiempo de cada postulación.';

create index if not exists application_comments_application_idx
  on public.application_comments (application_id, created_at);

-- ============================================================================
-- Tabla: application_notes  (NoteItem)
-- ============================================================================
create table if not exists public.application_notes (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  text           text not null,
  created_at     timestamptz not null default now()
);

comment on table public.application_notes is 'Notas con marca de tiempo de cada postulación.';

create index if not exists application_notes_application_idx
  on public.application_notes (application_id, created_at);

-- ============================================================================
-- Tabla: cv_documents  (CVDocument)  — un CV "actual" por usuario
-- ----------------------------------------------------------------------------
-- Las secciones de lista (skills, competencies, experience, education,
-- projects, others) se guardan como JSONB porque la app las lee y escribe
-- como un documento completo. `personal` agrupa los datos de contacto.
--
-- NOTA: pdf_data_url guarda el PDF como data URL (igual que en localStorage).
-- Para producción se recomienda Supabase Storage y guardar solo la ruta.
-- ============================================================================
create table if not exists public.cv_documents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references auth.users (id) on delete cascade,
  personal     jsonb not null default '{
    "fullName": "", "headline": "", "email": "", "phone": "",
    "location": "", "website": "", "linkedin": "", "x": ""
  }'::jsonb,
  summary      text  not null default '',
  skills       jsonb not null default '[]'::jsonb,
  competencies jsonb not null default '[]'::jsonb,
  experience   jsonb not null default '[]'::jsonb,
  education    jsonb not null default '[]'::jsonb,
  projects     jsonb not null default '[]'::jsonb,
  others       jsonb not null default '[]'::jsonb,
  accent_color text  not null default '#7c3aed',
  pdf_data_url text,
  pdf_name     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.cv_documents is 'CV actual del usuario (uno por usuario).';

create index if not exists cv_documents_user_id_idx on public.cv_documents (user_id);

drop trigger if exists cv_documents_set_updated_at on public.cv_documents;
create trigger cv_documents_set_updated_at
  before update on public.cv_documents
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Tabla: cv_versions  (CVVersion)  — instantáneas del CV (máx. 30 en la app)
-- ----------------------------------------------------------------------------
-- `document` guarda una copia profunda del CVDocument completo, tal y como
-- hace saveVersion() en src/services/cvService.ts.
-- ============================================================================
create table if not exists public.cv_versions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  label      text not null,
  document   jsonb not null,
  created_at timestamptz not null default now()
);

comment on table public.cv_versions is 'Versiones guardadas del CV (instantánea completa en document).';

create index if not exists cv_versions_user_created_idx on public.cv_versions (user_id, created_at desc);

-- ============================================================================
-- Row Level Security
-- ----------------------------------------------------------------------------
-- Política común: el usuario solo accede a filas cuyo user_id = auth.uid().
-- ============================================================================
alter table public.applications         enable row level security;
alter table public.application_comments enable row level security;
alter table public.application_notes    enable row level security;
alter table public.cv_documents         enable row level security;
alter table public.cv_versions          enable row level security;

-- applications
drop policy if exists "applications: dueño puede todo" on public.applications;
create policy "applications: dueño puede todo"
  on public.applications
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- application_comments
drop policy if exists "comments: dueño puede todo" on public.application_comments;
create policy "comments: dueño puede todo"
  on public.application_comments
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- application_notes
drop policy if exists "notes: dueño puede todo" on public.application_notes;
create policy "notes: dueño puede todo"
  on public.application_notes
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- cv_documents
drop policy if exists "cv_documents: dueño puede todo" on public.cv_documents;
create policy "cv_documents: dueño puede todo"
  on public.cv_documents
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- cv_versions
drop policy if exists "cv_versions: dueño puede todo" on public.cv_versions;
create policy "cv_versions: dueño puede todo"
  on public.cv_versions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================================
-- Provisión automática del CV al crear un usuario
-- ----------------------------------------------------------------------------
-- Crea una fila vacía en cv_documents cuando se registra un usuario nuevo,
-- de modo que la app siempre tenga un CV "actual" sobre el que trabajar.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.cv_documents (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
