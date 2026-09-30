import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { detectWebGL, useReduced, useTier } from './hooks/useEnv'
import type { Project } from './data/content'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Background from './components/Background'
import SmoothScroll from './components/SmoothScroll'
import ErrorBoundary from './components/ErrorBoundary'
import Hero from './components/Hero'
import About from './components/About'
import Mindset from './components/Mindset'
import Skills from './components/Skills'
import Projects from './components/Projects'
import ProjectDetail from './components/ProjectDetail'
import Experience from './components/Experience'
import Achievements from './components/Achievements'
import Resume from './components/Resume'
import Contact from './components/Contact'
import Footer from './components/Footer'

const GlobalScene = lazy(() => import('./scenes/GlobalScene'))

/** Static stand-in for the hero core when WebGL is unavailable. */
function StaticCore() {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className="absolute right-[-8%] top-1/2 hidden h-[80vh] -translate-y-1/2 opacity-60 lg:block">
      <g fill="none" stroke="#8c93ff" strokeOpacity=".5">
        <polygon points="200,40 340,120 340,280 200,360 60,280 60,120" />
        <polygon points="200,110 280,155 280,245 200,290 120,245 120,155" strokeOpacity=".8" />
        <path d="M200 40V110M340 120L280 155M340 280L280 245M200 360V290M60 280L120 245M60 120L120 155" />
      </g>
    </svg>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [webgl] = useState(() => detectWebGL())
  const [project, setProject] = useState<Project | null>(null)
  const tier = useTier()
  const reduced = useReduced()
  const done = useCallback(() => setReady(true), [])
  const close = useCallback(() => setProject(null), [])

  useEffect(() => { window.scrollTo(0, 0); if ('scrollRestoration' in history) history.scrollRestoration = 'manual' }, [])

  return (
    <>
      <Background />
      {/* Persistent 3D world behind all content. Scroll drives the camera. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
        {webgl ? (
          <ErrorBoundary fallback={<StaticCore />}>
            <Suspense fallback={null}><GlobalScene tier={tier} reduced={reduced} /></Suspense>
          </ErrorBoundary>
        ) : <StaticCore />}
      </div>

      <SmoothScroll ready={ready} />
      <Cursor />
      <Nav />

      <main id="main" className="relative z-10">
        <Hero ready={ready} />
        <About />
        <Mindset webgl={webgl} />
        <Skills webgl={webgl} />
        <Projects onOpen={setProject} />
        <Experience />
        <Achievements />
        <Resume />
        <Contact />
      </main>
      <div className="relative z-10"><Footer /></div>

      <ProjectDetail project={project} onClose={close} />
      {!ready && <Loader onDone={done} webgl={webgl} reduced={reduced} />}
    </>
  )
}
