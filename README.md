# react-shop

pnpm + Turborepo monorepo for a microfrontend shop.

## Stack

- **Apps**
  - `apps/shell` — Vite host (Module Federation)
  - `apps/catalog` — catalog remote
  - `apps/cart` — cart remote
  - `apps/api` — NestJS API (Zod-validated)
- **Packages**
  - `packages/ui` — MUI theme + shared components + Storybook
  - `packages/shared` — Zod schemas, sample data, Zustand cart store

## Ports

| Service   | Port |
|-----------|------|
| Shell     | 5000 |
| Catalog   | 5001 |
| Cart      | 5002 |
| API       | 3001 |
| Storybook | 6006 |

## Commands

```bash
pnpm install
pnpm --filter @react-shop/shared build
pnpm dev          # all apps in parallel via Turborepo
pnpm storybook    # UI design system
```

Useful filters:

```bash
pnpm dev:api
pnpm --filter @react-shop/shell dev
pnpm --filter @react-shop/catalog dev
pnpm --filter @react-shop/cart dev
```

## Architecture notes

- Remotes expose `./App` through `@originjs/vite-plugin-federation`.
- React, React DOM, Zustand, and MUI are shared singletons across remotes.
- Cart state lives in `@react-shop/shared/cart` (Zustand + persist).
- Product/order payloads are validated with Zod on both the client and NestJS.
