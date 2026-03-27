const STEPS = [
  { num: '01', title: 'Global Middleware Stack',   desc: 'Request ID, Pino logger, global rate limiter (100/15min), CORS & security headers, Prometheus metrics collection.' },
  { num: '02', title: 'Route-Level Middleware',    desc: 'Class-level and method-level middleware resolved from decorators. Rate limiters and auth guards evaluated in order.' },
  { num: '03', title: 'Auth Guards',               desc: '@RequireAuth validates JWT. @RequireRole checks RBAC. @RequirePermission enforces fine-grained access control. @Public bypasses all guards.' },
  { num: '04', title: 'Parameter Resolution',      desc: 'Zod schemas validate and parse @ValidatedBody, @ValidatedQuery, @ValidatedParam. @User injects the authenticated user from context.' },
  { num: '05', title: 'Controller Method',         desc: 'Your business logic runs. DI-injected services available. Post-method hooks fire: @LogActivity writes audit log, @TrackMetrics records counters.' },
  { num: '06', title: 'Response',                  desc: '@Cache stores result in Redis if applicable. Hono formats and sends the response with correct status codes and headers.' },
]

export default function Architecture() {
  return (
    <section id="architecture">
      <div className="section-label">how it works</div>
      <h2 className="section-title">Request flow.</h2>
      <p className="section-desc">
        Every request passes through a clean, layered middleware pipeline before reaching your controller.
      </p>

      <div className="arch-flow reveal">
        {STEPS.map((s) => (
          <div key={s.num} className="arch-step">
            <div className="arch-num">{s.num}</div>
            <div className="arch-content">
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
