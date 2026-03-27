const FEATURES = [
  {
    icon: '🎨', title: 'Decorator-Based Routing',
    desc: 'NestJS-inspired decorators for clean, declarative controllers. Metadata-driven routing with full TypeScript inference.',
    tags: ['@Controller', '@Get @Post', '@Put @Delete'],
  },
  {
    icon: '🔐', title: 'Auth & Authorization',
    desc: 'JWT auth with role-based access control (RBAC) and permission guards. Declarative security on any route.',
    tags: ['@RequireAuth', '@RequireRole', '@Public'],
  },
  {
    icon: '✅', title: 'Zod Validation',
    desc: 'Type-safe parameter binding for body, query, and route params. Schema-first with full TypeScript inference.',
    tags: ['@ValidatedBody', '@ValidatedQuery', '@ValidatedParam'],
  },
  {
    icon: '⚡', title: 'Redis Caching',
    desc: 'Declarative response caching with TTL support. Reduce database load on read-heavy endpoints instantly.',
    tags: ['@Cache', 'TTL support', 'Redis backend'],
  },
  {
    icon: '🛡️', title: 'Rate Limiting',
    desc: 'Per-route rate limiting with custom window, max requests, and key generators. Redis-backed for distributed systems.',
    tags: ['@RateLimit', 'custom keyGen'],
  },
  {
    icon: '📊', title: 'Observability',
    desc: 'Structured logging with Pino, Prometheus metrics, activity audit logging, and request tracing built in.',
    tags: ['@LogActivity', '@TrackMetrics', 'Pino'],
  },
  {
    icon: '💉', title: 'Dependency Injection',
    desc: 'Lightweight DI container with singleton support. Services auto-resolved and injected into controllers.',
    tags: ['@Injectable', '@Singleton'],
  },
  {
    icon: '📖', title: 'API Documentation',
    desc: 'Inline OpenAPI-style docs directly on your controllers. Tags, summaries, and response schemas alongside your code.',
    tags: ['@ApiDoc', '@ApiTags', '@ApiResponse'],
  },
]

export default function Features() {
  return (
    <section id="features">
      <div className="section-label">what's inside</div>
      <h2 className="section-title">Everything you need.<br />Nothing you don't.</h2>
      <p className="section-desc">
        Production-grade architecture out of the box. Focus on business logic, not boilerplate.
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
