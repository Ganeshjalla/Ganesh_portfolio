import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { projects, type Project } from '../data/content'
import { FadeUp, SectionHead } from './Reveal'
import Button from './Button'
import ProjectViz from './ProjectViz'
import { useReduced } from '../hooks/useEnv'

function ProjectCard({ p, onOpen }: { p: Project; onOpen: (p: Project) => void }) {
  const reduced = useReduced()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 20 }), sy = useSpring(my, { stiffness: 90, damping: 20 })
  const rotY = useTransform(sx, [-0.5, 0.5], [-3.5, 3.5])
  const rotX = useTransform(sy, [-0.5, 0.5], [3, -3])
  const px = useTransform(sx, [-0.5, 0.5], [-8, 8])

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => { mx.set(0); my.set(0) }

  return (
    <FadeUp>
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: reduced ? 0 : rotX, rotateY: reduced ? 0 : rotY, transformPerspective: 1600 }}
        aria-labelledby={`${p.id}-name`}
        className="glass glass-blur relative overflow-hidden rounded-3xl p-6 sm:p-10"
      >
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.18em] text-muted">
              <span className="text-accent">{p.index}</span><span aria-hidden className="h-px w-8 bg-white/20" /><span>{p.year}</span>
            </div>
            <h3 id={`${p.id}-name`} className="mt-5 text-3xl font-semibold leading-[1.05] tracking-tightest sm:text-5xl">{p.name}</h3>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-muted">{p.short}</p>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
              {p.stack.map((s) => <li key={s} className="rounded-full border hairline px-3 py-1 font-mono text-[10.5px] tracking-[0.1em] text-text/80">{s}</li>)}
            </ul>

            <div className="mt-8">
              <p className="font-mono text-[10.5px] tracking-[0.18em] text-muted">KEY ENGINEERING DECISIONS</p>
              <ul className="mt-3 space-y-2.5">
                {p.decisions.map((d) => (
                  <li key={d} className="flex gap-3 text-[14.5px] leading-relaxed text-text/85">
                    <span aria-hidden className="mt-[9px] h-px w-4 shrink-0 bg-accent" />{d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {p.live && <Button href={p.live} external icon={<ArrowUpRight size={15} />}>VIEW LIVE PROJECT</Button>}
              <Button variant="secondary" onClick={() => onOpen(p)}>CASE STUDY</Button>
              {p.source && <Button variant="ghost" href={p.source} external icon={<Github size={15} />}>SOURCE CODE</Button>}
            </div>
          </div>

          <motion.div style={{ x: reduced ? 0 : px }} className="min-w-0 self-center rounded-2xl border hairline bg-ink/50 p-4 sm:p-6">
            <p className="mb-2 font-mono text-[10.5px] tracking-[0.18em] text-muted">{p.id === 'fraud' ? 'DETECTION PIPELINE' : 'ARCHITECTURE'} · INTERACTIVE</p>
            <ProjectViz project={p} compact />
          </motion.div>
        </div>
      </motion.article>
    </FadeUp>
  )
}

export default function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-28 sm:py-40">
      <div className="section">
        <SectionHead id="projects-title" index="04" label="SELECTED WORK" title="Systems I've designed, built, and shipped." sub="From full-stack platforms to real-time fraud detection. Every project links to a live deployment." />
        <div className="space-y-8 sm:space-y-12">
          {projects.map((p) => <ProjectCard key={p.id} p={p} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  )
}
