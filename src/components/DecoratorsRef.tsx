const GROUPS = [
  {
    label: 'routing',
    items: [
      { name: '@Controller(path?, opts?)', desc: 'Registers a class as a controller. Accepts basePath, platform, and version.' },
      { name: '@Get(path?)',               desc: 'Maps method to HTTP GET.' },
      { name: '@Post(path?)',              desc: 'Maps method to HTTP POST.' },
      { name: '@Put(path?)',               desc: 'Maps method to HTTP PUT.' },
      { name: '@Delete(path?)',            desc: 'Maps method to HTTP DELETE.' },
      { name: '@Patch(path?)',             desc: 'Maps method to HTTP PATCH.' },
      { name: '@Head(path?)',              desc: 'Registered as GET; Hono handles HEAD requests via fallback.' },
      { name: '@Options(path?)',           desc: 'Maps method to HTTP OPTIONS.' },
      { name: '@All(path?)',               desc: 'Matches all HTTP methods on the given path.' },
    ],
  },
  {
    label: 'real-time',
    items: [
      { name: '@Sse(path?)',       desc: 'Registers a GET endpoint for Server-Sent Events. Inject the stream via @SseStream().' },
      { name: '@WebSocket(path?)', desc: 'Registers a WebSocket upgrade endpoint. Handler returns { onOpen, onMessage, onClose }.' },
      { name: '@Middleware(fn)',   desc: 'Attaches Hono middleware at class level (all routes) or method level (one route).' },
      { name: '@Use(fn)',          desc: 'Alias for @Middleware — familiar for NestJS/Express users.' },
    ],
  },
  {
    label: 'built-in middleware',
    items: [
      { name: '@Cors(opts?)',         desc: 'Applies CORS headers. Options match hono/cors — origin, allowMethods, maxAge, etc.' },
      { name: '@Compress(opts?)',     desc: 'Applies gzip/deflate response compression. Works at class or method level.' },
      { name: '@SecureHeaders(opts?)', desc: 'Adds security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.' },
      { name: '@PrettyJson(opts?)',   desc: 'Pretty-prints JSON responses when ?pretty query param is present.' },
    ],
  },
  {
    label: 'auth & security',
    items: [
      { name: '@RequireAuth()',                    desc: 'Attaches AuthGuard — your guardExecutor validates the token.' },
      { name: '@RequireRole(...roles)',             desc: 'Requires user to have ONE of the specified roles.' },
      { name: '@RequireAllRoles(...roles)',         desc: 'Requires user to have ALL specified roles.' },
      { name: '@RequirePermission(...perms)',       desc: 'Requires ALL listed permissions.' },
      { name: '@RequireAnyPermission(...perms)',    desc: 'Requires at least ONE of the listed permissions.' },
      { name: '@Public()',                          desc: 'Marks route as public, bypassing all auth guards.' },
      { name: '@RateLimit(opts)',                   desc: 'Rate-limits the route. Options: max, windowMs, message, keyGenerator.' },
    ],
  },
  {
    label: 'parameters',
    items: [
      { name: '@Body(schema?)',            desc: 'Injects request body. Pass a Zod schema for validation — returns 400 on failure.' },
      { name: '@Query(schema?)',           desc: 'Injects query params. Pass a Zod object schema to validate and type the result.' },
      { name: '@Param(name)',             desc: 'Injects a route path parameter by name.' },
      { name: '@Headers(name)',           desc: 'Injects a request header by name.' },
      { name: '@User()',                  desc: 'Injects the authenticated user object set by the guard.' },
      { name: '@Ip()',                    desc: 'Injects the real client IP (CF-Connecting-IP → X-Real-IP → X-Forwarded-For).' },
      { name: '@Device()',                desc: "Injects detected device type: 'mobile' | 'tablet' | 'desktop' | 'bot'." },
      { name: '@UserAgent()',             desc: 'Injects the raw User-Agent header string.' },
      { name: '@SseStream()',             desc: 'Injects the SSEStreamingApi stream inside an @Sse handler.' },
      { name: '@Req()',                   desc: 'Injects the Hono HonoRequest object.' },
      { name: '@Res()',                   desc: 'Injects the Hono Context object.' },
      { name: '@ValidatedBody(schema)',        desc: 'Type-safe alias for @Body — carries the Zod inferred type so no explicit annotation is needed.' },
      { name: '@ValidatedQuery(schema)',       desc: 'Type-safe alias for @Query with full Zod inference.' },
      { name: '@ValidatedParam(name, schema)', desc: 'Type-safe alias for @Param with Zod validation and inferred type.' },
      { name: '@UploadedFile(field)',          desc: 'Injects a single File from multipart form data by field name. Returns File | null.' },
      { name: '@UploadedFiles(field?)',        desc: 'Injects all File objects for a field. Omit field to collect every file in the form.' },
      { name: '@FormBody()',                   desc: 'Injects the raw FormData object. Parsed once per request even with multiple file params.' },
    ],
  },
  {
    label: 'channels (pub/sub)',
    items: [
      { name: 'channels.subscribe(ch, client)',   desc: 'Add a client to a channel. Client can be SseChannelClient or WsChannelClient.' },
      { name: 'channels.unsubscribe(ch, id)',     desc: 'Remove a client from a channel by clientId.' },
      { name: 'channels.publish(ch, event, data)', desc: 'Broadcast an event+data payload to all subscribers of a channel.' },
      { name: 'channels.use(adapter)',             desc: 'Swap the channel adapter at startup. Default: InMemoryChannelAdapter.' },
      { name: 'new RedisChannelAdapter(pub, sub)', desc: 'Redis-backed adapter for multi-instance SSE/WS broadcasting.' },
    ],
  },
  {
    label: 'interceptors',
    items: [
      { name: '@Retry(opts)',        desc: 'Retries the method on failure. Options: attempts, delay, backoff (linear | exponential).' },
      { name: '@Timeout(ms)',        desc: 'Rejects with an error if the method takes longer than ms milliseconds.' },
      { name: '@Transform(fn)',      desc: 'Applies a transform function to the return value before sending.' },
      { name: '@Cache(opts)',        desc: 'Stores cache metadata. Options: ttl, key. Integrate with your own cache layer.' },
      { name: '@TrackMetrics(opts)', desc: 'Records method duration via this.metrics.trackMethodDuration(). Options: name.' },
      { name: '@Throttle(ms)',       desc: 'Prevents the method from being called more than once per ms window. Throws if called too soon.' },
      { name: '@Memoize(opts?)',     desc: 'Caches the return value in memory keyed by arguments. Optional ttl (ms) before cache expires.' },
      { name: '@ValidateResult(schema)', desc: 'Validates the return value against a Zod schema. Throws ZodError on mismatch.' },
      { name: '@Audit(opts)',        desc: 'Logs an audit entry via this.logger before the method runs. Options: action.' },
      { name: '@Transaction()',      desc: 'Wraps method in this.db.transaction(). Compatible with Drizzle, Kysely, and similar.' },
    ],
  },
  {
    label: 'api documentation',
    items: [
      { name: '@ApiTags(...tags)',            desc: 'Groups controller endpoints under named tags in the OpenAPI spec.' },
      { name: '@ApiDoc(opts)',                desc: 'Documents an endpoint. Options: summary, description.' },
      { name: '@ApiResponse(status, msg)',    desc: 'Describes a possible HTTP response for this endpoint.' },
      { name: '@ApiDeprecated()',             desc: 'Marks the endpoint as deprecated in the generated spec.' },
      { name: 'OpenAPIGenerator.generate()', desc: 'Generates a full OpenAPI 3.1 spec from your controller classes.' },
      { name: 'OpenAPIGenerator.mount()',    desc: 'Serves /openapi.json and Scalar UI at /docs on a Hono app.' },
    ],
  },
  {
    label: 'dependency injection',
    items: [
      { name: '@Injectable()',    desc: 'Registers a class in the DI container. Required for constructor injection.' },
      { name: '@Singleton()',     desc: 'Returns the same instance on every resolve().' },
      { name: '@Inject(token)',   desc: 'Injects by string or symbol token — useful for interfaces or config values.' },
    ],
  },
]

export default function DecoratorsRef() {
  return (
    <section id="decorators" className="decorator-section">
      <div className="section-label">reference</div>
      <h2 className="section-title">All decorators.</h2>
      <p className="section-desc">
        Every decorator and API available in hono-forge, organized by category.
      </p>

      <div className="reveal">
        {GROUPS.map((g) => (
          <div key={g.label} className="decorator-group">
            <div className="group-label">{g.label}</div>
            <div className="decorator-list">
              {g.items.map((item) => (
                <div key={item.name} className="dec-item">
                  <div>
                    <div className="dec-name">{item.name}</div>
                    <div className="dec-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
