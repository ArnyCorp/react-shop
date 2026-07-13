# React Shop Platform Template — Design Spec

**Date:** 2026-07-13  
**Status:** Proposed  
**Repo today:** Vite Module Federation shop monorepo (shell / catalog / cart + Nest API + MUI UI + Storybook)

## Problem

The monorepo currently proves MFEs + Nest + MUI. It is **not yet** a reusable starter for “any project.” A real template needs:

1. Dual product surfaces (**User app** + **Dashboard app**)
2. First-class **roles & permissions** across API, routing, and UI
3. A **modern Storybook** that documents the design system *and* product patterns (including role-aware stories)
4. Clear seams so teams can delete demo shop code and keep the platform skeleton

## Goals

- Clone → `pnpm install` → run shell, user app, dashboard, API, Storybook
- Authenticate (dev mock + Nest JWT), assume a role, see the correct surface
- Permission matrix drives menus, routes, buttons, and API guards from one source of truth
- Storybook is the front door for design + interaction contracts
- Opinionated but swappable: MUI, Zustand, Zod, Nest stay; shop catalog/cart become optional demo remotes

## Non-goals (this initiative)

- Production IdP / SSO (Auth0, Cognito) — leave adapter hooks only
- Real payments, inventory, email, or multi-tenant billing
- Mobile native apps
- GraphQL (REST + Zod remains)

## Recommended approach

### Option A — Dual MFE surfaces + shared auth/RBAC packages (recommended)

Keep Module Federation. Add `apps/user` and `apps/dashboard` remotes. Evolve `apps/shell` into an auth-aware host that chooses layout + remote by role. Extract `@react-shop/auth` and expand `@react-shop/shared` with roles/permissions. Catalog/cart remain optional demo remotes under the user surface.

| Pros | Cons |
|------|------|
| Matches existing MFE investment | More apps/ports to run locally |
| Clear team ownership boundaries | Shared singletons must stay disciplined |
| Template teaches real multi-app SaaS shape | |

### Option B — Two standalone Vite apps (no federation)

User + dashboard as separate deploys composed only via shared packages.

| Pros | Cons |
|------|------|
| Simpler local DX | Throws away current federation work |
| Easier independent deploy | Weaker “platform template” story for MFEs |

### Option C — Single app with route namespaces

`/app/*` and `/dashboard/*` in one Vite app.

| Pros | Cons |
|------|------|
| Fastest to build | Weakest template for multi-team scale |
| One port | Harder to teach microfrontends |

**Decision: Option A.**

## Target architecture

```text
apps/
  shell/        # Host: auth gate, chrome, remote loader, role redirect
  user/         # Member/customer experience (storefront + account)
  dashboard/    # Staff console (admin / manager / support)
  catalog/      # Optional demo remote (user surface)
  cart/         # Optional demo remote (user surface)
  api/          # NestJS: auth, users, roles, products, orders
packages/
  shared/       # Zod schemas, roles, permissions, API types
  auth/         # Session store (Zustand), guards, token helpers
  ui/           # MUI design system + Storybook
  config/       # Ports, env schema (Zod), feature flags
```

### Runtime topology

| Service | Port | Audience |
|---------|------|----------|
| shell | 5000 | Everyone |
| user | 5003 | `user` (+ guest browsing) |
| dashboard | 5004 | `support`, `manager`, `admin` |
| catalog | 5001 | Demo (user) |
| cart | 5002 | Demo (user) |
| api | 3001 | All clients |
| storybook | 6006 | Engineers / designers |

### Auth flow

1. Shell loads → checks `@react-shop/auth` session (Zustand + `localStorage` in browser; httpOnly cookie later).
2. Unauthenticated → `/login` (shell page) → `POST /auth/login` → JWT + user `{ id, email, role, permissions[] }`.
3. Shell redirects:
   - `guest` / anonymous browse → user remote (read-only catalog)
   - `user` → user remote home
   - `support` | `manager` | `admin` → dashboard remote home
4. Remotes read the same auth store (MF shared singleton: `react`, `zustand`, `@react-shop/auth`).
5. Nest `JwtAuthGuard` + `PermissionsGuard` enforce the same permission strings.

### Roles & permissions (single source of truth)

Defined in `packages/shared/src/rbac.ts` (Zod enums + matrix):

| Role | Intent |
|------|--------|
| `guest` | Public browse only |
| `user` | Customer / member |
| `support` | Read users/orders, limited writes |
| `manager` | Business ops: catalog + orders + analytics |
| `admin` | Full settings, users, roles |

Permission examples:

- `catalog:read` / `catalog:write`
- `orders:read` / `orders:write` / `orders:refund`
- `users:read` / `users:write`
- `analytics:read`
- `settings:write`

UI: `useCan('orders:refund')`. Nest: `@RequirePermissions('orders:refund')`.

### User app vs Dashboard app

**User app (`apps/user`)**

- Home / browse
- Account profile
- Orders history
- Mounts optional catalog/cart remotes or embeds routes

**Dashboard app (`apps/dashboard`)**

- Overview KPIs (mock data OK)
- Users table (role-aware actions)
- Orders management
- Catalog CMS (if `catalog:write`)
- Settings (admin only)

Layouts differ: user = marketing-light chrome; dashboard = dense sidebar console. Both consume `@react-shop/ui`.

### Modern Storybook bar

Upgrade `packages/ui` Storybook beyond component snapshots:

1. **Foundations** — color, type, spacing, elevation, motion tokens (MDX)
2. **Primitives** — Button, Input, Dialog, DataTable wrappers over MUI
3. **Patterns** — PageHeader, StatStrip, EmptyState, ConfirmDialog, AuthGate
4. **Layouts** — UserShell / DashboardShell stories
5. **Role play** — toolbar decorator `Role: guest|user|support|manager|admin` that stubs auth store
6. **A11y + interactions** — `@storybook/addon-a11y`, play functions, smoke tests via `@storybook/test`
7. **Themes** — light default + optional dark *theme story* (app default stays light)
8. **Docs IA** — Introduction → Foundations → Components → Patterns → Recipes → RBAC

Storybook is the contract: if a pattern isn’t in Storybook, it isn’t part of the template.

## Data & API surface (minimum)

| Method | Path | Auth | Permission |
|--------|------|------|------------|
| POST | `/auth/login` | public | — |
| POST | `/auth/register` | public | — |
| GET | `/auth/me` | jwt | — |
| GET | `/users` | jwt | `users:read` |
| PATCH | `/users/:id/role` | jwt | `users:write` |
| GET/POST | `/products` | mixed | `catalog:read/write` |
| GET/POST | `/orders` | jwt | `orders:read/write` |

Seed users for every role (documented passwords in README).

## Migration from current code

1. Keep catalog/cart; do not delete until user app owns storefront routes.
2. Move shop-only UI (`ProductCard`) under `ui/src/shop/` so platform primitives stay clean.
3. Expand `shared` without breaking existing Zod product/order schemas.
4. Shell grows login + role redirect; existing `/` and `/cart` remain under user area.

## Risks

| Risk | Mitigation |
|------|------------|
| Zustand auth store duplicated across remotes | Share `@react-shop/auth` + `zustand` as MF singletons |
| Permission drift FE/BE | One matrix in `shared`; both import it |
| Storybook bloat | Enforce folder IA; no one-off demo junk in roots |
| Local port fatigue | `pnpm dev:platform` runs shell+user+dashboard+api only |

## Success criteria

- [ ] New engineer runs README path and sees login → role landing in <10 minutes
- [ ] Switching seed users changes menus, routes, and blocked API calls
- [ ] Storybook documents foundations, 8+ primitives, 4+ patterns, role decorator
- [ ] Catalog/cart optional: `pnpm dev:platform` works without them
- [ ] RBAC types fail compile if an unknown permission string is used

## Phased delivery

| Phase | Outcome |
|-------|---------|
| **1 — Foundation** | RBAC package, auth package, Nest auth, modern Storybook foundations + role decorator |
| **2 — Surfaces** | `apps/user` + `apps/dashboard` remotes, shell role routing, seed users |
| **3 — Template polish** | Generators/docs (`TEMPLATE.md`), CI, strip/move demo shop seams, permission-driven dashboard CRUD |

Detailed implementation tasks for Phases 1–2 live in:

`docs/superpowers/plans/2026-07-13-platform-template-foundation.md`
