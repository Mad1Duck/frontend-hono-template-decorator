import { useState } from 'react'
import { DOC_GROUPS, type DocItem } from '#/data/decorators'

export default function DecoratorsRef() {
  const [tooltip, setTooltip] = useState<{ name: string; example: string; x: number; y: number } | null>(null)

  const handleMouseEnter = (item: DocItem, e: React.MouseEvent) => {
    if (!item.example) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const TOOLTIP_W = 500
    const TOOLTIP_MAX_H = 400
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Prefer below the item, flip above if not enough space
    let top = rect.bottom + 8
    if (top + TOOLTIP_MAX_H > vh) top = rect.top - TOOLTIP_MAX_H - 8

    // Clamp horizontally
    let left = rect.left
    if (left + TOOLTIP_W > vw - 12) left = vw - TOOLTIP_W - 12
    if (left < 12) left = 12

    setTooltip({ name: item.name, example: item.example, x: left, y: top })
  }

  const handleMouseLeave = () => setTooltip(null)

  return (
    <section id="decorators" className="decorator-section">
      <div className="section-label">reference</div>
      <h2 className="section-title">All decorators.</h2>
      <p className="section-desc">
        Every decorator and API available in hono-forge, organized by category.
        Hover any item to see a usage example.
      </p>

      <div className="reveal">
        {DOC_GROUPS.map((g) => (
          <div key={g.label} className="decorator-group">
            <div className="group-label">{g.label}</div>
            <div className="decorator-list">
              {g.items.map((item) => (
                <div
                  key={item.name}
                  className={`dec-item${item.example ? ' dec-item--hoverable' : ''}`}
                  onMouseEnter={(e) => handleMouseEnter(item, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div>
                    <div className="dec-name">
                      {item.name}
                      {item.example && <span className="dec-hint">hover</span>}
                    </div>
                    <div className="dec-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip — fixed so it escapes any overflow:hidden ancestor */}
      {tooltip && (
        <div
          className="dec-tooltip"
          style={{ position: 'fixed', top: tooltip.y, left: tooltip.x }}
          onMouseEnter={() => setTooltip(tooltip)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="dec-tooltip-header">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
            <span className="dec-tooltip-title">{tooltip.name}</span>
          </div>
          <pre className="dec-tooltip-code">{tooltip.example}</pre>
        </div>
      )}
    </section>
  )
}
