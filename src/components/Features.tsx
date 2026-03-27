const FEATURES = [
  {
    icon: "🎨",
    title: "Decorator-Based Routing",
    desc: "NestJS-inspired decorators for clean, declarative controllers. Metadata-driven routing with full TypeScript inference.",
    tags: ["@Controller", "@Get @Post", "@Put @Delete"],
  },
  {
    icon: "🔐",
    title: "Auth & Authorization",
    desc: "JWT auth with role-based access control (RBAC) and permission guards. Declarative security on any route.",
    tags: ["@RequireAuth", "@RequireRole", "@Public"],
  },
  {
    icon: "✅",
    title: "Zod Validation",
    desc: "Type-safe parameter binding for body, query, and route params. Schema-first with full TypeScript inference.",
    tags: ["@ValidatedBody", "@ValidatedQuery", "@ValidatedParam"],
  },
  {
    icon: "⚡",
    title: "Redis Caching",
    desc: "Declarative response caching with TTL support. Reduce database load on read-heavy endpoints instantly.",
    tags: ["@Cache", "TTL support", "Redis backend"],
  },
  {
    icon: "🛡️",
    title: "Rate Limiting",
    desc: "Per-route rate limiting with custom window, max requests, and key generators. Redis-backed for distributed systems.",
    tags: ["@RateLimit", "custom keyGen"],
  },
  {
    icon: "📊",
    title: "Observability",
    desc: "Structured logging with Pino, Prometheus metrics, activity audit logging, and request tracing built in.",
    tags: ["@LogActivity", "@TrackMetrics", "Pino"],
  },
  {
    icon: "💉",
    title: "Dependency Injection",
    desc: "Lightweight DI container with singleton support. Services auto-resolved and injected into controllers.",
    tags: ["@Injectable", "@Singleton"],
  },
  {
    icon: "📖",
    title: "API Documentation",
    desc: "Inline OpenAPI-style docs directly on your controllers. Tags, summaries, and response schemas alongside your code.",
    tags: ["@ApiDoc", "@ApiTags", "@ApiResponse"],
  },
];

function FeatureCard({ icon, title, desc, tags }: any) {
  return (
    <div
      className="bg-(--color-surface) p-7 transition-colors duration-200
                 hover:bg-(--color-surface2) group"
    >
      <div className="text-[1.3rem] mb-4">{icon}</div>
      <h3
        className="font-sans text-[0.95rem] font-bold
                   tracking-[-0.01em] mb-2"
      >
        {title}
      </h3>
      <p
        className="font-mono text-[0.76rem]
                   text-(--color-muted) leading-[1.75]"
      >
        {desc}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {tags.map((t: any) => (
          <span
            key={t}
            className="font-mono text-[0.63rem] px-2 py-0.5
                       bg-[rgba(255,107,53,0.06)] border border-[rgba(255,107,53,0.14)]
                       text-(--color-accent2) rounded-[2px]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="max-w-275 mx-auto px-6 py-20">
      {/* Header */}
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-(--color-accent) mb-3">
        what's inside
      </p>
      <h2
        className="font-sans font-extrabold tracking-[-0.02em]
                   text-[clamp(1.8rem,3vw,2.6rem)] mb-3"
      >
        Everything you need.
        <br />
        Nothing you don't.
      </h2>
      <p
        className="font-mono text-[0.83rem] text-(--color-muted)
                   leading-[1.7] max-w-110 mb-12"
      >
        Production-grade architecture out of the box. Focus on business
        logic, not boilerplate.
      </p>

      {/* Grid */}
      <div
        className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border
                   border-(--color-border) rounded-xl overflow-hidden"
        style={{ gap: "1px", background: "var(--color-border)" }}
      >
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
