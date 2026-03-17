# CLAUDE.md

## Project

**bestfinds-store** — backoffice web para tienda de perfumes.
Remote: `https://github.com/clunkylion/bestfind-store-backoffice.git`

## Tech Stack

- **Framework**: Next.js 16 (App Router, RSC, Turbopack)
- **Database**: Neon (PostgreSQL serverless)
- **ORM**: Prisma 7 with `@prisma/adapter-neon`
- **Auth**: Neon Auth (`@neondatabase/auth` + Better Auth)
- **UI**: Tailwind CSS v4 + shadcn/ui (base-ui) + sonner
- **Tables**: TanStack Table v8
- **Validation**: Zod
- **Language**: TypeScript. UI en español, código en inglés.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run db:generate` — generate Prisma client
- `npm run db:push` — push schema to DB (no migration)
- `npm run db:seed` — seed DB with Excel data

## Structure

- `src/app/(dashboard)/` — protected pages (Resumen, Productos, Compras, Ventas, Ganancias)
- `src/app/auth/` — sign-in / sign-up pages
- `src/components/` — ui/ (shadcn), layout/, dashboard/, shared/, products/, purchases/, sales/
- `src/server/actions/` — server actions (products, purchases, sales, dashboard)
- `src/server/db.ts` — PrismaClient singleton with Neon adapter
- `src/lib/` — utils, validators (Zod), constants, auth/, logger, error-handler
- `prisma/schema.prisma` — DB schema (Product, Purchase, Sale)
- `prisma.config.ts` — Prisma 7 config with dotenv for DATABASE_URL

## Key Patterns

- Server Actions with Zod validation → `revalidatePath()` → return `ActionResult`
- Forms use `useActionState` (React 19) + Dialog (shadcn)
- `DataTable` generic wrapper with TanStack Table (pagination, sorting)
- `formatCurrency()` uses `Intl.NumberFormat("es-CL", { currency: "CLP" })`
- Decimal fields from Prisma: always `Number()` before using
- Neon Auth: client-side `authClient` (BetterAuthReactAdapter), server-side `getSession()`
