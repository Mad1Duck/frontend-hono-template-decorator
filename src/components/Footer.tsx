export default function Footer() {
  return (
    <footer className="border-t border-(--color-border) relative z-1">
      <div
        className="max-w-275 mx-auto px-6 py-8 flex flex-wrap items-center
                   justify-between gap-4 font-mono text-[0.73rem]
                   text-(--color-muted)"
      >
        <span>
          🔥{" "}
          <strong className="text-(--color-text)">
            create-hono-decorator
          </strong>{" "}
          — MIT License
        </span>

        <span className="flex items-center gap-3 flex-wrap">
          Built by{" "}
          <a
            href="https://github.com/Mad1Duck"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-accent) no-underline hover:underline"
          >
            Mad1Duck
          </a>
          <span className="text-(--color-border2)">·</span>
          <a
            href="https://github.com/Mad1Duck/hono-backend-template-decorator-style"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-accent) no-underline hover:underline"
          >
            GitHub ↗
          </a>
          <span className="text-(--color-border2)">·</span>
          <a
            href="https://www.npmjs.com/package/create-hono-decorator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-accent) no-underline hover:underline"
          >
            npm ↗
          </a>
        </span>

        <span>
          Powered by{" "}
          <a
            href="https://hono.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-accent) no-underline hover:underline"
          >
            Hono
          </a>{" "}
          +{" "}
          <a
            href="https://bun.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-accent) no-underline hover:underline"
          >
            Bun
          </a>
        </span>
      </div>
    </footer>
  );
}
