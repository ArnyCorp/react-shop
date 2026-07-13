# Platform Foundation Verification - 2026-07-13

## Build gate

| Command | Outcome |
| --- | --- |
| `pnpm --filter @react-shop/shared build` | Pass |
| `pnpm --filter @react-shop/auth build` | Pass |
| `pnpm build` | Pass |
| `pnpm --filter @react-shop/ui build-storybook` | Pass |

## Auth matrix smoke

API smoke server: `PORT=3002 pnpm --filter @react-shop/api start:prod`.

| Email | Expected role | Login status / role | Allowed API call | Allowed status | Denied API call | Denied status | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `admin@react-shop.dev` | `admin` | `201` / `admin` | `GET /users` | `200` | N/A - admin role has all platform permissions | skipped | Pass |
| `manager@react-shop.dev` | `manager` | `201` / `manager` | `GET /users` | `200` | `PATCH /users/seed-user/role` | `403` | Pass |
| `support@react-shop.dev` | `support` | `201` / `support` | `GET /users` | `200` | `PATCH /users/seed-user/role` | `403` | Pass |
| `user@react-shop.dev` | `user` | `201` / `user` | `GET /products` | `200` | `GET /users` | `403` | Pass |

No verification failures required code fixes.
