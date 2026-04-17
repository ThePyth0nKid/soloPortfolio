import { useState, useId, useMemo } from 'react'

const MILESTONES = [
  {
    year: '2016',
    title: 'BSc Computer Science',
    description: 'Graduated from the University of Waterloo with a focus on distributed systems and human-computer interaction.',
    category: 'Education',
  },
  {
    year: '2017',
    title: 'Software Engineer at Stripe',
    description: 'Worked on payments infrastructure — learned how to write code that cannot afford to be wrong.',
    category: 'Work',
  },
  {
    year: '2019',
    title: 'Launched StackTrace (beta)',
    description: 'A side project that used early LLMs to surface better answers from buried Stack Overflow threads.',
    category: 'Projects',
  },
  {
    year: '2020',
    title: 'Senior Engineer at Figma',
    description: 'Shipped collaborative cursors and real-time presence across millions of concurrent sessions.',
    category: 'Work',
  },
  {
    year: '2022',
    title: 'Recurse Center batch',
    description: 'A twelve-week self-directed programming retreat. Rebuilt a database from scratch; relearned how to learn.',
    category: 'Education',
  },
  {
    year: '2023',
    title: 'Released Sundial',
    description: 'An energy-aware calendar app. First solo product to cross 1,000 paying users.',
    category: 'Projects',
  },
  {
    year: '2024',
    title: 'Went independent',
    description: 'Left full-time work to build AI tooling for developers. Shipping weekly, answering my own support email.',
    category: 'Work',
  },
  {
    year: '2025',
    title: 'PatchParty launch',
    description: 'Open-sourced a multi-agent coding playground. Received a Product Hunt #2 of the day.',
    category: 'Projects',
  },
]

const FILTERS = ['All', 'Work', 'Education', 'Projects']

const CATEGORY_STYLES = {
  Work: 'bg-sky-500/10 text-sky-300 border-sky-400/40',
  Education: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
  Projects: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-400/40',
}

export default function Timeline() {
  const [filter, setFilter] = useState('All')
  const headingId = useId()
  const statusId = useId()

  const visible = useMemo(
    () => (filter === 'All' ? MILESTONES : MILESTONES.filter((m) => m.category === filter)),
    [filter]
  )

  const countLabel =
    filter === 'All'
      ? `Showing all ${visible.length} milestones`
      : `Showing ${visible.length} ${filter.toLowerCase()} ${
          visible.length === 1 ? 'milestone' : 'milestones'
        }`

  return (
    <section
      id="timeline"
      aria-labelledby={headingId}
      className="py-24 px-6"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <h2 id={headingId} className="text-4xl font-bold">
            Career Timeline
          </h2>
          <p className="text-slate-400 leading-relaxed">
            A running log of work, study, and things I've shipped. Use the filters to narrow the view.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter timeline by category"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((name) => {
            const isActive = filter === name
            return (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                aria-pressed={isActive}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  'focus-visible:ring-purple-300 focus-visible:ring-offset-slate-950',
                  isActive
                    ? 'bg-purple-500 border-purple-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white',
                ].join(' ')}
              >
                {name}
              </button>
            )
          })}
        </div>

        <p
          id={statusId}
          role="status"
          aria-live="polite"
          className="text-sm text-slate-400"
        >
          {countLabel}
        </p>

        {visible.length === 0 ? (
          <p className="text-slate-300">No milestones match this filter yet.</p>
        ) : (
          <ol
            aria-describedby={statusId}
            className="relative border-l border-slate-700 ml-3 space-y-8 pl-8"
          >
            {visible.map((item) => {
              const badgeClass =
                CATEGORY_STYLES[item.category] ||
                'bg-slate-700 text-slate-200 border-slate-600'
              return (
                <li
                  key={`${item.year}-${item.title}`}
                  className="relative timeline-item"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.1rem] top-1.5 h-3 w-3 rounded-full bg-purple-400 ring-4 ring-slate-950"
                  />
                  <article className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <time
                        dateTime={item.year}
                        className="text-sm font-mono text-slate-300"
                      >
                        {item.year}
                      </time>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${badgeClass}`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </article>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
