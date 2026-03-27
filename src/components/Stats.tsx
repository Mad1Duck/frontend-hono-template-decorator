const STATS = [
  { value: '14k+',  label: 'req / sec'   },
  { value: '3.2ms', label: 'avg latency' },
  { value: '20+',   label: 'decorators'  },
  { value: 'MIT',   label: 'license'     },
]

export default function Stats() {
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
