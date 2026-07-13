# Platform Template Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `react-shop` into a dual-surface platform starter (User app + Dashboard app) with shared RBAC, Nest JWT auth, and a modern Storybook that documents foundations, patterns, and role-aware UI.

**Architecture:** Keep Vite Module Federation. Add `@react-shop/auth` + RBAC in `@react-shop/shared`. Add `apps/user` and `apps/dashboard` remotes. Evolve `apps/shell` into an auth-aware host that redirects by role. Nest gains `/auth/*` and permission guards. Storybook gains foundations MDX, layout stories, and a role toolbar decorator.

**Tech Stack:** pnpm, Turborepo, Vite, React 19, MUI 7, Zustand, Zod, NestJS 11, Storybook 8, `@originjs/vite-plugin-federation`, JWT (Passport)

**Spec:** `docs/superpowers/specs/2026-07-13-starter-template-design.md`

---

## File map (create / reshape)

| Path | Responsibility |
|------|----------------|
| `packages/shared/src/rbac.ts` | Roles, permissions, matrix, helpers |
| `packages/shared/src/auth-schemas.ts` | Login/register/me Zod schemas |
| `packages/auth/` | Session Zustand store, `useCan`, route helpers |
| `packages/ui/src/foundations/*` | Tokens + MDX docs |
| `packages/ui/src/patterns/*` | PageHeader, EmptyState, StatCard, AuthGate |
| `packages/ui/src/layouts/*` | UserShell, DashboardShell |
| `packages/ui/.storybook/*` | Modern preview, role decorator, a11y |
| `apps/api/src/auth/*` | JWT login/register/me + guards |
| `apps/api/src/users/*` | Seed users + list/patch role |
| `apps/user/` | User-surface remote |
| `apps/dashboard/` | Dashboard remote |
| `apps/shell/src/*` | Login page + role redirect + remote mount |
| `README.md` / `TEMPLATE.md` | How to run + how to strip demo shop |

---

### Task 1: RBAC source of truth in shared

**Files:**
- Create: `packages/shared/src/rbac.ts`
- Create: `packages/shared/src/auth-schemas.ts`
- Modify: `packages/shared/src/index.ts`
- Modify: `packages/shared/tsup.config.ts`
- Test: `packages/shared/src/rbac.test.ts`

- [ ] **Step 1: Add Vitest to shared and write failing RBAC tests**

```bash
pnpm --filter @react-shop/shared add -D vitest
```

Create `packages/shared/src/rbac.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { can, permissionsForRole, RoleSchema } from "./rbac";

describe("rbac", () => {
  it("parses known roles", () => {
    expect(RoleSchema.parse("admin")).toBe("admin");
  });

  it("grants admin settings:write", () => {
    expect(can("admin", "settings:write")).toBe(true);
  });

  it("denies user users:write", () => {
    expect(can("user", "users:write")).toBe(false);
  });

  it("lists unique permissions for manager", () => {
    expect(permissionsForRole("manager")).toContain("catalog:write");
  });
});
```

Add script in `packages/shared/package.json`:

```json
"test": "vitest run"
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter @react-shop/shared test
```

Expected: FAIL — cannot find module `./rbac`

- [ ] **Step 3: Implement RBAC + auth schemas**

`packages/shared/src/rbac.ts`:

```ts
import { z } from "zod";

export const RoleSchema = z.enum([
  "guest",
  "user",
  "support",
  "manager",
  "admin",
]);
export type Role = z.infer<typeof RoleSchema>;

export const PermissionSchema = z.enum([
  "catalog:read",
  "catalog:write",
  "orders:read",
  "orders:write",
  "orders:refund",
  "users:read",
  "users:write",
  "analytics:read",
  "settings:write",
]);
export type Permission = z.infer<typeof PermissionSchema>;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ["catalog:read"],
  user: ["catalog:read", "orders:read", "orders:write"],
  support: [
    "catalog:read",
    "orders:read",
    "orders:write",
    "orders:refund",
    "users:read",
    "analytics:read",
  ],
  manager: [
    "catalog:read",
    "catalog:write",
    "orders:read",
    "orders:write",
    "orders:refund",
    "users:read",
    "analytics:read",
  ],
  admin: [
    "catalog:read",
    "catalog:write",
    "orders:read",
    "orders:write",
    "orders:refund",
    "users:read",
    "users:write",
    "analytics:read",
    "settings:write",
  ],
};

export function permissionsForRole(role: Role): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
```

`packages/shared/src/auth-schemas.ts`:

```ts
import { z } from "zod";
import { PermissionSchema, RoleSchema } from "./rbac";

export const AuthUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  role: RoleSchema,
  permissions: z.array(PermissionSchema),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const AuthTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: AuthUserSchema,
});
export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;
```

Update `packages/shared/src/index.ts`:

```ts
export * from "./schemas";
export * from "./constants";
export * from "./rbac";
export * from "./auth-schemas";
```

Update `packages/shared/tsup.config.ts` entry map to include `rbac` and `auth-schemas` (or keep barrel-only — barrel is enough if Nest imports `@react-shop/shared`).

- [ ] **Step 4: Run tests and build**

```bash
pnpm --filter @react-shop/shared test
pnpm --filter @react-shop/shared build
```

Expected: PASS + dist emitted

- [ ] **Step 5: Commit**

```bash
git add packages/shared
git commit -m "feat(shared): add RBAC matrix and auth Zod schemas"
```

---

### Task 2: `@react-shop/auth` package (Zustand session + useCan)

**Files:**
- Create: `packages/auth/package.json`
- Create: `packages/auth/tsconfig.json`
- Create: `packages/auth/tsup.config.ts`
- Create: `packages/auth/src/session-store.ts`
- Create: `packages/auth/src/use-can.ts`
- Create: `packages/auth/src/index.ts`
- Create: `packages/auth/src/session-store.test.ts`
- Modify: `pnpm-workspace.yaml` (already includes `packages/*`)

- [ ] **Step 1: Scaffold package.json**

```json
{
  "name": "@react-shop/auth",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@react-shop/shared": "workspace:*",
    "zustand": "^5.0.5"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "react": "^19.1.0",
    "tsup": "^8.5.0",
    "typescript": "^5.8.3",
    "vitest": "^3.2.0"
  }
}
```

- [ ] **Step 2: Write failing session test**

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "./session-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null });
  });

  it("sets session on login", () => {
    useAuthStore.getState().setSession({
      accessToken: "token",
      user: {
        id: "1",
        email: "a@b.com",
        name: "Ada",
        role: "admin",
        permissions: ["settings:write"],
      },
    });
    expect(useAuthStore.getState().user?.role).toBe("admin");
  });
});
```

- [ ] **Step 3: Implement store + useCan**

`packages/auth/src/session-store.ts`:

```ts
import type { AuthTokenResponse, AuthUser } from "@react-shop/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (session: AuthTokenResponse) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: ({ user, accessToken }) => set({ user, accessToken }),
      clearSession: () => set({ user: null, accessToken: null }),
    }),
    { name: "react-shop-auth" },
  ),
);
```

`packages/auth/src/use-can.ts`:

```ts
import type { Permission } from "@react-shop/shared";
import { useAuthStore } from "./session-store";

export function useCan(permission: Permission): boolean {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  return permissions.includes(permission);
}
```

`packages/auth/src/index.ts`:

```ts
export { useAuthStore } from "./session-store";
export { useCan } from "./use-can";
```

- [ ] **Step 4: Build and test**

```bash
pnpm install
pnpm --filter @react-shop/auth test
pnpm --filter @react-shop/auth build
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/auth pnpm-lock.yaml
git commit -m "feat(auth): add Zustand session store and useCan hook"
```

---

### Task 3: NestJS auth module + permission guard + seed users

**Files:**
- Create: `apps/api/src/auth/auth.module.ts`
- Create: `apps/api/src/auth/auth.service.ts`
- Create: `apps/api/src/auth/auth.controller.ts`
- Create: `apps/api/src/auth/jwt.strategy.ts`
- Create: `apps/api/src/auth/permissions.decorator.ts`
- Create: `apps/api/src/auth/permissions.guard.ts`
- Create: `apps/api/src/users/users.service.ts`
- Create: `apps/api/src/users/users.controller.ts`
- Create: `apps/api/src/users/users.module.ts`
- Modify: `apps/api/src/app.module.ts`
- Modify: `apps/api/package.json` (add `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcryptjs`)

- [ ] **Step 1: Install deps**

```bash
pnpm --filter @react-shop/api add @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
pnpm --filter @react-shop/api add -D @types/passport-jwt @types/bcryptjs
```

- [ ] **Step 2: Seed users service (in-memory)**

`apps/api/src/users/users.service.ts` — store users with hashed passwords for:

| Email | Password | Role |
|-------|----------|------|
| `admin@react-shop.dev` | `password123` | admin |
| `manager@react-shop.dev` | `password123` | manager |
| `support@react-shop.dev` | `password123` | support |
| `user@react-shop.dev` | `password123` | user |

On create, set `permissions: permissionsForRole(role)`.

- [ ] **Step 3: Auth service/controller**

`POST /auth/login` body validated with `LoginSchema` via existing `ZodValidationPipe`.  
Return `AuthTokenResponseSchema` shape with JWT `sub` = user id.

`GET /auth/me` — JwtAuthGuard — return current user.

- [ ] **Step 4: Permissions guard**

```ts
// permissions.decorator.ts
import { SetMetadata } from "@nestjs/common";
import type { Permission } from "@react-shop/shared";
export const PERMISSIONS_KEY = "permissions";
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

Guard reads user role/permissions from request and requires every listed permission.

Wire `@RequirePermissions('users:read')` on `GET /users`.

- [ ] **Step 5: Manual smoke test**

```bash
pnpm --filter @react-shop/shared build
pnpm --filter @react-shop/api build
pnpm --filter @react-shop/api start:prod
curl -s -X POST http://localhost:3001/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@react-shop.dev","password":"password123"}'
```

Expected: JSON with `accessToken` and `user.role === "admin"`

- [ ] **Step 6: Commit**

```bash
git add apps/api packages/shared pnpm-lock.yaml
git commit -m "feat(api): add JWT auth, seed roles, and permissions guard"
```

---

### Task 4: Modern Storybook foundations + role decorator

**Files:**
- Create: `packages/ui/src/foundations/Colors.mdx`
- Create: `packages/ui/src/foundations/Typography.mdx`
- Create: `packages/ui/src/patterns/PageHeader.tsx`
- Create: `packages/ui/src/patterns/PageHeader.stories.tsx`
- Create: `packages/ui/src/patterns/EmptyState.tsx`
- Create: `packages/ui/src/patterns/EmptyState.stories.tsx`
- Create: `packages/ui/src/patterns/StatCard.tsx`
- Create: `packages/ui/src/patterns/StatCard.stories.tsx`
- Create: `packages/ui/src/layouts/UserShell.tsx`
- Create: `packages/ui/src/layouts/DashboardShell.tsx`
- Create: `packages/ui/src/layouts/Shells.stories.tsx`
- Create: `packages/ui/.storybook/preview.tsx` (replace)
- Create: `packages/ui/.storybook/manger.ts` optional title branding
- Modify: `packages/ui/src/index.ts`
- Modify: `packages/ui/package.json` (add `@react-shop/auth`, addon-themes if used)
- Move: shop components under `packages/ui/src/shop/` (update exports/stories paths)

- [ ] **Step 1: Add Storybook role toolbar + decorator**

In `packages/ui/.storybook/preview.tsx`:

```tsx
import type { Preview } from "@storybook/react";
import { AppThemeProvider } from "../src/AppThemeProvider";
import { useAuthStore } from "@react-shop/auth";
import { permissionsForRole, type Role } from "@react-shop/shared";

const preview: Preview = {
  globalTypes: {
    role: {
      name: "Role",
      description: "Impersonate RBAC role",
      defaultValue: "user",
      toolbar: {
        icon: "user",
        items: ["guest", "user", "support", "manager", "admin"],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const role = (context.globals.role ?? "user") as Role;
      useAuthStore.setState({
        accessToken: "storybook",
        user: {
          id: "story",
          email: `${role}@example.com`,
          name: `Story ${role}`,
          role,
          permissions: permissionsForRole(role),
        },
      });
      return (
        <AppThemeProvider>
          {/* fonts link tags */}
          <Story />
        </AppThemeProvider>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          "Primitives",
          "Patterns",
          "Layouts",
          "Shop",
          "*",
        ],
      },
    },
  },
};
export default preview;
```

Retitle existing component stories to `Primitives/...` and shop stories to `Shop/...`.

- [ ] **Step 2: Add PageHeader / EmptyState / StatCard with stories**

Each pattern gets CSF3 + autodocs. `StatCard` story includes a play function clicking a detail link if present.

- [ ] **Step 3: Add UserShell + DashboardShell layout stories**

DashboardShell: sidebar nav items filtered by `useCan`.  
UserShell: top nav with brand + account.

Story `Layouts/DashboardShell/Admin` relies on toolbar role; document in MDX that switching Role changes visible nav.

- [ ] **Step 4: Foundations MDX**

Document CSS/MUI palette tokens used in `theme.ts` (ink, mist, primary jade, secondary teal). No duplicate random palettes.

- [ ] **Step 5: Build Storybook**

```bash
pnpm --filter @react-shop/auth build
pnpm --filter @react-shop/ui build-storybook
```

Expected: `packages/ui/storybook-static/index.html` exists

- [ ] **Step 6: Commit**

```bash
git add packages/ui packages/auth
git commit -m "feat(ui): modern Storybook foundations, patterns, and role decorator"
```

---

### Task 5: Scaffold `apps/user` and `apps/dashboard` remotes

**Files:**
- Create: `apps/user/**` (mirror catalog vite federation config, port **5003**)
- Create: `apps/dashboard/**` (port **5004**)
- Modify: `apps/shell/vite.config.ts` remotes map
- Modify: `apps/shell/src/remotes.d.ts`
- Modify: root `package.json` scripts `dev:platform`

- [ ] **Step 1: Create user remote**

Expose `./App`. Implement routes:

- `/` home welcome using `UserShell`
- `/account` profile from `useAuthStore`
- `/orders` list placeholder gated by `useCan('orders:read')`

Federation shared: `react`, `react-dom`, `react-router-dom`, `zustand`, `@mui/material`, `@react-shop/auth`.

- [ ] **Step 2: Create dashboard remote**

Expose `./App`. Implement:

- `/` overview with `StatCard`s (mock numbers OK)
- `/users` table — only if `useCan('users:read')`; write actions if `users:write`
- `/orders` management if `orders:read`
- `/settings` if `settings:write` else EmptyState forbidden

Use `DashboardShell` from UI package.

- [ ] **Step 3: Typecheck + build remotes**

```bash
pnpm --filter @react-shop/user typecheck
pnpm --filter @react-shop/dashboard typecheck
pnpm --filter @react-shop/user build
pnpm --filter @react-shop/dashboard build
```

Expected: `remoteEntry.js` in each `dist/assets`

- [ ] **Step 4: Commit**

```bash
git add apps/user apps/dashboard package.json
git commit -m "feat: add user and dashboard microfrontends"
```

---

### Task 6: Shell login + role-based routing

**Files:**
- Create: `apps/shell/src/pages/LoginPage.tsx`
- Modify: `apps/shell/src/App.tsx`
- Modify: `apps/shell/src/main.tsx`
- Modify: `apps/shell/package.json` (depend on `@react-shop/auth`)
- Modify: `apps/shell/vite.config.ts` remotes + shared auth

- [ ] **Step 1: Login page**

Form: email/password → `POST ${API}/auth/login` → Zod parse `AuthTokenResponseSchema` → `useAuthStore.getState().setSession(...)` → navigate by role:

```ts
function homeForRole(role: Role): string {
  if (role === "user" || role === "guest") return "/app";
  return "/dashboard";
}
```

Show seed credential helper text in rem for template DX.

- [ ] **Step 2: Protect routes**

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/app/*" element={<RequireAuth><UserApp /></RequireAuth>} />
  <Route path="/dashboard/*" element={<RequireStaff><DashboardApp /></RequireStaff>} />
  <Route path="/catalog" element={<RequireAuth><CatalogApp /></RequireAuth>} />
  <Route path="/cart" element={<RequireAuth><CartApp /></RequireAuth>} />
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
```

`RequireStaff` allows `support|manager|admin`; others redirect to `/app`.

- [ ] **Step 3: Smoke run**

```bash
pnpm --filter @react-shop/api start:dev &
pnpm --filter @react-shop/user dev &
pnpm --filter @react-shop/dashboard dev &
pnpm --filter @react-shop/shell dev
```

Open `http://localhost:5000/login`, login as admin → land on dashboard remote. Login as user → land on user remote.

- [ ] **Step 4: Commit**

```bash
git add apps/shell
git commit -m "feat(shell): login flow and role-based remote routing"
```

---

### Task 7: Permission-aware Nest users API + dashboard wiring

**Files:**
- Modify: `apps/api/src/users/*`
- Modify: `apps/dashboard/src/pages/UsersPage.tsx`
- Modify: `apps/api/src/orders/*` / `products/*` — attach guards where specified in the design table

- [ ] **Step 1: `GET /users` + `PATCH /users/:id/role`**

Validate role with `RoleSchema`. Recompute permissions via `permissionsForRole`. Require `users:write` for PATCH.

- [ ] **Step 2: Dashboard UsersPage**

Fetch with `Authorization: Bearer ${accessToken}`. Role select disabled when `!useCan('users:write')`.

- [ ] **Step 3: Verify denial**

Login as support → PATCH user role expects HTTP 403.

- [ ] **Step 4: Commit**

```bash
git add apps/api apps/dashboard
git commit -m "feat: wire users API into dashboard with RBAC enforcement"
```

---

### Task 8: Template docs + platform scripts

**Files:**
- Create: `TEMPLATE.md`
- Modify: `README.md`
- Modify: `package.json` scripts
- Modify: `turbo.json` if new package pipelines needed

- [ ] **Step 1: Scripts**

```json
{
  "dev:platform": "turbo run dev --filter=@react-shop/shell --filter=@react-shop/user --filter=@react-shop/dashboard --filter=@react-shop/api --parallel",
  "dev:demo-shop": "turbo run dev --filter=@react-shop/catalog --filter=@react-shop/cart --parallel",
  "test": "turbo run test"
}
```

- [ ] **Step 2: Write TEMPLATE.md**

Sections:

1. What you get
2. Seed users table
3. How to add a permission
4. How to add a dashboard page
5. How to remove the demo shop remotes
6. Storybook IA rules

- [ ] **Step 3: Update README ports table** (include 5003/5004)

- [ ] **Step 4: Commit**

```bash
git add README.md TEMPLATE.md package.json turbo.json
git commit -m "docs: add platform template guide and platform dev scripts"
```

---

### Task 9: Verification gate

- [ ] **Step 1: Full build**

```bash
pnpm --filter @react-shop/shared build
pnpm --filter @react-shop/auth build
pnpm build
pnpm --filter @react-shop/ui build-storybook
```

Expected: all succeed

- [ ] **Step 2: Auth matrix smoke**

For each seed user, login and confirm redirect + one allowed + one denied API call.

- [ ] **Step 3: Final commit / PR update**

```bash
git status
# push branch and update PR description with verification notes
```

---

## Out of scope for this plan (Phase 3 follow-up)

- Real SSO adapters
- Refresh tokens / httpOnly cookies
- Full orders CMS + analytics charts
- Chromatic CI visual diffs
- Codegen CLI (`pnpm gen:app`)

Create a separate plan file when starting Phase 3:  
`docs/superpowers/plans/YYYY-MM-DD-template-polish.md`

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| RBAC single source of truth | Task 1 |
| Auth package / session | Task 2 |
| Nest JWT + guards | Task 3, 7 |
| Modern Storybook + role decorator | Task 4 |
| User + Dashboard apps | Task 5 |
| Shell role routing | Task 6 |
| Seed users + docs | Task 3, 8 |
| Platform scripts without requiring shop remotes | Task 8 |
| Success criteria verification | Task 9 |
