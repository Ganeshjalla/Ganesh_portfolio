import { Suspense, lazy, useState } from 'react'
import { skills } from '../data/content'
import { SectionHead } from './Reveal'
import { useReduced, useTier } from '../hooks/useEnv'

const Constellation = lazy(() => import('../scenes/SkillsConstellation'))

export default function Skills({ webgl }: { webgl: boolean }) {
  const [selected, setSelected] = useState<string | null>('java')
  const [hovered, setHovered] = useState<string | null>(null)
  const reduced = useReduced()
  const tier = useTier()
  const focusId = hovered ?? selected
  const focus = skills.find((s) => s.id === focusId) ?? null

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-28 sm:py-36">
      <div className="section">
        <SectionHead id="skills-title" index="03" label="TECHNOLOGY CONSTELLATION" title="The stack, and how it connects." sub="Hover or tap a technology to see how I use it and what it links to." />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="relative h-[420px] overflow-hidden rounded-3xl border hairline bg-ink/40 sm:h-[560px]">
            {webgl ? (
              <Suspense fallback={<div className="grid h-full place-items-center font-mono text-xs text-muted">LOADING CONSTELLATION</div>}>
                <Constellation selected={selected} hovered={hovered} onSelect={setSelected} onHover={setHovered} reduced={reduced} tier={tier} />
              </Suspense>
            ) : (
              <div className="grid h-full place-items-center px-8 text-center text-sm text-muted">3D view unavailable on this device. Use the list to explore the stack.</div>
            )}
            <p aria-hidden className="pointer-events-none absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.16em] text-muted">HOVER / TAP A NODE</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="glass glass-blur rounded-2xl bg-ink/60 p-6" aria-live="polite">
              {focus ? (
                <>
                  <p className="font-mono text-[11px] tracking-[0.18em] text-accent">SELECTED</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tightest">{focus.label}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{focus.desc}</p>
                  {focus.related.length > 0 && (
                    <div className="mt-5">
                      <p className="font-mono text-[10px] tracking-[0.18em] text-muted">RELATED</p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {focus.related.map((r) => {
                          const s = skills.find((k) => k.id === r)!
                          return (
                            <li key={r}>
                              <button onClick={() => setSelected(r)} className="rounded-full border hairline px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em] text-text/85 transition-colors hover:border-accent hover:text-white">
                                {s.label}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted">Select a technology to see details.</p>
              )}
            </div>

            <ul className="flex flex-wrap gap-2" aria-label="All technologies">
              {skills.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSelected(s.id)}
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() => setHovered(null)}
                    aria-pressed={selected === s.id}
                    className={`min-h-[40px] rounded-full border px-3.5 font-mono text-[10.5px] tracking-[0.12em] transition-colors duration-300 ${
                      selected === s.id ? 'border-accent bg-accent/15 text-white' : 'hairline text-muted hover:text-text'
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
