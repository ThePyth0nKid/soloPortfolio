import { useState, useMemo, useRef, useLayoutEffect } from 'react'

const MILESTONES = [
  {
    year: '2016',
    title: 'B.S. Computer Science',
    description: 'Graduated from UC Berkeley. Wrote my first real side project — a terrible chat app — and got hooked.',
    category: 'Education',
  },
  {
    year: '2017',
    title: 'Frontend Engineer @ Stripe',
    description: 'First real job. Learned what production code looks like, and what a good code review feels like.',
    category: 'Work',
  },
  {
    year: '2019',
    title: 'Launched DevDigest',
    description: 'A weekly newsletter for indie developers. Grew to 12k subscribers before I burned out and sunset it.',
    category: 'Projects',
  },
  {
    year: '2020',
    title: 'Senior Engineer @ Figma',
    description: 'Joined the multiplayer team. Shipped features used by millions. Learned to love CRDTs.',
    category: 'Work',
  },
  {
    year: '2022',
    title: 'M.S. Human-Computer Interaction',
    description: 'Part-time at Georgia Tech. Thesis on motion design as affordance in web interfaces.',
    category: 'Education',
  },
  {
    year: '2023',
    title: 'Built StackTrace',
    description: 'LLM-powered search over forgotten Stack Overflow threads. My first AI-native side project.',
    category: 'Projects',
  },
  {
    year: '2024',
    title: 'Went solo',
    description: 'Left big tech. Started shipping products under my own name. Scared, free, caffeinated.',
    category: 'Work',
  },
  {
    year: '2025',
    title: 'Launched PatchParty',
    description: 'Five AI agents race to implement your GitHub issue. Funded by pure stubbornness.',
    category: 'Projects',
  },
]

const FILTERS = ['All', 'Work', 'Education', 'Projects']

const CATEGORY_STYLES = {
  Work: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  Education: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  Projects: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
}

const CATEGORY_DOT = {
  Work: 'bg-purple-400 shadow-[0_0_0_4px_rgba(168,85,247,0.18)]',
  Education: 'bg-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.18)]',
  Projects: 'bg-pink-400 shadow-[0_0_0_4px_rgba(244,114,182,0.18)]',
}

export default function Timeline() {
  const [filter, setFilter] = useState('All')
  const btnRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const visible = useMemo(
    () => MILESTONES.filter((m) => filter === 'All' || m.category === filter),
    [filter],
  )

  useLayoutEffect(() => {
    const el = btnRefs.current[filter]
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [filter])

  return (
    <section id="timeline" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-bold">Timeline</h2>
            <p className="text-slate-400 mt-2">A decade of shipping, learning, and the occasional detour.</p>
          </div>

          <div
            role="tablist"
            aria-label="Filter timeline by category"
            className="relative inline-flex self-start md:self-auto p-1 bg-slate-900 border border-slate-800 rounded-xl"
          >
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 rounded-lg bg-slate-700/60 ring-1 ring-slate-600/50 filter-indicator"
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
              }}
            />
            {FILTERS.map((f) => {
              const active = filter === f
              return (
                <button
                  key={f}
                  ref={(el) => (btnRefs.current[f] = el)}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={`filter-btn relative z-10 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>

        <ol className="relative timeline-list">
          <span
            aria-hidden="true"
            className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent"
          />

          {visible.map((m, i) => (
            <li
              key={`${filter}-${m.year}-${m.title}`}
              className="timeline-item relative pl-10 md:pl-14 pb-10 last:pb-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                aria-hidden="true"
                className={`timeline-dot absolute left-0 md:left-1 top-1.5 h-6 w-6 rounded-full border-2 border-slate-950 grid place-items-center`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${CATEGORY_DOT[m.category]}`} />
              </span>

              <article className="timeline-card group p-5 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-slate-500">{m.year}</span>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_STYLES[m.category]}`}
                  >
                    {m.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100">{m.title}</h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{m.description}</p>
              </article>
            </li>
          ))}

          {visible.length === 0 && (
            <li className="pl-10 md:pl-14 text-slate-500 text-sm">Nothing here yet.</li>
          )}
        </ol>
      </div>
    </section>
  )
}
