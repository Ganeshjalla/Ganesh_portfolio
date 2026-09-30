import { about } from '../data/content'
import { FadeUp, SectionHead } from './Reveal'

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 sm:py-40">
      <div className="veil-left pointer-events-none absolute inset-0" aria-hidden />
      <div className="section">
        <SectionHead id="about-title" index="01" label="ABOUT ME" title={about.statement} />
        <div className="grid gap-14 lg:grid-cols-[minmax(0,560px)_1fr]">
          <div>
            <FadeUp><p className="text-lg leading-relaxed text-text/90 sm:text-xl max-w-[52ch]">{about.body}</p></FadeUp>
            <FadeUp delay={0.1}>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Focus areas">
                {about.focus.map((f) => (
                  <li key={f} className="glass rounded-full px-4 py-2 text-[13px] text-text/85">{f}</li>
                ))}
              </ul>
            </FadeUp>
          </div>

          <FadeUp delay={0.1} className="lg:pl-10">
            <ol className="relative ml-1 border-l hairline" aria-label="Timeline">
              {about.timeline.map((t) => (
                <li key={t.year} className="relative pb-8 pl-8 last:pb-0">
                  <span aria-hidden className="absolute -left-[4.5px] top-2 h-2 w-2 rounded-full border border-accent bg-ink" />
                  <p className="font-mono text-xs tracking-[0.16em] text-accent">{t.year}</p>
                  <p className="mt-1 text-lg font-medium tracking-tight">{t.label}</p>
                  <p className="text-sm text-muted">{t.detail}</p>
                </li>
              ))}
            </ol>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
