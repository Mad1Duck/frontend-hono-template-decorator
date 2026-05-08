const NAV_LINKS = [
	{ label: "Features", href: "#features" },
	{ label: "Decorators", href: "#decorators" },
	{ label: "Usage", href: "#usage" },
	{ label: "Architecture", href: "#architecture" },
	{ label: "Changelog", href: "#changelog" },
	{ label: "Feedback", href: "#feedback" },
];

export default function Navbar() {
	return (
		<nav>
			<a href="/" className="nav-logo">
				<span className="flame">🔥</span>
				<span>hono-forge</span>
			</a>
			<ul className="nav-links">
				{NAV_LINKS.map((l) => (
					<li key={l.href}>
						<a href={l.href}>{l.label}</a>
					</li>
				))}
				<li>
					<a
						href="https://www.npmjs.com/package/hono-forge"
						target="_blank"
						rel="noopener noreferrer"
						className="nav-npm"
					>
						npm ↗
					</a>
				</li>
				<li>
					<a
						href="https://github.com/Mad1Duck/hono-decorator"
						target="_blank"
						rel="noopener noreferrer"
						className="nav-github"
					>
						GitHub ↗
					</a>
				</li>
			</ul>
		</nav>
	);
}
