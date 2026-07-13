# Platform template guide

Use this monorepo as a **Module Federation platform starter**: auth-aware shell, dual product surfaces (user + dashboard), shared RBAC, Nest API, and MUI design system. The catalog/cart remotes are an optional demo shop you can delete.

## What you get

| Layer | Location | Purpose |
|-------|----------|---------|
| Shell host | `apps/shell` | Login, route guards, remote loading, role-based redirect |
| User remote | `apps/user` | Customer/member surface at `/app/*` |
| Dashboard remote | `apps/dashboard` | Staff console at `/dashboard/*` |
| Demo shop remotes | `apps/catalog`, `apps/cart` | Optional federated storefront at `/catalog`, `/cart` |
| API | `apps/api` | NestJS + JWT auth + Zod validation + permission guards |
| Auth package | `packages/auth` | `useAuthStore` (Zustand + persist) and `useCan` |
| Shared package | `packages/shared` | Zod schemas, RBAC matrix, cart store, API types |
| UI package | `packages/ui` | MUI theme, layouts, patterns, shop components, Storybook |

**Dual surfaces:** After login, `apps/shell/src/auth-routing.ts` sends `user` to `/app` and staff (`support`, `manager`, `admin`) to `/dashboard`. The shell loads the matching federated remote; all remotes share `@react-shop/auth` as a Module Federation singleton.

**Run platform only:**

```bash
pnpm install
pnpm --filter @react-shop/shared build
pnpm dev:platform
```

Open `http://localhost:5000`, sign in, and land on the correct surface. Add `pnpm dev:demo-shop` when you need the catalog/cart demo.

## Seed users

In-memory users are seeded in `apps/api/src/users/users.service.ts`. All use password **`password123`**.

| Email | Role | Key permissions |
|-------|------|-----------------|
| `admin@react-shop.dev` | `admin` | Full: users, orders, catalog, analytics, settings |
| `manager@react-shop.dev` | `manager` | Ops: catalog write, orders, users read, analytics |
| `support@react-shop.dev` | `support` | Support: orders (incl. refund), users read, analytics |
| `user@react-shop.dev` | `user` | Customer: catalog read, orders read/write |

Permissions are derived from the role matrix in `packages/shared/src/rbac.ts` via `permissionsForRole()`.

## How to add a permission

Follow the same string end-to-end: shared matrix → Nest guard → UI `useCan`.

### 1. Shared RBAC matrix

Edit `packages/shared/src/rbac.ts`:

1. Add the permission to `PermissionSchema`.
2. Add it to the appropriate roles in `ROLE_PERMISSIONS`.

Rebuild shared so dependents pick up types:

```bash
pnpm --filter @react-shop/shared build
```

### 2. Nest guard

On the controller method that should enforce the permission:

```ts
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@RequirePermissions("your:permission")
```

`PermissionsGuard` (`apps/api/src/auth/permissions.guard.ts`) checks the JWT user’s role-derived permissions plus any explicit `user.permissions` on the token payload. See `apps/api/src/users/users.controller.ts` for a working example (`users:read`, `users:write`).

### 3. UI with `useCan`

In dashboard or user remotes:

```tsx
import { useCan } from "@react-shop/auth";

const canDoThing = useCan("your:permission");
```

Use the boolean to hide nav items, disable actions, or render `EmptyState`. For dashboard sidebar links, add an optional `permission` on the item in `packages/ui/src/layouts/DashboardShell.tsx` (same pattern as `users:read`, `orders:read`, `settings:write`).

## How to add a dashboard page

1. **Create the page** under `apps/dashboard/src/pages/`, e.g. `ReportsPage.tsx`. Use `@react-shop/ui` patterns (`PageHeader`, `StatCard`, `EmptyState`) and gate content with `useCan` when needed.

2. **Register a route** in `apps/dashboard/src/App.tsx`:

   ```tsx
   <Route path="reports" element={<ReportsPage />} />
   ```

3. **Add sidebar navigation** in `packages/ui/src/layouts/DashboardShell.tsx`:

   ```ts
   { label: "Reports", href: "reports", permission: "analytics:read" },
   ```

   `DashboardShell` filters nav items by `useCan`. Routes under `/dashboard/*` are mounted by the shell; the remote uses relative `href`s and `activeHrefForMount()` to highlight the active item.

## How to remove the demo shop remotes

Catalog and cart are optional. To keep only the platform skeleton:

1. **Delete apps:** `apps/catalog`, `apps/cart`.

2. **Shell federation** — `apps/shell/vite.config.ts`: remove `catalog` and `cart` from `remotes`.

3. **Shell routes** — `apps/shell/src/App.tsx`:
   - Remove `CatalogApp` / `CartApp` lazy imports and `/catalog`, `/cart` routes.
   - Remove `ShopChrome`, cart store usage, and `@react-shop/shared/cart` import if unused.

4. **Type declarations** — `apps/shell/src/remotes.d.ts`: remove `catalog/App` and `cart/App` modules.

5. **Root scripts** — remove or stop using `dev:web` and `dev:demo-shop` if you no longer need the demo.

6. **Optional cleanup:** shop-specific Storybook stories under `packages/ui/src/shop/`, cart store in `packages/shared`, and any catalog/cart API modules you do not need.

After removal, `pnpm dev:platform` is sufficient for local development.

## Storybook information architecture

Storybook lives in `packages/ui` (`pnpm storybook` → port **6006**).

Keep stories in this sidebar order:

1. **Introduction** — `src/Introduction.mdx` — product and design-system overview.
2. **Foundations** — `src/foundations/*.mdx` — colors, typography, spacing tokens (MDX, not stories).
3. **Primitives** — thin MUI wrappers (Button, Input, etc.). Add under `src/primitives/` with `title: "Primitives/..."` when you introduce them.
4. **Patterns** — `src/patterns/` — composable UI blocks (`PageHeader`, `StatCard`, `EmptyState`).
5. **Layouts** — `src/layouts/` — `UserShell`, `DashboardShell` (role-aware nav via Storybook Role toolbar in `preview.tsx`).
6. **Shop** — `src/shop/` — demo storefront components; safe to delete with the catalog/cart remotes.

**Rules:**

- Use `Meta title="Section/Name"` (or MDX `title` in front matter) so the sidebar matches the order above.
- Prefer MDX for foundations; use `*.stories.tsx` with `tags: ["autodocs"]` for components.
- Role-aware stories: the Storybook Role toolbar in `.storybook/preview.tsx` seeds `useAuthStore` with `permissionsForRole(role)` so layout stories reflect RBAC without a live API.
