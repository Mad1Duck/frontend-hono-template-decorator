import { useEffect, useState } from 'react'

const GITHUB_REPO = 'Mad1Duck/hono-decorator'
const NPM_PACKAGE = 'hono-forge'

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k+`
  return String(n)
}

export default function Stats() {
  const [stars, setStars]       = useState<string>('...')
  const [downloads, setDownloads] = useState<string>('...')

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => r.json())
      .then((d) => setStars(formatNum(d.stargazers_count ?? 0)))
      .catch(() => setStars('—'))

    fetch(`https://api.npmjs.org/downloads/point/2000-01-01:2099-01-01/${NPM_PACKAGE}`)
      .then((r) => r.json())
      .then((d) => setDownloads(formatNum(d.downloads ?? 0)))
      .catch(() => setDownloads('—'))
  }, [])

  const STATS = [
    { value: '14k+',    label: 'req / sec'       },
    { value: '50+',     label: 'decorators'       },
    { value: stars,     label: 'GitHub stars'     },
    { value: downloads, label: 'npm downloads'    },
  ]

  return (
    <section>
      <div className="stats-row reveal">
        {STATS.map((s) => (
          <div key={s.label} className="stat-box">
            <span className="stat-val">{s.value}</span>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
