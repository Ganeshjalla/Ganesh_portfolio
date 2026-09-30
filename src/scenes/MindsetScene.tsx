import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import InViewCanvas from './InViewCanvas'

const ACCENT = '#8c93ff'
const damp = (a: number, b: number, dt: number, k = 3) => a + (b - a) * (1 - Math.exp(-dt * k))

function Edged({ geo, opacity = 0.5 }: { geo: THREE.BufferGeometry; opacity?: number }) {
  const e = useMemo(() => new THREE.EdgesGeometry(geo), [geo])
  return <lineSegments geometry={e}><lineBasicMaterial color={ACCENT} transparent opacity={opacity} /></lineSegments>
}
const Metal = () => <meshStandardMaterial color="#30303c" metalness={0.5} roughness={0.42} />

/** SOLVE: a complex block that separates into a manageable system. */
function Solve({ active, reduced }: { active: boolean; reduced: boolean }) {
  const cubes = useMemo(() => {
    const out: THREE.Vector3[] = []
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) out.push(new THREE.Vector3(x, y, z))
    return out
  }, [])
  const geo = useMemo(() => new THREE.BoxGeometry(0.3, 0.3, 0.3), [])
  const g = useRef<THREE.Group>(null)
  const spread = useRef(1)
  useFrame((s, dt) => {
    if (!g.current || reduced) return
    spread.current = damp(spread.current, active ? 1.6 : 1, dt, 2.5)
    g.current.children.forEach((c, i) => c.position.copy(cubes[i]).multiplyScalar(0.36 * spread.current))
    g.current.rotation.y = s.clock.elapsedTime * 0.12
    g.current.rotation.x = 0.4
  })
  return (
    <group ref={g}>
      {cubes.map((c, i) => (
        <group key={i} position={c.clone().multiplyScalar(0.36)}>
          <mesh geometry={geo}><Metal /></mesh>
          <Edged geo={geo} opacity={0.4} />
        </group>
      ))}
    </group>
  )
}

/** BUILD: blocks stacking into a structure. */
function Build({ active, reduced }: { active: boolean; reduced: boolean }) {
  const geo = useMemo(() => new THREE.BoxGeometry(0.42, 0.42, 0.9), [])
  const g = useRef<THREE.Group>(null)
  const lift = useRef(0)
  useFrame((s, dt) => {
    if (!g.current || reduced) return
    lift.current = damp(lift.current, active ? 1 : 0, dt, 2.5)
    g.current.children.forEach((c, i) => { c.position.y = -0.55 + i * 0.44 + lift.current * i * 0.08 })
    g.current.rotation.y = 0.7 + Math.sin(s.clock.elapsedTime * 0.3) * 0.1
  })
  return (
    <group ref={g} rotation={[0.25, 0.7, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} position={[(i - 1.5) * 0.22, -0.55 + i * 0.44, 0]}>
          <mesh geometry={geo}><Metal /></mesh>
          <Edged geo={geo} opacity={0.35 + i * 0.12} />
        </group>
      ))}
    </group>
  )
}

/** OPTIMIZE: concentric rings aligning, like a tuned system. */
function Optimize({ active, reduced }: { active: boolean; reduced: boolean }) {
  const rings = useRef<(THREE.Mesh | null)[]>([])
  useFrame((s, dt) => {
    if (reduced) return
    rings.current.forEach((m, i) => {
      if (!m) return
      const target = active ? 0 : (i + 1) * 0.5
      m.rotation.x = damp(m.rotation.x, 1.1 + target * 0.6, dt, 2)
      m.rotation.y = s.clock.elapsedTime * (0.08 + i * 0.05) * (i % 2 ? -1 : 1)
    })
  })
  return (
    <group>
      {[0.95, 0.72, 0.5, 0.28].map((r, i) => (
        <mesh key={i} ref={(el) => { rings.current[i] = el }} rotation={[1.1 + i * 0.3, 0, 0]}>
          <torusGeometry args={[r, 0.018 + i * 0.004, 8, 80]} />
          <meshStandardMaterial color={i === 3 ? ACCENT : '#c9cbe0'} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <mesh><sphereGeometry args={[0.08, 12, 12]} /><meshBasicMaterial color="#fff" /></mesh>
    </group>
  )
}

/** LEARN: layers accumulating upward, each wider than the last. */
function Learn({ active, reduced }: { active: boolean; reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const k = useRef(0)
  const geos = useMemo(() => [0.5, 0.7, 0.9, 1.1, 1.3].map((w) => new THREE.BoxGeometry(w, 0.09, w)), [])
  useFrame((s, dt) => {
    if (!g.current || reduced) return
    k.current = damp(k.current, active ? 1 : 0, dt, 2.5)
    g.current.children.forEach((c, i) => { c.position.y = -0.55 + i * (0.22 + k.current * 0.1) })
    g.current.rotation.y = s.clock.elapsedTime * 0.1
  })
  return (
    <group ref={g} rotation={[0.35, 0, 0]}>
      {geos.map((geo, i) => (
        <group key={i} position={[0, -0.55 + i * 0.22, 0]}>
          <mesh geometry={geo}><Metal /></mesh>
          <Edged geo={geo} opacity={0.3 + i * 0.12} />
        </group>
      ))}
    </group>
  )
}

function Row({ active, reduced }: { active: number | null; reduced: boolean }) {
  const width = useThree((s) => s.viewport.width)
  const step = width / 4
  const scale = Math.min(1, step / 2.3)
  const items = [Solve, Build, Optimize, Learn]
  return (
    <>
      {items.map((C, i) => (
        <group key={i} position={[(i - 1.5) * step, 0, 0]} scale={scale}>
          <C active={active === i} reduced={reduced} />
        </group>
      ))}
    </>
  )
}

export default function MindsetScene({ active, reduced }: { active: number | null; reduced: boolean }) {
  return (
    <InViewCanvas
      reduced={reduced}
      camera={{ position: [0, 0.2, 7], fov: 38 }}
      className="h-full w-full"
      label="Four 3D architectural forms representing solve, build, optimize and learn."
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 6]} intensity={45} color="#dfe2ff" />
      <pointLight position={[-5, -2, 4]} intensity={20} color={ACCENT} />
      <Row active={active} reduced={reduced} />
    </InViewCanvas>
  )
}
