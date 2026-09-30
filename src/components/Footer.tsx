import { profile } from '../data/content'

export default function Footer() {
  return (
    <footer className="relative border-t hairline bg-ink/80 backdrop-blur-md">
      <div className="section flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xl font-semibold tracking-tight">GANESH JALLA</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">Backend &amp; Full-Stack Developer</p>
          <p className="mt-5 font-mono text-[10.5px] tracking-[0.16em] text-muted">&copy; 2026 Ganesh Jalla</p>
        </div>
        <div className="flex flex-col gap-5 md:items-end">
          <nav aria-label="Footer" className="flex gap-6 text-[13px]">
            <a className="text-muted transition-colors hover:text-text" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="text-muted transition-colors hover:text-text" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-muted transition-colors hover:text-text" href={`mailto:${profile.email}`}>Email</a>
          </nav>
          <p className="font-mono text-[10.5px] tracking-[0.2em] text-white/35">BUILT WITH JAVA • REACT • CREATIVITY</p>
        </div>
      </div>
    </footer>
  )
}
