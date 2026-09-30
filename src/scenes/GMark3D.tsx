import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { G_PATH } from '../components/Logo'

const offsets = [
  new THREE.Vector3(-0.62, 0.38, 0.2),
  new THREE.Vector3(0.1, -0.62, -0.12),
  new THREE.Vector3(0.62, 0.3, 0.16),
]

function ExtrudedMark({ reduced }: { reduced: boolean }) {
  const pieces = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#fff" d="${G_PATH}"/></svg>`
    const parsed = new SVGLoader().parse(svg)
    const shapes = parsed.paths.flatMap((path) => SVGLoader.createShapes(path))
    const source = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    })
    source.center()
    const flat = source.toNonIndexed()
    const positions = flat.getAttribute('position')
    const buckets: number[][] = [[], [], []]
    for (let i = 0; i < positions.count; i += 3) {
      const centerX = (positions.getX(i) + positions.getX(i + 1) + positions.getX(i + 2)) / 3
      const band = THREE.MathUtils.clamp(Math.floor((centerX + 24) / 16), 0, 2)
      for (let vertex = i; vertex < i + 3; vertex++) {
        buckets[band].push(positions.getX(vertex), positions.getY(vertex), positions.getZ(vertex))
      }
    }
    flat.dispose()
    source.dispose()
    return buckets.map((values) => {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(values, 3))
      geometry.computeVertexNormals()
      return geometry
    })
  }, [])
  const group = useRef<THREE.Group>(null)
  const materials = useMemo(() => pieces.map(() => new THREE.MeshStandardMaterial({
    color: '#e7e8f2',
    metalness: 0.78,
    roughness: 0.24,
    emissive: '#22233b',
    emissiveIntensity: 0.14,
  })), [pieces])

  useEffect(() => () => {
    pieces.forEach((geometry) => geometry.dispose())
    materials.forEach((material) => material.dispose())
  }, [materials, pieces])

  useFrame((state) => {
    if (!group.current) return
    const time = state.clock.elapsedTime
    const assemble = reduced ? 1 : THREE.MathUtils.smoothstep(time, 0.05, 0.95)
    group.current.children.forEach((piece, index) => {
      piece.position.copy(offsets[index]).multiplyScalar(1 - assemble)
      piece.rotation.y = (1 - assemble) * (index - 1) * 0.08
    })
    group.current.rotation.y = reduced ? 0 : Math.sin(time * 0.38) * 0.06
    const dissolve = reduced ? 1 : 1 - THREE.MathUtils.smoothstep(time, 1.45, 2.2)
    materials.forEach((material) => {
      material.transparent = dissolve < 1
      material.opacity = dissolve
    })
  })

  return (
    <group ref={group} scale={0.052}>
      {pieces.map((geometry, index) => (
        <mesh key={index} geometry={geometry} material={materials[index]} />
      ))}
    </group>
  )
}

export default function GMark3D({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={1}
      frameloop={reduced ? 'demand' : 'always'}
      camera={{ position: [0, 0, 5.5], fov: 34 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#f5f5f5" />
      <pointLight position={[-3, -1, 3]} intensity={1.1} color="#8c93ff" />
      <ExtrudedMark reduced={reduced} />
    </Canvas>
  )
}