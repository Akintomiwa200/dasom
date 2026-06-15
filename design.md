# DASOM — Design Specification

Design document for the **Davidic School of Ministry (DASOM)** enrollment web application.

The UI follows an **editorial cream-and-ink** system inspired by Cursor's marketing design language: warm canvas, magazine-weight display type, hairline depth, and a single accent color used sparingly.

---

## 1. Brand & Positioning

| Element | Value |
|---------|-------|
| **Name** | DASOM — Davidic School of Ministry |
| **Tagline** | Raising Mighty Men for the Nations |
| **Organisation** | The Mighty Men of David |
| **Location** | Ago-Iwoye, Ogun State, Nigeria |
| **Metaphor** | The Cave of Adullam (1 Samuel 22:2) |
| **Programme** | 8-month transformational ministry school (100% tuition-free) |

### Brand pillars

1. **Enlighten** — Illuminate identity and purpose in Christ.
2. **Equip** — 12 modules of theological and practical training.
3. **Empower** — Impartation, graduation, and deployment as Kingdom Gatekeepers.

---

## 2. Visual Design System

### 2.1 Colour palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#f54e00` | Primary CTAs, wordmark — used scarcely |
| `--primary-active` | `#d04200` | Button press state |
| `--canvas` | `#f7f7f4` | Page background (warm cream) |
| `--canvas-soft` | `#fafaf7` | Alternate section bands |
| `--surface-card` | `#ffffff` | Cards on cream |
| `--surface-strong` | `#e6e5e0` | Badges, pills |
| `--hairline` | `#e6e5e0` | 1px dividers |
| `--hairline-strong` | `#cfcdc4` | Stronger borders |
| `--ink` | `#26251e` | Headlines, emphasis |
| `--body` | `#5a5852` | Running text |
| `--muted` | `#807d72` | Labels, captions |
| `--semantic-success` | `#1f8a65` | Approved status |
| `--semantic-error` | `#cf2d56` | Errors, rejected status |

### 2.2 Typography

| Role | Font | Notes |
|------|------|-------|
| Display + body | **Inter** (CursorGothic substitute) | Weight 400 on display; negative letter-spacing |
| Code / references | **JetBrains Mono** | Application reference IDs |

| Class | Size | Weight | Use |
|-------|------|--------|-----|
| `.display-mega` | 72px (fluid) | 400 | Hero headline |
| `.display-lg` | 36px (fluid) | 400 | Section heads |
| `.display-md` | 26px | 400 | Sub-section heads |
| `.display-sm` | 22px | 400 | Card titles |
| `.title-md` | 18px | 600 | Component titles |
| `.body-md` | 16px | 400 | Default body |
| `.body-sm` | 14px | 400 | Secondary body |
| `.caption-uppercase` | 11px | 600 | Section labels |

### 2.3 Principles

- **Warm cream canvas**, never pure white page floors.
- **Display weight stays at 400** — magazine voice, not tech-bold.
- **Cursor Orange (`--primary`) used scarcely** — CTAs and wordmark only.
- **Hairline-only depth** — no drop shadows.
- **8px CTA radius**, 12px card radius.
- **80px section rhythm** (`--section`).

---

## 3. Components

| Class | Description |
|-------|-------------|
| `.top-nav` | Fixed 64px nav, cream background, hairline bottom |
| `.btn-primary` | Orange CTA, 40px height, 8px radius |
| `.btn-secondary` | White card pill with strong hairline border |
| `.btn-ghost` | Transparent with hairline border |
| `.card` / `.feature-card` | White surface, 12px radius, 1px hairline |
| `.badge-pill` | Uppercase pill on `--surface-strong` |
| `.tag-success` / `.tag-error` | Semantic status tags (admin) |

All tokens live in `app/globals.css`.

---

## 4. Information Architecture

```
/                 Landing page (summaries + links to detail pages)
/about            Origin, pillars, lead instructor (comprehensive)
/curriculum       12 modules + gates of influence (comprehensive)
/structure        Programme timeline, fees, attendance (comprehensive)
/enroll           4-step enrollment form
/admin            Password-protected admin dashboard
/api/applications POST / GET
/api/admin/applications  GET / PATCH (auth required)
```

---

## 5. Page Specifications

### Landing (`/`)

Hero band → About (Cave of Adullam) → 12 Modules grid → Gates of Influence → Programme Structure timeline → Lead Instructor → CTA band → Footer.

### Enrollment (`/enroll`)

4-step wizard: Personal Info → Spiritual Journey → Commitment → Referee. Step indicator uses primary orange for active/done states.

### Admin (`/admin`)

Sidebar filters (status, gate) + application table + detail panel. Light editorial theme matching the public site.

---

## 6. Data Model

**Entity:** `Application` — stored in PostgreSQL via Prisma 7.

See Prisma schema at `prisma/schema.prisma` for full field list.

---

## 7. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + `globals.css` design tokens |
| Database | PostgreSQL + Prisma 7 |
| Package manager | pnpm |

---

## 8. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | No | Admin dashboard password (default: `dasom2026`) |
