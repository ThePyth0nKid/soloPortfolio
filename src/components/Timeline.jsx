import { useState } from 'react'

const ITEMS = [
  { year: 2016, title: 'BS Computer Science', desc: 'Graduated from UC Berkeley.', category: 'Education' },
  { year: 2017, title: 'Software Engineer at Stripe', desc: 'Payments infra, API design, on-call pager trauma.', category: 'Work' },
  { year: 2019, title: 'Launched StackTrace', desc: 'Side project that found a small, loyal audience.', category: 'Projects' },
  { year: 2020, title: 'Staff Engineer at Figma', desc: 'Led the multiplayer cursor rewrite.', category: 'Work' },
  { year: 2022, title: 'MS in HCI', desc: 'Part-time degree from Georgia Tech.', category: 'Education' },
  { year: 2023, title: 'Launched Sundial', desc: 'Energy-aware calendar. Still a WIP.', category: 'Projects' },
  { year: 2024, title: 'Went solo', desc: 'Left big tech to build independently.', category: 'Work' },
  { year: 2025, title: 'Launched PatchParty', desc: 'Five AI agents, one issue, you pick the winner.', category: 'Projects' },
]

const FILTERS = ['All', 'Work', 'Education', 'Projects']

export default function Timeline() {
  const [filter, setFilter] = useState('All')

  return (
    <section id="timeline" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold">Timeline</h2>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs border transition-colors ${
                filter === f
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <ol className="relative border-l border-slate-800 ml-3">
          {ITEMS.map((item) => {
            const visible = filter === 'All' || filter === item.category
            return (
              <li
                key={item.year + item.title}
                aria-hidden={!visible}
                className={`ml-6 overflow-hidden transition-all duration-300 ease-out ${
                  visible ? 'opacity-100 max-h-40 py-3' : 'opacity-0 max-h-0 py-0 pointer-events-none'
                }`}
              >
                <span className="absolute -left-1.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-slate-950" />
                <div className="flex items-baseline gap-3">
                  <time className="text-sm font-mono text-purple-400">{item.year}</time>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">{item.category}</span>
                </div>
                <h3 className="font-semibold mt-1">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
