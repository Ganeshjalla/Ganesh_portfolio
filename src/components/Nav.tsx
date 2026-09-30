import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navItems, profile } from '../data/content'
import { navFor, scrollToId } from '../lib/scrollStore'
import { useActiveSection } from '../hooks/useEnv'
import Logo from './Logo'

export default function Nav() {
  const active = navFor[useActiveSection()]
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const go = (id: string) => { setOpen(false); setTimeout(() => scrollToId(id), open ? 250 : 0) }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
      <header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-5"
        style={{ paddingTop: 'calc(var(--safe-top) + 14px)' }}
      >
        <nav
          aria-label="Primary"
          className={`flex w-full max-w-[1180px] items-center justify-between rounded-full border px-4 py-2.5 transition-[background,border-color,backdrop-filter] duration-700 sm:px-6 ${
            scrolled ? 'glass-blur border-white/10 bg-ink/65' : 'border-transparent bg-transparent'
          }`}
        >
          <button onClick={() => go('home')} className="flex items-center gap-3" aria-label="Ganesh Jalla, back to top">
            <Logo size={32} variant="nav" />
            <span className="hidden font-mono text-[10.5px] tracking-[0.18em] text-muted xl:inline">GANESH JALLA</span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => go(n.id)}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={`relative px-3 py-2 text-[11px] font-medium tracking-[0.16em] transition-colors duration-500 ${active === n.id ? 'text-text' : 'text-muted hover:text-text'}`}
                >
                  {n.label}
                  {active === n.id && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-accent" transition={{ duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }} />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted md:flex">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-400/90" aria-hidden />
              AVAILABLE FOR OPPORTUNITIES
            </span>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-1">
              {navItems.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}>
                  <button onClick={() => go(n.id)} className={`w-full py-3 text-left text-4xl font-semibold tracking-tightest ${active === n.id ? 'text-text' : 'text-muted'}`}>
                    {n.label.charAt(0) + n.label.slice(1).toLowerCase()}
                  </button>
                </motion.li>
              ))}
            </ul>
            <p className="mt-10 flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-400/90" aria-hidden />
              AVAILABLE FOR OPPORTUNITIES
            </p>
            <a className="mt-3 font-mono text-xs text-accent" href={`mailto:${profile.email}`}>{profile.email}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
