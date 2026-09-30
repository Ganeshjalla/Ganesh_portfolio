import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Logo from './Logo'

const GMark3D = lazy(() => import('../scenes/GMark3D'))

/** Short cinematic intro: G -> GANESH JALLA -> initialising. Total ~2.4s, skippable via reduced motion. */
export default function Loader({ onDone, webgl, reduced }: { onDone: () => void; webgl: boolean; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tl = gsap.timeline({ onComplete: onDone })
    if (reduced) {
      tl.to(bar.current, { scaleX: 1, duration: 0.4 }).to(root.current, { opacity: 0, duration: 0.3 })
      return () => { tl.kill() }
    }
    tl.to(bar.current, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
      .call(() => setStage(1), [], 0.8)
      .call(() => setStage(2), [], 1.5)
      .to(root.current, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 2.3)
    return () => { tl.kill() }
  }, [onDone])

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <div className="relative h-24 w-full max-w-sm text-center">
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${stage === 0 ? 'opacity-100' : 'opacity-0 -translate-y-2'}`}>
          {webgl ? <Suspense fallback={<Logo size={72} variant="loader" />}><GMark3D reduced={reduced} /></Suspense> : <Logo size={72} variant="loader" />}
        </div>
        <p className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-semibold tracking-[0.04em] transition-all duration-700 ${stage === 1 ? 'opacity-100' : stage < 1 ? 'opacity-0 translate-y-2' : 'opacity-0 -translate-y-2'}`}>GANESH JALLA</p>
        <p className={`absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-[0.2em] text-muted transition-all duration-700 ${stage === 2 ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>INITIALIZING DIGITAL EXPERIENCE...</p>
      </div>
      <div className="mt-6 h-px w-48 overflow-hidden bg-white/10">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  )
}
