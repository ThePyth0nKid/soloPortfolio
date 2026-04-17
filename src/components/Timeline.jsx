const MILESTONES = [
  {
    year: '2024',
    title: 'Launched PatchParty',
    description: 'Shipped an AI agent arena for GitHub issues. Five agents, one winner.',
    category: 'projects',
  },
  {
    year: '2023',
    title: 'Went Solo',
    description: 'Left big tech to build independent products full-time. No regrets (mostly).',
    category: 'work',
  },
  {
    year: '2022',
    title: 'Staff Engineer at Stripe',
    description: 'Led platform tooling team. Learned how real infra scales — and breaks.',
    category: 'work',
  },
  {
    year: '2021',
    title: 'Shipped Sundial v1',
    description: 'Side-project calendar that schedules around energy, not free time.',
    category: 'projects',
  },
  {
    year: '2018',
    title: 'Senior Engineer at Figma',
    description: 'Built collaborative editing primitives. Found my love for CRDTs.',
    category: 'work',
  },
  {
    year: '2016',
    title: 'M.S. Computer Science',
    description: 'Stanford. Thesis on distributed systems nobody reads anymore.',
    category: 'education',
  },
  {
    year: '2014',
    title: 'B.S. Computer Science',
    description: 'UC Berkeley. Graduated with a caffeine dependency and a GitHub streak.',
    category: 'education',
  },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
]

export default function Timeline() {
  return (
    <section id="timeline" className="timeline-section">
      <div className="timeline-wrap">
        <header className="timeline-header">
          <h2>Timeline</h2>
          <p>A decade of shipping, learning, and occasionally breaking production.</p>
        </header>

        {/* Radio inputs drive the filter state purely via CSS :has() — no JS. */}
        <fieldset className="timeline-filter" aria-label="Filter timeline by category">
          {FILTERS.map((f, i) => (
            <label key={f.id} className="filter-chip">
              <input
                type="radio"
                name="timeline-filter"
                value={f.id}
                defaultChecked={i === 0}
              />
              <span>{f.label}</span>
            </label>
          ))}
        </fieldset>

        <ol className="timeline-list">
          {MILESTONES.map((m, i) => (
            <li
              key={m.title}
              className="timeline-item"
              data-category={m.category}
              style={{ '--i': i }}
            >
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-card">
                <div className="timeline-meta">
                  <time>{m.year}</time>
                  <span className="timeline-tag" data-tag={m.category}>
                    {m.category}
                  </span>
                </div>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
