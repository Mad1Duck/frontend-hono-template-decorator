const FEATURES = [
  {
    icon: '🎨', title: 'Decorator-Based Routing',
    desc: 'NestJS-inspired decorators for clean, declarative controllers. Metadata-driven routing with full TypeScript inference.',
    tags: ['@Controller', '@Get @Post', '@Put @Delete @All'],
  },
  {
    icon: '🔐', title: 'Auth & Authorization',
    desc: 'Pluggable guard executor with role-based and permission-based access control. Throws 401/403 automatically.',
    tags: ['@RequireAuth', '@RequireRole', '@Public'],
  },
  {
    icon: '✅', title: 'Zod Validation',
    desc: 'Type-safe parameter binding for body, query, and route params. Schema-first with full TypeScript inference.',
    tags: ['Body(c, schema)', 'Query(c, schema)', 'Param(c, name)'],
  },
  {
    icon: '📡', title: 'SSE & WebSocket',
    desc: 'First-class streaming with @Sse and @WebSocket decorators. Built-in keepalive and pluggable upgrader for any Hono runtime.',
    tags: ['@Sse(keepAliveMs)', '@WebSocket', 'SSEStreamingApi'],
  },
  {
    icon: '🔁', title: 'Pub/Sub Channels',
    desc: 'Broadcast events to SSE and WebSocket clients. In-memory by default, swap to Redis for multi-instance deployments.',
    tags: ['channels.publish', 'SseChannelClient', 'RedisChannelAdapter'],
  },
  {
    icon: '🛡️', title: 'Rate Limiting',
    desc: 'Per-route rate limiting with X-RateLimit-* headers out of the box. In-memory limiter by default, pluggable for any backend.',
    tags: ['@RateLimit', 'X-RateLimit-*', 'custom keyGen'],
  },
  {
    icon: '📊', title: 'Request Logging',
    desc: 'Pluggable logger with IP extraction, device detection, and duration tracking. Read IP/device anywhere in handlers.',
    tags: ['Ip(c)', 'Device(c)', 'UserAgent(c)'],
  },
  {
    icon: '💉', title: 'Dependency Injection',
    desc: 'Lightweight DI container with singleton, transient, and request-scoped lifetimes. Lifecycle hooks, circular dependency detection, and auto-resolution.',
    tags: ['@Injectable', '@Singleton', '@RequestScoped', 'OnInit/OnDestroy'],
  },
  {
    icon: '📖', title: 'OpenAPI 3.1 + Scalar',
    desc: 'Auto-generate a full OpenAPI spec from your decorators — including request bodies and query params. Serve interactive Scalar docs with one line.',
    tags: ['OpenAPIGenerator', '@ApiDoc', '@ApiBody', '@ApiQuery'],
  },
  {
    icon: '⚡', title: 'Interceptors',
    desc: 'Cross-cutting concerns without middleware clutter. Retry, timeout, transform, cache, and metrics decorators.',
    tags: ['@Retry', '@Timeout', '@Transform', '@Cache', '@TrackMetrics'],
  },
  {
    icon: '🧩', title: 'Modules',
    desc: 'Compose your app from @Module blocks. buildModule() traverses imports recursively and fail-fast validates DI at boot.',
    tags: ['@Module', 'buildModule', 'describe()'],
  },
  {
    icon: '♻️', title: 'Resilience',
    desc: 'Production-grade request safety: idempotency keys, concurrent dedupe, and circuit breakers for external calls.',
    tags: ['@Idempotent', '@SingleFlight', '@CircuitBreaker'],
  },
  {
    icon: '📮', title: 'Event Bus & Scheduler',
    desc: 'In-process pub/sub for decoupled services, plus periodic jobs. Listeners resolve through the DI container.',
    tags: ['@OnEvent', 'events.emit', '@Interval'],
  },
  {
    icon: '🧪', title: 'Testing & Typed Client',
    desc: 'createTestingModule() mocks providers cleanly. generateClientTypes() emits a fully-typed fetch client from your controllers.',
    tags: ['createTestingModule', 'createClient', 'generateClientTypes'],
  },
  {
    icon: '🛟', title: 'Ops Ready',
    desc: 'Health checks, graceful shutdown, route table printing, and pluggable logging — the boring parts are done for you.',
    tags: ['mountHealth', 'gracefulShutdown', 'printRoutes', 'LOGGER'],
  },
  {
    icon: '🌐', title: 'Built-in Middleware',
    desc: 'First-class decorators for the most common Hono middleware. No boilerplate — just stack and go.',
    tags: ['@Cors', '@Compress', '@SecureHeaders', '@PrettyJson'],
  },
  {
    icon: '🚨', title: 'Structured Error Handling',
    desc: 'HttpException with static factories for every HTTP error. Auto-serialized to consistent JSON. Optional stack trace exposure for development.',
    tags: ['HttpException', '.badRequest()', '.notFound()', 'exposeStack'],
  },
  {
    icon: '🔭', title: 'Observability',
    desc: 'Every request gets a trace ID from X-Request-ID or auto-generated UUID. Access it anywhere — services, repos, loggers — without passing it explicitly.',
    tags: ['getTraceId()', 'onRequestStart', 'X-Request-ID'],
  },
]

export default function Features() {
  return (
    <section id="features">
      <div className="section-label">what's inside</div>
      <h2 className="section-title">Everything you need.<br />Nothing you don't.</h2>
      <p className="section-desc">
        One package. No boilerplate. Focus on business logic.
      </p>

      <div className="feature-grid reveal">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
            <div className="feature-tags">
              {f.tags.map((t) => <span key={t} className="ftag">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
