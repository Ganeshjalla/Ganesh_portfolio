import { useEffect, useRef, useState } from 'react'
import { useInView as useFmInView } from 'framer-motion'
import { achievements } from '../data/content'
import { FadeUp, SectionHead } from './Reveal'
import { useReduced } from '../hooks/useEnv'

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useFmInView(ref, { once: true, margin: '-15%' })
  const reduced = useReduced()
  const [v, setV] = useState(reduced ? to : 0)
  useEffect(() => {
    if (!inView || reduced) { if (reduced) setV(to); return }
    const start = performance.now(), dur = 1800
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      setV(Math.round(to * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, to])
  return <span ref={ref} aria-label={String(to)}>{v}</span>
}

export default function Achievements() {
  const a = achievements
  return (
    <section id="achievements" aria-labelledby="ach-title" className="relative py-28 sm:py-40">
      <div className="veil-left pointer-events-none absolute inset-0" aria-hidden />
      <div className="section">
        <SectionHead id="ach-title" index="07" label="PROOF OF PROBLEM SOLVING" title="Consistent practice, measurable results." />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
          <FadeUp>
            <p className="text-[clamp(7rem,26vw,17rem)] font-semibold leading-[0.85] tracking-[-0.06em]">
              <CountUp to={a.leetcode.value} /><span className="text-accent">{a.leetcode.suffix}</span>
            </p>
            <p className="mt-6 font-mono text-[12px] tracking-[0.2em] text-text">{a.leetcode.label}</p>
            <p className="lede mt-3">{a.leetcode.text}</p>
          </FadeUp>

          <FadeUp delay={0.15} className="self-end">
            <div className="glass glass-blur rounded-3xl p-8 sm:p-10">
              <p className="text-7xl font-semibold leading-none tracking-[-0.05em] sm:text-8xl" aria-label="5 star">{a.hackerrank.value}</p>
              <p className="mt-6 font-mono text-[12px] tracking-[0.2em]">{a.hackerrank.label}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.hackerrank.text}</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
