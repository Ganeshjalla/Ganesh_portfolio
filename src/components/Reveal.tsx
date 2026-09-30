import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const ease = [0.22, 0.8, 0.2, 1] as const

/** Word-by-word masked reveal for headings. Text stays fully readable to screen readers. */
export function SplitText({
  text, className = '', delay = 0, as: Tag = 'span',
}: { text: string; className?: string; delay?: number; as?: 'span' | 'div' }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const M = motion[Tag]
  return (
    <M className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10%' }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: reduce ? 0 : '105%', opacity: reduce ? 1 : 0 }, show: { y: 0, opacity: 1 } }}
            transition={{ duration: 1.0, ease, delay: delay + i * 0.05 }}
          >
            {w}{i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

export function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({
  index, label, title, sub, id,
}: { index: string; label: string; title: string; sub?: string; id: string }) {
  return (
    <header className="mb-12 sm:mb-16 max-w-3xl">
      <FadeUp>
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="h-px w-10 bg-white/20" />
          <span>{label}</span>
        </p>
      </FadeUp>
      <h2 id={id} className="h-section">
        <SplitText text={title} />
      </h2>
      {sub && (
        <FadeUp delay={0.15}>
          <p className="lede mt-5">{sub}</p>
        </FadeUp>
      )}
    </header>
  )
}
