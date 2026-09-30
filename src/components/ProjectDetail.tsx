import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Github, X } from 'lucide-react'
import type { Project } from '../data/content'
import { scrollState } from '../lib/scrollStore'
import Button from './Button'
import ProjectViz from './ProjectViz'

const Block = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <section className="border-t hairline pt-6">
    <h3 className="font-mono text-[11px] tracking-[0.2em] text-accent">{label}</h3>
    <div className="mt-3 text-[15.5px] leading-relaxed text-text/90">{children}</div>
  </section>
)

export default function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!project) return
    const prev = document.activeElement as HTMLElement | null
    scrollState.lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      scrollState.lenis?.start()
      document.documentElement.style.overflow = ''
      prev?.focus?.()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[70]" initial="hidden" animate="show" exit="hidden">
          <motion.div
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            data-lenis-prevent
            className="absolute inset-y-0 right-0 w-full overflow-y-auto border-l hairline bg-base sm:w-[min(880px,92vw)]"
            variants={{ hidden: { x: '100%' }, show: { x: 0 } }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b hairline bg-base/85 px-6 py-4 backdrop-blur-lg sm:px-10" style={{ paddingTop: 'calc(var(--safe-top) + 16px)' }}>
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted">CASE STUDY · {project.index}/03</p>
              <button ref={closeRef} onClick={onClose} aria-label="Close case study" className="grid h-11 w-11 place-items-center rounded-full border hairline transition-colors hover:border-white/40">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-8 px-6 pb-16 pt-10 sm:px-10">
              <header>
                <p className="font-mono text-[11px] tracking-[0.2em] text-accent">PROJECT · {project.year}</p>
                <h2 id="detail-title" className="mt-4 text-4xl font-semibold leading-[1.02] tracking-tightest sm:text-6xl">{project.name}</h2>
                <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-muted">{project.short}</p>
              </header>

              <Block label="STACK">
                <ul className="flex flex-wrap gap-2">{project.stack.map((s) => <li key={s} className="rounded-full border hairline px-3 py-1 font-mono text-[11px] tracking-[0.1em]">{s}</li>)}</ul>
              </Block>

              <Block label="ARCHITECTURE"><div className="mt-4"><ProjectViz project={project} /></div></Block>

              <Block label="CHALLENGE"><p>{project.detail.challenge}</p></Block>
              <Block label="IMPLEMENTATION">
                <p>{project.detail.implementation}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">{project.features.map((f) => <li key={f} className="flex gap-3 text-[14px] text-muted"><span aria-hidden className="mt-[10px] h-px w-3 shrink-0 bg-accent" />{f}</li>)}</ul>
              </Block>
              <Block label="RESULT"><p>{project.detail.result}</p></Block>

              <div className="flex flex-wrap gap-3 pt-2">
                {project.live && <Button href={project.live} external icon={<ArrowUpRight size={15} />}>LIVE DEMO</Button>}
                {project.source && <Button variant="secondary" href={project.source} external icon={<Github size={15} />}>SOURCE CODE</Button>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
