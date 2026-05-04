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
    tags: ['@Body(schema)', '@Query(schema)', '@Param'],
  },
  {
    icon: '📡', title: 'SSE & WebSocket',
    desc: 'First-class streaming with @Sse and @WebSocket decorators. Pluggable upgrader for any Hono runtime.',
    tags: ['@Sse', '@WebSocket', '@SseStream'],
  },
  {
    icon: '🔁', title: 'Pub/Sub Channels',
    desc: 'Broadcast events to SSE and WebSocket clients. In-memory by default, swap to Redis for multi-instance deployments.',
    tags: ['channels.publish', 'SseChannelClient', 'RedisChannelAdapter'],
  },
  {
    icon: '🛡️', title: 'Rate Limiting',
    desc: 'Per-route rate limiting with custom window, max requests, and key generators. Pluggable for any backend.',
    tags: ['@RateLimit', 'custom keyGen'],
  },
  {
    icon: '📊', title: 'Request Logging',
    desc: 'Pluggable logger with IP extraction, device detection, and duration tracking. Inject IP/device directly into handlers.',
    tags: ['@Ip', '@Device', '@UserAgent'],
  },
  {
    icon: '💉', title: 'Dependency Injection',
    desc: 'Lightweight DI container with singleton support and circular dependency detection. Services auto-resolved.',
    tags: ['@Injectable', '@Singleton', '@Inject'],
  },
  {
    icon: '📖', title: 'OpenAPI 3.1 + Scalar',
    desc: 'Auto-generate a full OpenAPI spec from your decorators. Serve interactive Scalar docs with one line.',
    tags: ['OpenAPIGenerator', '@ApiDoc', '@ApiTags'],
  },
  {
    icon: '⚡', title: 'Interceptors',
    desc: 'Cross-cutting concerns without middleware clutter. Retry, timeout, transform, cache, and metrics decorators.',
    tags: ['@Retry', '@Timeout', '@Transform', '@Cache', '@TrackMetrics'],
  },
  {
    icon: '🌐', title: 'Built-in Middleware',
    desc: 'First-class decorators for the most common Hono middleware. No boilerplate — just stack and go.',
    tags: ['@Cors', '@Compress', '@SecureHeaders', '@PrettyJson'],
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
