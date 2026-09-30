import { Suspense, lazy, useState } from 'react'
import { principles } from '../data/content'
import { FadeUp, SectionHead } from './Reveal'
import { useReduced } from '../hooks/useEnv'

const MindsetScene = lazy(() => import('../scenes/MindsetScene'))

export default function Mindset({ webgl }: { webgl: boolean }) {
  const [active, setActive] = useState<number | null>(null)
  const reduced = useReduced()
  return (
    <section id="mindset" aria-labelledby="mindset-title" className="relative py-28 sm:py-36">
      <div className="section">
        <SectionHead id="mindset-title" index="02" label="ENGINEERING MINDSET" title="Four habits behind every system I build." sub="The same loop applies to a REST endpoint, a database schema, or a graph algorithm." />

        {webgl && (
          <div className="mb-2 h-[170px] sm:h-[230px]" aria-hidden={false}>
            <Suspense fallback={null}>
              <MindsetScene active={active} reduced={reduced} />
            </Suspense>
          </div>
        )}

        <ol className="grid gap-px overflow-hidden rounded-2xl border hairline bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li
              key={p.n}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              className="group bg-ink/90 p-7 transition-colors duration-500 hover:bg-surface focus-visible:bg-surface"
            >
              <FadeUp delay={i * 0.08}>
                <p className="font-mono text-xs tracking-[0.18em] text-accent">{p.n}</p>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.text}</p>
              </FadeUp>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
