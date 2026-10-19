import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { DOC_GROUPS, slugify } from "#/data/decorators";
import CodeBlock from "@/components/CodeBlock";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const INSTALL = `bun add hono-forge hono zod
# or
npm install hono-forge hono zod`;

const TSCONFIG = `{
  "compilerOptions": {
    "target": "ESNext"
  }
}
// TC39 Stage 3 decorators — no experimentalDecorators,
// no reflect-metadata. Bun >= 1.2 required (1.3 recommended).`;

const SCAFFOLD = `bunx hono-forge init my-api
cd my-api
bun install
bun run dev
# serves /hello, /health, /openapi.json and docs at /docs`;

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
export default app`;

const CREATE_APP = `import { createApp } from 'hono-forge'

const app = await createApp(AppModule, {
  health: { probes: true, checks: { db: () => db.ping() } }, // /health + /health/live + /health/ready
  metrics: true,                                            // GET /metrics (Prometheus)
  openapi: { info: { title: 'My API', version: '1.0.0' } }, // GET /docs + /openapi.json
  cors: true,                                               // global CORS
  printRoutes: true,                                        // route table at startup
  shutdown: { timeoutMs: 10_000 },                          // graceful SIGINT/SIGTERM
})

export default app`;

const MODULE = `import { Module } from 'hono-forge'
import { Hono } from 'hono'
import { HonoRouteBuilder } from 'hono-forge'

@Module({ controllers: [UserController], providers: [UserService] })
class UserModule {}

@Module({ imports: [UserModule], controllers: [OrderController] })
class AppModule {}

const app = new Hono()
app.route('/', HonoRouteBuilder.buildModule(AppModule))
export default app`;

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
})`;

const CLI_USAGE = `bunx hono-forge <command> <entry-file> [options]

# the entry file must export an @Module or @Controller class
bunx hono-forge routes ./src/app.module.ts

# TypeScript entries need Bun at runtime. If bunx/npx resolves the
# bin to a Node shim (Windows), the CLI detects it and transparently
# re-execs through Bun when it's on PATH — otherwise it prints the
# exact fallback command:
bun node_modules/hono-forge/dist/cli.js routes ./src/app.module.ts

# several exports in one file? pick one:
bunx hono-forge routes ./src/index.ts --export AppModule

# per-command flags + examples:
bunx hono-forge help doctor
bunx hono-forge doctor --help`;

const CLI_WORKFLOW = `# during development — inspect without booting the server
bunx hono-forge routes ./src/app.module.ts          # route table
bunx hono-forge graph  ./src/app.module.ts          # DI graph
bunx hono-forge graph  ./src/app.module.ts --format mermaid

# in CI — fails the pipeline on wiring issues
bunx hono-forge doctor ./src/app.module.ts --json

# codegen — commit or .gitignore the outputs, your call
bunx hono-forge openapi ./src/app.module.ts --out openapi.json
bunx hono-forge flows   ./src/app.module.ts --out ./flows
bunx hono-forge client  ./src/app.module.ts --out src/routes.gen.ts
bunx hono-forge schema  ./src/db/schema.ts --out db.schema.yaml
#                     ↑ also: schema.prisma | postgres://… | --from file`;

const CLI_SCRIPTS = `{
  "scripts": {
    "routes": "hono-forge routes ./src/app.module.ts",
    "doctor": "hono-forge doctor ./src/app.module.ts",
    "gen:openapi": "hono-forge openapi ./src/app.module.ts --out openapi.json",
    "gen:client": "hono-forge client ./src/app.module.ts --out src/routes.gen.ts"
  }
}
// then: bun run doctor — same flags work, e.g. bun run routes --json`;

const GUIDES = [
	{ id: "install", label: "Install & scaffold" },
	{ id: "quickstart", label: "Quick start" },
	{ id: "modules-app", label: "Modules & createApp" },
	{ id: "configure", label: "HonoRouteBuilder.configure" },
	{ id: "cli-usage", label: "Using the CLI" },
];

const itemId = (groupId: string, name: string) => `${groupId}-${slugify(name)}`;

export default function DocsPage() {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const expand = (id: string) => setExpanded((prev) => new Set(prev).add(id));
	const toggle = (id: string) =>
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	return (
		<>
			<Navbar />
			<div className="docs-layout">
				<aside className="docs-sidebar">
					<div className="docs-toc-title">guide</div>
					{GUIDES.map((g) => (
						<a
							key={g.id}
							href={`#${g.id}`}
							className="docs-toc-link docs-toc-group"
						>
							{g.label}
						</a>
					))}
					<div className="docs-toc-title">decorator & api reference</div>
					{DOC_GROUPS.map((g) => (
						<div
							key={g.id}
							className={`docs-toc-group-block${expanded.has(g.id) ? " open" : ""}`}
						>
							<div className="docs-toc-group-row">
								<a
									href={`#${g.id}`}
									className="docs-toc-link docs-toc-group"
									onClick={() => expand(g.id)}
								>
									{g.label}
									<span className="docs-toc-count">{g.items.length}</span>
								</a>
								<button
									type="button"
									className="docs-toc-toggle"
									onClick={() => toggle(g.id)}
									aria-label={`toggle ${g.label}`}
								>
									<ChevronRight size={12} className="docs-chev" />
								</button>
							</div>
							{expanded.has(g.id) && (
								<div className="docs-toc-items">
									{g.items.map((item) => (
										<a
											key={item.name}
											href={`#${itemId(g.id, item.name)}`}
											className="docs-toc-link docs-toc-item"
										>
											{item.name}
										</a>
									))}
								</div>
							)}
						</div>
					))}
				</aside>

				<main className="docs-content">
					<header className="docs-header">
						<div className="section-label">documentation</div>
						<h1 className="section-title">hono-forge docs</h1>
						<p className="section-desc">
							Batteries-included Hono framework built on TC39 decorators —
							controller routing, DI, guards, validation, SSE/WebSocket,
							OpenAPI, scheduling, and more. Every export is documented below,
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
							Add the package to an existing project, or let the CLI generate a
							runnable starter with an example controller, OpenAPI docs, health
							checks, and graceful shutdown already wired.
						</p>
						<CodeBlock filename="terminal">{INSTALL}</CodeBlock>
						<CodeBlock filename="tsconfig.json">{TSCONFIG}</CodeBlock>
						<CodeBlock filename="terminal">{SCAFFOLD}</CodeBlock>
					</section>

					<section id="quickstart" className="docs-group">
						<div className="section-label">02 — guide</div>
						<h2 className="section-title">Quick start</h2>
						<p className="docs-desc">
							A controller groups HTTP methods and injects services through the
							constructor. Handlers receive the Hono <code>Context</code>{" "}
							directly — route params, query, body and headers are read via
							typed context helpers. A plain return value is auto-serialized to
							JSON; a returned <code>Response</code> passes through untouched.
						</p>
						<CodeBlock filename="src/index.ts">{QUICKSTART}</CodeBlock>
					</section>

					<section id="modules-app" className="docs-group">
						<div className="section-label">03 — guide</div>
						<h2 className="section-title">Modules & createApp</h2>
						<p className="docs-desc">
							<code>@Module</code> groups controllers and providers — imports
							are traversed recursively and deduplicated, and providers resolve
							eagerly so missing DI tokens fail at boot. <code>createApp</code>{" "}
							goes further: one call wires health probes, Prometheus metrics,
							OpenAPI + Scalar docs, CORS, route printing, and graceful
							shutdown.
						</p>
						<CodeBlock filename="src/app.module.ts">{MODULE}</CodeBlock>
						<CodeBlock filename="src/index.ts">{CREATE_APP}</CodeBlock>
					</section>

					<section id="configure" className="docs-group">
						<div className="section-label">04 — guide</div>
						<h2 className="section-title">HonoRouteBuilder.configure</h2>
						<p className="docs-desc">
							One global configuration point for cross-cutting behaviour —
							guards, rate limiting, cache backends, logging, error format, and
							platform upgraders. Call once at startup before building routes.
						</p>
						<CodeBlock filename="src/bootstrap.ts">{CONFIGURE}</CodeBlock>
					</section>

					<section id="cli-usage" className="docs-group">
						<div className="section-label">05 — guide</div>
						<h2 className="section-title">Using the CLI</h2>
						<p className="docs-desc">
							The CLI reads your decorators <em>without starting the server</em>{" "}
							— every command takes an entry file that exports an{" "}
							<code>@Module</code> (or <code>@Controller</code>) class.
							TypeScript entries run under Bun; if <code>bunx</code>/
							<code>npx</code> resolves the bin to a Node shim, the CLI detects
							it and re-execs through Bun automatically.
						</p>
						<CodeBlock filename="terminal">{CLI_USAGE}</CodeBlock>
						<p className="docs-desc">
							Where it fits in your workflow — inspection while you develop, a
							gate in CI, and codegen for specs, test flows, and typed clients.
							Each command's flags are listed in the{" "}
							<a href="#cli" className="docs-inline-link">
								cli commands reference
							</a>{" "}
							below.
						</p>
						<CodeBlock filename="terminal">{CLI_WORKFLOW}</CodeBlock>
						<p className="docs-desc">
							Tip: wire the commands you run often into{" "}
							<code>package.json</code> scripts.
						</p>
						<CodeBlock filename="package.json">{CLI_SCRIPTS}</CodeBlock>
					</section>

					{DOC_GROUPS.map((g, i) => (
						<section key={g.id} id={g.id} className="docs-group">
							<div className="section-label">
								{String(i + GUIDES.length + 1).padStart(2, "0")} — reference
							</div>
							<h2 className="section-title">{g.label}</h2>
							<p className="docs-desc">{g.desc}</p>

							<div className="docs-entries">
								{g.items.map((item) => (
									<article
										key={item.name}
										id={itemId(g.id, item.name)}
										className="doc-entry"
									>
										<h3 className="doc-name">
											<a
												href={`#${itemId(g.id, item.name)}`}
												className="doc-anchor"
											>
												{item.name}
											</a>
										</h3>
										<p className="doc-desc">{item.desc}</p>
										{item.example && (
											<CodeBlock filename="example.ts">
												{item.example}
											</CodeBlock>
										)}
									</article>
								))}
							</div>
						</section>
					))}
				</main>
			</div>
			<Footer />
		</>
	);
}
