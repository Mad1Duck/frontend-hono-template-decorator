const STEPS = [
  { num: '01', title: 'Route Registration',      desc: 'HonoRouteBuilder.build() reads decorator metadata (@Controller, @Get, @Post, @Sse, @WebSocket, etc.) and registers all routes onto a Hono app instance at startup.' },
  { num: '02', title: 'Middleware',              desc: '@Middleware decorators at class or method level are resolved and prepended to the handler chain. Runs before guards and rate limiters.' },
  { num: '03', title: 'Rate Limiting',           desc: '@RateLimit triggers the pluggable rateLimiterFactory. Returns 429 if the limit is exceeded before the request reaches your handler.' },
  { num: '04', title: 'Auth Guards',             desc: '@RequireAuth, @RequireRole, @RequirePermission are passed to your pluggable guardExecutor. Throws 401 for "Unauthorized", 403 for "Forbidden". @Public skips all guards.' },
  { num: '05', title: 'Parameter Resolution',    desc: '@Body(schema) and @Query(schema) validate via Zod — returns 400 on failure. @Param, @User, @Ip, @Device, @UserAgent, @Headers, @Req, @Res inject context values. @SseStream injects the SSE stream for streaming handlers.' },
  { num: '06', title: 'Controller Method',       desc: 'Your business logic executes with DI-injected services resolved from the container. For SSE the response streams until the client disconnects. For WebSocket the upgrader handshake is performed.' },
  { num: '07', title: 'Response & Logging',      desc: 'Return value is serialized to JSON and sent. The pluggable requestLogger fires with method, path, statusCode, durationMs, ip, device, and userId. Unhandled errors are routed to your onError handler.' },
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
