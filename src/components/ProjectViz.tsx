import { useEffect, useState } from 'react'
import type { Project } from '../data/content'
import { useReduced } from '../hooks/useEnv'

const STEP = 46

/** Interactive 3D (CSS) architecture stack: hover a layer to read its purpose; packets travel down the stack. */
export function LayerStack({ project, compact = false }: { project: Project; compact?: boolean }) {
  const [active, setActive] = useState<number | null>(0)
  const n = project.layers.length
  const zmax = (n - 1) * STEP
  const w = compact ? 190 : 230
  const h = compact ? 118 : 142
  const sceneH = compact ? 250 : 310
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[1fr_1fr]">
      <div className="relative" style={{ height: sceneH }} aria-hidden>
        <div
          className="iso-scene absolute left-1/2 top-1/2"
          style={{ transform: `translate(-50%, calc(-50% + ${zmax * 0.42}px))`, width: w, height: h }}
        >
          <div className="iso-stack" style={{ width: w, height: h }}>
            {project.layers.map((l, i) => (
              <div
                key={l.name}
                className="iso-plate"
                data-active={active === i}
                style={{ ['--z' as string]: (n - 1 - i) * STEP }}
                onMouseEnter={() => setActive(i)}
              >
                <span className="absolute bottom-2 left-3 font-mono text-[8.5px] tracking-[0.14em] text-white/60">{l.name.toUpperCase()}</span>
              </div>
            ))}
            <div className="iso-packet" style={{ ['--zmax' as string]: `${zmax}px` }} />
          </div>
        </div>
      </div>

      <ol className="space-y-1.5" aria-label={`${project.name} architecture layers`}>
        {project.layers.map((l, i) => (
          <li key={l.name}>
            <button
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-expanded={active === i}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-colors duration-400 ${active === i ? 'border-accent/60 bg-accent/10' : 'hairline hover:bg-white/[0.03]'}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-[13.5px] font-medium">{l.name}</span>
                {i < n - 1 && <span aria-hidden className="font-mono text-[10px] text-muted">↓</span>}
              </span>
              <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${active === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <span className="overflow-hidden text-[12.5px] leading-relaxed text-muted"><span className="block pt-1.5">{l.purpose}</span></span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Fraud detection: animated transaction network                       */
/* ------------------------------------------------------------------ */

const accounts: Record<string, [number, number]> = {
  A: [90, 80], B: [230, 40], C: [360, 110], D: [390, 240], E: [250, 265], F: [110, 230], G: [40, 160],
}
// [from, to, id, suspicious]
const txns: [string, string, string, boolean][] = [
  ['A', 'B', 't1', true], ['B', 'C', 't2', true], ['C', 'A', 't3', true],
  ['C', 'D', 't4', false], ['D', 'E', 't5', false], ['E', 'F', 't6', false], ['F', 'G', 't7', false], ['G', 'A', 't8', false],
]
const RISK = '#ffa46b'

export function FraudGraph({ project }: { project: Project }) {
  const reduced = useReduced()
  const [stage, setStage] = useState(reduced ? 3 : 0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(() => setStage((s) => (s + 1) % 5), 2200)
    return () => clearInterval(id)
  }, [reduced, paused])

  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  return (
    <div className="grid items-center gap-4 sm:grid-cols-[1.15fr_1fr]">
      <svg viewBox="0 0 440 310" role="img" aria-label="Animated transaction network. Accounts A, B and C form a cycle that gets flagged as a risk signal." className="w-full">
        {txns.map(([f, t, id, sus]) => {
          const a = accounts[f], b = accounts[t]
          const hot = sus && stage >= 2
          const [mx, my] = mid(a, b)
          return (
            <g key={id}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={hot ? RISK : 'rgba(255,255,255,0.16)'} strokeWidth={hot ? 1.8 : 1} className={hot && stage === 2 ? 'flow-dash' : ''} style={{ transition: 'stroke .6s' }} />
              <rect x={mx - 5} y={my - 5} width="10" height="10" rx="2" fill="#111114" stroke={sus && stage >= 1 ? RISK : 'rgba(255,255,255,0.3)'} style={{ transition: 'stroke .6s' }} />
            </g>
          )
        })}
        {Object.entries(accounts).map(([k, [x, y]]) => {
          const inCycle = 'ABC'.includes(k)
          const hot = inCycle && stage >= 3
          return (
            <g key={k}>
              <circle cx={x} cy={y} r="17" fill="#0b0b0d" stroke={hot ? RISK : 'rgba(255,255,255,0.35)'} strokeWidth={hot ? 1.6 : 1} style={{ transition: 'stroke .6s' }} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="#f5f5f5" fontFamily="Geist Mono Variable, monospace">{k}</text>
            </g>
          )
        })}
        {stage >= 3 && (
          <text x="220" y="14" textAnchor="middle" fontSize="10" letterSpacing="2" fill={RISK} fontFamily="Geist Mono Variable, monospace">CYCLE A→B→C→A · RISK SIGNAL</text>
        )}
      </svg>

      <ol className="space-y-1.5" aria-label="Detection pipeline">
        {project.layers.map((l, i) => (
          <li key={l.name}>
            <button
              onClick={() => { setStage(i); setPaused(true) }}
              onMouseEnter={() => { setStage(i); setPaused(true) }}
              onMouseLeave={() => setPaused(false)}
              className={`w-full rounded-xl border px-4 py-2.5 text-left transition-colors duration-400 ${stage === i ? 'border-accent/60 bg-accent/10' : 'hairline hover:bg-white/[0.03]'}`}
            >
              <span className="flex items-center justify-between text-[13.5px] font-medium">{l.name}{i < 4 && <span aria-hidden className="font-mono text-[10px] text-muted">↓</span>}</span>
              <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${stage === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <span className="overflow-hidden text-[12.5px] leading-relaxed text-muted"><span className="block pt-1.5">{l.purpose}</span></span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function ProjectViz({ project, compact }: { project: Project; compact?: boolean }) {
  return project.id === 'fraud' ? <FraudGraph project={project} /> : <LayerStack project={project} compact={compact} />
}
