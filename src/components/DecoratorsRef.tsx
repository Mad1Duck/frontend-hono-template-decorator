import { useState } from 'react'

interface DecItem {
  name: string
  desc: string
  example?: string
}

const GROUPS: { label: string; items: DecItem[] }[] = [
  {
    label: 'routing',
    items: [
      { name: '@Controller(path?, opts?)', desc: 'Registers a class as a controller. Accepts basePath, platform, and version.', example: `@Controller('/users')\n@Injectable([UserService])\nclass UserController {\n  constructor(private svc: UserService) {}\n}` },
      { name: '@Get(path?)',    desc: 'Maps method to HTTP GET.',    example: `@Get('/:id')\n@Public()\ngetOne(c: Context) {\n  return this.svc.findById(Param(c, 'id'));\n}` },
      { name: '@Post(path?)',   desc: 'Maps method to HTTP POST.',   example: `@Post()\nasync create(c: Context) {\n  const body = await Body(c, CreateSchema);\n  return this.svc.create(body);\n}` },
      { name: '@Put(path?)',    desc: 'Maps method to HTTP PUT.',    example: `@Put('/:id')\nasync replace(c: Context) {\n  return this.svc.replace(\n    Param(c, 'id'), await Body(c, Schema)\n  );\n}` },
      { name: '@Delete(path?)', desc: 'Maps method to HTTP DELETE.', example: `@Delete('/:id')\n@RequireAuth()\nremove(c: Context) {\n  return this.svc.delete(Param(c, 'id'));\n}` },
      { name: '@Patch(path?)',  desc: 'Maps method to HTTP PATCH.',  example: `@Patch('/:id')\nasync update(c: Context) {\n  const body = await Body(c, UpdateSchema);\n  return this.svc.update(Param(c, 'id'), body);\n}` },
      { name: '@Head(path?)',   desc: 'Registered as GET; Hono handles HEAD requests via fallback.', example: `@Head('/ping')\n@Public()\nping() { return null; }` },
      { name: '@Options(path?)', desc: 'Maps method to HTTP OPTIONS.', example: `@Options('/cors')\n@Public()\ncors() { return { allow: 'GET,POST' }; }` },
      { name: '@All(path?)',    desc: 'Matches all HTTP methods on the given path.', example: `@All('/any')\n@Public()\nany(c: Context) { return { method: c.req.method }; }` },
    ],
  },
  {
    label: 'real-time',
    items: [
      { name: '@Sse(path?)',       desc: 'Registers a GET endpoint for SSE. Handler receives (c: Context, stream: SSEStreamingApi) — no decorator needed for the stream.', example: `@Sse('/feed')\n@Public()\nasync feed(c: Context, stream: SSEStreamingApi) {\n  await stream.writeSSE({ event: 'connected', data: 'ok' });\n  while (!stream.closed) {\n    await stream.sleep(30_000);\n    await stream.writeSSE({ event: 'ping', data: '' });\n  }\n}` },
      { name: '@WebSocket(path?)', desc: 'Registers a WebSocket upgrade endpoint. Handler receives (c: Context) and returns { onOpen, onMessage, onClose }.', example: `@WebSocket('/:room')\n@Public()\nchat(c: Context) {\n  const room = Param(c, 'room');\n  return {\n    onOpen: (_e, ws) => console.log('connected to', room),\n    onMessage: (e, ws) => ws.send(\`Echo: \${e.data}\`),\n    onClose: () => console.log('disconnected'),\n  };\n}` },
      { name: '@Middleware(fn)',   desc: 'Attaches Hono middleware at class level (all routes) or method level (one route).', example: `const logMw = async (c: Context, next: Next) => {\n  console.log(c.req.method, c.req.path);\n  await next();\n};\n\n@Controller('/api')\n@Middleware(logMw)          // class-level\nclass ApiController {\n  @Get()\n  @Middleware(tracingMw)    // method-level\n  list() { /* ... */ }\n}` },
      { name: '@Use(fn)',          desc: 'Alias for @Middleware — familiar for NestJS/Express users.', example: `@Get()\n@Use(authMw, auditMw)\nlist() { return this.svc.getAll(); }` },
    ],
  },
  {
    label: 'built-in middleware',
    items: [
      { name: '@Cors(opts?)',          desc: 'Applies CORS headers. Options match hono/cors — origin, allowMethods, maxAge, etc.', example: `@Controller('/api')\n@Cors({ origin: 'https://example.com' })\nclass ApiController { /* ... */ }\n\n// or method-level:\n@Get('/public')\n@Cors({ origin: '*' })\nlist() { /* ... */ }` },
      { name: '@Compress(opts?)',      desc: 'Applies gzip/deflate response compression. Works at class or method level.', example: `@Controller('/api')\n@Compress()\nclass ApiController { /* ... */ }` },
      { name: '@SecureHeaders(opts?)', desc: 'Adds security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.', example: `@Controller('/api')\n@SecureHeaders()\nclass ApiController { /* ... */ }` },
      { name: '@PrettyJson(opts?)',    desc: 'Pretty-prints JSON responses when ?pretty query param is present.', example: `@Controller('/debug')\n@PrettyJson()\nclass DebugController { /* ... */ }\n// GET /debug?pretty → formatted JSON` },
    ],
  },
  {
    label: 'auth & security',
    items: [
      { name: '@RequireAuth()',                    desc: 'Attaches AuthGuard — your guardExecutor validates the token.', example: `@Get('/me')\n@RequireAuth()\nasync me(c: Context) {\n  const user = User<MyUser>(c);\n  return { id: user.id, email: user.email };\n}` },
      { name: '@RequireRole(...roles)',             desc: 'Requires user to have ONE of the specified roles.', example: `@Delete('/users/:id')\n@RequireRole('admin', 'moderator')\nremove(c: Context) {\n  return this.svc.delete(Param(c, 'id'));\n}` },
      { name: '@RequireAllRoles(...roles)',         desc: 'Requires user to have ALL specified roles.', example: `@Post('/promote')\n@RequireAllRoles('admin', 'superuser')\npromote(c: Context) { /* ... */ }` },
      { name: '@RequirePermission(...perms)',       desc: 'Requires ALL listed permissions.', example: `@Post('/publish')\n@RequirePermission('posts:write', 'posts:publish')\npublish(c: Context) { /* ... */ }` },
      { name: '@RequireAnyPermission(...perms)',    desc: 'Requires at least ONE of the listed permissions.', example: `@Get('/reports')\n@RequireAnyPermission('reports:read', 'admin:all')\nreports(c: Context) { /* ... */ }` },
      { name: '@Public()',                          desc: 'Marks route as public, bypassing all auth guards.', example: `@Get('/health')\n@Public()\nhealth() { return { status: 'ok' }; }` },
      { name: '@Private()',                         desc: 'Marks route as internal-only. Excluded when build() is called with { excludePrivate: true }.', example: `@Get('/internal/metrics')\n@Private()\nmetrics() { return process.memoryUsage(); }\n\n// Exclude on public app:\nHonoRouteBuilder.build(Ctrl, undefined, { excludePrivate: true });` },
      { name: '@RateLimit(opts)',                   desc: 'Rate-limits the route. Options: max, windowMs, message, keyGenerator.', example: `@Post('/login')\n@RateLimit({ max: 5, windowMs: 60_000, message: 'Too many attempts' })\nasync login(c: Context) {\n  const body = await Body(c, LoginSchema);\n  return this.authSvc.login(body);\n}` },
    ],
  },
  {
    label: 'context helpers',
    items: [
      { name: 'Body(c, schema?)',            desc: 'Reads + validates request body. Pass a Zod schema for validation — returns 400 on failure.', example: `@Post()\nasync create(c: Context) {\n  const body = await Body(c, CreateSchema);\n  // body is z.infer<typeof CreateSchema>\n  return this.svc.create(body);\n}` },
      { name: 'Query(c, schema?)',           desc: 'Reads query params. Pass a Zod schema to validate and type the result.', example: `const FilterSchema = z.object({\n  search: z.string().optional(),\n  limit: z.coerce.number().default(20),\n});\n\n@Get()\nasync list(c: Context) {\n  const q = await Query(c, FilterSchema);\n  return this.svc.getAll(q);\n}` },
      { name: 'Param(c, name)',              desc: 'Reads a route path parameter by name.', example: `@Get('/:id')\ngetOne(c: Context) {\n  const id = Param(c, 'id'); // string\n  return this.svc.findById(id);\n}` },
      { name: 'Headers(c, name?)',           desc: 'Reads a request header. Omit name to get all headers as an object.', example: `@Get()\ncheck(c: Context) {\n  const token = Headers(c, 'authorization'); // string | undefined\n  const all   = Headers(c);                 // Record<string, string>\n}` },
      { name: 'User<T>(c)',                  desc: 'Returns the authenticated user object set by the guard.', example: `@Get('/profile')\n@RequireAuth()\nprofile(c: Context) {\n  const user = User<{ id: string; email: string }>(c);\n  return { email: user.email };\n}` },
      { name: 'Ip(c)',                       desc: 'Returns the real client IP (CF-Connecting-IP → X-Real-IP → X-Forwarded-For).', example: `@Get('/info')\ninfo(c: Context) {\n  return { ip: Ip(c) }; // '203.0.113.1'\n}` },
      { name: 'Device(c)',                   desc: "Returns detected device type: 'mobile' | 'tablet' | 'desktop' | 'bot'.", example: `@Get('/page')\npage(c: Context) {\n  const device = Device(c); // 'mobile' | 'tablet' | 'desktop' | 'bot'\n  return device === 'mobile' ? mobileView() : desktopView();\n}` },
      { name: 'UserAgent(c)',                desc: 'Returns the raw User-Agent header string.', example: `@Get('/ua')\nua(c: Context) {\n  return { ua: UserAgent(c) };\n}` },
      { name: 'Cookie(c, name)',             desc: 'Returns a single cookie value by name.', example: `@Get('/session')\n@RequireAuth()\nsession(c: Context) {\n  const token = Cookie(c, 'session'); // string | undefined\n  return { valid: !!token };\n}` },
      { name: 'Cookies(c)',                  desc: 'Returns all cookies as Record<string, string>.', example: `@Get('/debug/cookies')\n@Private()\ndebugCookies(c: Context) {\n  return Cookies(c); // { session: '...', theme: 'dark' }\n}` },
      { name: 'Req(c)',                      desc: 'Returns the Hono HonoRequest object.', example: `@Get()\ninfo(c: Context) {\n  const req = Req(c);\n  return { method: req.method, url: req.url };\n}` },
      { name: 'Ctx(c) / Res(c)',             desc: 'Returns the full Hono Context c — for redirect, set-cookie, etc.', example: `@Get('/redirect')\nredirect(c: Context) {\n  return Ctx(c).redirect('/new-path', 301);\n}\n\n@Post('/login')\nasync login(c: Context) {\n  const ctx = Ctx(c);\n  ctx.header('Set-Cookie', \`token=\${token}; HttpOnly; Path=/\`);\n  return { ok: true };\n}` },
      { name: 'ValidatedBody(c, schema)',    desc: 'Alias for Body(c, schema) — emphasises validation intent.', example: `@Post()\nasync create(c: Context) {\n  const data = await ValidatedBody(c, CreateSchema);\n  return this.svc.create(data);\n}` },
      { name: 'ValidatedQuery(c, schema)',   desc: 'Alias for Query(c, schema).', example: `@Get()\nasync list(c: Context) {\n  const q = await ValidatedQuery(c, FilterSchema);\n  return this.svc.getAll(q);\n}` },
      { name: 'ValidatedParam(c, name, schema)', desc: 'Reads a route param and validates it through a Zod schema.', example: `@Get('/:id')\nasync getOne(c: Context) {\n  const id = await ValidatedParam(c, 'id', z.string().uuid());\n  return this.svc.findById(id);\n}` },
      { name: 'UploadedFile(c, field)',      desc: 'Returns a single File from multipart form data by field name. Returns File | null.', example: `@Post('/avatar')\nasync upload(c: Context) {\n  const file = await UploadedFile(c, 'avatar');\n  if (!file) return c.json({ error: 'no file' }, 400);\n  return { name: file.name, size: file.size };\n}` },
      { name: 'UploadedFiles(c, field?)',    desc: 'Returns all File objects for a field. Omit field to collect every file in the form.', example: `@Post('/gallery')\nasync gallery(c: Context) {\n  const files = await UploadedFiles(c, 'photos');\n  return files.map(f => ({ name: f.name, size: f.size }));\n}` },
      { name: 'FormBody(c)',                 desc: 'Returns the raw FormData object.', example: `@Post('/submit')\nasync submit(c: Context) {\n  const form = await FormBody(c);\n  const name = form.get('name') as string;\n  return { name };\n}` },
    ],
  },
  {
    label: 'channels (pub/sub)',
    items: [
      { name: 'channels.subscribe(ch, client)',    desc: 'Add a client to a channel. Client can be SseChannelClient or WsChannelClient.', example: `// SSE client\nconst client = new SseChannelClient(userId, stream);\nawait channels.subscribe(\`user:\${userId}\`, client);\n\n// WebSocket client\nconst ws = new WsChannelClient(ws.id, ws);\nawait channels.subscribe(\`room:\${room}\`, ws);` },
      { name: 'channels.unsubscribe(ch, id)',      desc: 'Remove a client from a channel by clientId.', example: `stream.onAbort(() =>\n  channels.unsubscribe(\`user:\${userId}\`, userId)\n);` },
      { name: 'channels.publish(ch, event, data)', desc: 'Broadcast an event+data payload to all subscribers of a channel.', example: `// Push from anywhere — service, cron, webhook handler\nawait channels.publish('user:42', 'order.created', { orderId: 123 });\nawait channels.publish('room:general', 'message', { text: 'hello' });` },
      { name: 'channels.use(adapter)',              desc: 'Swap the channel adapter at startup. Default: InMemoryChannelAdapter.', example: `import { RedisChannelAdapter } from 'hono-forge';\nimport Redis from 'ioredis';\n\n// Multi-instance — use Redis adapter\nchannels.use(new RedisChannelAdapter(\n  new Redis(process.env.REDIS_URL),\n  new Redis(process.env.REDIS_URL),\n));` },
      { name: 'new RedisChannelAdapter(pub, sub)',  desc: 'Redis-backed adapter for multi-instance SSE/WS broadcasting.', example: `import { channels, RedisChannelAdapter } from 'hono-forge';\nimport Redis from 'ioredis';\n\nconst pub = new Redis(process.env.REDIS_URL);\nconst sub = new Redis(process.env.REDIS_URL);\nchannels.use(new RedisChannelAdapter(pub, sub));` },
    ],
  },
  {
    label: 'interceptors',
    items: [
      { name: '@Retry(opts)',           desc: 'Retries the method on failure. Options: attempts, delay, backoff (linear | exponential).', example: `@Retry({ attempts: 3, delay: 500, backoff: 'exponential' })\nasync fetchExternalData() {\n  return await fetch('https://api.example.com/data');\n}` },
      { name: '@Timeout(ms)',           desc: 'Rejects with an error if the method takes longer than ms milliseconds.', example: `@Timeout(5000)\nasync slowOperation() {\n  return await db.heavyQuery(); // throws if > 5s\n}` },
      { name: '@Transform(fn)',         desc: 'Applies a transform function to the return value before sending.', example: `@Transform((user: User) => ({\n  id: user.id,\n  name: user.name,\n  // strips sensitive fields like password\n}))\nasync getUser(c: Context) {\n  return this.repo.findById(Param(c, 'id'));\n}` },
      { name: '@Cache(opts)',           desc: 'Stores cache metadata. Options: ttl, key. Integrate with your own cache layer.', example: `@Cache({ ttl: 60_000, key: 'app-config' })\nasync getConfig() {\n  return this.repo.getConfig();\n}` },
      { name: '@TrackMetrics(opts)',    desc: 'Records method duration via this.metrics.trackMethodDuration(). Options: name.', example: `@TrackMetrics({ name: 'user.create' })\nasync create(data: CreateDto) {\n  // this.metrics.trackMethodDuration called automatically\n  return this.repo.insert(data);\n}` },
      { name: '@Throttle(ms)',          desc: 'Prevents the method from being called more than once per ms window. Throws if called too soon.', example: `@Throttle(10_000) // max once per 10s per instance\nasync generateReport() {\n  return this.reportSvc.generate();\n}` },
      { name: '@Memoize(opts?)',        desc: 'Caches the return value in memory. Options: ttl (ms), scope ("global" | "request").', example: `// Global cache — same result for all requests\n@Memoize({ ttl: 60_000 })\nasync getFeatureFlags() {\n  return this.db.getFlags();\n}\n\n// Request-scoped — isolated per request\n@Memoize({ scope: 'request' })\nasync getCurrentUser(id: string) {\n  return this.db.findUser(id);\n}` },
      { name: '@ValidateResult(schema)', desc: 'Validates the return value against a Zod schema. Throws ZodError on mismatch.', example: `const UserSchema = z.object({ id: z.string(), email: z.string().email() });\n\n@ValidateResult(UserSchema)\nasync getUser(id: string) {\n  return this.repo.findById(id); // throws if shape is wrong\n}` },
      { name: '@Audit(opts)',           desc: 'Logs an audit entry via this.logger before the method runs. Options: action.', example: `@Audit({ action: 'user.delete' })\nasync remove(id: string) {\n  // logs: { action: 'user.delete', user: '...', timestamp: '...' }\n  return this.repo.delete(id);\n}` },
      { name: '@Transaction(exec?)',    desc: 'Wraps method in this.db.transaction(). Pass a custom TransactionExecutor for Prisma ($transaction) or Kysely.', example: `// Drizzle / Knex — default executor\n@Transaction()\nasync transfer(from: string, to: string, amount: number) {\n  await this.repo.debit(from, amount);\n  await this.repo.credit(to, amount);\n}\n\n// Prisma — custom executor\n@Transaction((db: PrismaClient, run) => db.$transaction(run))\nasync onboard(data: NewUser) { /* ... */ }` },
    ],
  },
  {
    label: 'api documentation',
    items: [
      { name: '@ApiTags(...tags)',             desc: 'Groups controller endpoints under named tags in the OpenAPI spec.', example: `@Controller('/users')\n@ApiTags('Users')\nclass UserController {\n  @Get()\n  @ApiTags('list')  // method-level tag\n  list() { /* ... */ }\n}` },
      { name: '@ApiDoc(opts)',                 desc: 'Documents an endpoint. Options: summary, description.', example: `@Get('/:id')\n@ApiDoc({\n  summary: 'Get user by ID',\n  description: 'Returns a single user. Throws 404 if not found.',\n})\ngetOne(c: Context) { /* ... */ }` },
      { name: '@ApiResponse(status, msg)',     desc: 'Describes a possible HTTP response for this endpoint.', example: `@Post()\n@ApiResponse(201, 'User created successfully')\n@ApiResponse(409, 'Email already taken')\nasync create(c: Context) { /* ... */ }` },
      { name: '@ApiDeprecated()',              desc: 'Marks the endpoint as deprecated in the generated spec.', example: `@Get('/v1/users')\n@ApiDeprecated()\n@ApiDoc({ description: 'Use /v2/users instead.' })\nlistV1() { /* ... */ }` },
      { name: 'OpenAPIGenerator.generate()',  desc: 'Generates a full OpenAPI 3.1 spec from your controller classes.', example: `const spec = OpenAPIGenerator.generate(\n  [UserController, OrderController],\n  {\n    info: { title: 'My API', version: '2.0.0' },\n    servers: [{ url: 'https://api.example.com' }],\n  }\n);` },
      { name: 'OpenAPIGenerator.mount()',     desc: 'Serves /openapi.json and Scalar UI at /docs on a Hono app.', example: `const app = new Hono();\napp.route('/', HonoRouteBuilder.build(UserController));\n\nconst spec = OpenAPIGenerator.generate([UserController], {\n  info: { title: 'API', version: '1.0.0' },\n});\nOpenAPIGenerator.mount(app, spec);\n// → GET /openapi.json  (raw spec)\n// → GET /docs          (Scalar UI)` },
    ],
  },
  {
    label: 'dependency injection',
    items: [
      { name: '@Injectable(tokens?)',           desc: 'Registers a class in the DI container. Pass explicit dependency tokens: @Injectable([Database, Logger]).', example: `@Injectable()           // no deps\nclass EmailService { send(to: string) {} }\n\n@Injectable([EmailService])  // with deps\nclass UserService {\n  constructor(private email: EmailService) {}\n}\n\n// Symbol token\nconst DB = Symbol('db');\ncontainer.registerInstance(DB, drizzle(client));\n\n@Injectable([DB])\nclass UserRepo {\n  constructor(private db: AppDb) {}\n}` },
      { name: '@Singleton()',                   desc: 'Returns the same instance on every resolve().', example: `@Injectable()\n@Singleton()\nclass Database {\n  readonly conn = createConnection();\n}\n// container.resolve(Database) always returns the same instance` },
      { name: '@RequestScoped()',               desc: 'Fresh instance per request, destroyed automatically when the request ends. Shared within the same request.', example: `@Injectable()\n@RequestScoped()\nclass RequestContext implements OnDestroy {\n  readonly requestId = crypto.randomUUID();\n  onDestroy() { console.log('request done', this.requestId); }\n}` },
      { name: '@Stateless()',                   desc: 'Enforces that a @Singleton holds no mutable per-request state. Writes to the instance throw at runtime.', example: `@Injectable()\n@Singleton()\n@Stateless()\nclass UserRepo {\n  // reads only — mutating any property throws at runtime\n  findAll() { return db.select().from(users); }\n}` },
      { name: 'container.boot()',               desc: 'Calls onInit() on all registered singletons that implement OnInit. Call once at app startup before starting the server.', example: `// Call after all registerInstance() / registerFactory() calls\nawait container.boot();\n\n// Then start the server\nBun.serve({ fetch: app.fetch, port: 3000 });` },
      { name: 'container.shutdown()',           desc: 'Calls onDestroy() on all singletons in reverse registration order. Call in SIGTERM/SIGINT handler.', example: `process.on('SIGTERM', async () => {\n  await container.shutdown(); // closes DB, Redis, etc.\n  process.exit(0);\n});` },
      { name: 'container.runInScope(fn)',       desc: 'Runs fn in a new request scope. onDestroy is called on all scoped instances in the finally block.', example: `// Usually called automatically by HonoRouteBuilder.\n// Use manually when running outside a route:\nconst result = await container.runInScope(async () => {\n  const svc = container.resolve(RequestScopedService);\n  return svc.doWork();\n});` },
      { name: 'container.registerInstance(token, value)', desc: 'Registers a pre-built external object (Drizzle, Prisma, Redis, etc.) under a symbol token.', example: `import { drizzle } from 'drizzle-orm/postgres-js';\nimport postgres from 'postgres';\n\nexport const DB = Symbol('db');\nconst client = postgres(process.env.DATABASE_URL!);\ncontainer.registerInstance(DB, drizzle(client));\n\n@Injectable([DB])\nclass UserRepo {\n  constructor(private db: AppDb) {}\n}` },
    ],
  },
  {
    label: 'error handling',
    items: [
      { name: 'HttpException',                      desc: 'Structured HTTP error with status, code, message, and optional meta payload. Auto-handled by the route builder.', example: `// Throw from handler or service — auto-formatted:\nthrow HttpException.notFound('User not found');\n// → 404 { status: 'error', error: { code: 'NOT_FOUND', message: '...' } }\n\n// With meta payload:\nthrow HttpException.unprocessable('Validation failed', {\n  fields: ['email', 'name']\n});` },
      { name: 'HttpException.notFound(msg?)',        desc: '404 NOT_FOUND', example: `async getOne(c: Context) {\n  const user = await this.repo.findById(Param(c, 'id'));\n  if (!user) throw HttpException.notFound('User not found');\n  return user;\n}` },
      { name: 'HttpException.unauthorized(msg?)',    desc: '401 UNAUTHORIZED', example: `guardExecutor: async (c, guards) => {\n  const token = c.req.header('authorization');\n  if (!token) throw new Error('Unauthorized: missing token');\n  // ...\n}` },
      { name: 'HttpException.forbidden(msg?)',       desc: '403 FORBIDDEN', example: `if (user.role !== 'admin')\n  throw HttpException.forbidden('Admin access required');` },
      { name: 'HttpException.conflict(msg?)',        desc: '409 CONFLICT', example: `const exists = await this.repo.findByEmail(data.email);\nif (exists) throw HttpException.conflict('Email already taken');` },
      { name: 'HttpException.badRequest(msg?)',      desc: '400 BAD_REQUEST', example: `if (!body.id) throw HttpException.badRequest('id is required');` },
      { name: 'HttpException.internal(msg?)',        desc: '500 INTERNAL_SERVER_ERROR', example: `try {\n  await this.externalService.call();\n} catch {\n  throw HttpException.internal('External service unavailable');\n}` },
    ],
  },
  {
    label: 'observability & config',
    items: [
      { name: 'getTraceId()',           desc: 'Returns the active trace/correlation ID. Callable from anywhere in the call chain — services, repos, loggers — without passing it explicitly.', example: `import { getTraceId } from 'hono-forge';\n\n@Injectable()\nclass AuditService {\n  log(action: string) {\n    console.log({ traceId: getTraceId(), action });\n    // traceId is the X-Request-ID from the active request\n  }\n}` },
      { name: 'runWithTraceId(id, fn)', desc: 'Runs fn within a trace context. Use when running handlers outside HonoRouteBuilder.', example: `import { runWithTraceId } from 'hono-forge';\n\nawait runWithTraceId('cron-job-001', async () => {\n  // getTraceId() returns 'cron-job-001' inside here\n  await myService.runDailyReport();\n});` },
      { name: 'onRequestStart hook',    desc: 'Called before middleware and guards on every request. Receives { method, path, traceId, ip, userAgent }.', example: `HonoRouteBuilder.configure({\n  onRequestStart: ({ method, path, traceId }) => {\n    const span = tracer.startSpan(\`\${method} \${path}\`, {\n      attributes: { traceId },\n    });\n    // attach span to context...\n  },\n});` },
      { name: 'exposeStack option',     desc: 'Controls stack trace exposure in HttpException responses. Values: false (default, safe) | true | "development".', example: `HonoRouteBuilder.configure({\n  exposeStack: 'development',\n  // false     → never expose (production-safe)\n  // true      → always expose\n  // 'development' → only when NODE_ENV !== 'production'\n});` },
    ],
  },
]

export default function DecoratorsRef() {
  const [tooltip, setTooltip] = useState<{ name: string; example: string; x: number; y: number } | null>(null)

  const handleMouseEnter = (item: DecItem, e: React.MouseEvent) => {
    if (!item.example) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const TOOLTIP_W = 500
    const TOOLTIP_MAX_H = 400
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Prefer below the item, flip above if not enough space
    let top = rect.bottom + 8
    if (top + TOOLTIP_MAX_H > vh) top = rect.top - TOOLTIP_MAX_H - 8

    // Clamp horizontally
    let left = rect.left
    if (left + TOOLTIP_W > vw - 12) left = vw - TOOLTIP_W - 12
    if (left < 12) left = 12

    setTooltip({ name: item.name, example: item.example, x: left, y: top })
  }

  const handleMouseLeave = () => setTooltip(null)

  return (
    <section id="decorators" className="decorator-section">
      <div className="section-label">reference</div>
      <h2 className="section-title">All decorators.</h2>
      <p className="section-desc">
        Every decorator and API available in hono-forge, organized by category.
        Hover any item to see a usage example.
      </p>

      <div className="reveal">
        {GROUPS.map((g) => (
          <div key={g.label} className="decorator-group">
            <div className="group-label">{g.label}</div>
            <div className="decorator-list">
              {g.items.map((item) => (
                <div
                  key={item.name}
                  className={`dec-item${item.example ? ' dec-item--hoverable' : ''}`}
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div>
                    <div className="dec-name">
                      {item.name}
                      {item.example && <span className="dec-hint">hover</span>}
                    </div>
                    <div className="dec-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip — fixed so it escapes any overflow:hidden ancestor */}
      {tooltip && (
        <div
          className="dec-tooltip"
          style={{ position: 'fixed', top: tooltip.y, left: tooltip.x }}
          onMouseEnter={() => setTooltip(tooltip)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="dec-tooltip-header">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
            <span className="dec-tooltip-title">{tooltip.name}</span>
          </div>
          <pre className="dec-tooltip-code">{tooltip.example}</pre>
        </div>
      )}
    </section>
  )
}
