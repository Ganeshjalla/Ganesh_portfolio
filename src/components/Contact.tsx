import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { profile } from '../data/content'
import { FadeUp, SplitText } from './Reveal'
import Button from './Button'

const Row = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-4 border-b hairline py-4">
    <span className="text-accent" aria-hidden>{icon}</span>
    <div><p className="font-mono text-[10px] tracking-[0.18em] text-muted">{label}</p><div className="mt-0.5 text-[16px]">{children}</div></div>
  </div>
)

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative flex min-h-[100svh] items-center py-28">
      <div className="veil-left pointer-events-none absolute inset-0" aria-hidden />
      <div className="section">
        <p className="eyebrow mb-5 flex items-center gap-3"><span className="text-accent">09</span><span aria-hidden className="h-px w-10 bg-white/20" />CONTACT</p>
        <h2 id="contact-title" className="h-display text-[clamp(3rem,9vw,7.5rem)] max-w-4xl"><SplitText text="LET'S BUILD SOMETHING." /></h2>
        <FadeUp delay={0.1}><p className="lede mt-6">Have an opportunity, project, or interesting engineering problem?</p></FadeUp>

        <FadeUp delay={0.2}>
          <div className="mt-10 max-w-md">
            <Row icon={<Mail size={18} />} label="EMAIL"><a className="underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-accent" href={`mailto:${profile.email}`}>{profile.email}</a></Row>
            <Row icon={<Phone size={18} />} label="PHONE"><a href={`tel:${profile.phoneHref}`}>{profile.phone}</a></Row>
            <Row icon={<MapPin size={18} />} label="LOCATION">{profile.location}</Row>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={`mailto:${profile.email}?subject=Let%27s%20talk`} icon={<Mail size={15} />}>START A CONVERSATION</Button>
            <Button variant="secondary" href={profile.linkedin} external icon={<Linkedin size={15} />} ariaLabel="LinkedIn profile">LINKEDIN</Button>
            <Button variant="secondary" href={profile.github} external icon={<Github size={15} />} ariaLabel="GitHub profile">GITHUB</Button>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
