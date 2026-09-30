import type { CSSProperties } from 'react'

export const G_PATH = 'M48 15C43 10 37 8 30 8C16 8 7 19 7 33C7 47 17 58 31 58C45 58 55 48 55 34V30H31V38H46C45 46 39 51 31 51C21 51 15 44 15 33C15 22 21 16 31 16C36 16 40 18 44 22Z'

type LogoProps = {
  size?: number
  variant?: 'nav' | 'loader'
  className?: string
  style?: CSSProperties
}

export default function Logo({ size = 36, variant = 'nav', className, style }: LogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={style}
      data-variant={variant}
      focusable="false"
    >
      <path d={G_PATH} fill="#F5F5F5" />
      <path d="M35 34H49" stroke="#8C93FF" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}