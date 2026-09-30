import type Lenis from 'lenis'

/** Ordered list of story sections. The 3D camera has one keyframe per entry. */
export const sectionIds = [
  'home', 'about', 'mindset', 'skills', 'projects',
  'experience', 'achievements', 'resume', 'contact',
] as const
export type SectionId = (typeof sectionIds)[number]

/** Maps a story section to the nav item that should light up. */
export const navFor: Record<SectionId, string> = {
  home: 'home', about: 'about', mindset: 'about', skills: 'skills', projects: 'projects',
  experience: 'experience', achievements: 'achievements', resume: 'contact', contact: 'contact',
}

export const scrollState = {
  y: 0,
  /** continuous index: integer part = section, fraction = progress through it. */
  sectionFloat: 0.5,
  active: 'home' as SectionId,
  mouse: { x: 0, y: 0 },
  lenis: null as Lenis | null,
}

let rects: { top: number; height: number }[] = []
const listeners = new Set<() => void>()
const frameListeners = new Set<() => void>()

export function measureSections() {
  rects = sectionIds.map((id) => {
    const el = document.getElementById(id)
    if (!el) return { top: 0, height: 1 }
    const r = el.getBoundingClientRect()
    return { top: r.top + window.scrollY, height: Math.max(r.height, 1) }
  })
  updateScroll(window.scrollY)
}

export function updateScroll(y: number) {
  scrollState.y = y
  if (!rects.length) return
  const line = y + window.innerHeight * 0.5
  let i = 0
  for (let k = 0; k < rects.length; k++) if (rects[k].top <= line) i = k
  const frac = Math.min(Math.max((line - rects[i].top) / rects[i].height, 0), 0.999)
  scrollState.sectionFloat = i + frac
  const id = sectionIds[i]
  if (id !== scrollState.active) {
    scrollState.active = id
    listeners.forEach((l) => l())
  }
  frameListeners.forEach((l) => l())
}

export const subscribeActive = (cb: () => void) => {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}
export const getActive = () => scrollState.active
/** Called on every scroll tick (used to invalidate demand-rendered canvases). */
export const onScrollTick = (cb: () => void) => {
  frameListeners.add(cb)
  return () => { frameListeners.delete(cb) }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (scrollState.lenis) scrollState.lenis.scrollTo(el, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
