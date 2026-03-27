const STEPS = [
  {
    num: "01",
    title: "Global Middleware Stack",
    desc: "Request ID, Pino logger, global rate limiter (100/15min), CORS & security headers, Prometheus metrics collection.",
  },
  {
    num: "02",
    title: "Route-Level Middleware",
    desc: "Class-level and method-level middleware resolved from decorators. Rate limiters and auth guards evaluated in order.",
  },
  {
    num: "03",
    title: "Auth Guards",
    desc: "@RequireAuth validates JWT. @RequireRole checks RBAC. @RequirePermission enforces fine-grained access control. @Public bypasses all guards.",
  },
  {
    num: "04",
    title: "Parameter Resolution",
    desc: "Zod schemas validate and parse @ValidatedBody, @ValidatedQuery, @ValidatedParam. @User injects the authenticated user from context.",
  },
  {
    num: "05",
    title: "Controller Method",
    desc: "Your business logic runs. DI-injected services available. Post-method hooks fire: @LogActivity writes audit log, @TrackMetrics records counters.",
  },
  {
    num: "06",
    title: "Response",
    desc: "@Cache stores result in Redis if applicable. Hono formats and sends the response with correct status codes and headers.",
  },
];

function Step({ num, title, desc, isLast }: any) {
  return (
    <div className="flex items-start gap-6 relative">
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[19px] top-[38px] w-0.5 h-[calc(100%-8px)]"
          style={{
            background: "linear-gradient(to bottom, var(--color-border2), transparent)",
          }}
        />
      )}

      {/* Number bubble */}
      <div
        className="w-[38px] h-[38px] shrink-0 rounded-full border border-[var(--color-border2)]
                   bg-[var(--color-surface)] flex items-center justify-center
                   font-[family-name:var(--font-mono)] text-[0.72rem] font-bold
                   text-[var(--color-accent)]"
      >
        {num}
      </div>

      {/* Content */}
      <div className="pb-10">
        <h4
          className="font-[family-name:var(--font-sans)] text-[0.92rem] font-bold
                     tracking-[-0.01em] mb-1.5"
        >
          {title}
        </h4>
        <p
          className="font-[family-name:var(--font-mono)] text-[0.74rem]
                     text-[var(--color-muted)] leading-[1.7]"
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function Architecture() {
  return (
    <section id="architecture" className="max-w-[1100px] mx-auto px-6 py-20">
      {/* Header */}
      <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.15em] text-[var(--color-accent)] mb-3">
        how it works
      </p>
      <h2
        className="font-[family-name:var(--font-sans)] font-extrabold tracking-[-0.02em]
                   text-[clamp(1.8rem,3vw,2.6rem)] mb-3"
      >
        Request flow.
      </h2>
      <p
        className="font-[family-name:var(--font-mono)] text-[0.83rem] text-[var(--color-muted)]
                   leading-[1.7] max-w-[460px] mb-12"
      >
        Every request passes through a clean, layered middleware pipeline
        before reaching your controller.
      </p>

      {/* Steps — two-col on large screens */}
      <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-x-16">
        <div>
          {STEPS.slice(0, 3).map((s, i) => (
            <Step key={s.num} {...s} isLast={i === 2} />
          ))}
        </div>
        <div>
          {STEPS.slice(3).map((s, i) => (
            <Step key={s.num} {...s} isLast={i === 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
