export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-600 dark:text-purple-400 theme-transition">
          ✨ Available for new projects
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Alex
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto theme-transition">
          Solo founder building tools that don't suck. Currently obsessed with
          AI agents, developer experience, and minimal design.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
          >
            See my work
          </a>
          <a
            href="#about"
            className="px-6 py-3 border border-slate-300 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-500 rounded-lg font-medium theme-transition"
          >
            About me
          </a>
        </div>
      </div>
    </section>
  )
}
