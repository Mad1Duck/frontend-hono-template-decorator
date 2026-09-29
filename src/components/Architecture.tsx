const STEPS = [
  { num: '01', title: 'Route Registration',      desc: 'HonoRouteBuilder.build() — or buildModule() for @Module trees — reads decorator metadata (@Controller, @Get, @Post, @Sse, @WebSocket, @ChannelRoute, etc.) and registers all routes onto a Hono app instance at startup.' },
  { num: '02', title: 'Trace ID & onRequestStart', desc: 'A trace/correlation ID is assigned from X-Request-ID or auto-generated UUID and echoed back on the response. The onRequestStart hook fires here — use it to start OTel spans or attach logger context.' },
  { num: '03', title: 'Middleware',              desc: '@Middleware/@Use at class or method level, plus built-ins (@Cors, @Compress, @SecureHeaders, @PrettyJson, @JwtAuth), are prepended to the handler chain. Runs before guards and rate limiters.' },
  { num: '04', title: 'Rate Limiting',           desc: '@RateLimit checks the built-in in-memory limiter (or your pluggable rateLimiterFactory). Emits X-RateLimit-Limit/Remaining/Reset headers and returns 429 with Retry-After if exceeded.' },
  { num: '05', title: 'Auth Guards',             desc: '@RequireAuth, @RequireRole, @RequirePermission are passed to your pluggable guardExecutor. HttpException thrown by guards passes through unchanged; other errors map to 401 for "Unauthorized", 403 for "Forbidden". @Public skips all guards.' },
  { num: '06', title: 'Dedupe & Idempotency',    desc: '@Idempotent replays cached responses for duplicate Idempotency-Key requests. @SingleFlight coalesces concurrent identical requests so the handler runs once.' },
  { num: '07', title: 'Parameter Resolution',    desc: 'Helper functions read and validate context values inside your handler: Body(c, schema) and Query(c, schema) validate via Zod (400 on failure), plus Param, User, Ip, Device, Headers, Cookie, UploadedFile and more. SSE handlers receive the stream as a second argument.' },
  { num: '08', title: 'Controller Method',       desc: 'Your business logic executes with DI-injected services resolved from the container. Request-scoped instances (@RequestScoped) are created fresh and shared within this request. getContext() and getTraceId() are available anywhere in the call chain.' },
  { num: '09', title: 'Response & Cleanup',      desc: 'Return values serialize to JSON; a returned Response passes through untouched. @Status/@NoContent/@Header/@Redirect shape the response. Errors flow through @Catch/@UseFilters method filters → class filters → onError → HttpException. onDestroy() runs on request-scoped instances, and requestLogger fires with method, path, statusCode, durationMs, ip, traceId.' },
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
