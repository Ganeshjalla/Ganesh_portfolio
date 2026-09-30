/** Static atmospheric layers: gradient, fine grid, noise. Sits behind the 3D canvas. */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(1200px 700px at 78% 22%, rgba(108,123,255,0.10), transparent 60%), radial-gradient(900px 600px at 8% 90%, rgba(140,147,255,0.05), transparent 60%), #050505' }} />
      <div className="bg-grid absolute inset-0" />
      <div className="bg-noise absolute inset-0" />
    </div>
  )
}
