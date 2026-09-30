import type { ReactNode } from 'react'
import Magnetic from './Magnetic'

type Variant = 'primary' | 'secondary' | 'ghost'
interface Props {
  children: ReactNode
  variant?: Variant
  href?: string
  onClick?: () => void
  download?: boolean
  external?: boolean
  icon?: ReactNode
  ariaLabel?: string
}

const base =
  'group inline-flex min-h-[48px] items-center justify-center gap-2.5 px-6 text-[12px] font-medium tracking-[0.14em] transition-[background,border-color,color,transform] duration-500 ease-out active:scale-[0.985] hover:scale-[1.02] rounded-full'
const styles: Record<Variant, string> = {
  primary: 'bg-text text-ink hover:bg-white border border-white',
  secondary: 'glass glass-blur text-text hover:border-white/40',
  ghost: 'text-muted hover:text-text border border-transparent px-3',
}

export default function Button({ children, variant = 'primary', href, onClick, download, external, icon, ariaLabel }: Props) {
  const cls = `${base} ${styles[variant]}`
  const inner = (<>{children}{icon}</>)
  return (
    <Magnetic>
      {href ? (
        <a
          className={cls}
          href={href}
          download={download ? '' : undefined}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          aria-label={ariaLabel}
          onClick={(e) => {
            if (onClick) { e.preventDefault(); onClick() }
          }}
        >
          {inner}
        </a>
      ) : (
        <button type="button" className={cls} onClick={onClick} aria-label={ariaLabel}>{inner}</button>
      )}
    </Magnetic>
  )
}
