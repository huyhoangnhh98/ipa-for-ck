Cloudflare Workers + Next.js deployment rules. Covers: Edge runtime, Zustand hydration, authentication patterns, environment variables, API routes, D1/KV/R2 bindings, common pitfalls and fixes. Use when: deploying Next.js to Cloudflare, fixing hydration errors, SSR/SSG issues, auth loops, edge runtime limitations.

# Cloudflare + Next.js Implementation Rules

Best practices and common pitfalls when deploying Next.js applications to Cloudflare Workers.

---

## Tech Stack & Libraries

### Core Framework

| Package    | Version | Description                     |
| ---------- | ------- | ------------------------------- |
| next       | 16.x    | React framework with App Router |
| react      | 19.x    | UI library                      |
| react-dom  | 19.x    | React DOM renderer              |
| typescript | 5.x     | Type safety                     |

### Cloudflare Integration

| Package                   | Version | Description                            |
| ------------------------- | ------- | -------------------------------------- |
| @opennextjs/cloudflare    | 1.x     | Next.js adapter for Cloudflare Workers |
| wrangler                  | 4.x     | Cloudflare CLI tool                    |
| @cloudflare/workers-types | 4.x     | TypeScript types for Workers           |

### UI & Styling

| Package                  | Version | Description                 |
| ------------------------ | ------- | --------------------------- |
| tailwindcss              | 4.x     | Utility-first CSS framework |
| @tailwindcss/postcss     | 4.x     | PostCSS plugin for Tailwind |
| tw-animate-css           | 1.x     | Animation utilities         |
| @radix-ui/\*             | latest  | Headless UI components      |
| lucide-react             | 0.5x+   | Icon library                |
| class-variance-authority | 0.7.x   | Variant styling             |
| clsx                     | 2.x     | Classname utility           |
| tailwind-merge           | 3.x     | Merge Tailwind classes      |
| next-themes              | 0.4.x   | Theme switching             |
| sonner                   | 2.x     | Toast notifications         |

### State & Forms

| Package             | Version | Description               |
| ------------------- | ------- | ------------------------- |
| zustand             | 5.x     | State management          |
| react-hook-form     | 7.x     | Form handling             |
| @hookform/resolvers | 5.x     | Form validation resolvers |
| zod                 | 4.x     | Schema validation         |

---

## Project Folder Structure

```
project-root/
├── .claude/                      # Claude AI configuration
│   └── skills/                   # Custom skills for Claude
│       └── <skill-name>/
│           └── SKILL.md
├── public/                       # Static assets
│   ├── images/
│   └── fonts/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── health/
│   │   │   │   └── route.ts      # Health check endpoint
│   │   │   └── [...path]/        # Catch-all API proxy (optional)
│   │   │       └── route.ts
│   │   ├── (<route-group>)/      # Route groups for layouts
│   │   │   ├── layout.tsx        # Group layout
│   │   │   ├── <page-name>/
│   │   │   │   ├── page.tsx      # Page component
│   │   │   │   ├── loading.tsx   # Loading state (optional)
│   │   │   │   └── _components/  # Page-specific components
│   │   │   └── <resource>/
│   │   │       ├── page.tsx      # List page
│   │   │       ├── create/
│   │   │       │   └── page.tsx  # Create page
│   │   │       └── [id]/
│   │   │           ├── page.tsx  # Detail/Edit page
│   │   │           └── _components/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/                   # Reusable UI primitives (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/               # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar/
│   │   │   │   ├── index.tsx
│   │   │   │   └── nav-items.tsx
│   │   │   └── footer.tsx
│   │   ├── shared/               # Shared/common components
│   │   │   └── <component-name>/
│   │   └── <feature>/            # Feature-specific components
│   │       ├── <feature>-list.tsx
│   │       ├── <feature>-form.tsx
│   │       └── <feature>-card.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-<hook-name>.ts
│   │   └── index.ts
│   ├── lib/                      # Utility functions & configs
│   │   ├── utils.ts              # General utilities (cn, etc.)
│   │   ├── api.ts                # API client helpers
│   │   └── constants.ts          # App constants
│   ├── services/                 # API service layers
│   │   ├── <resource>.service.ts
│   │   └── index.ts
│   ├── stores/                   # Zustand stores
│   │   ├── <store-name>.store.ts
│   │   └── index.ts
│   ├── schemas/                  # Zod validation schemas
│   │   ├── <resource>.schema.ts
│   │   └── index.ts
│   └── types/                    # TypeScript type definitions
│       ├── <resource>.types.ts
│       ├── api.types.ts
│       └── index.ts
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── open-next.config.ts           # OpenNext configuration
├── package.json
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── wrangler.toml                 # Cloudflare Workers configuration
```

### Naming Conventions

| Type              | Convention                        | Example                             |
| ----------------- | --------------------------------- | ----------------------------------- |
| Components        | PascalCase                        | `UserCard.tsx`, `DataTable.tsx`     |
| Hooks             | camelCase with `use` prefix       | `use-auth.ts`, `use-pagination.ts`  |
| Stores            | kebab-case with `.store` suffix   | `user.store.ts`, `theme.store.ts`   |
| Services          | kebab-case with `.service` suffix | `user.service.ts`, `api.service.ts` |
| Schemas           | kebab-case with `.schema` suffix  | `user.schema.ts`, `form.schema.ts`  |
| Types             | kebab-case with `.types` suffix   | `user.types.ts`, `api.types.ts`     |
| API Routes        | `route.ts` inside folder          | `app/api/users/route.ts`            |
| Page components   | `page.tsx`                        | `app/users/page.tsx`                |
| Layout components | `layout.tsx`                      | `app/(admin)/layout.tsx`            |
| Private folders   | Prefix with `_`                   | `_components/`, `_lib/`             |

### Route Groups

Use parentheses `()` to organize routes without affecting URL:

```
app/
├── (public)/           # Public pages (no auth required)
│   ├── layout.tsx      # Minimal layout
│   └── about/
├── (admin)/            # Admin pages (requires auth)
│   ├── layout.tsx      # Admin layout with sidebar
│   ├── dashboard/
│   └── users/
└── (marketing)/        # Marketing pages
    ├── layout.tsx      # Marketing layout
    └── pricing/
```

---

## Zustand + Next.js Hydration

### Problem: Infinite Loop / Hydration Mismatch

When using Zustand with `persist` middleware in Next.js, you may encounter:

- Infinite redirect loops on auth pages
- Hydration mismatch errors
- Components stuck in loading state

### Root Cause

```typescript
// BAD: isLoading starts as true but isn't persisted
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true, // Problem: not persisted, causes mismatch
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

**Sequence:**

1. Server renders with `isLoading: true`, `isAuthenticated: false`
2. Client hydrates Zustand from localStorage → `isAuthenticated` may be `true`
3. `isLoading` remains `true` (initial value, not persisted)
4. State mismatch triggers re-renders, useEffect runs multiple times
5. If auth check fails → infinite loop

### Solution: Add Hydration State + Prevent Race Condition

```typescript
// GOOD: Track hydration state and prevent redirect race condition
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean; // Track hydration
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false, // Start as false
      hasHydrated: false,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clearAuth: () => set({ isAuthenticated: false, isLoading: false }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // CRITICAL: If user was authenticated (from localStorage),
        // set loading to true to prevent redirects until auth is verified
        if (state?.isAuthenticated) {
          state?.setLoading(true);
        }
      },
    }
  )
);
```

### Why This Prevents the Loop

**Without the fix (race condition):**

1. Zustand hydrates: `isAuthenticated: true` (stale), `isLoading: false`
2. Login page sees `!isLoading && isAuthenticated` → redirects to `/`
3. Auth check runs later, fails (token expired) → `isAuthenticated: false`
4. AuthGuard on `/` sees `!isAuthenticated` → redirects to `/login`
5. **Infinite loop!**

**With the fix:**

1. Zustand hydrates: `isAuthenticated: true`, `isLoading: true` (set in onRehydrateStorage)
2. Login page sees `isLoading: true` → shows spinner, no redirect
3. Auth check runs, verifies token with API
4. If valid: redirect to `/` with verified auth
5. If invalid: set `isAuthenticated: false`, show login form
6. **No loop!**

### Usage in Components

```typescript
// In hooks (e.g., useAuth)
useEffect(() => {
  // Wait for hydration before checking auth
  if (!hasHydrated || hasChecked.current) return;
  hasChecked.current = true;

  checkAuth();
}, [hasHydrated /* other deps */]);

// In pages (e.g., LoginPage)
const { isAuthenticated, isLoading, hasHydrated } = useAuth();

useEffect(() => {
  // Only redirect after hydration complete
  if (hasHydrated && !isLoading && isAuthenticated) {
    router.push("/");
  }
}, [hasHydrated, isLoading, isAuthenticated, router]);

// Show loading while hydrating OR checking auth
if (!hasHydrated || isLoading) {
  return <LoadingSpinner />;
}
```

---

## Edge Runtime Limitations

### Unsupported Node.js APIs

Edge runtime doesn't support:

- `fs` module
- `child_process`
- `crypto.randomBytes()` (use `crypto.getRandomValues()`)
- `Buffer` global (import from `buffer` package)
- Long-running processes

### Solution: Use Edge-Compatible Alternatives

```typescript
// BAD
import { randomBytes } from "crypto";
const token = randomBytes(32).toString("hex");

// GOOD
const array = new Uint8Array(32);
crypto.getRandomValues(array);
const token = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join(
  ""
);
```

### Check Runtime in next.config

```javascript
// next.config.mjs
export default {
  experimental: {
    runtime: "edge", // or "nodejs" for specific routes
  },
};
```

---

## Environment Variables

### Cloudflare Workers Secrets

```bash
# Set secrets via wrangler
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
```

### Access in Code

```typescript
// In API routes, access via env parameter
export async function GET(request: Request, { env }) {
  const dbUrl = env.DATABASE_URL;
  // ...
}

// For client-side, use NEXT_PUBLIC_ prefix
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### wrangler.toml Configuration

```toml
name = "my-nextjs-app"
compatibility_date = "2024-01-01"

[vars]
NEXT_PUBLIC_API_URL = "https://api.example.com"

[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxx-xxx-xxx"

[[kv_namespaces]]
binding = "KV"
id = "xxx-xxx-xxx"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-bucket"
```

---

## API Routes Best Practices

### Use Edge Runtime Where Possible

```typescript
// app/api/example/route.ts
export const runtime = "edge";

export async function GET(request: Request) {
  // Edge-optimized code
}
```

### Error Handling

```typescript
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### CORS for API Routes

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET(request: Request) {
  const data = await fetchData();
  return Response.json(data, { headers: corsHeaders });
}
```

---

## Authentication Patterns

### Cookie-Based Auth (Recommended for SSR)

```typescript
// Set cookie in login API
export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = await authenticate(email, password);

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createToken(user);

  return new Response(JSON.stringify({ user }), {
    headers: {
      "Set-Cookie": `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
      "Content-Type": "application/json",
    },
  });
}
```

### Middleware for Protected Routes

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Redirect to login if no token on protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if already logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
```

---

## Service Bindings in Local Development

### Problem: Service Bindings Don't Work Locally

When using Cloudflare service bindings (e.g., connecting to another Worker), you'll get errors in local development:

- `Failed to parse URL from [object Request]`
- `getCloudflareContext` returns empty/null bindings

### Root Cause

Service bindings are Cloudflare-specific and only work in the Workers runtime, not in local Node.js development.

### Solution: Create a Helper with HTTP Fallback

```typescript
// Shared helper for API routes that call external Workers
async function callAuthAPI(
  endpoint: string,
  options: RequestInit
): Promise<Response> {
  // Try Cloudflare service binding first (production)
  try {
    const ctx = await getCloudflareContext();
    const env = ctx.env as CloudflareEnv;

    if (env.AUTH_API) {
      // Service binding available - use it
      const serviceRequest = new Request(
        `https://auth-api${endpoint}`,
        options
      );
      return await env.AUTH_API.fetch(serviceRequest);
    }
  } catch {
    // Service binding not available, fallback to direct fetch
  }

  // Fallback to direct HTTP call (for local development)
  const authApiUrl = process.env.AUTH_API_URL;
  if (!authApiUrl) {
    throw new Error("AUTH_API_URL not configured for local development");
  }

  return fetch(`${authApiUrl}${endpoint}`, options);
}
```

### Environment Setup

```env
# .env (for local development)
AUTH_API_URL=https://your-worker.your-account.workers.dev
```

```toml
# wrangler.toml (for production - service binding)
[[services]]
binding = "AUTH_API"
service = "auth-worker"
environment = "production"
```

### Usage in API Routes

```typescript
// app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await callAuthAPI("/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await response.json());
}
```

### Next.js Configuration for Cloudflare

```typescript
// next.config.ts
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize Cloudflare context for local development
// This enables getCloudflareContext() to work locally (returning empty bindings)
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Required for Cloudflare Workers (no native image optimization)
    unoptimized: true,
  },
};

export default nextConfig;
```

**Why these settings:**

| Setting                          | Reason                                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `initOpenNextCloudflareForDev()` | Enables `getCloudflareContext()` locally, returns empty bindings so HTTP fallback works             |
| `reactStrictMode: true`          | Helps catch bugs early, runs effects twice in dev mode                                              |
| `images.unoptimized: true`       | Cloudflare Workers doesn't support Next.js Image Optimization, use unoptimized or Cloudflare Images |

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "build:worker": "opennextjs-cloudflare build",
    "dev:worker": "wrangler dev --port 8771",
    "dev:cf": "opennextjs-cloudflare build && opennextjs-cloudflare preview --port 8771",
    "dev:cf:remote": "opennextjs-cloudflare build && opennextjs-cloudflare preview --port 8771 --remote",
    "preview": "opennextjs-cloudflare preview --port 8771",
    "deploy": "opennextjs-cloudflare deploy",
    "deploy:dev": "opennextjs-cloudflare deploy --env dev",
    "deploy:staging": "opennextjs-cloudflare deploy --env staging",
    "deploy:prod": "opennextjs-cloudflare deploy --env production"
  }
}
```

**Script descriptions:**

| Script           | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `dev`            | Run Next.js dev server (standard, no Cloudflare bindings)    |
| `build`          | Build Next.js for production                                 |
| `build:worker`   | Build for Cloudflare Workers using OpenNext                  |
| `dev:worker`     | Run local Cloudflare Workers dev server with wrangler        |
| `dev:cf`         | Build + preview with Cloudflare Workers runtime locally      |
| `dev:cf:remote`  | Build + preview with remote Cloudflare bindings (D1, KV, R2) |
| `preview`        | Preview built worker locally                                 |
| `deploy`         | Deploy to Cloudflare Workers (default env)                   |
| `deploy:dev`     | Deploy to dev environment                                    |
| `deploy:staging` | Deploy to staging environment                                |
| `deploy:prod`    | Deploy to production environment                             |

**When to use each:**

- **Local development (no bindings):** `pnpm dev`
- **Local development (with local bindings):** `pnpm dev:cf`
- **Local development (with remote bindings):** `pnpm dev:cf:remote`
- **Deploy to Cloudflare:** `pnpm deploy` or `pnpm deploy:<env>`

---

## D1 Database Integration with Drizzle ORM

### Setup

```typescript
// lib/db.ts
import { drizzle } from "drizzle-orm/d1";

export type DB = ReturnType<typeof drizzle>;

export function getDb(env: { DB: D1Database }): DB {
  return drizzle(env.DB);
}
```

### Schema Definition

```typescript
// db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  status: text("status").default("active"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// Infer types from schema
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
```

### Repository Pattern

```typescript
// repositories/user.repository.interface.ts
import { UserSelect } from "@/db/schema";

export interface IUserRepository {
  findById(id: string): Promise<UserSelect | null>;
  findByEmail(email: string): Promise<UserSelect | null>;
  findAllPaginated(
    page: number,
    limit: number
  ): Promise<PaginatedResult<UserSelect>>;
  create(
    data: Omit<UserSelect, "id" | "createdAt" | "updatedAt">
  ): Promise<UserSelect>;
  update(id: string, data: Partial<UserSelect>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}
```

```typescript
// repositories/user.repository.ts
import { eq, asc, desc, sql } from "drizzle-orm";
import { users, UserSelect, DB } from "@/db/schema";
import { IUserRepository, PaginatedResult } from "./user.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(private db: DB) {}

  async findById(id: string): Promise<UserSelect | null> {
    const results = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return results[0] ?? null;
  }

  async findByEmail(email: string): Promise<UserSelect | null> {
    const results = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return results[0] ?? null;
  }

  async findAllPaginated(
    page: number,
    limit: number
  ): Promise<PaginatedResult<UserSelect>> {
    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      this.db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      this.db.select({ count: sql<number>`count(*)` }).from(users),
    ]);

    return {
      data,
      total: countResult[0]?.count ?? 0,
    };
  }

  async create(
    data: Omit<UserSelect, "id" | "createdAt" | "updatedAt">
  ): Promise<UserSelect> {
    const now = Date.now();
    const id = crypto.randomUUID();

    await this.db.insert(users).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    });

    return this.findById(id) as Promise<UserSelect>;
  }

  async update(id: string, data: Partial<UserSelect>): Promise<void> {
    await this.db
      .update(users)
      .set({ ...data, updatedAt: Date.now() })
      .where(eq(users.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async countByStatus(status: string): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.status, status));

    return result[0]?.count ?? 0;
  }
}
```

### Usage in API Routes

```typescript
// app/api/users/route.ts
import { getDb } from "@/lib/db";
import { UserRepository } from "@/repositories/user.repository";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const ctx = await getCloudflareContext();
  const db = getDb(ctx.env);
  const userRepo = new UserRepository(db);

  const result = await userRepo.findAllPaginated(page, limit);

  return Response.json({
    data: result.data,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const ctx = await getCloudflareContext();
  const db = getDb(ctx.env);
  const userRepo = new UserRepository(db);

  // Check if email already exists
  const existing = await userRepo.findByEmail(body.email);
  if (existing) {
    return Response.json({ error: "Email already exists" }, { status: 400 });
  }

  const user = await userRepo.create(body);
  return Response.json(user, { status: 201 });
}
```

### Common Drizzle Queries

```typescript
import {
  eq,
  and,
  or,
  like,
  gt,
  lt,
  gte,
  lte,
  asc,
  desc,
  sql,
} from "drizzle-orm";

// WHERE with multiple conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(and(eq(users.status, "active"), gt(users.createdAt, lastWeek)));

// OR conditions
const results = await db
  .select()
  .from(users)
  .where(or(eq(users.status, "active"), eq(users.status, "pending")));

// LIKE search
const searchResults = await db
  .select()
  .from(users)
  .where(like(users.name, `%${searchTerm}%`));

// ORDER BY multiple columns
const sorted = await db
  .select()
  .from(users)
  .orderBy(desc(users.createdAt), asc(users.name));

// SELECT specific columns
const emails = await db
  .select({ id: users.id, email: users.email })
  .from(users);

// COUNT with condition
const activeCount = await db
  .select({ count: sql<number>`count(*)` })
  .from(users)
  .where(eq(users.status, "active"));

// JOIN example
const usersWithPosts = await db
  .select({
    user: users,
    postCount: sql<number>`count(${posts.id})`,
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.userId))
  .groupBy(users.id);
```

---

## Common Errors & Fixes

### Error: "window is not defined"

**Cause:** Server-side code trying to access browser APIs.

```typescript
// BAD
const theme = localStorage.getItem("theme");

// GOOD
const [theme, setTheme] = useState<string | null>(null);

useEffect(() => {
  setTheme(localStorage.getItem("theme"));
}, []);
```

### Error: "Text content does not match"

**Cause:** Hydration mismatch between server and client.

```typescript
// BAD
<p>{new Date().toLocaleString()}</p>;

// GOOD
const [time, setTime] = useState<string>("");

useEffect(() => {
  setTime(new Date().toLocaleString());
}, []);

return <p>{time || "Loading..."}</p>;
```

### Error: "Dynamic server usage"

**Cause:** Using dynamic features in static pages.

```typescript
// Force dynamic rendering
export const dynamic = "force-dynamic";

// Or use generateStaticParams for static generation
export async function generateStaticParams() {
  return [{ slug: "example" }];
}
```

### Error: Infinite Redirect Loop

**Cause:** Auth middleware and page redirecting each other.

**Fix:** Use `hasHydrated` pattern (see Zustand section above).

---

## Checklists

### Project Setup Checklist

- [ ] Initialize Next.js with TypeScript: `npx create-next-app@latest --typescript`
- [ ] Install Cloudflare adapter: `pnpm add @opennextjs/cloudflare`
- [ ] Install wrangler: `pnpm add -D wrangler @cloudflare/workers-types`
- [ ] Configure `wrangler.toml` with project name and bindings
- [ ] Create `open-next.config.ts` for OpenNext configuration
- [ ] Add `initOpenNextCloudflareForDev()` to `next.config.ts`
- [ ] Setup Tailwind CSS 4.x with `@tailwindcss/postcss`
- [ ] Install shadcn/ui: `npx shadcn@latest init`
- [ ] Install Zustand: `pnpm add zustand`
- [ ] Install form libraries: `pnpm add react-hook-form @hookform/resolvers zod`
- [ ] Create folder structure: `src/{components,hooks,lib,services,stores,schemas,types}`
- [ ] Setup `.env.example` with required environment variables
- [ ] Configure `tsconfig.json` with path aliases (`@/*`)

### New Page Checklist

- [ ] Create page in correct route group: `app/(<group>)/<page>/page.tsx`
- [ ] Add `loading.tsx` if page has async data fetching
- [ ] Add `error.tsx` for error boundary (optional)
- [ ] Create `_components/` folder for page-specific components
- [ ] Use `"use client"` directive only when needed (interactivity, hooks)
- [ ] Implement proper loading states with Skeleton or Spinner
- [ ] Handle empty states for lists/data
- [ ] Add proper TypeScript types for props and data
- [ ] Test hydration (no `window`/`document` access during SSR)
- [ ] Verify responsive design on mobile

### New Component Checklist

- [ ] Place in correct folder:
  - `components/ui/` - Reusable primitives (button, input, etc.)
  - `components/layout/` - Layout components (header, sidebar, etc.)
  - `components/shared/` - Shared business components
  - `components/<feature>/` - Feature-specific components
- [ ] Use PascalCase for component file names
- [ ] Export component as named export (not default)
- [ ] Add TypeScript interface for props
- [ ] Use `cn()` utility for conditional classnames
- [ ] Implement `forwardRef` if component wraps native elements
- [ ] Add `"use client"` only if component uses hooks/interactivity
- [ ] Handle loading, error, and empty states if applicable

### New API Route Checklist

- [ ] Create route in `app/api/<endpoint>/route.ts`
- [ ] Add `export const runtime = "edge"` for edge compatibility
- [ ] Implement proper HTTP methods (GET, POST, PUT, DELETE)
- [ ] Add OPTIONS handler for CORS if needed
- [ ] Validate request body with Zod schema
- [ ] Return proper status codes (200, 201, 400, 401, 404, 500)
- [ ] Use `Response.json()` for JSON responses
- [ ] Add try-catch for error handling
- [ ] Log errors with `console.error()`
- [ ] Test with different input scenarios
- [ ] Check edge runtime compatibility (no Node.js-only APIs)

### New Zustand Store Checklist

- [ ] Create store in `stores/<name>.store.ts`
- [ ] Define TypeScript interface for state
- [ ] Include action methods in the store
- [ ] Add `persist` middleware if state needs persistence
- [ ] Use `partialize` to exclude non-persistent fields
- [ ] Implement `onRehydrateStorage` for hydration handling
- [ ] Add `hasHydrated` state for SSR compatibility
- [ ] Create custom hook if store needs derived state
- [ ] Test hydration behavior in browser

### New Service Checklist

- [ ] Create service in `services/<name>.service.ts`
- [ ] Define TypeScript types for request/response
- [ ] Use consistent error handling pattern
- [ ] Return typed responses
- [ ] Handle API errors gracefully
- [ ] Add JSDoc comments for public methods
- [ ] Export from `services/index.ts`

### New Form Checklist

- [ ] Create Zod schema in `schemas/<name>.schema.ts`
- [ ] Use `react-hook-form` with `zodResolver`
- [ ] Add proper input validation messages
- [ ] Implement loading state during submission
- [ ] Handle API errors and display to user
- [ ] Use `sonner` toast for success/error notifications
- [ ] Disable submit button while loading
- [ ] Test form with invalid inputs
- [ ] Test form submission and error handling

### Code Review Checklist

- [ ] No `any` types - use proper TypeScript types
- [ ] No unused imports or variables
- [ ] No console.log in production code (use console.error for errors)
- [ ] No hardcoded strings - use constants or env variables
- [ ] No `window`/`document` access without `useEffect`
- [ ] Components have proper loading/error states
- [ ] Forms have proper validation
- [ ] API routes have proper error handling
- [ ] No sensitive data in client-side code
- [ ] Proper use of `"use client"` directive
- [ ] No unnecessary re-renders (check useEffect deps)
- [ ] Responsive design works on mobile
- [ ] Accessibility: proper labels, ARIA attributes

### Deployment Checklist

**Pre-Deployment:**

- [ ] All environment variables set in Cloudflare dashboard
- [ ] D1/KV/R2 bindings configured in wrangler.toml
- [ ] Edge-incompatible code moved to nodejs runtime
- [ ] Zustand stores have proper hydration handling
- [ ] No `window`/`document` access during SSR
- [ ] Build passes without errors: `pnpm build`
- [ ] TypeScript has no errors: `pnpm tsc --noEmit`
- [ ] Lint passes: `pnpm lint`

**Build & Deploy:**

```bash
# Build for Cloudflare
pnpm build:worker

# Preview locally
pnpm preview

# Deploy to Cloudflare
pnpm deploy
```

**Post-Deployment:**

- [ ] Test all critical user flows
- [ ] Verify no console errors in browser
- [ ] Check server logs in Cloudflare dashboard
- [ ] Test on mobile devices
- [ ] Verify environment variables are accessible
- [ ] Check API response times
- [ ] Verify caching headers are correct

### Troubleshooting Checklist

**Hydration Errors:**

- [ ] Check for `window`/`document` access during SSR
- [ ] Check for Date/time rendering without useEffect
- [ ] Check Zustand store has `hasHydrated` pattern
- [ ] Verify `"use client"` is added where needed

**Build Errors:**

- [ ] Check for Node.js-only APIs in edge runtime
- [ ] Verify all imports are valid
- [ ] Check for circular dependencies
- [ ] Verify environment variables are defined

**Runtime Errors:**

- [ ] Check Cloudflare dashboard logs
- [ ] Verify bindings are configured correctly
- [ ] Check service binding fallback for local dev
- [ ] Verify API routes return proper responses

---

## Performance Tips

### Use Static Generation Where Possible

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

### Optimize Images

```typescript
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>;
```

### Cache API Responses

```typescript
export async function GET(request: Request) {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
```
