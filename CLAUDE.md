# CLAUDE.md

## Project

**bestfinds-store** — backoffice web para tienda de perfumes.
Remote: `https://github.com/clunkylion/bestfind-store-backoffice.git`

## Tech Stack

- **Framework**: Next.js 16 (App Router, RSC, Turbopack)
- **Database**: Neon (PostgreSQL serverless)
- **ORM**: Prisma 7 with `@prisma/adapter-neon`
- **Auth**: Neon Auth (`@neondatabase/auth/next/server` — official Next.js integration)
- **UI**: Tailwind CSS v4 + shadcn/ui (base-ui) + sonner
- **Tables**: TanStack Table v8
- **Validation**: Zod
- **Language**: TypeScript. UI en español, código en inglés.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (runs `prisma generate` via postinstall)
- `npm run db:generate` — generate Prisma client
- `npm run db:push` — push schema to DB (no migration)
- `npm run db:seed` — seed DB with Excel data

## Structure

- `src/app/(dashboard)/` — protected pages (Resumen, Productos, Compras, Ventas, Ganancias)
- `src/app/auth/` — custom sign-in / sign-up pages (shadcn, not Neon Auth UI)
- `src/app/api/auth/[...path]/route.ts` — auth proxy (authApiHandler from Neon Auth)
- `src/proxy.ts` — route protection (neonAuthMiddleware from Neon Auth)
- `src/components/` — ui/ (shadcn), layout/, dashboard/, shared/, products/, purchases/, sales/
- `src/server/actions/` — server actions (products, purchases, sales, dashboard)
- `src/server/db.ts` — PrismaClient singleton with Neon adapter + inferred types
- `src/lib/auth/client.ts` — client-side authClient (points to own origin → /api/auth proxy)
- `src/lib/auth/server.ts` — server-side auth (createAuthServer + neonAuth from SDK)
- `prisma/schema.prisma` — DB schema (Product, Purchase, Sale)
- `prisma.config.ts` — Prisma 7 config with dotenv for DATABASE_URL

## Neon Auth Setup (IMPORTANT)

Uses the official `@neondatabase/auth/next/server` integration:

- **Route handler**: `authApiHandler()` in `api/auth/[...path]/route.ts` — proxies auth requests to Neon Auth so cookies are set on our domain
- **Middleware**: `neonAuthMiddleware()` in `proxy.ts` — protects routes, redirects to sign-in
- **Server**: `createAuthServer()` + `neonAuth()` — read session in RSC/server actions
- **Client**: `createAuthClient(origin)` with `BetterAuthReactAdapter()` — calls `/api/auth/*` on our domain

DO NOT call Neon Auth URL directly from the client. The client must go through our `/api/auth` proxy for cookies to work (same-origin policy).

## Sign-up Protection

Sign-up requires a `REGISTRATION_CODE` env var. Verified server-side in `src/app/auth/sign-up/actions.ts`. Avoid special characters (`$`, `!`) in the code — dotenv interprets them.

## Env Vars

Required in `.env.local` (local) and Vercel dashboard (production):
- `DATABASE_URL` — Neon PostgreSQL connection string
- `NEON_AUTH_BASE_URL` — Neon Auth URL (server-side)
- `NEXT_PUBLIC_NEON_AUTH_BASE_URL` — same URL (client-side, needed by SDK)
- `REGISTRATION_CODE` — invite code for sign-up (no special chars)

## Key Patterns

- Server Actions with Zod validation → `revalidatePath()` → return `ActionResult`
- Forms use `useActionState` (React 19) + Dialog (shadcn)
- `DataTable` generic wrapper with TanStack Table (pagination, sorting)
- `formatCurrency()` uses `Intl.NumberFormat("es-CL", { currency: "CLP" })`
- Prisma 7: types inferred from client (`type Product = Awaited<...>`), NOT imported from `@prisma/client`
- Prisma 7: `postinstall` script runs `prisma generate` (required for Vercel)
- Prisma 7: `prisma.config.ts` uses dotenv to load DATABASE_URL
