import { useState } from 'react'

const TECH_BADGES = [
  { label: 'Hono 4.0+',       cls: 'tb-orange' },
  { label: 'Bun 1.0+',        cls: 'tb-green'  },
  { label: 'TypeScript 5.0+', cls: 'tb-blue'   },
  { label: 'Drizzle ORM',     cls: 'tb-purple' },
  { label: 'Zod',             cls: 'tb-yellow' },
  { label: 'Redis',           cls: 'tb-gray'   },
  { label: 'Pino',            cls: 'tb-gray'   },
  { label: 'Prometheus',      cls: 'tb-orange' },
]

const INSTALL_CMD = 'bun create hono-decorator@latest my-app'

export default function Hero() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="hero">
      <div className="hero-glow" />

      <div className="hero-badge">
        v1.0 · npm package · open source
      </div>

      <h1>
        Backend template<br />
        <span className="accent">decorator</span> style.<br />
        <span className="dim">production ready.</span>
      </h1>

      <p className="hero-sub">
        NestJS-inspired decorators on top of Hono's blazing-fast core.
        Controllers, DI, auth guards, rate limiting — all declarative.
        Built for Bun. Zero boilerplate.
      </p>

      <div className="hero-actions">
        <a
          href="https://github.com/Mad1Duck/hono-backend-template-decorator-style"
          className="btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub ↗
        </a>
        <a href="#usage" className="btn-ghost">
          Quick start →
        </a>
      </div>

      <div className="install-block">
        <span className="prompt">$</span>
        <span className="cmd">{INSTALL_CMD}</span>
        <button
          className={`copy-btn${copied ? ' copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'copied!' : 'copy'}
        </button>
      </div>

      <div className="tech-row">
        {TECH_BADGES.map((b) => (
          <span key={b.label} className={`tech-badge ${b.cls}`}>{b.label}</span>
        ))}
      </div>
    </div>
  )
}
