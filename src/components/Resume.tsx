import { Download, Github, Linkedin } from 'lucide-react'
import { profile } from '../data/content'
import { FadeUp, SplitText } from './Reveal'
import Button from './Button'

export default function Resume() {
  return (
    <section id="resume" aria-labelledby="resume-title" className="relative py-28 sm:py-36">
      <div className="section">
        <div className="glass glass-blur relative overflow-hidden rounded-[2rem] px-7 py-14 sm:px-16 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(140,147,255,0.18), transparent)' }} />
          <p className="eyebrow mb-5 flex items-center gap-3"><span className="text-accent">08</span><span aria-hidden className="h-px w-10 bg-white/20" />RESUME</p>
          <h2 id="resume-title" className="h-section max-w-3xl"><SplitText text="Want the full story?" /></h2>
          <FadeUp delay={0.1}><p className="lede mt-5">Explore my complete experience, technical skills, projects, and achievements.</p></FadeUp>
          <FadeUp delay={0.2}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={profile.resume} download icon={<Download size={15} />}>DOWNLOAD RESUME</Button>
              <Button variant="secondary" href={profile.linkedin} external icon={<Linkedin size={15} />}>VIEW LINKEDIN</Button>
              <Button variant="secondary" href={profile.github} external icon={<Github size={15} />}>VIEW GITHUB</Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
