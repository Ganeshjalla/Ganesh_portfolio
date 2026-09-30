import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Download, ArrowUpRight } from 'lucide-react'
import { profile } from '../data/content'
import { scrollToId } from '../lib/scrollStore'
import Button from './Button'

const ease = [0.22, 0.8, 0.2, 1] as const

export default function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion()
  const show = ready ? 'show' : 'hidden'
  const line = (d: number) => ({
    variants: { hidden: { y: reduce ? 0 : '110%' }, show: { y: 0 } },
    transition: { duration: 1.3, ease, delay: d },
  })
  const fade = (d: number) => ({
    variants: { hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }, show: { opacity: 1, y: 0 } },
    transition: { duration: 1.0, ease, delay: d },
  })
  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center">
      <div className="veil-left pointer-events-none absolute inset-0 lg:hidden" aria-hidden />
      <div className="section pb-24 pt-32 lg:pt-28">
        <motion.div initial="hidden" animate={show} className="max-w-[720px]">
          <motion.p {...fade(0.1)} className="eyebrow mb-7 flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-white/25" />
            Portfolio 2026
          </motion.p>

          <h1 id="hero-title" className="h-display text-[clamp(4.4rem,15.5vw,10.5rem)]">
            <span className="block overflow-hidden pb-[0.06em]"><motion.span className="block" {...line(0.15)}>{profile.first}</motion.span></span>
            <span className="block overflow-hidden pb-[0.06em] text-white/90"><motion.span className="block" {...line(0.27)}>{profile.last}</motion.span></span>
          </h1>

          <motion.div {...fade(0.75)} className="mt-8">
            <p className="mt-1.5 text-[13px] font-medium tracking-[0.22em] text-accent">{profile.roleLine2}</p>
          </motion.div>

          <motion.p {...fade(0.9)} className="lede mt-6 max-w-[52ch]">{profile.heroCopy}</motion.p>

          <motion.div {...fade(1.05)} className="mt-9 flex flex-wrap items-center gap-3">
            <Button onClick={() => scrollToId('projects')} href="#projects" icon={<ArrowDown size={15} className="-rotate-90 transition-transform duration-500 group-hover:translate-x-0.5" />}>VIEW PROJECTS</Button>
            <Button variant="secondary" href={profile.resume} download icon={<Download size={15} />}>DOWNLOAD RESUME</Button>
            <Button variant="ghost" href="#contact" onClick={() => scrollToId('contact')} icon={<ArrowUpRight size={14} />}>LET&apos;S CONNECT</Button>
          </motion.div>

          <motion.ul {...fade(1.2)} aria-label="Core technologies" className="mt-10 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.16em] text-muted">
            {profile.metaStack.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {t}
                {i < profile.metaStack.length - 1 && <span aria-hidden className="text-white/20">/</span>}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1.6, duration: 1 }}
        onClick={() => scrollToId('about')}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[10.5px] tracking-[0.2em] text-muted transition-colors hover:text-text"
        aria-label="Scroll to explore"
      >
        SCROLL TO EXPLORE <ArrowDown size={13} aria-hidden />
      </motion.button>
    </section>
  )
}
