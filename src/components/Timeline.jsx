import { useState } from 'react'

const MILESTONES = [
  {
    year: '2016',
    title: 'B.S. Computer Science',
    description: 'Graduated from UC Berkeley. Wrote my thesis on distributed systems and drank too much cold brew.',
    category: 'Education',
  },
  {
    year: '2017',
    title: 'Software Engineer at Stripe',
    description: 'First real job. Shipped payment infrastructure used by thousands of merchants. Learned what production actually means.',
    category: 'Work',
  },
  {
    year: '2019',
    title: 'Launched StackTrace',
    description: 'Side project that blew up on Hacker News. LLM-powered search over old forum threads.',
    category: 'Projects',
  },
  {
    year: '2021',
    title: 'Senior Engineer at Figma',
    description: 'Led the plugins platform team. Burned out once, took a month off, came back better.',
    category: 'Work',
  },
  {
    year: '2023',
    title: 'Recurse Center',
    description: 'Three months of deep work on compilers and programming language theory. Reset my brain.',
    category: 'Education',
  },
  {
    year: '2024',
    title: 'Shipped Sundial',
    description: 'Energy-aware calendar app. 5k users in the first month, all from a single tweet.',
    category: 'Projects',
  },
  {
    year: '2025',
    title: 'Went Solo',
    description: 'Left big tech to build independently. Currently working on PatchParty and whatever else feels right.',
    category: 'Work',
  },
]

const CATEGORIES = ['All', 'Work', 'Education', 'Projects']

const CATEGORY_STYLES = {
  Work: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  Education: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Projects: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
}

export default function Timeline() {
  const [filter, setFilter] = useState('All')

  const visible = MILESTONES.map((m) => ({
    ...m,
    hidden: filter !== 'All' && m.category !== filter,
  }))

  return (
    <section id="timeline" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold">Timeline</h2>
          <p className="text-slate-400">A decade of shipping, learning, and occasionally breaking production.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = filter === cat
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <ol className="relative border-l border-slate-800 ml-3 space-y-2">
          {visible.map((m, i) => (
            <li
              key={m.year + m.title}
              className={`relative pl-8 overflow-hidden transition-all duration-500 ease-out ${
                m.hidden
                  ? 'max-h-0 opacity-0 -translate-x-2 py-0'
                  : 'max-h-96 opacity-100 translate-x-0 py-4'
              }`}
              style={{ transitionDelay: m.hidden ? '0ms' : `${i * 40}ms` }}
              aria-hidden={m.hidden}
            >
              <span
                className={`absolute -left-[7px] top-6 w-3 h-3 rounded-full border-2 border-slate-950 transition-colors ${
                  m.category === 'Work'
                    ? 'bg-purple-500'
                    : m.category === 'Education'
                      ? 'bg-blue-500'
                      : 'bg-pink-500'
                }`}
              />
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-slate-500">{m.year}</span>
                    <h3 className="text-lg font-semibold">{m.title}</h3>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${CATEGORY_STYLES[m.category]}`}
                  >
                    {m.category}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{m.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
