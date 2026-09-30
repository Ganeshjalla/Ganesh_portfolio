import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useInView } from '../hooks/useEnv'

/** A small self-contained canvas that stops rendering entirely while off-screen. */
export default function InViewCanvas({
  children, reduced, dpr = [1, 1.6], camera, className = '', label,
}: {
  children: ReactNode
  reduced: boolean
  dpr?: [number, number]
  camera: { position: [number, number, number]; fov: number }
  className?: string
  label: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>('150px')
  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      <Canvas
        dpr={dpr}
        camera={camera}
        gl={{ antialias: true, alpha: true }}
        frameloop={inView ? (reduced ? 'demand' : 'always') : 'never'}
        style={{ touchAction: 'pan-y' }}
      >
        {children}
      </Canvas>
    </div>
  )
}
