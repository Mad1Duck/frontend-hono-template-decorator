import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CodeBlock from '@/components/CodeBlock'
import { DOC_GROUPS, slugify } from '#/data/decorators'

const INSTALL = `bun add hono-forge hono zod
# or
npm install hono-forge hono zod`

const TSCONFIG = `{
  "compilerOptions": {
    "target": "ESNext"
  }
}
// TC39 Stage 3 decorators — no experimentalDecorators,
// no reflect-metadata. Bun >= 1.2 required (1.3 recommended).`

const SCAFFOLD = `bunx hono-forge init my-api
cd my-api
bun install
bun run dev
# serves /hello, /health, /openapi.json and docs at /docs`

const QUICKSTART = `import { Hono } from 'hono'
import type { Context } from 'hono'
import {
  Controller, Get, Post,
  Injectable, Body, Param,
  HonoRouteBuilder,
} from 'hono-forge'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

@Injectable()
class UserService {
  getAll() { return [{ id: 1, name: 'Alice' }] }
  create(data: { name: string; email: string }) { return { id: 2, ...data } }
}

@Controller('/users')
@Injectable([UserService])
class UserController {
  constructor(private userService: UserService) {}

  @Get()
  list() { return this.userService.getAll() }

  @Post()
  async create(c: Context) {
    const body = await Body(c, CreateUserSchema)
    return this.userService.create(body)
  }

  @Get('/:id')
  getOne(c: Context) { return { id: Param(c, 'id') } }
}

const app = new Hono()
app.route('/', HonoRouteBuilder.build(UserController))
export default app`

const CREATE_APP = `import { createApp } from 'hono-forge'

const app = createApp(AppModule, {
  health: { probes: true, checks: { db: () => db.ping() } }, // /health + /health/live + /health/ready
  metrics: true,                                            // GET /metrics (Prometheus)
  openapi: { info: { title: 'My API', version: '1.0.0' } }, // GET /docs + /openapi.json
  cors: true,                                               // global CORS
  printRoutes: true,                                        // route table at startup
  shutdown: { timeoutMs: 10_000 },                          // graceful SIGINT/SIGTERM
})

export default app`

const MODULE = `import { Module } from 'hono-forge'
import { Hono } from 'hono'
import { HonoRouteBuilder } from 'hono-forge'

@Module({ controllers: [UserController], providers: [UserService] })
class UserModule {}

@Module({ imports: [UserModule], controllers: [OrderController] })
class AppModule {}

const app = new Hono()
app.route('/', HonoRouteBuilder.buildModule(AppModule))
export default app`

const CONFIGURE = `HonoRouteBuilder.configure({
  guardExecutor,      // auth decisions for guard decorators
  rateLimiterFactory, // swap @RateLimit backend (e.g. redisRateLimiter)
  cacheAdapter,       // swap @Cache/@Idempotent store (get/set/delete/deletePattern)
  webSocketUpgrader,  // upgradeWebSocket from hono/bun, cf-workers, ...
  requestLogger,      // (entry) => per-request log record
  onError,            // (err, c) => Response | void — global error hook
  errorFormat,        // 'envelope' (default) | 'problem' (RFC 9457)
  exposeStack,        // false (default) | true | 'development'
  onRequestStart,     // ({ method, path, traceId, ip, userAgent }) => span hook
  trailingSlash,      // 'ignore' (default) | 'strip' | 'add'
})`

const GUIDES = [
  { id: 'install', label: 'Install & scaffold' },
  { id: 'quickstart', label: 'Quick start' },
  { id: 'modules-app', label: 'Modules & createApp' },
  { id: 'configure', label: 'HonoRouteBuilder.configure' },
]

const itemId = (groupId: string, name: string) => `${groupId}-${slugify(name)}`

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-toc-title">guide</div>
          {GUIDES.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="docs-toc-link docs-toc-group">
              {g.label}
            </a>
          ))}
          <div className="docs-toc-title">decorator & api reference</div>
          {DOC_GROUPS.map((g) => (
            <div key={g.id} className="docs-toc-group-block">
              <a href={`#${g.id}`} className="docs-toc-link docs-toc-group">
                {g.label}
              </a>
              <div className="docs-toc-items">
                {g.items.map((item) => (
                  <a key={item.name} href={`#${itemId(g.id, item.name)}`} className="docs-toc-link docs-toc-item">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <main className="docs-content">
          <header className="docs-header">
            <div className="section-label">documentation</div>
            <h1 className="section-title">hono-forge docs</h1>
            <p className="section-desc">
              Batteries-included Hono framework built on TC39 decorators — controller routing, DI, guards,
              validation, SSE/WebSocket, OpenAPI, scheduling, and more. Every export is documented below,
              grouped by what it does.
            </p>

            {/* Mobile TOC — sidebar is hidden under 960px */}
            <nav className="docs-mobile-toc">
              {GUIDES.map((g) => (
                <a key={g.id} href={`#${g.id}`} className="docs-chip">
                  {g.label}
                </a>
              ))}
              {DOC_GROUPS.map((g) => (
                <a key={g.id} href={`#${g.id}`} className="docs-chip">
                  {g.label}
                </a>
              ))}
            </nav>
          </header>

          <section id="install" className="docs-group">
            <div className="section-label">01 — guide</div>
            <h2 className="section-title">Install & scaffold</h2>
            <p className="docs-desc">
              Add the package to an existing project, or let the CLI generate a runnable starter with
              an example controller, OpenAPI docs, health checks, and graceful shutdown already wired.
            </p>
            <CodeBlock filename="terminal">{INSTALL}</CodeBlock>
            <CodeBlock filename="tsconfig.json">{TSCONFIG}</CodeBlock>
            <CodeBlock filename="terminal">{SCAFFOLD}</CodeBlock>
          </section>

          <section id="quickstart" className="docs-group">
            <div className="section-label">02 — guide</div>
            <h2 className="section-title">Quick start</h2>
            <p className="docs-desc">
              A controller groups HTTP methods and injects services through the constructor. Handlers
              receive the Hono <code>Context</code> directly — route params, query, body and headers are
              read via typed context helpers. A plain return value is auto-serialized to JSON; a returned
              <code>Response</code> passes through untouched.
            </p>
            <CodeBlock filename="src/index.ts">{QUICKSTART}</CodeBlock>
          </section>

          <section id="modules-app" className="docs-group">
            <div className="section-label">03 — guide</div>
            <h2 className="section-title">Modules & createApp</h2>
            <p className="docs-desc">
              <code>@Module</code> groups controllers and providers — imports are traversed recursively
              and deduplicated, and providers resolve eagerly so missing DI tokens fail at boot.
              <code>createApp</code> goes further: one call wires health probes, Prometheus metrics,
              OpenAPI + Scalar docs, CORS, route printing, and graceful shutdown.
            </p>
            <CodeBlock filename="src/app.module.ts">{MODULE}</CodeBlock>
            <CodeBlock filename="src/index.ts">{CREATE_APP}</CodeBlock>
          </section>

          <section id="configure" className="docs-group">
            <div className="section-label">04 — guide</div>
            <h2 className="section-title">HonoRouteBuilder.configure</h2>
            <p className="docs-desc">
              One global configuration point for cross-cutting behaviour — guards, rate limiting, cache
              backends, logging, error format, and platform upgraders. Call once at startup before
              building routes.
            </p>
            <CodeBlock filename="src/bootstrap.ts">{CONFIGURE}</CodeBlock>
          </section>

          {DOC_GROUPS.map((g, i) => (
            <section key={g.id} id={g.id} className="docs-group">
              <div className="section-label">
                {String(i + GUIDES.length + 1).padStart(2, '0')} — reference
              </div>
              <h2 className="section-title">{g.label}</h2>
              <p className="docs-desc">{g.desc}</p>

              <div className="docs-entries">
                {g.items.map((item) => (
                  <article key={item.name} id={itemId(g.id, item.name)} className="doc-entry">
                    <h3 className="doc-name">
                      <a href={`#${itemId(g.id, item.name)}`} className="doc-anchor">
                        {item.name}
                      </a>
                    </h3>
                    <p className="doc-desc">{item.desc}</p>
                    {item.example && <CodeBlock filename="example.ts">{item.example}</CodeBlock>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  )
}
