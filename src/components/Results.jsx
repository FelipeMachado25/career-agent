import { useState } from 'react'
import ShareButton from './ShareButton.jsx'

const TABS = [
  { key: 'unconventional', label: 'Unconventional', blurb: "Paths you've probably never considered." },
  { key: 'conventional', label: 'Conventional', blurb: 'Established professions that fit you.' },
]

function CareerCard({ path }) {
  const [open, setOpen] = useState(false)
  const hasResearch = path.salary || path.outlook || path.skills.length > 0 || path.firstStep

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-lg space-y-2">
      <h3 className="text-gold font-bold text-lg">{path.title}</h3>
      <p className="text-white text-sm leading-relaxed">{path.why}</p>

      {hasResearch && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            className="text-gold text-sm font-medium hover:opacity-80 transition-opacity"
          >
            {open ? 'Hide research ▲' : 'Show research ▼'}
          </button>

          {open && (
            <dl className="text-sm space-y-2 pt-2 border-t border-border">
              {path.salary && (
                <div>
                  <dt className="text-muted text-xs uppercase tracking-wide">Typical salary</dt>
                  <dd className="text-white">{path.salary}</dd>
                </div>
              )}
              {path.outlook && (
                <div>
                  <dt className="text-muted text-xs uppercase tracking-wide">Outlook</dt>
                  <dd className="text-white">{path.outlook}</dd>
                </div>
              )}
              {path.skills.length > 0 && (
                <div>
                  <dt className="text-muted text-xs uppercase tracking-wide">Key skills</dt>
                  <dd className="flex flex-wrap gap-2 pt-1">
                    {path.skills.map(skill => (
                      <span
                        key={skill}
                        className="border border-border rounded-full px-3 py-0.5 text-white text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {path.firstStep && (
                <div>
                  <dt className="text-muted text-xs uppercase tracking-wide">First step this week</dt>
                  <dd className="text-white">{path.firstStep}</dd>
                </div>
              )}
            </dl>
          )}
        </>
      )}
    </div>
  )
}

export default function Results({ careers, onRetry, isError }) {
  const [activeTab, setActiveTab] = useState('unconventional')

  if (isError || !careers) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <p className="text-white text-lg">
            Something went wrong generating your career paths. Please try again.
          </p>
          <button
            onClick={onRetry}
            className="bg-gold text-navy font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const tab = TABS.find(t => t.key === activeTab)

  return (
    <div className="min-h-screen bg-navy p-4">
      <div className="max-w-md mx-auto py-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">
          Your Career Paths
        </h2>

        <div role="tablist" className="flex bg-surface border border-border rounded-full p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === t.key ? 'bg-gold text-navy' : 'text-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="text-muted text-sm text-center">{tab.blurb}</p>

        <div role="tabpanel" className="space-y-4">
          {careers[activeTab].map((path, i) => (
            <CareerCard key={`${activeTab}-${i}`} path={path} />
          ))}
        </div>

        <p className="text-muted text-xs text-center">
          Research figures are AI-generated estimates — verify before making decisions.
        </p>

        <ShareButton />
      </div>
    </div>
  )
}
