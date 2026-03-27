const DECORATOR_GROUPS = [
  {
    label: "Routing",
    items: [
      { name: "@Controller(path, opts)", desc: "Registers a class as a controller. Accepts basePath, platform, and version." },
      { name: "@Get(path?)",             desc: "Maps method to HTTP GET. Optional sub-path." },
      { name: "@Post(path?)",            desc: "Maps method to HTTP POST." },
      { name: "@Put(path?)",             desc: "Maps method to HTTP PUT." },
      { name: "@Delete(path?)",          desc: "Maps method to HTTP DELETE." },
      { name: "@Patch(path?)",           desc: "Maps method to HTTP PATCH." },
    ],
  },
  {
    label: "Auth & Security",
    items: [
      { name: "@RequireAuth()",            desc: "Requires a valid JWT token. Returns 401 if missing or invalid." },
      { name: "@RequireRole(...roles)",    desc: "Requires user to have one of the specified roles. Returns 403 on failure." },
      { name: "@RequirePermission(...p)", desc: "Requires ALL listed permissions for fine-grained access control." },
      { name: "@Public()",                 desc: "Marks route as public, bypassing all auth guards." },
      { name: "@RateLimit(opts)",          desc: "Limits requests per window. Options: max, windowMs, message, keyGenerator." },
    ],
  },
  {
    label: "Validation & Params",
    items: [
      { name: "@ValidatedBody(schema)",       desc: "Parses and validates request body against a Zod schema." },
      { name: "@ValidatedQuery(schema)",      desc: "Parses and validates query string parameters against a Zod schema." },
      { name: "@ValidatedParam(name, schema)",desc: "Validates a single route param against a Zod schema." },
      { name: "@User()",                      desc: "Injects the authenticated user object from context." },
      { name: "@Body()",                      desc: "Injects raw request body without validation." },
      { name: "@Query(key?)",                 desc: "Injects query params or a specific query key." },
      { name: "@Param(key)",                  desc: "Injects a raw route param by name." },
    ],
  },
  {
    label: "Performance & Caching",
    items: [
      { name: "@Cache(opts)", desc: "Caches response in Redis. Options: ttl (seconds), key." },
    ],
  },
  {
    label: "Observability & Logging",
    items: [
      { name: "@LogActivity(event, opts)", desc: "Logs an audit event after method execution. Options: includeBody." },
      { name: "@TrackMetrics(opts)",       desc: "Records Prometheus metrics for this endpoint. Options: name." },
    ],
  },
  {
    label: "API Documentation",
    items: [
      { name: "@ApiTags(...tags)",         desc: "Groups controller endpoints under named tags." },
      { name: "@ApiDoc(opts)",             desc: "Documents an endpoint. Options: summary, description." },
      { name: "@ApiResponse(status, msg)", desc: "Describes a possible HTTP response status for this endpoint." },
    ],
  },
  {
    label: "Dependency Injection",
    items: [
      { name: "@Injectable()", desc: "Registers a class in the DI container." },
      { name: "@Singleton()",  desc: "Ensures only one instance is created and shared across the app." },
    ],
  },
];

function DecoratorItem({ name, desc }: any) {
  return (
    <div
      className="flex flex-col gap-1 p-3 border border-[var(--color-border)]
                 rounded-[4px] bg-[var(--color-surface)] transition-all duration-200
                 hover:border-[rgba(255,107,53,0.3)] hover:bg-[var(--color-surface2)]"
    >
      <span
        className="font-[family-name:var(--font-mono)] text-[0.76rem] font-semibold
                   text-[var(--color-accent)] whitespace-nowrap"
      >
        {name}
      </span>
      <span
        className="font-[family-name:var(--font-mono)] text-[0.69rem]
                   text-[var(--color-muted)] leading-[1.55]"
      >
        {desc}
      </span>
    </div>
  );
}

function DecoratorGroup({ label, items }: any) {
  return (
    <div className="mb-8">
      <p
        className="font-[family-name:var(--font-mono)] text-[0.67rem] uppercase
                   tracking-[0.1em] text-[var(--color-muted)] mb-3 pb-2
                   border-b border-[var(--color-border)]"
      >
        {label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map((item: any) => (
          <DecoratorItem key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function DecoratorsRef() {
  return (
    <section id="decorators" className="max-w-[1100px] mx-auto px-6 py-20">
      {/* Header */}
      <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.15em] text-[var(--color-accent)] mb-3">
        reference
      </p>
      <h2
        className="font-[family-name:var(--font-sans)] font-extrabold tracking-[-0.02em]
                   text-[clamp(1.8rem,3vw,2.6rem)] mb-3"
      >
        All decorators.
      </h2>
      <p
        className="font-[family-name:var(--font-mono)] text-[0.83rem] text-[var(--color-muted)]
                   leading-[1.7] max-w-[440px] mb-12"
      >
        Every decorator available in the template, organized by category.
      </p>

      <div className="reveal">
        {DECORATOR_GROUPS.map((group) => (
          <DecoratorGroup key={group.label} {...group} />
        ))}
      </div>
    </section>
  );
}
