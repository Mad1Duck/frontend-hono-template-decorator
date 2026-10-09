const FLOWS = [
	{
		file: "/flows/todo.flow.yaml",
		name: "todo.flow.yaml",
		desc: "CRUD chain — list → create (extracts {{id}}) → get → delete, with auth + validation assertions.",
	},
	{
		file: "/flows/feed.flow.yaml",
		name: "feed.flow.yaml",
		desc: "Live SSE feed node — listens to the server-sent event stream for 10s.",
	},
];

export default function ApiTester() {
	return (
		<section id="api-tester" className="decorator-section">
			<div className="section-label">try it</div>
			<h2 className="section-title">Generated flows, ready to run.</h2>
			<p className="section-desc">
				hono-forge can emit ready-to-execute{" "}
				<code>.flow.yaml</code> files straight from your route metadata —
				CRUD chains, sample bodies from <code>@Validate</code> schemas, auth
				header placeholders, and SSE/WS nodes. Import them into{" "}
				<strong>api-tester</strong> (our Electron API client) and hit Run.
			</p>

			<div className="feature-grid reveal">
				{FLOWS.map((f) => (
					<div key={f.file} className="feature-card">
						<div className="feature-title">{f.name}</div>
						<div className="feature-desc">{f.desc}</div>
						<a className="btn-ghost" href={f.file} download>
							Download {f.name}
						</a>
					</div>
				))}
			</div>

			<p className="section-desc" style={{ marginTop: "2rem" }}>
				<strong>Using the flows:</strong> start the example app{" "}
				<code>bun examples/todo-api/index.ts</code>, open api-tester →{" "}
				<em>Import flow</em> → pick a file → set the <code>{"{{token}}"}</code>{" "}
				variable → Run. Generate your own with{" "}
				<code>bunx hono-forge flows ./src/app.module.ts</code>, or point the
				importer at <code>/openapi.json</code> for REST+SSE+WS node generation
				without any flow files.
			</p>
		</section>
	);
}
