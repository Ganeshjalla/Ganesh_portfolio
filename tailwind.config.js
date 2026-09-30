/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        base: '#0B0B0D',
        surface: '#111114',
        line: 'rgba(255,255,255,0.08)',
        text: '#F5F5F5',
        muted: '#8B8B92',
        accent: '#8C93FF',
        accent2: '#6C7BFF',
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: { tightest: '-0.045em' },
    },
  },
  plugins: [],
}
