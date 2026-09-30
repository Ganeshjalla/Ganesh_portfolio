import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { onScrollTick, scrollState } from '../lib/scrollStore'
import type { Tier } from '../hooks/useEnv'

const ACCENT = '#8c93ff'

/** One camera keyframe per story section (same order as sectionIds). */
const KEYS: { p: [number, number, number]; l: [number, number, number] }[] = [
  { p: [0, 0.3, 9], l: [0, 0, 0] },              // home: wide shot
  { p: [-0.6, 0.5, -5], l: [2.6, 0, -14] },      // about: slow approach to profile monolith
  { p: [0, 0.9, -21], l: [0, 0, -30] },          // mindset
  { p: [0.4, -0.2, -34], l: [0, 0, -42] },       // skills
  { p: [1.2, 0.5, -45], l: [3.6, 0, -54] },      // projects: racks
  { p: [-0.8, 0.4, -60], l: [0, 0, -68] },       // experience
  { p: [0, 0.6, -70], l: [3.4, 0.4, -80] },      // achievements: data towers
  { p: [0, 0.2, -86], l: [0, 0, -94] },          // resume
  { p: [0, 0.2, -98], l: [0, 0.1, -112] },       // contact: portal
]

const smooth = (t: number) => t * t * (3 - 2 * t)

function CameraRig({ reduced, tier }: { reduced: boolean; tier: Tier }) {
  const { camera } = useThree()
  const pos = useRef(new THREE.Vector3(...KEYS[0].p))
  const look = useRef(new THREE.Vector3(...KEYS[0].l))
  const velocity = useRef(new THREE.Vector3())
  const lookVelocity = useRef(new THREE.Vector3())
  const positionPath = useMemo(() => new THREE.CatmullRomCurve3(KEYS.map((key) => new THREE.Vector3(...key.p))), [])
  const lookPath = useMemo(() => new THREE.CatmullRomCurve3(KEYS.map((key) => new THREE.Vector3(...key.l))), [])
  const mouseAmt = tier === 'high' && !reduced ? 1 : 0

  useFrame((_, dt) => {
    const progress = THREE.MathUtils.clamp(scrollState.sectionFloat - 0.5, 0, KEYS.length - 1) / (KEYS.length - 1)
    const tp = positionPath.getPoint(progress)
    const tl = lookPath.getPoint(progress)
    tp.x += scrollState.mouse.x * 0.55 * mouseAmt
    tp.y += scrollState.mouse.y * 0.3 * mouseAmt
    if (!reduced) {
      const step = Math.min(dt, 1 / 30)
      const spring = 3.2
      velocity.current.addScaledVector(tp.clone().sub(pos.current).multiplyScalar(spring * spring).addScaledVector(velocity.current, -2 * spring), step)
      lookVelocity.current.addScaledVector(tl.clone().sub(look.current).multiplyScalar(spring * spring).addScaledVector(lookVelocity.current, -2 * spring), step)
      pos.current.addScaledVector(velocity.current, step)
      look.current.addScaledVector(lookVelocity.current, step)
      const time = performance.now() * 0.001
      pos.current.x += Math.sin(time * 0.43) * 0.012 * mouseAmt
      pos.current.y += Math.sin(time * 0.31) * 0.009 * mouseAmt
    }
    camera.position.copy(pos.current)
    camera.lookAt(look.current)
  })
  return null
}

/** Hero: the "digital engineering core". Faceted metal heart inside a node lattice. */
function Core({ reduced, tier }: { reduced: boolean; tier: Tier }) {
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Mesh>(null)
  const ring1 = useRef<THREE.Group>(null)
  const ring2 = useRef<THREE.Group>(null)
  const nodes = useRef<THREE.InstancedMesh>(null)
  const shaderClock = useRef({ value: 0 })
  const width = useThree((s) => s.size.width)
  const offsetX = width > 1024 ? 3.1 : 0
  const scale = width > 1024 ? 0.88 : width > 640 ? 0.85 : 0.7

  const lattice = useMemo(() => new THREE.IcosahedronGeometry(2.4, tier === 'low' ? 1 : 2), [tier])
  const wire = useMemo(() => new THREE.WireframeGeometry(lattice), [lattice])
  const verts = useMemo(() => {
    const p = lattice.attributes.position
    const seen = new Set<string>()
    const out: THREE.Vector3[] = []
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i)
      const key = `${v.x.toFixed(2)}${v.y.toFixed(2)}${v.z.toFixed(2)}`
      if (!seen.has(key)) { seen.add(key); out.push(v) }
    }
    return out
  }, [lattice])
  const coreMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: '#3b3b48', metalness: 0.72, roughness: 0.28, envMapIntensity: 1.8, flatShading: true })
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = shaderClock.current
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vGNormal;')
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvGNormal = normalize(normalMatrix * objectNormal);')
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;\nvarying vec3 vGNormal;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          float gFresnel = pow(1.0 - max(dot(normalize(vGNormal), normalize(vViewPosition)), 0.0), 3.0);
          float gIridescence = 0.5 + 0.5 * sin(uTime * 0.22 + vViewPosition.y * 3.0 + vViewPosition.x * 1.4);
          float gScan = 1.0 - smoothstep(0.0, 0.08, abs(fract(vViewPosition.y * 0.17 - uTime * 0.045) - 0.5));
          totalEmissiveRadiance += vec3(0.24, 0.26, 0.72) * gFresnel * (0.18 + gIridescence * 0.08);
          totalEmissiveRadiance += vec3(0.22, 0.24, 0.62) * gScan * 0.045;`)
    }
    material.customProgramCacheKey = () => 'ganesh-core-rim-scan-v1'
    return material
  }, [])
  const latticeMaterial = useMemo(() => {
    const material = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.16 })
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = shaderClock.current
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          transformed += normalize(position) * sin(uTime * 0.55 + length(position) * 2.2) * 0.014;`)
    }
    material.customProgramCacheKey = () => 'ganesh-lattice-breath-v1'
    return material
  }, [])

  useLayoutEffect(() => {
    const m = nodes.current
    if (!m) return
    const d = new THREE.Object3D()
    verts.forEach((v, i) => { d.position.copy(v); d.scale.setScalar(0.9); d.updateMatrix(); m.setMatrixAt(i, d.matrix) })
    m.instanceMatrix.needsUpdate = true
  }, [verts])

  useFrame((s, dt) => {
    shaderClock.current.value = reduced ? 0 : s.clock.elapsedTime
    if (!group.current || reduced) return
    const t = s.clock.elapsedTime
    const mx = scrollState.mouse.x, my = scrollState.mouse.y
    group.current.rotation.y += (mx * 0.35 + t * 0.06 - group.current.rotation.y) * Math.min(dt * 1.6, 1)
    group.current.rotation.x += (-my * 0.2 - group.current.rotation.x) * Math.min(dt * 1.6, 1)
    if (inner.current) { inner.current.rotation.y = -t * 0.12; inner.current.rotation.x = t * 0.07 }
    if (ring1.current) ring1.current.rotation.z = t * 0.09
    if (ring2.current) ring2.current.rotation.z = -t * 0.06
  })

  return (
    <group position={[offsetX, 0, 0]} scale={scale}>
      <group ref={group}>
        <lineSegments geometry={wire}>
          <primitive object={latticeMaterial} attach="material" />
        </lineSegments>
        <instancedMesh ref={nodes} args={[undefined, undefined, verts.length]}>
          <sphereGeometry args={[0.026, 8, 8]} />
          <meshBasicMaterial color="#9da2ff" />
        </instancedMesh>
        <mesh ref={inner}>
          <dodecahedronGeometry args={[1.05, 0]} />
          <primitive object={coreMaterial} attach="material" />
        </mesh>
        <mesh scale={1.02}>
          <dodecahedronGeometry args={[1.05, 0]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.35} />
        </mesh>
        <group ref={ring1} rotation={[1.2, 0.2, 0]}>
          <mesh><torusGeometry args={[3.1, 0.006, 6, 120]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.28} /></mesh>
          <mesh position={[3.1, 0, 0]}><sphereGeometry args={[0.05, 10, 10]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </group>
        <group ref={ring2} rotation={[0.5, 1.0, 0.4]}>
          <mesh><torusGeometry args={[3.55, 0.005, 6, 120]} /><meshBasicMaterial color={ACCENT} transparent opacity={0.3} /></mesh>
          <mesh position={[-3.55, 0, 0]}><sphereGeometry args={[0.045, 10, 10]} /><meshBasicMaterial color={ACCENT} /></mesh>
        </group>
      </group>
    </group>
  )
}

/** Shows children only while the story is within [min, max] sections, so later scenes never bleed into earlier ones. */
function Gate({ min, max, children }: { min: number; max: number; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!g.current) return
    const f = scrollState.sectionFloat
    g.current.visible = f >= min && f <= max
  })
  return <group ref={g} visible={false}>{children}</group>
}

function Edged({ geo, color = ACCENT, opacity = 0.5 }: { geo: THREE.BufferGeometry; color?: string; opacity?: number }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo])
  return <lineSegments geometry={edges}><lineBasicMaterial color={color} transparent opacity={opacity} /></lineSegments>
}

/** About: a floating architectural "profile" monolith made of layered slabs. */
function Monolith({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null)
  const slab = useMemo(() => new THREE.BoxGeometry(2.6, 3.4, 0.14), [])
  useFrame((s) => {
    if (!g.current || reduced) return
    const t = s.clock.elapsedTime
    g.current.position.y = Math.sin(t * 0.4) * 0.12
    g.current.rotation.y = -0.45 + Math.sin(t * 0.25) * 0.08
  })
  return (
    <group position={[4.2, 0, -15]}>
      <group ref={g}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[0, 0, -i * 0.55]} scale={1 - i * 0.05}>
            <mesh geometry={slab}>
              <meshStandardMaterial color="#20202a" metalness={0.6} roughness={0.4} transparent opacity={i === 0 ? 0.95 : 0.6} />
            </mesh>
            <Edged geo={slab} opacity={i === 0 ? 0.7 : 0.25} />
          </group>
        ))}
        {/* "profile" glyph: avatar disc + text lines built from primitives */}
        <mesh position={[-0.55, 0.85, 0.09]}><circleGeometry args={[0.32, 32]} /><meshBasicMaterial color="#e9eaff" /></mesh>
        {[0.2, -0.05, -0.3, -0.55].map((y, i) => (
          <mesh key={i} position={[0.05 - (i === 3 ? 0.35 : 0), y - 0.15, 0.09]}>
            <planeGeometry args={[i === 3 ? 0.9 : 1.6, 0.05]} />
            <meshBasicMaterial color={ACCENT} transparent opacity={0.6 - i * 0.1} />
          </mesh>
        ))}
        {[-0.85, -0.3, 0.25].map((x, i) => (
          <mesh key={i} position={[x, -1.05, 0.09]}><boxGeometry args={[0.42, 0.42, 0.02]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.1 + i * 0.05} /></mesh>
        ))}
      </group>
    </group>
  )
}

/** Projects: abstract server racks. */
function Racks() {
  const rack = useMemo(() => new THREE.BoxGeometry(1.5, 4.2, 1.5), [])
  const lines = useMemo(() => Array.from({ length: 12 }, (_, i) => -1.85 + i * 0.33), [])
  const layout: [number, number, number][] = [[6.6, -0.2, -52], [8.3, 0.2, -56], [10.0, -0.2, -60]]
  return (
    <group>
      {layout.map((p, r) => (
        <group key={r} position={p} rotation={[0, -0.5, 0]}>
          <mesh geometry={rack}><meshStandardMaterial color="#1a1a22" metalness={0.6} roughness={0.45} /></mesh>
          <Edged geo={rack} opacity={0.4} />
          {lines.map((y, i) => (
            <mesh key={i} position={[0, y, 0.76]}>
              <planeGeometry args={[1.2, 0.06]} />
              <meshBasicMaterial color={ACCENT} transparent opacity={(i + r) % 4 === 0 ? 0.8 : 0.16} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Achievements: a field of data towers that rise as the camera arrives. */
function Towers({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const N = 7
  const d = useMemo(() => new THREE.Object3D(), [])
  const heights = useMemo(() => {
    const h: number[] = []
    for (let x = 0; x < N; x++) for (let z = 0; z < N; z++) {
      const dist = Math.hypot(x - 3, z - 3)
      h.push(0.4 + (Math.sin(x * 1.7) * Math.cos(z * 1.3) + 1) * 0.9 + Math.max(0, 3.2 - dist) * 0.9)
    }
    return h
  }, [])
  useFrame(() => {
    const m = ref.current
    if (!m) return
    const prox = reduced ? 1 : smooth(Math.max(0, 1 - Math.abs(scrollState.sectionFloat - 6.5) / 1.4))
    let i = 0
    for (let x = 0; x < N; x++) for (let z = 0; z < N; z++) {
      const h = Math.max(0.05, heights[i] * prox)
      d.position.set((x - 3) * 0.75, h / 2 - 1.6, (z - 3) * 0.75)
      d.scale.set(0.5, h, 0.5)
      d.updateMatrix()
      m.setMatrixAt(i++, d.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <group position={[5.2, 0, -82]} rotation={[0, 0.5, 0]}>
      <instancedMesh ref={ref} args={[undefined, undefined, N * N]}>
        <boxGeometry />
        <meshStandardMaterial color="#24242e" metalness={0.6} roughness={0.4} />
      </instancedMesh>
      <gridHelper args={[6, 8, '#30335f', '#22243f']} position={[0, -1.62, 0]} />
    </group>
  )
}

/** Contact: a doorway made of nested frames; light pulses inward. */
function Portal({ reduced }: { reduced: boolean }) {
  const frames = 10
  const refs = useRef<(THREE.LineLoop | null)[]>([])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const w = 1.5, h = 2.5
    g.setAttribute('position', new THREE.Float32BufferAttribute([-w, -h, 0, w, -h, 0, w, h, 0, -w, h, 0], 3))
    return g
  }, [])
  useFrame((s) => {
    refs.current.forEach((l, i) => {
      if (!l) return
      const mat = l.material as THREE.LineBasicMaterial
      const base = 0.25 + (i / frames) * 0.5
      const pulse = reduced ? 0 : Math.max(0, Math.sin(s.clock.elapsedTime * 0.9 - i * 0.55)) * 0.35
      mat.opacity = Math.min(1, base + pulse)
    })
  })
  return (
    <group position={[3.4, 0.2, -112]}>
      {Array.from({ length: frames }, (_, i) => (
        <lineLoop
          key={i}
          ref={(el) => { refs.current[i] = el }}
          geometry={geo}
          position={[0, 0, -i * 1.1]}
          scale={1 - i * 0.075}
        >
          <lineBasicMaterial color={i % 3 === 0 ? '#ffffff' : ACCENT} transparent opacity={0.3} />
        </lineLoop>
      ))}
      <mesh position={[0, 0, -frames * 1.1]}>
        <planeGeometry args={[2.2, 3.8]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const geo = useMemo(() => {
    const a = new Float32Array(count * 3)
    let seed = 7
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    for (let i = 0; i < count; i++) {
      a[i * 3] = (rnd() - 0.5) * 30
      a[i * 3 + 1] = (rnd() - 0.5) * 14
      a[i * 3 + 2] = 14 - rnd() * 135
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(a, 3))
    return g
  }, [count])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } }), [])
  useFrame((state) => {
    uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime
    uniforms.uMouse.value.set(scrollState.mouse.x * 10, scrollState.mouse.y * 5)
  })
  return (
    <points geometry={geo}>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`uniform float uTime;
          uniform vec2 uMouse;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float t = uTime * 0.12;
            p += vec3(sin(position.y * 0.22 + t), sin(position.z * 0.17 + t * 0.8), cos(position.x * 0.19 - t)) * 0.045;
            vec2 away = p.xy - uMouse;
            float repel = max(0.0, 1.0 - length(away) / 2.4);
            p.xy += normalize(away + vec2(0.0001)) * repel * 0.24;
            p.z += uTime * 0.06;
            p.z = mod(p.z + 150.0, 150.0) - 135.0;
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = 1.45 * (10.0 / max(1.0, -mvPosition.z));
            gl_Position = projectionMatrix * mvPosition;
            vAlpha = 0.28 + 0.28 * (0.5 + 0.5 * sin(position.x * 0.5 + position.z * 0.3));
          }`}
        fragmentShader={`varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float alpha = (1.0 - smoothstep(0.18, 0.5, d)) * vAlpha;
            gl_FragColor = vec4(vec3(0.68, 0.70, 1.0), alpha);
          }`}
      />
    </points>
  )
}

function FrameRateGuard({ onSlow }: { onSlow: () => void }) {
  const slowFor = useRef(0)
  const fired = useRef(false)
  useFrame((_, dt) => {
    if (fired.current) return
    slowFor.current = dt > 1 / 45 ? slowFor.current + dt : Math.max(0, slowFor.current - dt * 2)
    if (slowFor.current >= 2) {
      fired.current = true
      onSlow()
    }
  })
  return null
}

function Invalidator() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => onScrollTick(invalidate), [invalidate])
  return null
}

export default function GlobalScene({ tier, reduced }: { tier: Tier; reduced: boolean }) {
  const [runtimeTier, setRuntimeTier] = useState(tier)
  const [tabVisible, setTabVisible] = useState(() => !document.hidden)
  useEffect(() => setRuntimeTier(tier), [tier])
  useEffect(() => {
    const update = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  const count = runtimeTier === 'high' ? 65000 : runtimeTier === 'mid' ? 16000 : 4000
  const downgrade = () => setRuntimeTier((current) => current === 'high' ? 'mid' : 'low')
  return (
    <Canvas
      className="!pointer-events-none"
      dpr={runtimeTier === 'high' ? [1, 1.75] : runtimeTier === 'mid' ? [1, 1.25] : 1}
      gl={{ antialias: runtimeTier !== 'low', alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: KEYS[0].p, fov: 42, near: 0.1, far: 90 }}
      frameloop={!tabVisible ? 'never' : reduced ? 'demand' : 'always'}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {!reduced && tabVisible && <FrameRateGuard key={runtimeTier} onSlow={downgrade} />}
      {runtimeTier !== 'low' && !reduced && <AdaptiveDpr pixelated />}
      <fog attach="fog" args={['#050505', 10, 46]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#dfe2ff" />
      <pointLight position={[3, 1, 6]} intensity={30} color="#b9bdff" distance={30} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 4]} scale={[8, 2, 1]} color="#c9ccff" />
        <Lightformer form="rect" intensity={1.2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#8c93ff" />
        <Lightformer form="rect" intensity={0.8} position={[5, -2, -2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ffffff" />
      </Environment>
      <CameraRig reduced={reduced} tier={tier} />
      <Core reduced={reduced} tier={runtimeTier} />
      <Gate min={0.6} max={2.6}><Monolith reduced={reduced} /></Gate>
      {runtimeTier !== 'low' && <Gate min={3.6} max={5.6}><Racks /></Gate>}
      <Gate min={5.4} max={8.0}><Towers reduced={reduced} /></Gate>
      <Gate min={6.9} max={9}><Portal reduced={reduced} /></Gate>
      <Particles count={count} reduced={reduced} />
      {reduced && <Invalidator />}
    </Canvas>
  )
}
