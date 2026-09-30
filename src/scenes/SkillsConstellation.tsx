import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '../data/content'
import type { Tier } from '../hooks/useEnv'
import InViewCanvas from './InViewCanvas'

const ACCENT = '#8c93ff'

function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const th = golden * i
    const rr = r * (0.9 + ((i * 37) % 10) / 45) // slight depth variation, deterministic
    pts.push(new THREE.Vector3(Math.cos(th) * rad * rr, y * rr * 0.82, Math.sin(th) * rad * rr))
  }
  return pts
}

function Constellation({
  selected, hovered, onSelect, onHover, reduced, tier,
}: {
  selected: string | null
  hovered: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  reduced: boolean
  tier: Tier
}) {
  const group = useRef<THREE.Group>(null)
  const positions = useMemo(() => fibonacciSphere(skills.length, 3.3), [])
  const idx = useMemo(() => Object.fromEntries(skills.map((s, i) => [s.id, i])), [])
  const focus = hovered ?? selected
  const related = useMemo(() => {
    const set = new Set<string>()
    if (focus) skills.find((s) => s.id === focus)?.related.forEach((r) => set.add(r))
    return set
  }, [focus])

  const baseLines = useMemo(() => {
    const arr: number[] = []
    positions.forEach((p) => arr.push(0, 0, 0, p.x, p.y, p.z))
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
  }, [positions])

  const focusLines = useMemo(() => {
    const arr: number[] = []
    if (focus) {
      const a = positions[idx[focus]]
      skills.find((s) => s.id === focus)?.related.forEach((r) => {
        const b = positions[idx[r]]
        arr.push(a.x, a.y, a.z, b.x, b.y, b.z)
      })
    }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
  }, [focus, positions, idx])

  useFrame((s, dt) => {
    if (!group.current || reduced) return
    const paused = !!focus
    if (!paused) group.current.rotation.y += dt * 0.09
    group.current.rotation.x += (s.pointer.y * 0.18 - group.current.rotation.x) * Math.min(dt * 2, 1)
  })

  return (
    <group ref={group}>
      {/* center */}
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color="#3b3b48" metalness={0.5} roughness={0.35} flatShading />
      </mesh>
      <mesh scale={1.08}><icosahedronGeometry args={[0.55, 1]} /><meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.4} /></mesh>
      <Html center position={[0, -0.95, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.18em] text-text/80">SOFTWARE ENGINEERING</span>
      </Html>

      <lineSegments geometry={baseLines}><lineBasicMaterial color="#ffffff" transparent opacity={0.07} /></lineSegments>
      <lineSegments geometry={focusLines}><lineBasicMaterial color={ACCENT} transparent opacity={0.9} /></lineSegments>

      {skills.map((s, i) => {
        const on = focus === s.id
        const rel = related.has(s.id)
        const dim = !!focus && !on && !rel
        return (
          <group key={s.id} position={positions[i]}>
            <mesh
              scale={on ? 1.9 : rel ? 1.4 : 1}
              onPointerOver={(e) => { e.stopPropagation(); onHover(s.id); document.body.style.cursor = 'pointer' }}
              onPointerOut={() => { onHover(null); document.body.style.cursor = '' }}
              onClick={(e) => { e.stopPropagation(); onSelect(selected === s.id ? null : s.id) }}
            >
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial
                color={on ? '#ffffff' : rel ? ACCENT : '#6a6c88'}
                emissive={on ? ACCENT : rel ? ACCENT : '#000000'}
                emissiveIntensity={on ? 0.9 : rel ? 0.4 : 0}
                metalness={0.3}
                roughness={0.45}
                flatShading
              />
            </mesh>
            {/* larger invisible hit target for easier hover/tap */}
            <mesh
              visible={false}
              onPointerOver={(e) => { e.stopPropagation(); onHover(s.id) }}
              onPointerOut={() => onHover(null)}
              onClick={(e) => { e.stopPropagation(); onSelect(selected === s.id ? null : s.id) }}
            >
              <sphereGeometry args={[0.42, 8, 8]} />
            </mesh>
            {tier !== 'low' || on || rel ? (
              <Html center position={[0, 0.36, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
                <span
                  className={`whitespace-nowrap font-mono text-[9.5px] tracking-[0.14em] transition-all duration-500 ${
                    on ? 'text-white' : rel ? 'text-accent' : dim ? 'text-white/20' : 'text-white/60'
                  }`}
                >
                  {s.label}
                </span>
              </Html>
            ) : null}
          </group>
        )
      })}
    </group>
  )
}

export default function SkillsConstellation(props: {
  selected: string | null
  hovered: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  reduced: boolean
  tier: Tier
}) {
  return (
    <InViewCanvas
      reduced={props.reduced}
      camera={{ position: [0, 0, 9.2], fov: 42 }}
      className="h-full w-full"
      label="Interactive 3D technology constellation. The same skills are listed as buttons below."
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 6]} intensity={40} color="#dfe2ff" />
      <pointLight position={[-6, -3, 4]} intensity={18} color={ACCENT} />
      <Constellation {...props} />
    </InViewCanvas>
  )
}
