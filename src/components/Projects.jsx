const PROJECTS = [
  {
    name: 'PatchParty',
    description: 'Five parallel AI agents implement your GitHub issue. You pick the winner.',
    tag: 'AI Tools',
    status: 'Live',
  },
  {
    name: 'StackTrace',
    description: 'Stack overflow alternative that uses LLMs to find better answers from forgotten threads.',
    tag: 'Developer Tools',
    status: 'Beta',
  },
  {
    name: 'Sundial',
    description: 'Calendar that schedules around your energy levels, not your free time.',
    tag: 'Productivity',
    status: 'WIP',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-slate-100/60 dark:bg-slate-900/30">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold">Projects</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PROJECTS.map((project) => (
            <div
              key={project.name}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-400 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    project.status === 'Live'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30'
                      : project.status === 'Beta'
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {project.description}
              </p>
              <div className="text-xs text-slate-500">{project.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
