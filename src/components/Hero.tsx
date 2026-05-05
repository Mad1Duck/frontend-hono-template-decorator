import { useState, useEffect } from 'react'

const TECH_BADGES = [
  { label: 'Hono 4.0+',       cls: 'tb-orange' },
  { label: 'Bun 1.0+',        cls: 'tb-green'  },
  { label: 'TypeScript 5.0+', cls: 'tb-blue'   },
  { label: 'Zod',             cls: 'tb-yellow' },
  { label: 'SSE',             cls: 'tb-purple' },
  { label: 'WebSocket',       cls: 'tb-purple' },
  { label: 'Redis',           cls: 'tb-gray'   },
  { label: 'OpenAPI 3.1',     cls: 'tb-orange' },
]

const INSTALL_CMD = 'bun add hono-forge hono zod'

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [version, setVersion] = useState('0.2.1') // fallback

  useEffect(() => {
    fetch('https://registry.npmjs.org/hono-forge')
      .then(res => res.json())
      .then(data => {
        setVersion(data['dist-tags'].latest)
      })
      .catch(() => {
        // Keep fallback version if fetch fails
      })
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="hero">
      <div className="hero-glow" />

      <div className="hero-badge">
        v{version} ·{' '}
        <a
          href="https://www.npmjs.com/package/hono-forge"
          target="_blank"
          rel="noopener noreferrer"
        >
          npm package
        </a>
        {' '}· open source
      </div>

      <h1>
        Hono with<br />
        <span className="accent">NestJS-style</span> decorators.<br />
        {/* <span className="dim">production ready.</span> */}
      </h1>

      <p className="hero-sub">
        Controllers, DI, guards, SSE, WebSocket, channels, rate limiting, OpenAPI, structured errors, and trace IDs — all declarative.
        Install one package. No boilerplate.
      </p>

      <div className="hero-actions">
        <a
          href="https://github.com/Mad1Duck/hono-decorator"
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
