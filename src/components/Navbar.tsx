const NAV_LINKS = [
	{ label: "Features", href: "/#features" },
	{ label: "Docs", href: "/docs" },
	{ label: "Tutorial", href: "/tutorial" },
	{ label: "Changelog", href: "/changelog" },
	{ label: "GitHub", href: "https://github.com/Mad1Duck/hono-decorator", external: true },
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
						<a
							href={l.href}
							target={l.external ? "_blank" : undefined}
							rel={l.external ? "noopener noreferrer" : undefined}
						>
							{l.label}
						</a>
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
			</ul>
		</nav>
	);
}
