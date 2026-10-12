export interface DocItem {
	name: string;
	desc: string;
	example?: string;
}

export interface DocGroup {
	id: string;
	label: string;
	desc: string;
	items: DocItem[];
}

export const DOC_GROUPS: DocGroup[] = [
	{
		id: "routing",
		label: "routing",
		desc: "Map classes and methods to HTTP routes. Every method decorator accepts a path and optional { platform, isPrivate } options.",
		items: [
			{
				name: "@Controller(path?, opts?)",
				desc: "Registers a class as a controller. Options: platform and version — { version: 'v2' } prefixes all routes with /v2.",
				example: `@Controller('/users', { version: 'v2' })\n@Injectable([UserService])\nclass UserController {\n  constructor(private svc: UserService) {}\n  // routes mount at /v2/users/...\n}`,
			},
			{
				name: "@Get(path?)",
				desc: "Maps method to HTTP GET.",
				example: `@Get('/:id')\n@Public()\ngetOne(c: Context) {\n  return this.svc.findById(Param(c, 'id'));\n}`,
			},
			{
				name: "@Post(path?)",
				desc: "Maps method to HTTP POST.",
				example: `@Post()\nasync create(c: Context) {\n  const body = await Body(c, CreateSchema);\n  return this.svc.create(body);\n}`,
			},
			{
				name: "@Put(path?)",
				desc: "Maps method to HTTP PUT.",
				example: `@Put('/:id')\nasync replace(c: Context) {\n  return this.svc.replace(\n    Param(c, 'id'), await Body(c, Schema)\n  );\n}`,
			},
			{
				name: "@Delete(path?)",
				desc: "Maps method to HTTP DELETE.",
				example: `@Delete('/:id')\n@RequireAuth()\nremove(c: Context) {\n  return this.svc.delete(Param(c, 'id'));\n}`,
			},
			{
				name: "@Patch(path?)",
				desc: "Maps method to HTTP PATCH.",
				example: `@Patch('/:id')\nasync update(c: Context) {\n  const body = await Body(c, UpdateSchema);\n  return this.svc.update(Param(c, 'id'), body);\n}`,
			},
			{
				name: "@Head(path?)",
				desc: "Registered as GET; Hono handles HEAD requests via fallback.",
				example: `@Head('/ping')\n@Public()\nping() { return null; }`,
			},
			{
				name: "@Options(path?)",
				desc: "Maps method to HTTP OPTIONS.",
				example: `@Options('/cors')\n@Public()\ncors() { return { allow: 'GET,POST' }; }`,
			},
			{
				name: "@All(path?)",
				desc: "Matches all HTTP methods on the given path.",
				example: `@All('/any')\n@Public()\nany(c: Context) { return { method: c.req.method }; }`,
			},
			{
				name: "@Status(code)",
				desc: "Sets the default HTTP status for the response — e.g. 201 for POST, without calling c.json(data, 201). A returned Response still wins.",
				example: `@Post()\n@Status(201)\ncreate(c: Context) {\n  return this.svc.create(Body(c, Schema)); // → 201\n}`,
			},
			{
				name: "@NoContent()",
				desc: "Returns 204 with an empty body regardless of the handler return value.",
				example: `@Delete('/:id')\n@NoContent()\nremove(c: Context) {\n  this.svc.delete(Param(c, 'id'));\n  // → 204, empty body\n}`,
			},
			{
				name: "@Header(name, value)",
				desc: "Sets a static response header. Repeatable — multiple @Header decorators merge. Bypassed by a raw new Response() return.",
				example: `@Get('/feed')\n@Header('Cache-Control', 'public, max-age=60')\n@Header('X-Source', 'hono-forge')\nfeed() { return this.repo.feed(); }`,
			},
			{
				name: "@CacheControl(opts)",
				desc: "Sets the Cache-Control header — typed options object (maxAge, public/private, noStore, staleWhileRevalidate, immutable) or a raw directive string.",
				example: `@Get('/feed')\n@CacheControl({ public: true, maxAge: 60, staleWhileRevalidate: 30 })\nfeed() { return this.repo.feed(); }\n\n@Get('/private') @CacheControl('private, no-store')\nmine() { /* ... */ }`,
			},
			{
				name: "@ETag(opts?)",
				desc: 'Emits an ETag computed from the JSON body (SHA-256, truncated). Weak W/"…" by default; { weak: false } for strong. Matching If-None-Match short-circuits to 304.',
				example: `@Get('/article/:id') @ETag()\narticle(c: Context) {\n  return this.repo.find(Param(c, 'id'));\n}\n// If-None-Match: W/"abc…" → 304 Not Modified`,
			},
			{
				name: "@Redirect(location, status?)",
				desc: "Always redirects — the handler is never invoked. Status defaults to 302 (301/302/303/307/308).",
				example: `@Get('/old-users')\n@Redirect('/users', 301)\noldUsers() { /* never runs */ }`,
			},
		],
	},
	{
		id: "modules",
		label: "modules & bootstrap",
		desc: "Compose controllers and providers into modules, then build the app in one call — or bootstrap everything (health, docs, metrics, shutdown) with createApp.",
		items: [
			{
				name: "@Module({ controllers, providers, imports })",
				desc: "Groups controllers and providers into a composable unit. imports are traversed recursively and deduplicated. Modules organize wiring — they do not create isolated DI scopes.",
				example: `@Module({\n  controllers: [UserController],\n  providers: [UserService, UserRepo],\n  imports: [SharedModule],\n})\nclass UserModule {}`,
			},
			{
				name: "HonoRouteBuilder.buildModule(module)",
				desc: "Builds routes from a @Module class. providers are resolved eagerly so missing DI tokens fail at boot, not at request time.",
				example: `const app = new Hono();\napp.route('/', HonoRouteBuilder.buildModule(AppModule));\n// equivalent to building each controller in the module`,
			},
			{
				name: "HonoRouteBuilder.build(ctrl, platform?, opts?)",
				desc: "Builds a single controller into a Hono sub-app. Filter by platform, or { excludePrivate: true } to skip @Private routes.",
				example: `app.route('/', HonoRouteBuilder.build(UserController));\n\n// platform filter\napp.route('/', HonoRouteBuilder.build(Ctrl, 'web'));\n\n// exclude internal routes on the public instance\nHonoRouteBuilder.build(Ctrl, undefined, { excludePrivate: true });`,
			},
			{
				name: "createApp(module, opts?)",
				desc: "One-call bootstrap: buildModule + optional /health probes + /docs OpenAPI + /metrics + CORS + printRoutes + gracefulShutdown. Every option optional.",
				example: `const app = createApp(AppModule, {\n  health: { probes: true, checks: { db: () => db.ping() } },\n  metrics: true,\n  openapi: { info: { title: 'My API', version: '1.0.0' } },\n  cors: true,\n  printRoutes: true,\n  shutdown: { timeoutMs: 10_000 },\n});\nexport default app;`,
			},
			{
				name: "HonoRouteBuilder.describe(target)",
				desc: "Returns route metadata (method, path, guards, middlewares, cache, rateLimit, sse, websocket, isPublic, isPrivate) for a controller or module — without instantiating anything.",
				example: `const routes = HonoRouteBuilder.describe(AppModule);\n// [{ method: 'GET', path: '/users/:id', guards: [...] }]`,
			},
			{
				name: "HonoRouteBuilder.printRoutes(target)",
				desc: "Prints a route table of every route — method, path, handler, guards, flags. Pure metadata read; great during dev startup.",
				example: `HonoRouteBuilder.printRoutes(AppModule);\n// ┌────────┬──────────────┬─────────┬────────┐\n// │ method │ path         │ handler │ guards │\n// └────────┴──────────────┴─────────┴────────┘`,
			},
			{
				name: "HonoRouteBuilder.moduleControllers(module)",
				desc: "Returns every controller class reachable from a @Module (imports traversed, deduplicated). Useful for OpenAPI / client codegen.",
				example: `const ctrls = HonoRouteBuilder.moduleControllers(AppModule);\nOpenAPIGenerator.generate(ctrls, { info: {...} });`,
			},
			{
				name: "discoverControllers(glob)",
				desc: "Bun-only runtime filesystem scan — imports matching files and returns every @Controller class found.",
				example: `// Bun runtime\nconst controllers = await discoverControllers('./src/controllers/**/*.ts');\nfor (const ctrl of controllers) {\n  app.route('/', HonoRouteBuilder.build(ctrl));\n}`,
			},
			{
				name: "fromModules(modules)",
				desc: "Bundler-friendly discovery — pass the result of import.meta.glob({ eager: true }) and get every @Controller class back. Other exports are ignored.",
				example: `const modules = import.meta.glob('./controllers/**/*.ts', { eager: true });\nconst controllers = fromModules(modules);\nfor (const ctrl of controllers) {\n  app.route('/', HonoRouteBuilder.build(ctrl));\n}`,
			},
		],
	},
	{
		id: "di",
		label: "dependency injection",
		desc: "A small DI container: classes declare deps via @Injectable tokens, scopes control lifetime, and lifecycle hooks run at boot and shutdown.",
		items: [
			{
				name: "@Injectable(tokens?)",
				desc: "Registers a class in the DI container. Pass explicit dependency tokens — array index maps to constructor parameter position. Symbol/string tokens work for external objects.",
				example: `@Injectable()           // no deps\nclass EmailService { send(to: string) {} }\n\n@Injectable([EmailService])  // with deps\nclass UserService {\n  constructor(private email: EmailService) {}\n}\n\n// Symbol token\nconst DB = Symbol('db');\ncontainer.registerInstance(DB, drizzle(client));\n\n@Injectable([DB])\nclass UserRepo {\n  constructor(private db: AppDb) {}\n}`,
			},
			{
				name: "@Singleton()",
				desc: "Returns the same instance on every resolve().",
				example: `@Injectable()\n@Singleton()\nclass Database {\n  readonly conn = createConnection();\n}\n// container.resolve(Database) always returns the same instance`,
			},
			{
				name: "@RequestScoped()",
				desc: "Fresh instance per request, destroyed automatically when the request ends. Shared within the same request. Injecting one into a singleton wires a lazy proxy resolved per request.",
				example: `@Injectable()\n@RequestScoped()\nclass RequestContext implements OnDestroy {\n  readonly requestId = crypto.randomUUID();\n  onDestroy() { console.log('request done', this.requestId); }\n}`,
			},
			{
				name: "@Stateless()",
				desc: "No-op marker for @Singleton classes that hold no mutable per-request state — documents intent and can be enforced by tooling.",
				example: `@Injectable()\n@Singleton()\n@Stateless()\nclass UserRepo {\n  findAll() { return db.select().from(users); }\n}`,
			},
			{
				name: "OnInit / OnDestroy",
				desc: "Interfaces for lifecycle hooks — onInit runs when the provider is resolved/booted, onDestroy on container.shutdown() in reverse registration order.",
				example: `@Injectable()\n@Singleton()\nclass RedisClient implements OnInit, OnDestroy {\n  private client!: Redis;\n  async onInit() {\n    this.client = new Redis(process.env.REDIS_URL!);\n    await this.client.ping();\n  }\n  async onDestroy() {\n    await this.client.quit();\n  }\n}`,
			},
			{
				name: "@OnBootstrap()",
				desc: "Method-level startup hook — runs once after buildModule() mounts every route and boots singletons. Sequential and awaited; @RequestScoped classes are rejected (doctor flags it too).",
				example: `@Injectable()\n@Singleton()\nclass SeedService {\n  @OnBootstrap()\n  async seed() {\n    // routes are already mounted here\n    if (await db.users.count() === 0) await db.users.insert(admin);\n  }\n}`,
			},
			{
				name: "container.registerInstance(token, value)",
				desc: "Registers a pre-built external object (Drizzle, Prisma, Redis, etc.) under a symbol token. Recommended name for external deps.",
				example: `import { drizzle } from 'drizzle-orm/postgres-js';\nimport postgres from 'postgres';\n\nexport const DB = Symbol('db');\nconst client = postgres(process.env.DATABASE_URL!);\ncontainer.registerInstance(DB, drizzle(client));\n\n@Injectable([DB])\nclass UserRepo {\n  constructor(private db: AppDb) {}\n}`,
			},
			{
				name: "container.registerSingleton / registerFactory",
				desc: "Manual registration — bind a class token to an instance, or a factory invoked per resolve.",
				example: `container.registerSingleton(Database, new Database(config));\ncontainer.registerFactory(Redis, () => new Redis(process.env.REDIS_URL));`,
			},
			{
				name: "container.boot()",
				desc: "Calls onInit() on all registered singletons that implement OnInit. Call once at app startup before starting the server.",
				example: `await container.boot();\nBun.serve({ fetch: app.fetch, port: 3000 });`,
			},
			{
				name: "container.shutdown()",
				desc: "Calls onDestroy() on all singletons in reverse registration order. Call in SIGTERM/SIGINT handler.",
				example: `process.on('SIGTERM', async () => {\n  await container.shutdown(); // closes DB, Redis, etc.\n  process.exit(0);\n});`,
			},
			{
				name: "container.runInScope(fn)",
				desc: "Runs fn in a new request scope. onDestroy is called on all scoped instances in the finally block.",
				example: `const result = await container.runInScope(async () => {\n  const svc = container.resolve(RequestScopedService);\n  return svc.doWork();\n});`,
			},
			{
				name: "container.describe() / printGraph()",
				desc: "Introspects the dependency graph without resolving — scope, deps, registration kind, missing deps. printGraph renders a human-readable table.",
				example: `container.describe([\n  ...HonoRouteBuilder.moduleProviders(AppModule),\n  ...HonoRouteBuilder.moduleControllers(AppModule),\n]);\n\ncontainer.printGraph([...]);\n//   TodoService   [singleton] → TodoRepo\n//   ⚠ missing: 'Mailer' is not in providers`,
			},
			{
				name: "DI error classes",
				desc: "DependencyResolutionError — thrown by resolve() when a token isn't in providers/registrations (note: a concrete class decorated with @Injectable() self-registers and never throws this). CircularDependencyError — thrown when the resolution stack revisits a token mid-construction (A → B → A).",
				example: `import {\n  DependencyResolutionError,\n  CircularDependencyError,\n} from 'hono-forge';\n\ntry {\n  container.resolve(UnregisteredToken);\n} catch (e) {\n  if (e instanceof DependencyResolutionError) { /* … */ }\n}`,
			},
			{
				name: "metadata introspection",
				desc: "Read decorator metadata for plugin/tooling authors — getClassMetadata(class, key) and getMethodMetadata(target, method, key) read values stored under METADATA_KEYS.* symbols; hasDecorator(target, method, key) is a boolean check. Lower-level getClassMeta/getMethodMeta read from a class's Symbol.metadata record directly.",
				example: `import {\n  getClassMetadata,\n  getMethodMetadata,\n  hasDecorator,\n  METADATA_KEYS,\n} from 'hono-forge';\n\nconst guards = getMethodMetadata<GuardMetadata[]>(\n  instance, 'findAll', METADATA_KEYS.GUARDS,\n);\nconst isController =\n  getClassMetadata(ctrl, METADATA_KEYS.CONTROLLER) !== undefined;\nconst cached = hasDecorator(instance, 'getUser', METADATA_KEYS.CACHE);`,
			},
		],
	},
	{
		id: "context",
		label: "context helpers",
		desc: "Typed functions for request data — called inside the handler with c as the first argument. No magic parameter injection; the Hono Context stays the source of truth.",
		items: [
			{
				name: "Body(c, schema?)",
				desc: "Reads + validates request body. With @Validate set, returns the pre-validated value (transforms/defaults applied); pass a schema for ad-hoc validation.",
				example: `@Post()\n@Validate({ body: CreateSchema })\nasync create(c: Context) {\n  const body = await Body<z.infer<typeof CreateSchema>>(c);\n  return this.svc.create(body);\n}`,
			},
			{
				name: "Param(c, name)",
				desc: "Reads a route path parameter by name. Omit name to get all params as raw strings.",
				example: `@Get('/:id')\ngetOne(c: Context) {\n  const id = Param(c, 'id'); // string\n  return this.svc.findById(id);\n}`,
			},
			{
				name: "Params<T>(c)",
				desc: "All route params as an object — the @Validate-parsed typed version when set, raw strings otherwise.",
				example: `@Get('/:id')\n@Validate({ params: z.object({ id: z.string().uuid() }) })\ngetOne(c: Context) {\n  const { id } = Params<{ id: string }>(c); // typed\n  return this.svc.findById(id);\n}`,
			},
			{
				name: "Query(c, schema?)",
				desc: "Reads query params. With @Validate set, returns the pre-validated object; pass a Zod schema for ad-hoc validation and coercion.",
				example: `const FilterSchema = z.object({\n  search: z.string().optional(),\n  limit: z.coerce.number().default(20),\n});\n\n@Get()\nasync list(c: Context) {\n  const q = await Query(c, FilterSchema);\n  return this.svc.getAll(q);\n}`,
			},
			{
				name: "Headers(c, name?)",
				desc: "Reads a request header. Omit name to get all headers as an object.",
				example: `@Get()\ncheck(c: Context) {\n  const token = Headers(c, 'authorization'); // string | undefined\n  const all   = Headers(c);                 // Record<string, string>\n}`,
			},
			{
				name: "User<T>(c)",
				desc: "Returns the authenticated user object set on the context by the guard or @JwtAuth — shorthand for c.get('user').",
				example: `@Get('/profile')\n@RequireAuth()\nprofile(c: Context) {\n  const user = User<{ id: string; email: string }>(c);\n  return { email: user.email };\n}`,
			},
			{
				name: "Req(c)",
				desc: "Returns the Hono HonoRequest object.",
				example: `@Get()\ninfo(c: Context) {\n  const req = Req(c);\n  return { method: req.method, url: req.url };\n}`,
			},
			{
				name: "Ctx(c)",
				desc: "Returns the full Hono Context c — for redirect, set-cookie, etc. (Res() is a deprecated alias — use Ctx.)",
				example: `@Get('/redirect')\nredirect(c: Context) {\n  return Ctx(c).redirect('/new-path', 301);\n}`,
			},
			{
				name: "Ip(c)",
				desc: "Returns the real client IP — CF-Connecting-IP → X-Real-IP → X-Forwarded-For → 'unknown'. Proxy headers are trusted unconditionally.",
				example: `@Get('/info')\ninfo(c: Context) {\n  return { ip: Ip(c) }; // '203.0.113.1'\n}`,
			},
			{
				name: "Device(c)",
				desc: "Returns detected device type: 'mobile' | 'tablet' | 'desktop' | 'bot'.",
				example: `@Get('/page')\npage(c: Context) {\n  const device = Device(c);\n  return device === 'mobile' ? mobileView() : desktopView();\n}`,
			},
			{
				name: "UserAgent(c)",
				desc: "Returns the raw User-Agent header string.",
				example: `@Get('/ua')\nua(c: Context) {\n  return { ua: UserAgent(c) };\n}`,
			},
			{
				name: "Cookie(c, name)",
				desc: "Returns a single cookie value by name.",
				example: `@Get('/session')\n@RequireAuth()\nsession(c: Context) {\n  const token = Cookie(c, 'session'); // string | undefined\n  return { valid: !!token };\n}`,
			},
			{
				name: "Cookies(c)",
				desc: "Returns all cookies as Record<string, string>.",
				example: `@Get('/debug/cookies')\n@Private()\ndebugCookies(c: Context) {\n  return Cookies(c); // { session: '...', theme: 'dark' }\n}`,
			},
			{
				name: "SetCookie(c, name, value, opts?)",
				desc: "Sets a cookie — options match Hono setCookie: httpOnly, sameSite, maxAge, secure, path, domain.",
				example: `@Post('/login')\nlogin(c: Context) {\n  SetCookie(c, 'session', token, {\n    httpOnly: true, sameSite: 'Strict', maxAge: 86400,\n  });\n  return { ok: true };\n}`,
			},
			{
				name: "DeleteCookie(c, name, opts?)",
				desc: "Deletes a cookie by name.",
				example: `@Post('/logout')\nlogout(c: Context) {\n  DeleteCookie(c, 'session');\n  return { ok: true };\n}`,
			},
			{
				name: "UploadedFile(c, field)",
				desc: "Returns a single File from multipart form data by field name. Returns File | null.",
				example: `@Post('/avatar')\nasync upload(c: Context) {\n  const file = await UploadedFile(c, 'avatar');\n  if (!file) return c.json({ error: 'no file' }, 400);\n  return { name: file.name, size: file.size };\n}`,
			},
			{
				name: "UploadedFiles(c, field?)",
				desc: "Returns all File objects for a field. Omit field to collect every file in the form.",
				example: `@Post('/gallery')\nasync gallery(c: Context) {\n  const files = await UploadedFiles(c, 'photos');\n  return files.map(f => ({ name: f.name, size: f.size }));\n}`,
			},
			{
				name: "FormBody(c)",
				desc: "Returns the raw FormData object.",
				example: `@Post('/submit')\nasync submit(c: Context) {\n  const form = await FormBody(c);\n  const name = form.get('name') as string;\n  return { name };\n}`,
			},
			{
				name: "ValidatedBody / ValidatedQuery",
				desc: "Aliases for Body(c, schema) and Query(c, schema) — same behaviour, emphasises validation intent.",
				example: `const data = await ValidatedBody(c, CreateSchema);\nconst q    = await ValidatedQuery(c, FilterSchema);`,
			},
			{
				name: "ValidatedParam(c, name, schema)",
				desc: "Reads a route param and validates it through a Zod schema. Invalid input throws ZodError → 400 VALIDATION_ERROR.",
				example: `@Get('/:id')\nasync getOne(c: Context) {\n  const id = await ValidatedParam(c, 'id', z.string().uuid());\n  return this.svc.findById(id);\n}`,
			},
			{
				name: "getContext()",
				desc: "Returns the active Hono Context from anywhere in the request call chain — services, repos — without prop drilling. undefined outside a request.",
				example: `import { getContext } from 'hono-forge';\n\n@Injectable()\nclass AuditService {\n  who() {\n    const c = getContext();\n    return c?.get('user'); // no need to pass c around\n  }\n}`,
			},
			{
				name: "getRequestContext()",
				desc: "Returns the full request scope context ({ traceId, hono, memoCache, diScope }) — the lower-level API behind getContext(). runInRequestContext(ctx, fn) runs code inside a context; createRequestContext(traceId, hono?) builds one — HonoRouteBuilder calls these once per request, so you only need them when invoking handlers outside the route builder.",
				example: `const ctx = getRequestContext();\nif (ctx) {\n  ctx.memoCache.set('flags', flags); // request-scoped cache\n}\n\n// run a handler outside the route builder (e.g. WS callback):\nrunInRequestContext(\n  createRequestContext(getTraceId() ?? crypto.randomUUID(), c),\n  () => handler(c),\n);`,
			},
			{
				name: "extractIp / detectDevice / extractUserAgent / extractRequestContext",
				desc: "The raw extractor utilities behind Ip/Device/UserAgent — usable outside handlers (middleware, loggers). extractIp honors CF-Connecting-IP → X-Real-IP → X-Forwarded-For; detectDevice classifies a UA string into 'mobile' | 'tablet' | 'desktop' | 'bot'; extractRequestContext(c) returns all three in one call ({ ip, device, userAgent }).",
				example: `const log = requestLogger((entry) => sink.write(entry));\n\n// inside custom middleware:\nconst { ip, device, userAgent } = extractRequestContext(c);\n// or individually:\nconst ip  = extractIp(c);\nconst dev = detectDevice(c.req.header('user-agent') ?? '');`,
			},
		],
	},
	{
		id: "validation",
		label: "validation & serialization",
		desc: "One Zod schema drives request validation AND the generated OpenAPI spec — docs can't drift from validation.",
		items: [
			{
				name: "@Validate({ body?, query?, params? })",
				desc: "Validates body/query/params before the handler runs — invalid input returns 400 VALIDATION_ERROR with Zod issues. The same schemas are emitted into the OpenAPI spec, so no @ApiBody duplication.",
				example: `@Post()\n@Validate({ body: CreateUserSchema })\nasync create(c: Context) {\n  const body = await Body<z.infer<typeof CreateUserSchema>>(c);\n  // already validated — defaults/transforms applied\n  return this.svc.create(body);\n}\n\n@Get('/:id')\n@Validate({\n  params: z.object({ id: z.string().uuid() }),\n  query:  z.object({ verbose: z.coerce.boolean().default(false) }),\n})\nasync getOne(c: Context) { /* ... */ }`,
			},
			{
				name: "@ValidateResult(schema)",
				desc: "Validates the return value against a Zod schema. Throws ZodError if the result doesn't match — enforce response contracts at service boundaries.",
				example: `const UserSchema = z.object({ id: z.string(), email: z.string().email() });\n\n@ValidateResult(UserSchema)\nasync getUser(id: string) {\n  return this.repo.findById(id); // throws if shape is wrong\n}`,
			},
			{
				name: "@Serialize(schema)",
				desc: "Runs the handler's return through a Zod schema before sending — strip sensitive fields with .omit()/.pick() or coerce output shape. Validation errors become 400.",
				example: `const UserView = z.object({ id: z.string(), name: z.string() });\n\n@Get('/me')\n@Serialize(UserView)\ngetUser() {\n  return { id: '1', name: 'Ada', passwordHash: '...' };\n  // response contains only { id, name }\n}`,
			},
			{
				name: "@Transform(fn)",
				desc: "Applies a transform function to the return value before sending.",
				example: `@Transform((user: User) => ({\n  id: user.id,\n  name: user.name,\n  // strips sensitive fields like password\n}))\nasync getUser(c: Context) {\n  return this.repo.findById(Param(c, 'id'));\n}`,
			},
			{
				name: "defineSchemas(select, insert, opts?)",
				desc: "Generates a consistent { select, insert, update } schema set from any two Zod schemas — works with drizzle-zod, zod-prisma, or hand-written schemas. update defaults to insert.partial().",
				example: `import { createSelectSchema, createInsertSchema } from 'drizzle-zod';\n\nexport const UserSchemas = defineSchemas(\n  createSelectSchema(users),  // full row\n  createInsertSchema(users),  // insert fields\n);\n// .select → GET responses\n// .insert → POST body\n// .update → PATCH body (all optional)\n\n// custom update rules:\ndefineSchemas(select, insert, {\n  update: insert.omit({ email: true }).partial(),\n});`,
			},
		],
	},
	{
		id: "auth",
		label: "auth & guards",
		desc: "Guard decorators attach named guards to a route; your guardExecutor (configured once) decides what each guard enforces. build() throws at startup if guarded routes have no executor.",
		items: [
			{
				name: "guardExecutor config",
				desc: 'The pluggable auth hook — configure once via HonoRouteBuilder.configure. Throw HttpException for precise status codes; "Unauthorized" in message → 401, "Forbidden" → 403, return false → 403.',
				example: `HonoRouteBuilder.configure({\n  guardExecutor: async (c, guards) => {\n    for (const guard of guards) {\n      if (guard.name === 'AuthGuard') {\n        const token = c.req.header('authorization')?.split(' ')[1];\n        if (!token) throw HttpException.unauthorized('No token');\n        c.set('user', verifyJwt(token));\n      }\n      if (guard.name === 'RoleGuard') {\n        const user = c.get('user') as { roles: string[] };\n        const ok = guard.options?.roles?.some(r => user.roles.includes(r));\n        if (!ok) throw HttpException.forbidden('Insufficient role');\n      }\n    }\n    return true;\n  },\n});`,
			},
			{
				name: "@RequireAuth()",
				desc: "Attaches AuthGuard — your guardExecutor validates the token and sets the user via c.set('user'). Read it back with User(c).",
				example: `@Get('/me')\n@RequireAuth()\nasync me(c: Context) {\n  const user = User<MyUser>(c);\n  return { id: user.id, email: user.email };\n}`,
			},
			{
				name: "@RequireRole(...roles)",
				desc: "Requires user to have ONE of the specified roles.",
				example: `@Delete('/users/:id')\n@RequireRole('admin', 'moderator')\nremove(c: Context) {\n  return this.svc.delete(Param(c, 'id'));\n}`,
			},
			{
				name: "@RequireAllRoles(...roles)",
				desc: "Requires user to have ALL specified roles.",
				example: `@Post('/promote')\n@RequireAllRoles('admin', 'superuser')\npromote(c: Context) { /* ... */ }`,
			},
			{
				name: "@RequirePermission(...perms)",
				desc: "Requires ALL listed permissions.",
				example: `@Post('/publish')\n@RequirePermission('posts:write', 'posts:publish')\npublish(c: Context) { /* ... */ }`,
			},
			{
				name: "@RequireAnyPermission(...perms)",
				desc: "Requires at least ONE of the listed permissions.",
				example: `@Get('/reports')\n@RequireAnyPermission('reports:read', 'admin:all')\nreports(c: Context) { /* ... */ }`,
			},
			{
				name: "@Public()",
				desc: "Marks route as public, bypassing all auth guards.",
				example: `@Get('/health')\n@Public()\nhealth() { return { status: 'ok' }; }`,
			},
			{
				name: "@Private()",
				desc: "Marks route as internal-only — still registered, but excluded when build() is called with { excludePrivate: true }.",
				example: `@Get('/internal/metrics')\n@Private()\nmetrics() { return process.memoryUsage(); }\n\n// Exclude on public app:\nHonoRouteBuilder.build(Ctrl, undefined, { excludePrivate: true });`,
			},
			{
				name: "@JwtAuth(opts)",
				desc: "Turnkey JWT auth — verifies the Bearer token with hono/jwt (HS256 default; alg, cookie options available) and stores the payload for User(c). Reflected in OpenAPI as bearerAuth + 401/403 responses, and the flow generator detects it the same way — protected routes get Authorization: Bearer {{token}} (or ?token={{token}} on generated WS nodes). Invalid/missing token → 401.",
				example: `@Controller('/api')\nclass MeController {\n  @Get('/me')\n  @JwtAuth({ secret: process.env.JWT_SECRET! })\n  me(c: Context) {\n    return User(c); // decoded JWT payload\n  }\n}`,
			},
			{
				name: "@UseGuards(...guards)",
				desc: "Attaches custom guard classes by constructor — the executor receives them like built-in guards.",
				example: `@Get('/billing')\n@UseGuards(SubscriptionGuard)\nusage(c: Context) { /* ... */ }`,
			},
		],
	},
	{
		id: "middleware",
		label: "middleware",
		desc: "Attach any Hono middleware at class level (every route) or method level (one route). Built-in decorators wrap Hono's own middleware.",
		items: [
			{
				name: "execution order",
				desc: "The request pipeline runs class-level @Middleware first, then method-level, then rate limiting (@RateLimit/@Concurrency), guards (@JwtAuth/@RequireRole/…), and validation (@Validate). @Idempotent wraps the handler — replay/dedupe happens around execution. @Throttle sits inside the method body (it throws when the handler is invoked too soon). On the way out, handler output passes @Serialize/@Transform, then interceptors, then the response.",
				example: `// request → class @Middleware → method @Middleware\n//        → @RateLimit / @Concurrency → guards → @Validate\n//        → @Idempotent (wraps) → handler\n//        → @Serialize / @Transform → interceptors → response\n\n// so a method-level middleware still runs BEFORE @JwtAuth —\n// put auth at class level, or verify inside the middleware itself`,
			},
			{
				name: "@Middleware(...fns)",
				desc: "Attaches Hono middleware at class level (all routes) or method level (one route). Multiple middleware run in order.",
				example: `const logMw = async (c: Context, next: Next) => {\n  console.log(c.req.method, c.req.path);\n  await next();\n};\n\n@Controller('/api')\n@Middleware(logMw)          // class-level\nclass ApiController {\n  @Get()\n  @Middleware(tracingMw)    // method-level\n  list() { /* ... */ }\n}`,
			},
			{
				name: "@Use(...fns)",
				desc: "Alias for @Middleware — familiar for NestJS/Express users.",
				example: `@Get()\n@Use(authMw, auditMw)\nlist() { return this.svc.getAll(); }`,
			},
			{
				name: "MiddlewareClass",
				desc: "Interface for reusable stateful middleware — implement use(c, next) and pass the class to @Use/@Middleware.",
				example: `class AuthMiddleware implements MiddlewareClass {\n  async use(c: Context, next: Next) {\n    if (!c.req.header('authorization'))\n      return c.json({ error: 'Unauthorized' }, 401);\n    await next();\n  }\n}\n\n@Controller('/admin')\n@Use(AuthMiddleware)\nclass AdminController { /* ... */ }`,
			},
			{
				name: "@Cors(opts?)",
				desc: "Applies CORS headers. Options match hono/cors — origin, allowMethods, maxAge, etc. Class or method level.",
				example: `@Controller('/api')\n@Cors({ origin: 'https://example.com' })\nclass ApiController { /* ... */ }\n\n@Get('/public')\n@Cors({ origin: '*' })\nlist() { /* ... */ }`,
			},
			{
				name: "@Compress(opts?)",
				desc: "Applies gzip/deflate response compression. Works at class or method level.",
				example: `@Controller('/api')\n@Compress()\nclass ApiController { /* ... */ }`,
			},
			{
				name: "@SecureHeaders(opts?)",
				desc: "Adds security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.",
				example: `@Controller('/api')\n@SecureHeaders()\nclass ApiController { /* ... */ }`,
			},
			{
				name: "@PrettyJson(opts?)",
				desc: "Pretty-prints JSON responses when ?pretty query param is present.",
				example: `@Controller('/debug')\n@PrettyJson()\nclass DebugController { /* ... */ }\n// GET /debug?pretty → formatted JSON`,
			},
		],
	},
	{
		id: "interceptors",
		label: "interceptors & caching",
		desc: "Wrap handler execution — transform the result, cache responses, measure metrics, or run inside a transaction.",
		items: [
			{
				name: "@Cache(opts)",
				desc: "Caches the handler return value in the configured CacheAdapter — in-memory by default, swappable for Redis/Postgres. Keyed by key (default: method name) + request path + query. ttl (ms) required; adapter picks a named cacheAdapters entry. Cached hits skip the handler entirely.",
				example: `@Get('/config')\n@Cache({ ttl: 60_000, key: 'app-config' })\nasync getConfig() {\n  return this.repo.getConfig(); // runs once per ttl\n}`,
			},
			{
				name: "@CacheInvalidate(...patterns)",
				desc: "Deletes cache entries whose key starts with each pattern after the handler succeeds.",
				example: `@Put('/config')\n@CacheInvalidate('app-config')\nasync updateConfig(c: Context) {\n  return this.repo.setConfig(await Body(c, Schema));\n}`,
			},
			{
				name: "cacheAdapter config",
				desc: "Swap the in-memory cache (InMemoryCacheAdapter, also exposed as defaultCacheAdapter) for a durable backend — ship RedisCacheAdapter (ioredis-shaped client) or PostgresCacheAdapter (driver-free sql fn + one table, strongest for @Idempotent). Named cacheAdapters enable per-decorator picks: @Cache({ adapter: 'redis' }) vs @Idempotent({ adapter: 'pg' }).",
				example: `HonoRouteBuilder.configure({\n  cacheAdapter: new RedisCacheAdapter(redis),\n  cacheAdapters: {\n    redis: new RedisCacheAdapter(redis),\n    pg: new PostgresCacheAdapter(\n      (sql, params) => pool.query(sql, params),\n    ),\n  },\n});\n// @Cache({ adapter: 'redis' })   @Idempotent({ adapter: 'pg' })`,
			},
			{
				name: "@Memoize(opts?)",
				desc: "Caches the return value in memory keyed by serialized arguments. scope: 'global' (default, shared across requests) or 'request' (isolated per request, via the request context). Optional ttl. Calling a request-scoped @Memoize method outside a request falls back to the global cache — wrap the call in runWithMemoScope(fn) to give it a scope.",
				example: `// Global cache — same result for all requests\n@Memoize({ ttl: 60_000 })\nasync getFeatureFlags() {\n  return this.db.getFlags();\n}\n\n// Request-scoped — isolated per request\n@Memoize({ scope: 'request' })\nasync getCurrentUser(id: string) {\n  return this.db.findUser(id);\n}`,
			},
			{
				name: "@TrackMetrics(opts)",
				desc: "Records method duration into the shared Prometheus registry as hono_forge_method_duration_seconds{method,status}. Options: name.",
				example: `@TrackMetrics({ name: 'user.create' })\nasync create(data: CreateDto) {\n  return this.repo.insert(data);\n}`,
			},
			{
				name: "@Audit(opts)",
				desc: "Logs an audit entry (action, userId, timestamp, method name) through the registered LOGGER before the method runs — falls back to ConsoleLogger. Options: action.",
				example: `@Audit({ action: 'user.delete' })\nasync remove(id: string) {\n  return this.repo.delete(id);\n}`,
			},
			{
				name: "@Transaction(exec?)",
				desc: "Wraps the method in this.db.transaction() — Drizzle/Knex/TypeORM compatible by default. Pass a custom TransactionExecutor for Prisma or Kysely. The tx propagates via AsyncLocalStorage: nested repos call useTransaction() to join it.",
				example: `// Drizzle / Knex — default executor\n@Transaction()\nasync transfer(from: string, to: string, amount: number) {\n  await this.repo.debit(from, amount);\n  await this.repo.credit(to, amount);\n}\n\n// Prisma — custom executor\n@Transaction((db: PrismaClient, run) => db.$transaction(run))\nasync onboard(data: NewUser) { /* ... */ }\n\n// in any nested repo — joins the active tx:\nconst tx = useTransaction<DrizzleDb>() ?? this.db;`,
			},
		],
	},
	{
		id: "resilience",
		label: "rate limiting & resilience",
		desc: "Protect routes and services: per-route rate limits, request dedup, bulkheads, retries, timeouts, and circuit breakers.",
		items: [
			{
				name: "@RateLimit(opts)",
				desc: "Rate-limits the route — built-in in-memory fixed-window limiter works out of the box, keyed by client IP (or keyGenerator). Emits X-RateLimit-Limit/Remaining/Reset headers; exceeding max returns 429 + Retry-After. Options: max, windowMs, message, keyGenerator.",
				example: `@Post('/login')\n@RateLimit({ max: 5, windowMs: 60_000, message: 'Too many attempts' })\nasync login(c: Context) {\n  const body = await Body(c, LoginSchema);\n  return this.authSvc.login(body);\n}`,
			},
			{
				name: "redisRateLimiter(client)",
				desc: "Distributed @RateLimit via Redis (INCR + PEXPIRE fixed window) — inMemoryRateLimiter is the default factory and is per-process, so multi-instance deploys need this. Client is injected (ioredis-compatible, or anything exposing incr/pexpire/pttl). Factories receive RateLimiterFactoryOptions: { max, windowMs, keyPrefix, keyGenerator?, message? }.",
				example: `import Redis from 'ioredis';\nimport { redisRateLimiter } from 'hono-forge';\n\nHonoRouteBuilder.configure({\n  rateLimiterFactory: redisRateLimiter(new Redis()),\n});\n\n// or roll your own factory:\nrateLimiterFactory: ({ max, windowMs, keyPrefix }) => middleware`,
			},
			{
				name: "@Throttle(ms)",
				desc: "Prevents the method from being called more than once per ms window. Throws HttpException 429 (with retryAfterMs in meta + Retry-After header). Keyed on the instance — on a singleton it applies globally across all users.",
				example: `@Throttle(10_000) // max once per 10s per instance\nasync generateReport() {\n  return this.reportSvc.generate();\n}`,
			},
			{
				name: "@Concurrency(n)",
				desc: "Per-route bulkhead — caps simultaneous executions; extra requests get a fast 503 instead of queueing unbounded work. Slots release in finally — exceptions never leak capacity.",
				example: `@Get('/export')\n@Concurrency(4)\nasync exportAll() {\n  // 5th concurrent caller → 503 until a slot frees\n  return buildHugeCsv();\n}`,
			},
			{
				name: "@Idempotent(opts?)",
				desc: "Replays the stored response when a client retries with the same Idempotency-Key header — including concurrent duplicates (handler runs once). Same key + different request body → 409 Conflict (Stripe-style body-hash check, on by default — hash: false to opt out). scope namespaces keys per tenant/user. Only successful responses are stored; ttl defaults to 24h. Uses the configured CacheAdapter — default in-memory does NOT survive restarts; use adapter: 'name' with a named cacheAdapters entry (e.g. PostgresCacheAdapter) in production.",
				example: `@Post('/orders')\n@Idempotent({\n  scope: (c) => User(c)?.tenantId ?? 'anon', // per-tenant namespace\n  ttl: 60_000,\n})\nasync createOrder(c: Context) {\n  // client sends: Idempotency-Key: order-req-123\n  // retry same key + same body → same response, no double charge\n  // retry same key + different body → 409 Conflict\n  return this.svc.charge(await Body(c, OrderSchema));\n}`,
			},
			{
				name: "@SingleFlight()",
				desc: "Coalesces concurrent identical requests (same method+path+query) — the handler executes once and every caller gets a copy of that response. For client-driven retries on mutations, use @Idempotent instead.",
				example: `@Get('/expensive-report')\n@SingleFlight()\nasync report() {\n  // 100 concurrent callers → 1 execution\n  return this.svc.heavyReport();\n}`,
			},
			{
				name: "@Retry(opts)",
				desc: "Retries the method on failure. Options: attempts, delay, backoff (linear | exponential).",
				example: `@Retry({ attempts: 3, delay: 500, backoff: 'exponential' })\nasync fetchExternalData() {\n  return await fetch('https://api.example.com/data');\n}`,
			},
			{
				name: "@Timeout(ms)",
				desc: "Throws HttpException 504 GATEWAY_TIMEOUT if the method takes longer than ms milliseconds — also documented in the generated OpenAPI spec.",
				example: `@Timeout(5000)\nasync slowOperation() {\n  return await db.heavyQuery(); // → 504 if > 5s\n}`,
			},
			{
				name: "@CircuitBreaker(opts)",
				desc: "Stops calling a failing method after failureThreshold consecutive errors — fast-fails with CircuitOpenError (503) until resetAfterMs passes, then probes with a half-open call. State is per instance+method.",
				example: `@Injectable()\nclass PaymentGateway {\n  @CircuitBreaker({ failureThreshold: 5, resetAfterMs: 30_000 })\n  async charge(amount: number) {\n    return this.http.post('/charge', { amount });\n  }\n}`,
			},
		],
	},
	{
		id: "errors",
		label: "error handling",
		desc: "Structured errors: HttpException factories, per-type exception filters through the DI container, an onError hook, and an opt-in RFC 9457 problem+json format.",
		items: [
			{
				name: "HttpException",
				desc: "Structured HTTP error with status, code, message, and optional meta payload — auto-handled by the route builder. Factories: badRequest 400, unauthorized 401, forbidden 403, notFound 404, conflict 409, unprocessable 422, tooManyRequests 429, internal 500, serviceUnavailable 503.",
				example: `// Throw from handler or service — auto-formatted:\nthrow HttpException.notFound('User not found');\n// → 404 { "status": "error", "error": { "code": "NOT_FOUND", ... } }\n\n// With meta payload:\nthrow HttpException.unprocessable('Validation failed', {\n  fields: ['email', 'name']\n});`,
			},
			{
				name: "@Catch(...errorTypes)",
				desc: "Marks a class as an exception filter — no args = catch-all. The class implements catch(err, c) and is resolved through the DI container, so it can inject services.",
				example: `@Catch(PrismaClientKnownError)\n@Injectable()\nclass DbErrorFilter implements ExceptionFilter {\n  catch(err: unknown, c: Context) {\n    return c.json({ status: 'error', error: { code: 'DB_ERROR' } }, 500);\n  }\n}`,
			},
			{
				name: "@UseFilters(...filters)",
				desc: "Attaches exception filters at method or class level. Order: method filters → class filters → onError → default HttpException handling. A filter returning void falls through.",
				example: `@Controller('/users')\n@UseFilters(DbErrorFilter)          // class-level\nclass UserController {\n  @Post()\n  @UseFilters(UploadErrorFilter)    // method-level runs first\n  create(c: Context) { /* ... */ }\n}`,
			},
			{
				name: "onError hook",
				desc: "Global hook called for every non-validation error (including HttpException). Return a Response to override; return void to fall through to default handling. ZodError always returns 400 and bypasses this hook.",
				example: `HonoRouteBuilder.configure({\n  onError: async (err, c) => {\n    if (err instanceof HttpException) {\n      await db.insert(errorLogs).values({ code: err.code });\n      // return nothing → default structured JSON still sent\n    } else {\n      return c.json({ error: { code: 'INTERNAL_SERVER_ERROR' } }, 500);\n    }\n  },\n});`,
			},
			{
				name: "errorFormat: 'problem'",
				desc: "Opt-in RFC 9457 application/problem+json error shape instead of the default envelope. Validation failures become a 400 problem with Zod issues under errors; headers set before the throw (e.g. Retry-After) are preserved. problemResponse(c, err, exposeStack) renders the same shape — reuse it inside a custom onError; returns null for non-HttpException/non-Zod errors.",
				example: `HonoRouteBuilder.configure({ errorFormat: 'problem' });\n\n// → 404 application/problem+json\n{\n  "type": "about:blank",\n  "title": "Not Found",\n  "status": 404,\n  "detail": "User 42 not found",\n  "instance": "/users/42",\n  "code": "USER_NOT_FOUND"\n}`,
			},
			{
				name: "exposeStack option",
				desc: "Controls stack trace exposure in HttpException responses. Values: false (default, production-safe) | true | \"development\" (NODE_ENV !== 'production').",
				example: `HonoRouteBuilder.configure({\n  exposeStack: 'development',\n});`,
			},
		],
	},
	{
		id: "realtime",
		label: "real-time: sse, websocket & channels",
		desc: "Server-Sent Events, WebSockets, and a shared pub/sub channel registry — in-memory by default, pluggable to Redis for multi-instance deployments.",
		items: [
			{
				name: "@Sse(path?, opts?)",
				desc: "Registers a GET endpoint for SSE. Handler receives (c: Context, stream: SSEStreamingApi). Pass { keepAliveMs } to send :keepalive comments on an interval — keeps proxies from closing idle streams.",
				example: `@Sse('/feed', { keepAliveMs: 15_000 })\n@Public()\nasync feed(c: Context, stream: SSEStreamingApi) {\n  await stream.writeSSE({ event: 'connected', data: 'ok' });\n  while (!stream.closed) {\n    await stream.sleep(30_000);\n    await stream.writeSSE({ event: 'ping', data: '' });\n  }\n}`,
			},
			{
				name: "@WebSocket(path?)",
				desc: "Registers a WebSocket upgrade endpoint — configure a platform upgrader once (e.g. hono/bun). Handler receives (c: Context) and returns { onOpen, onMessage, onClose }.",
				example: `HonoRouteBuilder.configure({\n  webSocketUpgrader: upgradeWebSocket, // from 'hono/bun'\n});\n\n@WebSocket('/:room')\n@Public()\nchat(c: Context) {\n  const room = Param(c, 'room');\n  return {\n    onOpen: (_e, ws) => console.log('connected to', room),\n    onMessage: (e, ws) => ws.send(\`Echo: \${e.data}\`),\n    onClose: () => console.log('disconnected'),\n  };\n}`,
			},
			{
				name: "@OnWsMessage(event)",
				desc: 'Routes incoming WS frames to a sibling method by event name — JSON envelope { "event", "data" } dispatches to (data, ws, rawEvent). Non-envelope frames and unmatched events fall through to onMessage.',
				example: `@WebSocket('/room') @Public()\nroom() { return { onMessage: (e, ws) => ws.send('unhandled') }; }\n\n@OnWsMessage('join')\nonJoin(data: { user: string }, ws) { /* ... */ }\n\n@OnWsMessage('message')\nonChat(data: { text: string }, ws) { ws.send(data.text); }`,
			},
			{
				name: "@ChannelRoute(channel)",
				desc: "Bridges a pub/sub channel to an @Sse or @WebSocket route — subscribes a client on connect, unsubscribes on disconnect, pushes every published event to the stream/socket. Static string or fn of Context.",
				example: `@Sse('/user/:userId')\n@ChannelRoute((c) => \`user:\${Param(c, 'userId')}\`)\nasync userFeed(c: Context, stream: SSEStreamingApi) {\n  // subscription + hold-open handled automatically\n}\n\nawait channels.publish('user:42', 'order.created', data);`,
			},
			{
				name: "@ChannelAuth(authorize)",
				desc: "Authorizes the resolved channel before the SSE/WS upgrade completes — runs as middleware, receives (c, channel), returns false → 403. Pair with token verification at upgrade (e.g. hono/jwt verify of ?token= or Authorization) for the standard authenticated-channel recipe. Flow generation marks these routes too — generated WS nodes get ?token={{token}} on the connection URL.",
				example: `import { verify } from 'hono/jwt';\n\n// 1. authenticate at upgrade — method middleware\nconst wsAuth = async (c: Context, next: Next) => {\n  const token = c.req.query('token');\n  if (!token) return c.json({ error: 'Unauthorized' }, 401);\n  c.set('user', await verify(token, JWT_SECRET));\n  await next();\n};\n\n// 2. authorize the resolved channel\n@WebSocket('/outlet/:outletId/kds/:station')\n@Middleware(wsAuth)\n@ChannelRoute((c) =>\n  \`outlet:\${Param(c, 'outletId')}:kds:\${Param(c, 'station')}\`)\n@ChannelAuth((c, channel) =>\n  User(c)?.outletIds?.includes(Param(c, 'outletId')) ?? false)\nkds(c: Context) { /* ... */ }`,
			},
			{
				name: "channels.subscribe / unsubscribe / publish",
				desc: "The shared channel registry API — add/remove clients and broadcast event+data payloads to all subscribers of a channel.",
				example: `const client = new SseChannelClient(userId, stream);\nawait channels.subscribe(\`user:\${userId}\`, client);\nstream.onAbort(() =>\n  channels.unsubscribe(\`user:\${userId}\`, userId)\n);\n\n// Push from anywhere — service, cron, webhook handler\nawait channels.publish('user:42', 'order.created', { orderId: 123 });`,
			},
			{
				name: "SseChannelClient / WsChannelClient",
				desc: "Client adapters wrapping an SSE stream or WebSocket so the channel registry can push to them. WsChannelClient takes the ws instance + an id.",
				example: `// WebSocket + channels manually:\nonOpen: (_e, ws) =>\n  channels.subscribe(\`room:\${room}\`, new WsChannelClient(ws.id, ws)),\nonClose: (_e, ws) =>\n  channels.unsubscribe(\`room:\${room}\`, ws.id),`,
			},
			{
				name: "channels.use(adapter)",
				desc: "Swaps the channel adapter at startup — default is InMemoryChannelAdapter. Use RedisChannelAdapter for multi-instance broadcasting.",
				example: `import { RedisChannelAdapter } from 'hono-forge';\nimport Redis from 'ioredis';\n\nchannels.use(new RedisChannelAdapter(\n  new Redis(process.env.REDIS_URL), // pub\n  new Redis(process.env.REDIS_URL), // sub\n));`,
			},
		],
	},
	{
		id: "events",
		label: "events & scheduling",
		desc: "In-process pub/sub between services, plus scheduled jobs — interval timers and a zero-dependency 5-field cron parser.",
		items: [
			{
				name: "@OnEvent(event)",
				desc: 'Subscribes a service method to an in-process event. Repeatable; supports wildcards like "user.*". Listeners resolve through the DI container per emit — keep them singleton/transient, not @RequestScoped.',
				example: `@Injectable()\nclass MailService {\n  @OnEvent('user.created')\n  async welcome(p: { id: string }) {\n    await this.send(p.id);\n  }\n\n  @OnEvent('user.*') // wildcard\n  auditUserEvents(payload: unknown) { /* ... */ }\n}`,
			},
			{
				name: "events.emit(event, data)",
				desc: "Emits an event to all matching @OnEvent listeners. Each listener is isolated — a throwing one is logged via LOGGER, others still run; emit never throws.",
				example: `@Post()\nasync create(c: Context) {\n  const user = await this.svc.create(await Body(c));\n  await events.emit('user.created', { id: user.id });\n  return user;\n}`,
			},
			{
				name: "startEventBus(...targets)",
				desc: "Scans classes or @Module trees for @OnEvent methods and subscribes them. Returns a teardown function — wire it into gracefulShutdown.",
				example: `const stop = startEventBus(AppModule);\n\ngracefulShutdown({\n  onShutdown: async () => { stop(); stopJobs(); },\n});`,
			},
			{
				name: "@Interval(ms, opts?)",
				desc: "Runs a service method every ms milliseconds once startScheduler() activates it. Overlapping ticks are skipped; { immediate: true } runs once at start. Timers are unref'd.",
				example: `@Injectable()\n@Singleton()\nclass Janitor {\n  @Interval(60_000)\n  sweep() { /* cleanup expired tokens */ }\n\n  @Interval(30_000, { immediate: true })\n  warmCache() { /* ... */ }\n}`,
			},
			{
				name: "@Cron(expr, opts?)",
				desc: "Schedules a method on a standard 5-field cron expression (min hour dom mon dow, local time). Supports *, */n, ranges, lists — Vixie OR semantics when dom+dow are both restricted. Invalid expressions are logged and skipped.",
				example: `@Cron('0 2 * * *')         // daily 02:00\nnightlyBackup() { /* ... */ }\n\n@Cron('*/15 9-17 * * 1-5')   // every 15 min, work hours, weekdays\npollFeed() { /* ... */ }`,
			},
			{
				name: "startScheduler(...targets)",
				desc: "Activates all @Interval and @Cron methods on classes or @Module trees. Job errors are logged via LOGGER; the loop never crashes. Returns a teardown.",
				example: `const stopJobs = startScheduler(AppModule);\n\ngracefulShutdown({\n  onShutdown: async () => stopJobs(),\n});`,
			},
			{
				name: "parseCron / nextCronTime",
				desc: "The exported cron primitives — parse an expression once, compute the next fire time.",
				example: `const parsed = parseCron('0 2 * * *');\nconst next = nextCronTime(parsed, new Date());`,
			},
		],
	},
	{
		id: "observability",
		label: "observability & config",
		desc: "Trace IDs on every request, pluggable logging and metrics, and Zod-validated typed config bound to the DI container.",
		items: [
			{
				name: "getTraceId()",
				desc: "Returns the active trace/correlation ID — from the X-Request-ID header or a generated UUID, echoed back on the response. Callable anywhere in the call chain.",
				example: `import { getTraceId } from 'hono-forge';\n\n@Injectable()\nclass AuditService {\n  log(action: string) {\n    console.log({ traceId: getTraceId(), action });\n  }\n}`,
			},
			{
				name: "runWithTraceId(id, fn)",
				desc: "Runs fn within a trace context — for code outside the route builder (cron, workers).",
				example: `await runWithTraceId('cron-job-001', async () => {\n  // getTraceId() returns 'cron-job-001' inside here\n  await myService.runDailyReport();\n});`,
			},
			{
				name: "onRequestStart hook",
				desc: "Called before middleware and guards on every request. Receives { method, path, traceId, ip, userAgent } — use it to start an OpenTelemetry span.",
				example: `HonoRouteBuilder.configure({\n  onRequestStart: ({ method, path, traceId }) => {\n    const span = tracer.startSpan(\`\${method} \${path}\`, {\n      attributes: { traceId },\n    });\n  },\n});`,
			},
			{
				name: "requestLogger hook",
				desc: "Pluggable per-request logger — receives { method, path, ip, device, userAgent, statusCode, durationMs, userId? } after each response.",
				example: `HonoRouteBuilder.configure({\n  requestLogger: (entry) => {\n    console.log(JSON.stringify(entry));\n  },\n});`,
			},
			{
				name: "registerLogger(logger) / LOGGER",
				desc: "Binds a pino/winston-compatible logger ({ info(data, msg?) }) to the LOGGER DI token — used by @Audit, the scheduler, and the event bus. Injectable anywhere. getLogger() resolves the registered logger with a ConsoleLogger fallback when nothing is bound.",
				example: `import { registerLogger, LOGGER } from 'hono-forge';\n\nregisterLogger(pinoInstance);\n\n@Injectable([LOGGER])\nclass AuditService {\n  constructor(private log: Logger) {}\n}`,
			},
			{
				name: "registerConfig(schema)",
				desc: "Parses process.env through a Zod schema once at boot — fails fast listing every invalid field. Returns the typed config and binds it to the CONFIG token.",
				example: `const EnvSchema = z.object({\n  PORT: z.coerce.number().default(3000),\n  DATABASE_URL: z.string().url(),\n  JWT_SECRET: z.string().min(16),\n});\nexport const env = registerConfig(EnvSchema); // typed`,
			},
			{
				name: "CONFIG token / getConfig()",
				desc: "Access the registered config — inject via @Injectable([CONFIG]) or call getConfig<T>() anywhere outside DI.",
				example: `@Injectable([CONFIG])\nclass DbService {\n  constructor(private env: z.infer<typeof EnvSchema>) {}\n}\n\n// outside DI:\nconst cfg = getConfig<z.infer<typeof EnvSchema>>();`,
			},
			{
				name: "mountMetrics(app, opts?)",
				desc: "Mounts GET /metrics in Prometheus text format — http_requests_total + http_request_duration_seconds histogram labeled by method/route/status. Mount BEFORE building routes; the metrics path is never self-counted.",
				example: `const app = new Hono();\nmountMetrics(app); // before buildModule\n\n// or: createApp(AppModule, { metrics: true })\n// GET /metrics → scrape-ready exposition text`,
			},
			{
				name: "getMetricsRegistry()",
				desc: "Returns the shared MetricsRegistry — read counters/histograms programmatically (custom exporters, tests, in-process dashboards) without scraping /metrics.",
				example: `const reg = getMetricsRegistry();\nreg.counter('jobs_processed').inc();\n// or snapshot for a test assertion\nexpect(reg.counter('http_requests_total').get()).toBeGreaterThan(0);`,
			},
		],
	},
	{
		id: "openapi",
		label: "openapi documentation",
		desc: "Auto-generate an OpenAPI 3.1 spec from your decorators and serve Scalar docs — auth, validation, and path params are reflected automatically. Schemas are converted with the bundled zodToJsonSchema — also exported if you need a standalone Zod → JSON Schema pass.",
		items: [
			{
				name: "OpenAPIGenerator.generate()",
				desc: "Generates a full OpenAPI 3.1 spec from your controller classes.",
				example: `const spec = OpenAPIGenerator.generate(\n  [UserController, OrderController],\n  {\n    info: { title: 'My API', version: '2.0.0' },\n    servers: [{ url: 'https://api.example.com' }],\n  }\n);`,
			},
			{
				name: "OpenAPIGenerator.mount()",
				desc: "Serves /openapi.json and Scalar UI at /docs. Accepts a generated spec OR a controller array — generates and mounts in one call.",
				example: `const app = new Hono();\napp.route('/', HonoRouteBuilder.build(UserController));\n\n// One-call overload — generates the spec itself:\nOpenAPIGenerator.mount(app, [UserController], {\n  info: { title: 'API', version: '1.0.0' },\n});\n// → GET /openapi.json  (raw spec)\n// → GET /docs          (Scalar UI)`,
			},
			{
				name: "@ApiTags(...tags)",
				desc: "Groups controller endpoints under named tags in the OpenAPI spec.",
				example: `@Controller('/users')\n@ApiTags('Users')\nclass UserController {\n  @Get()\n  @ApiTags('list')  // method-level tag\n  list() { /* ... */ }\n}`,
			},
			{
				name: "@ApiDoc(opts)",
				desc: "Documents an endpoint. Options: summary, description.",
				example: `@Get('/:id')\n@ApiDoc({\n  summary: 'Get user by ID',\n  description: 'Returns a single user. Throws 404 if not found.',\n})\ngetOne(c: Context) { /* ... */ }`,
			},
			{
				name: "@ApiResponse(status, msg)",
				desc: "Describes a possible HTTP response for this endpoint — repeatable. Pass { schema } to attach a response body schema.",
				example: `@Post()\n@ApiResponse(201, 'User created successfully')\n@ApiResponse(409, 'Email already taken')\nasync create(c: Context) { /* ... */ }`,
			},
			{
				name: "@ApiBody(schema, opts?)",
				desc: "Documents the JSON request body in the spec. required is auto-inferred — schemas with .optional()/.default() are optional.",
				example: `@Post()\n@ApiBody(CreateUserSchema, { description: 'New user payload' })\nasync create(c: Context) {\n  return this.svc.create(await Body(c, CreateUserSchema));\n}`,
			},
			{
				name: "@ApiQuery(name, schema, opts?)",
				desc: "Documents a query parameter in the spec. required is auto-inferred from the schema.",
				example: `@Get()\n@ApiQuery('search', z.string().optional())\n@ApiQuery('limit', z.coerce.number().default(20))\nasync list(c: Context) { /* ... */ }`,
			},
			{
				name: "@ApiDeprecated(sunset?)",
				desc: "Marks the endpoint deprecated in the spec AND emits an RFC 9745 Deprecation response header. Pass a date to also emit a Sunset header.",
				example: `@Get('/v1/users')\n@ApiDeprecated('2027-01-01')\n@ApiDoc({ description: 'Use /v2/users instead.' })\nlistV1() { /* ... */ }`,
			},
			{
				name: "@ApiSecurity(name)",
				desc: "Applies a named security requirement to a route — use for schemes the auto-detection doesn't cover (apiKey, basic, OAuth2).",
				example: `@Get('/status')\n@ApiSecurity('apiKey')\nstatus(c: Context) { /* ... */ }`,
			},
			{
				name: "@ApiSecurityScheme(name, spec)",
				desc: "Declares a security scheme emitted under components.securitySchemes — Scalar/Redoc pick it up for the Authorize button.",
				example: `@Controller('/payments')\n@ApiSecurityScheme('apiKey', {\n  type: 'apiKey', in: 'header', name: 'X-Api-Key',\n})\nclass PaymentsController { /* ... */ }`,
			},
		],
	},
	{
		id: "pagination",
		label: "pagination",
		desc: "Standard { data, meta } pagination — query schema, response wrapper, and spec-ready schemas.",
		items: [
			{
				name: "paginate(data, total, opts)",
				desc: "Wraps a data array and total count into a standard { data, meta } response — meta carries page, limit, total, totalPages, hasNext, hasPrev. Return type is PaginatedResult<T> ({ data: T[]; meta: PaginationMeta }) — PaginationMeta is the exported meta type.",
				example: `const [data, total] = await repo.findAndCount({ limit, offset });\nreturn paginate(data, total, { page, limit });\n// { data: [...], meta: { page: 1, limit: 20, total: 95, totalPages: 5, ... } }`,
			},
			{
				name: "PaginationQuerySchema",
				desc: "Zod schema for standard page/limit query params — page defaults to 1, limit defaults to 20 (max 100). Use with @Validate or Query(c, schema).",
				example: `@Get()\n@Validate({ query: PaginationQuerySchema })\nasync list(c: Context) {\n  const { page, limit } = Query<PaginationQuery>(c);\n  const [data, total] = await this.repo.findAndCount({\n    limit, offset: (page - 1) * limit,\n  });\n  return paginate(data, total, { page, limit });\n}`,
			},
			{
				name: "paginatedSchema(itemSchema)",
				desc: "Wraps an item schema into a full paginated response schema — for @ApiResponse or @ValidateResult.",
				example: `const UserListSchema = paginatedSchema(UserSchemas.select);\n\n@Get()\n@ApiResponse(200, { schema: UserListSchema })\n@ValidateResult(UserListSchema)\nasync list(c: Context) { /* ... */ }`,
			},
		],
	},
	{
		id: "ops",
		label: "ops, testing & tooling",
		desc: "Health checks, graceful shutdown, test isolation, typed clients, and api-tester flows — everything needed to ship and verify.",
		items: [
			{
				name: "mountHealth(app, opts?)",
				desc: "Mounts GET /health returning { status, uptime, checks } — any failing check → 503. With probes: true also mounts /health/live (process alive, no deps) and /health/ready (dependency checks) for k8s liveness/readiness.",
				example: `mountHealth(app, {\n  probes: true,\n  checks: { db: () => db.ping() },      // → /health/ready\n  liveChecks: { deadlock: () => true }, // → /health/live (optional)\n});`,
			},
			{
				name: "gracefulShutdown(opts?)",
				desc: "Hooks SIGINT/SIGTERM: onShutdown → drain in-flight HTTP requests → close channel subscribers (SSE/WS, WS 1001) → container.shutdown() → exit. Hard-exits after timeoutMs. Returns a detach function.",
				example: `gracefulShutdown({\n  timeoutMs: 10_000,\n  drainRequests: true, // needs mountDrain — 503s new work while draining\n  drainChannels: true, // default — closes SSE/WS transports\n  onShutdown: async () => {\n    stopEventBus();\n    stopScheduler();\n  },\n});`,
			},
			{
				name: "mountDrain(app)",
				desc: "Installs in-flight request tracking so gracefulShutdown can wait for running requests instead of cutting them off. Mount BEFORE building routes. createApp mounts it automatically when shutdown is enabled. getRequestDrain() returns the RequestDrain ({ active, isDraining, drain() }) for custom probes.",
				example: `const app = new Hono();\nmountDrain(app); // before routes!\nnew HonoRouteBuilder(app)\n  .buildControllers(controllers);\ngracefulShutdown();`,
			},
			{
				name: "createTestingModule(meta)",
				desc: "Builds an isolated DI container for tests — framework-agnostic (bun:test, vitest, node:test). overrideProvider().useValue/useClass/useFactory swaps dependencies; cleanup() restores the real container.",
				example: `const mod = createTestingModule({\n  controllers: [UserController],\n})\n  .overrideProvider(UserService)\n  .useValue({ findAll: () => [] })\n  .compile();\n\nmod.get(UserController);            // unit\nawait mod.createApp().fetch(        // or e2e\n  new Request('http://t/users')\n);\nmod.cleanup(); // always call this`,
			},
			{
				name: "generateClientTypes(opts)",
				desc: "Emits an AppRoutes TypeScript interface from your controllers — each output is the handler's Awaited<ReturnType>. Handlers returning Response produce Response in the map — use plain-value returns for typed clients. Imports come from importPath by default; controllerSpecifiers (a Map of controller → module specifier) emits grouped per-file imports — the CLI fills this in automatically from each controller's recorded source file.",
				example: `const code = generateClientTypes({\n  controllers: [UserController],\n  importPath: './controllers',\n  exportName: 'AppRoutes',\n  // per-file imports instead of one barrel:\n  controllerSpecifiers: new Map([\n    [UserController, './modules/users/user.controller'],\n  ]),\n});\nawait Bun.write('src/routes.gen.ts', code);`,
			},
			{
				name: "createClient<AppRoutes>(baseUrl)",
				desc: 'Typed fetch client keyed by "METHOD /path". Response types come from the generated interface. Throws ClientRequestError on non-2xx.',
				example: `import type { AppRoutes } from './routes.gen';\n\nconst api = createClient<AppRoutes>('http://localhost:3000');\nconst user = await api.request('GET /users/:id', {\n  params: { id: '1' },\n}); // typed response`,
			},
			{
				name: "writeFlowFiles(dir, module, opts?)",
				desc: "Emits api-tester .flow.yaml files — one per controller, CRUD-chained (POST extracts id → {{id}} downstream). @Validate/@ApiBody schemas become sample bodies (z.file() fields → form-data multipart rows; schema-less mutations get a visible empty raw body); @Validate({query})/@ApiQuery become query params; @Validate({params}) seeds the editable {{param}} variables; guard- or @JwtAuth-protected routes add Bearer placeholders — WebSocket nodes get ?token={{token}} on the URL instead (sockets can't carry headers; @ChannelAuth routes and declared @ApiQuery params land there too, and the wsQuery option appends anything else). @Status/@ApiResponse(2xx) drive status assertions and @Serialize/@ApiResponse schemas seed exists assertions on required response fields. Deterministic ids → re-imports upsert. In-memory variants for your own writer: generateFlowFiles/generateFlowFile (returns [{filename, flow}]) and stringifyFlowFile (returns the YAML string).",
				example: `await writeFlowFiles('./flows', AppModule, {\n  baseUrl: 'http://localhost:3000',\n});\n// flows/todos.flow.yaml, flows/users.flow.yaml\n\n// single-file variant — groups per controller:\nawait writeFlowFile('./flows', AppModule);`,
			},
			{
				name: "db schema introspection",
				desc: "Programmatic API behind hono-forge schema — extractDbSchema(mod) reflects a module's exported Drizzle tables into a DbSchemaFile, introspectPostgresSchema(connStr, { schema? }) reads a live database via information_schema (needs 'pg' in the project), parsePrismaSchema(text) parses schema.prisma, and normalizeDbSchemaDoc(doc) canonicalizes hand-written/external docs. Write with writeDbSchema(file, schema) or serialize via stringifyDbSchema.",
				example: `import {\n  extractDbSchema, writeDbSchema,\n  introspectPostgresSchema, parsePrismaSchema,\n} from 'hono-forge';\n\nconst mod = await import('./src/db/schema.ts');\nconst schema = extractDbSchema(mod, { entryFile });\nawait writeDbSchema('./db.schema.yaml', schema);\n\n// or live:\nconst live = await introspectPostgresSchema(\n  'postgres://user:pass@localhost:5432/db',\n);`,
			},
		],
	},
	{
		id: "cli",
		label: "cli commands",
		desc: "The hono-forge CLI introspects your @Module/@Controller entry file — no server needed. TypeScript entries require Bun; Node needs a pre-built JS entry. --export <name> picks a specific export when the file exports several modules, and every command supports --help (or hono-forge help <command>).",
		items: [
			{
				name: "hono-forge init <name>",
				desc: "Scaffolds a runnable starter project — app.module.ts, an example controller/service, src/index.ts wiring health + OpenAPI docs + graceful shutdown, package.json, tsconfig.json (TC39 decorators configured), README.md, and .gitignore.",
				example: `bunx hono-forge init my-api\ncd my-api\nbun install\nbun run dev\n\n# serves /hello, /health, /openapi.json\n# and interactive docs at /docs`,
			},
			{
				name: "hono-forge schema <entry|conn-string>",
				desc: "Reflects a database schema into a portable .schema.yaml — columns, vendor+portable types, notNull, PK/composite PK flags, the full FK graph, and dialect. Four sources, auto-detected or forced with --from: drizzle (.ts/.js exporting pgTable/mysqlTable/sqliteTable), prisma (schema.prisma model blocks — no prisma CLI needed), pg (postgres://… entry or --connect <url> — live information_schema introspection, any ORM, needs 'pg' installed), file (.yaml/.json — normalizes hand-written/external docs). Options: --from, --connect, --out <file> (default ./db.schema.yaml), --json. api-tester's Database view imports the output.",
				example: `bunx hono-forge schema ./src/db/schema.ts\n# entry exports pgTable/mysqlTable/sqliteTable objects\n\nbunx hono-forge schema ./prisma/schema.prisma\n# parses model blocks — @id, @@id, @map, @relation, enums\n\nbunx hono-forge schema "postgres://user:pass@localhost:5432/db"\n# live information_schema introspection — any ORM or none\n\nbunx hono-forge schema ./db.schema.yaml --from file\n# normalize a hand-written/external doc to canonical form\n\n# then in api-tester: Database → Import .schema.yaml\n# (or "Introspect live DB" — no CLI needed)`,
			},
			{
				name: "hono-forge flows <entry>",
				desc: "Generates api-tester .flow.yaml files — one per controller, CRUD-chained. Auth detection covers guards AND @JwtAuth middleware — REST/SSE nodes get Bearer {{token}} headers, auth-protected and @ChannelAuth WS nodes get ?token={{token}} on the URL (sockets can't carry headers), and @ApiQuery params declared on SSE/WS handlers land on the URL as seeded {{var}} placeholders. @Serialize/@ValidateResult contracts seed exists assertions for required top-level fields ($[0].* for arrays), scoped with forStatus to the success status. Options: --out <dir> (default ./flows), --base-url <url> (default http://localhost:3000), --single (one file with a visual group per controller), --auth '<METHOD> <path>' + --auth-body/--auth-extract (prepend a login step so guarded flows actually run — {{vars}} in the body become editable variables), --ws-query 'k=v,...' (extra params on every WS node URL, {{vars}} allowed), --export <name>.",
				example: `bunx hono-forge flows ./src/app.module.ts --out ./flows\nbunx hono-forge flows ./src/app.module.ts --single \\\n  --base-url http://localhost:3000\n\n# authenticated APIs — login step produces {{token}}:\nbunx hono-forge flows ./src/app.module.ts \\\n  --auth 'POST /v1/auth/login' \\\n  --auth-body '{"username":"{{user}}","password":"{{pass}}"}' \\\n  --auth-extract 'token=data.accessToken'\n\n# extra params on every WebSocket node URL:\nbunx hono-forge flows ./src/app.module.ts \\\n  --ws-query 'outletId={{outletId}}&region=us-1'\n\n# then in api-tester: Import flow → pick a .flow.yaml → Run`,
			},
			{
				name: "hono-forge openapi <entry>",
				desc: "Writes the OpenAPI 3.1 spec to a JSON file without booting the server. Options: --out <file> (default ./openapi.json), --title <text> (default: entry file name), --version <ver> (default 1.0.0), --export <name>.",
				example: `bunx hono-forge openapi ./src/app.module.ts --out openapi.json\nbunx hono-forge openapi ./src/app.module.ts \\\n  --title "Todo API" --version 2.1.0\n\n# feed the file to Swagger UI, api-tester "Import from API",\n# or codegen`,
			},
			{
				name: "hono-forge routes <entry>",
				desc: "Prints the route table — method / path / handler / guards / middleware / flags. Options: --json (machine-readable output), --export <name>.",
				example: `bunx hono-forge routes ./src/app.module.ts\nbunx hono-forge routes ./src/app.module.ts --json`,
			},
			{
				name: "hono-forge graph <entry>",
				desc: "Prints the DI dependency graph — provider scopes, constructor deps, and missing-dep warnings. Options: --format text|mermaid (mermaid is embeddable in docs/PRs), --export <name>.",
				example: `bunx hono-forge graph ./src/app.module.ts\nbunx hono-forge graph ./src/app.module.ts --format mermaid`,
			},
			{
				name: "hono-forge doctor <entry>",
				desc: "Static wiring check — exits 1 on issues so it works as a CI guard. Checks: missing DI deps, route collisions across controllers, invalid @Cron expressions, scheduled jobs on @RequestScoped classes, and @OnBootstrap on @RequestScoped classes. Options: --json (issue list for CI/IDE), --export <name>.",
				example: `bunx hono-forge doctor ./src/app.module.ts\nbunx hono-forge doctor ./src/app.module.ts --json\n\n# ✖ doctor found 2 issue(s):\n#   • di: 'UserService' depends on 'Mailer' — not in providers\n#   • route: GET /users bound by both UserController.list\n#     and AdminController.list`,
			},
			{
				name: "hono-forge client <entry>",
				desc: "Writes a typed client route map — the generated file declares interface AppRoutes for createClient<AppRoutes>(baseUrl). Each controller is imported from its own source file — @Controller records where the class is declared, so the output compiles even when controllers aren't re-exported from the entry module. Options: --out <file> (default ./routes.gen.ts), --name <ident> (interface name), --import-path <p> (opt out of per-file imports and treat one module as a barrel for every controller), --export <name>. Re-run as a codegen step whenever routes change.",
				example: `bunx hono-forge client ./src/app.module.ts --out src/routes.gen.ts\n\n# then:\nimport { createClient } from 'hono-forge';\nimport type { AppRoutes } from './routes.gen';\n\nconst api = createClient<AppRoutes>('http://localhost:3000');`,
			},
			{
				name: "hono-forge help <command>",
				desc: "Shows per-command flags and examples — also available as hono-forge <command> --help. Unknown commands get a 'did you mean' suggestion.",
				example: `hono-forge help\nhono-forge help client\nhono-forge client --help`,
			},
		],
	},
];

export function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
