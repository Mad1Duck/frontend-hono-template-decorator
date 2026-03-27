const GROUPS = [
  {
    label: 'routing',
    items: [
      { name: '@Controller(path, opts)', desc: 'Registers a class as a controller. Accepts basePath, platform, and version.' },
      { name: '@Get(path?)',             desc: 'Maps method to HTTP GET. Optional sub-path.' },
      { name: '@Post(path?)',            desc: 'Maps method to HTTP POST.' },
      { name: '@Put(path?)',             desc: 'Maps method to HTTP PUT.' },
      { name: '@Delete(path?)',          desc: 'Maps method to HTTP DELETE.' },
      { name: '@Patch(path?)',           desc: 'Maps method to HTTP PATCH.' },
    ],
  },
  {
    label: 'auth & security',
    items: [
      { name: '@RequireAuth()',            desc: 'Requires a valid JWT token. Returns 401 if missing or invalid.' },
      { name: '@RequireRole(...roles)',    desc: 'Requires user to have one of the specified roles. Returns 403 on failure.' },
      { name: '@RequirePermission(...perms)', desc: 'Requires ALL listed permissions. Fine-grained access control.' },
      { name: '@Public()',                 desc: 'Marks route as public, bypassing all auth guards.' },
      { name: '@RateLimit(opts)',          desc: 'Limits requests. Options: max, windowMs, message, keyGenerator.' },
    ],
  },
  {
    label: 'validation & params',
    items: [
      { name: '@ValidatedBody(schema)',        desc: 'Parses and validates request body against a Zod schema.' },
      { name: '@ValidatedQuery(schema)',       desc: 'Parses and validates query string parameters.' },
      { name: '@ValidatedParam(name, schema)', desc: 'Validates a single route param against a Zod schema.' },
      { name: '@User()',                       desc: 'Injects the authenticated user object from context.' },
      { name: '@Body()',                       desc: 'Injects raw request body without validation.' },
      { name: '@Query(key?)',                  desc: 'Injects query params or a specific query key.' },
      { name: '@Param(key)',                   desc: 'Injects a raw route param by name.' },
    ],
  },
  {
    label: 'performance & caching',
    items: [
      { name: '@Cache(opts)', desc: 'Caches response in Redis. Options: ttl (seconds), key.' },
    ],
  },
  {
    label: 'observability & logging',
    items: [
      { name: '@LogActivity(event, opts)', desc: 'Logs an audit event after method execution. Options: includeBody.' },
      { name: '@TrackMetrics(opts)',       desc: 'Records Prometheus metrics for this endpoint. Options: name.' },
    ],
  },
  {
    label: 'api documentation',
    items: [
      { name: '@ApiTags(...tags)',         desc: 'Groups controller endpoints under named tags.' },
      { name: '@ApiDoc(opts)',             desc: 'Documents an endpoint. Options: summary, description.' },
      { name: '@ApiResponse(status, msg)', desc: 'Describes a possible HTTP response for this endpoint.' },
    ],
  },
  {
    label: 'dependency injection',
    items: [
      { name: '@Injectable()', desc: 'Registers a class in the DI container.' },
      { name: '@Singleton()',  desc: 'Ensures only one instance is created and shared.' },
    ],
  },
]

export default function DecoratorsRef() {
  return (
    <section id="decorators" className="decorator-section">
      <div className="section-label">reference</div>
      <h2 className="section-title">All decorators.</h2>
      <p className="section-desc">
        Every decorator available in the template, organized by category.
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
