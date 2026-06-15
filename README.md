# DASOM — Davidic School of Ministry

Full-stack Next.js web application for the Davidic School of Ministry enrollment system.

## Features

- **Landing page**: About, 12-module curriculum, 12 gates, programme structure, instructor bio
- **Enrollment form**: 4-step multi-page form with validation
- **Admin dashboard**: `/admin` — review, approve, reject applications
- **REST API**: `/api/applications` (POST) and `/api/admin/applications` (GET/PATCH)
- **Database**: PostgreSQL with Prisma ORM 7

See [design.md](./design.md) for the full design specification (brand, UI system, pages, data model).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+ (`corepack enable` recommended)

This project uses **pnpm only** — npm and yarn are blocked via `only-allow`.

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set your PostgreSQL URL:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/dasom?schema=public"
ADMIN_EMAIL=admin@dasom.com
ADMIN_PASSWORD=dasom123
```

### 3. Set up the database

```bash
pnpm db:push
```

Or use migrations for production:

```bash
pnpm db:migrate
```

### 4. Run the dev server

```bash
pnpm dev
```

Visit:

- `http://localhost:3000` — Main site
- `http://localhost:3000/about` — About DASOM
- `http://localhost:3000/curriculum` — Full curriculum & gates
- `http://localhost:3000/structure` — Programme structure & fees
- `http://localhost:3000/enroll` — Enrollment form
- `http://localhost:3000/admin` — Admin dashboard (login: `admin@dasom.com` / `dasom123`)

## Database Scripts

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:push` | Push schema to database (dev) |
| `pnpm db:migrate` | Create and apply migrations |
| `pnpm db:studio` | Open Prisma Studio |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)

## Deployment

Set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in your hosting environment. Run migrations before starting:

```bash
pnpm exec prisma migrate deploy
```
"# dasom" 
