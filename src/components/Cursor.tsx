import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/** Subtle custom cursor. Fine pointers only; native cursor is untouched on touch devices. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e: MouseEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY) }
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('a,button,[data-cursor]')
      gsap.to(ring.current, { scale: t ? 1.9 : 1, opacity: t ? 0.55 : 0.9, duration: 0.4, ease: 'power3.out' })
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="absolute left-0 top-0 -ml-4 -mt-4 h-8 w-8 rounded-full border border-white/70 mix-blend-difference" />
      <div ref={dot} className="absolute left-0 top-0 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-white" />
    </div>
  )
}
