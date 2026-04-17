export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">About</h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            I've spent the last 8 years building products at startups and big
            tech. Burned out twice, learned some lessons. Now I build alone —
            shipping faster, focusing on the work I actually care about.
          </p>
          <p>
            My current focus: AI tooling for developers. I think there's a huge
            gap between "AI hype" and "AI that's actually useful in your daily
            workflow." I'd like to help close it.
          </p>
          <p>
            When I'm not coding, you'll find me running, cooking pasta, or
            losing at chess on the internet.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-4">
          {['React', 'TypeScript', 'Python', 'Postgres', 'AI/ML', 'Design'].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 rounded-md text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
