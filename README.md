# react-shop

pnpm + Turborepo monorepo for a **platform template** with Module Federation: auth-aware shell, user and dashboard remotes, optional demo shop, Nest API, and MUI Storybook.

## Surfaces

| Surface | App | Route | Audience |
|---------|-----|-------|----------|
| Shell | `apps/shell` | `/login` | Auth gate + remote host |
| User | `apps/user` | `/app/*` | Customers (`user` role) |
| Dashboard | `apps/dashboard` | `/dashboard/*` | Staff (`support`, `manager`, `admin`) |
| Demo shop | `apps/catalog`, `apps/cart` | `/catalog`, `/cart` | Optional storefront demo |

After login, the shell redirects by role (`apps/shell/src/auth-routing.ts`): customers → `/app`, staff → `/dashboard`.

## Stack

- **Apps:** `shell`, `user`, `dashboard`, `catalog`, `cart`, `api`
- **Packages:** `ui` (MUI + Storybook), `auth` (`useAuthStore`, `useCan`), `shared` (Zod, RBAC, cart store)

RBAC is defined once in `packages/shared/src/rbac.ts` and enforced in Nest (`PermissionsGuard`) and UI (`useCan`).

## Ports

| Service | Port |
|---------|------|
| Shell | 5000 |
| Catalog | 5001 |
| Cart | 5002 |
| User | 5003 |
| Dashboard | 5004 |
| API | 3001 |
| Storybook | 6006 |

## Seed users

Dev accounts (password `password123`): `admin@react-shop.dev`, `manager@react-shop.dev`, `support@react-shop.dev`, `user@react-shop.dev`. See [TEMPLATE.md](./TEMPLATE.md) for roles, permissions, and how to extend the platform.

## Commands

```bash
pnpm install
pnpm --filter @react-shop/shared build
pnpm dev:platform   # shell + user + dashboard + API
pnpm dev:demo-shop  # catalog + cart (with platform running)
pnpm storybook      # UI design system (port 6006)
pnpm test           # vitest across packages with test scripts
pnpm build
pnpm lint
pnpm typecheck
```

Other filters: `pnpm dev:api`, `pnpm dev:web` (shell + demo shop remotes).

## Architecture

- Remotes expose `./App` via `@originjs/vite-plugin-federation`.
- React, React DOM, React Router, Zustand, MUI, `@react-shop/auth`, and `@react-shop/shared` are shared singletons.
- Session persists in `@react-shop/auth` (Zustand + `localStorage`); API uses JWT + `@RequirePermissions`.
- Product/order payloads are validated with Zod on client and server.

For onboarding (add permissions, dashboard pages, remove demo shop, Storybook IA), read [TEMPLATE.md](./TEMPLATE.md).
