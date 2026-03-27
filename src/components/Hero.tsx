import { useState } from "react";

const TECH_BADGES = [
  { label: "Hono 4.0+",      cls: "text-orange-400 border-orange-400/30 bg-orange-400/5" },
  { label: "Bun 1.0+",       cls: "text-green-400  border-green-400/30  bg-green-400/5"  },
  { label: "TypeScript 5.0+",cls: "text-blue-400   border-blue-400/30   bg-blue-400/5"   },
  { label: "Drizzle ORM",    cls: "text-purple-400 border-purple-400/30 bg-purple-400/5" },
  { label: "Zod",            cls: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
  { label: "Redis",          cls: "text-slate-400  border-slate-400/30  bg-slate-400/5"  },
  { label: "Pino",           cls: "text-slate-400  border-slate-400/30  bg-slate-400/5"  },
  { label: "Prometheus",     cls: "text-orange-400 border-orange-400/30 bg-orange-400/5" },
];

const INSTALL_CMD = "bun create hono-decorator@latest my-app";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center
                 px-6 pt-24 pb-16 text-center overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                   rounded-full pointer-events-none animate-glow-breathe"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.13) 0%, transparent 70%)",
        }}
      />

      {/* Live badge */}
      <div
        className="animate-fade-up [animation-delay:0ms] inline-flex items-center gap-2 mb-8
                   font-mono text-[0.68rem] uppercase tracking-[0.12em]
                   text-(--color-accent) border border-accent/30
                   bg-accent/5 px-3 py-1.5 rounded-[2px]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent) animate-pulse-dot" />
        v1.0 · npm package · open source
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up [animation-delay:80ms] font-sans
                   font-extrabold leading-[1.05] tracking-[-0.03em] mb-6
                   text-[clamp(2.8rem,6vw,5.5rem)]"
      >
        Backend template
        <br />
        <span className="text-(--color-accent)">decorator</span> style.
        <br />
        <span className="text-(--color-muted)">production ready.</span>
      </h1>

      {/* Sub */}
      <p
        className="animate-fade-up [animation-delay:160ms] font-mono
                   text-[0.92rem] text-(--color-muted) max-w-125 leading-[1.75] mb-10"
      >
        NestJS-inspired decorators on top of Hono's blazing-fast core.
        Controllers, DI, auth guards, rate limiting — all declarative.
        Built for Bun. Zero boilerplate.
      </p>

      {/* CTA buttons */}
      <div className="animate-fade-up [animation-delay:240ms] flex items-center gap-4 flex-wrap justify-center mb-10">
        <a
          href="https://github.com/Mad1Duck/hono-backend-template-decorator-style"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-(--color-accent) text-white
                     font-mono text-[0.78rem] font-semibold
                     tracking-[0.05em] px-6 py-3 rounded-[3px] no-underline
                     shadow-[0_0_28px_rgba(255,107,53,0.35)] transition-all duration-200
                     hover:bg-(--color-accent2) hover:shadow-[0_0_44px_rgba(255,107,53,0.55)]
                     hover:-translate-y-px"
        >
          View on GitHub ↗
        </a>
        <a
          href="#usage"
          className="inline-flex items-center gap-2 text-(--color-muted)
                     font-mono text-[0.78rem] tracking-[0.05em]
                     px-6 py-3 border border-(--color-border2) rounded-[3px] no-underline
                     transition-all duration-200 hover:border-(--color-accent)
                     hover:text-(--color-accent)"
        >
          Quick start →
        </a>
      </div>

      {/* Install command */}
      <div
        className="animate-fade-up [animation-delay:320ms] inline-flex items-center gap-4
                   bg-(--color-surface) border border-(--color-border2)
                   rounded-[6px] px-5 py-3.5 font-mono text-[0.88rem]
                   max-w-full overflow-hidden"
      >
        <span className="text-(--color-accent) select-none">$</span>
        <span className="text-(--color-text) whitespace-nowrap">{INSTALL_CMD}</span>
        <button
          onClick={handleCopy}
          className={`text-[0.68rem] px-2.5 py-1 border rounded-[3px] cursor-pointer
                     font-mono tracking-[0.04em] transition-all duration-200
                     whitespace-nowrap bg-transparent
                     ${
                       copied
                         ? "border-green-400 text-green-400"
                         : "border-(--color-border2) text-(--color-muted) hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                     }`}
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>

      {/* Tech badges */}
      <div className="animate-fade-up [animation-delay:400ms] flex gap-2 flex-wrap justify-center mt-7">
        {TECH_BADGES.map((b) => (
          <span
            key={b.label}
            className={`font-mono text-[0.67rem] tracking-[0.05em]
                        px-2.5 py-1 border rounded-[3px] ${b.cls}`}
          >
            {b.label}
          </span>
        ))}
      </div>
    </section>
  );
}
