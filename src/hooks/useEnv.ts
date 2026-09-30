import { useEffect, useState, useSyncExternalStore } from 'react'
import { getActive, subscribeActive, type SectionId } from '../lib/scrollStore'

export function useActiveSection(): SectionId {
  return useSyncExternalStore(subscribeActive, getActive, getActive)
}

export function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

export function useMediaQuery(query: string): boolean {
  const [m, setM] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}

export const useReduced = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** low = phones, mid = tablets, high = laptops / desktops */
export type Tier = 'low' | 'mid' | 'high'
export function useTier(): Tier {
  const wide = useMediaQuery('(min-width: 1024px)')
  const medium = useMediaQuery('(min-width: 640px)')
  return wide ? 'high' : medium ? 'mid' : 'low'
}

export function useInView<T extends Element>(rootMargin = '200px') {
  const [el, setEl] = useState<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [el, rootMargin])
  return { ref: setEl, inView }
}
