const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Decorators", href: "#decorators" },
  { label: "Usage", href: "#usage" },
  { label: "Architecture", href: "#architecture" },
];

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-15 flex items-center justify-between px-8
                 bg-[#0a0a0b]/85 backdrop-blur-xl border-b border-(--color-border)"
    >
      {/* Logo */}
      <a
        href="#"
        className="flex items-center gap-2 font-mono text-[0.82rem]
                   font-semibold text-(--color-text) no-underline"
      >
        <span className="text-(--color-accent) text-base">🔥</span>
        <span>create-hono-decorator</span>
      </a>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="font-mono text-[0.72rem] uppercase tracking-[0.05em]
                         text-(--color-muted) no-underline transition-colors duration-200
                         hover:text-(--color-text)"
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="https://github.com/Mad1Duck/hono-backend-template-decorator-style"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.72rem] uppercase tracking-[0.05em]
                       text-(--color-accent) border border-(--color-accent) px-3 py-1.5
                       rounded-[3px] no-underline transition-all duration-200
                       hover:bg-(--color-accent) hover:text-white"
          >
            GitHub ↗
          </a>
        </li>
      </ul>
    </nav>
  );
}
