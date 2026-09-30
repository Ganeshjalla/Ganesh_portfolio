import { certifications, education, virtualExperiences } from '../data/content'
import { FadeUp, SectionHead } from './Reveal'

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 sm:py-36">
      <div className="veil-left pointer-events-none absolute inset-0" aria-hidden />
      <div className="section">
        <SectionHead id="experience-title" index="05" label="CERTIFICATIONS" title="Verified learning and industry simulations." sub="Certifications and virtual job experiences completed alongside my degree." />

        <div className="grid gap-12 lg:grid-cols-2">
          <FadeUp>
            <h3 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-accent">CERTIFICATIONS</h3>
            <ol className="relative border-l hairline">
              {certifications.map((c) => (
                <li key={c.title} className="relative pb-9 pl-8 last:pb-0">
                  <span aria-hidden className="absolute -left-[4.5px] top-2 h-2 w-2 rounded-full border border-accent bg-ink" />
                  <p className="text-xl font-semibold tracking-tight">{c.org}</p>
                  <p className="mt-1 text-[15px] text-muted">{c.title}</p>
                </li>
              ))}
            </ol>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h3 className="mb-6 font-mono text-[11px] tracking-[0.2em] text-accent">VIRTUAL EXPERIENCES</h3>
            <ol className="relative border-l hairline">
              {virtualExperiences.map((v) => (
                <li key={v.title} className="relative pb-9 pl-8 last:pb-0">
                  <span aria-hidden className="absolute -left-[4.5px] top-2 h-2 w-2 rounded-full border border-white/50 bg-ink" />
                  <p className="text-xl font-semibold tracking-tight">{v.org}</p>
                  <p className="mt-1 text-[15px] text-text/85">{v.title}</p>
                  <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-muted">{v.text}</p>
                </li>
              ))}
            </ol>
          </FadeUp>
        </div>

        <div className="mt-24 sm:mt-32" id="education">
          <FadeUp>
            <p className="eyebrow mb-4 flex items-center gap-3"><span className="text-accent">06</span><span aria-hidden className="h-px w-10 bg-white/20" />EDUCATION</p>
            <h3 className="h-section max-w-3xl">Where the fundamentals come from.</h3>
          </FadeUp>
          <ol className="mt-12 space-y-4">
            {education.map((e, i) => (
              <li key={e.school}>
                <FadeUp delay={i * 0.1}>
                  <div className="glass grid items-end gap-6 rounded-3xl p-7 sm:grid-cols-[1fr_auto] sm:p-10">
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.18em] text-muted">{e.years} · {e.place}</p>
                      <p className="mt-3 text-2xl font-semibold tracking-tightest sm:text-4xl">{e.school}</p>
                      <p className="mt-2 text-[16px] text-muted">{e.program}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-mono text-[11px] tracking-[0.18em] text-accent">{e.metricLabel}</p>
                      <p className="mt-1 text-4xl font-semibold tracking-tightest sm:text-6xl">{e.metric}</p>
                    </div>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
