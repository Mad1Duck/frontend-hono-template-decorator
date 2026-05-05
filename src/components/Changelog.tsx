import { useState, useEffect } from 'react'

interface Change {
  type: 'added' | 'fixed' | 'changed' | 'deprecated' | 'removed' | 'security'
  title: string
  description: string
  details?: string
}

interface Release {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  changes: Change[]
}

export default function Changelog() {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['0.2.1']))
  const [releases, setReleases] = useState<Release[]>([
    // Fallback data
    {
      version: '0.2.1',
      date: '2026-05-05',
      type: 'patch',
      changes: [
        {
          type: 'fixed',
          title: '@Stateless runtime enforcement',
          description: 'Resolved @Stateless @Singleton instances are now wrapped in a Proxy'
        }
      ]
    }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        // Fetch package info from npm
        const response = await fetch('https://registry.npmjs.org/hono-forge')
        const packageInfo = await response.json()
        
        // Get versions sorted by semver (newest first)
        const versions = Object.keys(packageInfo.versions)
          .filter(v => !v.includes('-'))
          .sort((a, b) => {
            const aParts = a.split('.').map(Number)
            const bParts = b.split('.').map(Number)
            for (let i = 0; i < 3; i++) {
              if (aParts[i] !== bParts[i]) {
                return bParts[i] - aParts[i]
              }
            }
            return 0
          })
        
        // Get last 10 versions
        const recentVersions = versions.slice(0, 10)
        const releasesData: Release[] = []
        
        for (const version of recentVersions) {
          const versionData = packageInfo.versions[version]
          const date = new Date(versionData.time).toISOString().split('T')[0]
          
          // Determine release type
          const [major, minor] = version.split('.').map(Number)
          let releaseType: Release['type'] = 'patch'
          if (minor === 0 && major > 0) releaseType = 'major'
          else if (minor > 0) releaseType = 'minor'
          
          // Try to fetch changelog from GitHub
          let changes: Change[] = []
          try {
            const changelogUrl = 'https://raw.githubusercontent.com/Mad1Duck/hono-decorator/main/CHANGELOG.md'
            const changelogResponse = await fetch(changelogUrl)
            
            if (changelogResponse.ok) {
              const changelogText = await changelogResponse.text()
              const versionSection = changelogText.match(new RegExp(`## \\[${version}\\].*?(?=## \\[|$)`, 's'))
              
              if (versionSection) {
                const section = versionSection[0]
                
                // Parse changes
                const parseChanges = (text: string, type: Change['type']) => {
                  const lines = text.trim().split('\n')
                  lines.forEach(line => {
                    const match = line.match(/^- (.+?): (.+)/)
                    if (match) {
                      changes.push({
                        type,
                        title: match[1],
                        description: match[2]
                      })
                    }
                  })
                }
                
                const addedMatch = section.match(/### Added\s*\n([\s\S]*?)(?=###|\n##|$)/)
                const fixedMatch = section.match(/### (Fixed|Bug Fixes)\s*\n([\s\S]*?)(?=###|\n##|$)/)
                const changedMatch = section.match(/### Changed\s*\n([\s\S]*?)(?=###|\n##|$)/)
                
                if (addedMatch) parseChanges(addedMatch[1], 'added')
                if (fixedMatch) parseChanges(fixedMatch[2], 'fixed')
                if (changedMatch) parseChanges(changedMatch[2], 'changed')
              }
            }
          } catch (e) {
            // Ignore changelog fetch errors
          }
          
          // If no changes found, add basic entry
          if (changes.length === 0) {
            changes.push({
              type: 'added',
              title: 'Version ' + version,
              description: versionData.description || 'New release'
            })
          }
          
          releasesData.push({
            version,
            date,
            type: releaseType,
            changes
          })
        }
        
        setReleases(releasesData)
      } catch (error) {
        console.error('Failed to fetch changelog:', error)
        // Keep fallback data
      } finally {
        setLoading(false)
      }
    }
    
    fetchChangelog()
  }, [])

  const toggleVersion = (version: string) => {
    const next = new Set(expandedVersions)
    if (next.has(version)) {
      next.delete(version)
    } else {
      next.add(version)
    }
    setExpandedVersions(next)
  }

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'major': return 'rgba(239, 68, 68, 0.15)'
      case 'minor': return 'rgba(96, 165, 250, 0.15)'
      case 'patch': return 'rgba(74, 222, 128, 0.15)'
      default: return 'rgba(148, 163, 184, 0.15)'
    }
  }

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'major': return '#ef4444'
      case 'minor': return '#60a5fa'
      case 'patch': return '#4ade80'
      default: return '#94a3b8'
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return '✨'
      case 'fixed': return '🔧'
      case 'changed': return '🔄'
      case 'deprecated': return '⚠️'
      case 'removed': return '🗑️'
      case 'security': return '🔒'
      default: return '📝'
    }
  }

  return (
    <section id="changelog">
      <div className="section-label">changelog</div>
      <h2 className="section-title">What's new</h2>
      <p className="section-desc">
        All notable changes to hono-forge are documented here. Follows{' '}
        <a href="https://keepachangelog.com" target="_blank" rel="noopener" style={{ color: 'var(--accent)', textDecoration: 'none', transition: 'textDecoration 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
          Keep a Changelog
        </a>{' '}
        and{' '}
        <a href="https://semver.org" target="_blank" rel="noopener" style={{ color: 'var(--accent)', textDecoration: 'none', transition: 'textDecoration 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
          Semantic Versioning
        </a>.
        {loading && <span style={{ marginLeft: '0.5rem', color: 'var(--muted)' }}>Loading...</span>}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }} className="reveal">
        {releases.map((release, idx) => (
          <div key={release.version} style={{ background: 'var(--surface)' }}>
            <button
              style={{
                width: '100%',
                padding: '1.2rem 1.5rem',
                background: 'var(--surface)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'background 0.2s',
                fontFamily: 'var(--mono)',
                fontSize: '0.85rem',
                color: 'var(--text)',
                textAlign: 'left'
              }}
              onClick={() => toggleVersion(release.version)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <span style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '2px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: getTypeBgColor(release.type),
                  color: getTypeTextColor(release.type)
                }}>
                  {release.type.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
                  v{release.version}
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                  {release.date}
                </span>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: '0.7rem', transition: 'transform 0.2s' }}>
                {expandedVersions.has(release.version) ? '−' : '+'}
              </span>
            </button>

            {expandedVersions.has(release.version) && (
              <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {release.changes.map((change, cidx) => (
                    <div key={cidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface2)' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{getChangeIcon(change.type)}</span>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
                          {change.title}
                        </h4>
                        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                          {change.description}
                        </p>
                        {change.details && (
                          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.5rem', opacity: 0.8 }}>
                            {change.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
