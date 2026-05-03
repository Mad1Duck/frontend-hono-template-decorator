export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span>
          🔥 <strong style={{ color: 'var(--text)' }}>hono-forge</strong> — MIT License
        </span>
        <span>
          Built by <a href="https://github.com/Mad1Duck" target="_blank" rel="noopener noreferrer">Mad1Duck</a>
          {' · '}
          <a href="https://github.com/Mad1Duck/hono-decorator" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          {' · '}
          <a href="https://www.npmjs.com/package/hono-forge" target="_blank" rel="noopener noreferrer">npm ↗</a>
        </span>
        <span>
          Powered by <a href="https://hono.dev" target="_blank" rel="noopener noreferrer">Hono</a>
          {' + '}
          <a href="https://bun.sh" target="_blank" rel="noopener noreferrer">Bun</a>
        </span>
      </div>
    </footer>
  )
}
