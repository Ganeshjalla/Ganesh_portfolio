import { useEffect } from 'react'
import Lenis from 'lenis'
import { measureSections, scrollState, updateScroll } from '../lib/scrollStore'
import { useReduced } from '../hooks/useEnv'

/** Lenis smooth scrolling + feeds the scroll store that drives the 3D camera. */
export default function SmoothScroll({ ready }: { ready: boolean }) {
  const reduced = useReduced()
  useEffect(() => {
    if (!ready) return
    let lenis: Lenis | null = null
    let raf = 0
    if (!reduced) {
      lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 3), wheelMultiplier: 0.95 })
      scrollState.lenis = lenis
      lenis.on('scroll', (e: Lenis) => updateScroll(e.scroll))
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    } else {
      scrollState.lenis = null
    }
    const onScroll = () => updateScroll(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    const onMouse = (e: MouseEvent) => {
      scrollState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      scrollState.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    measureSections()
    const ro = new ResizeObserver(() => measureSections())
    ro.observe(document.body)
    window.addEventListener('resize', measureSections)
    const t = window.setTimeout(measureSections, 800)
    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
      scrollState.lenis = null
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', measureSections)
      ro.disconnect()
      clearTimeout(t)
    }
  }, [ready, reduced])
  return null
}
