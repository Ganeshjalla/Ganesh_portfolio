import { Component, type ReactNode } from 'react'

/** Keeps the page alive if a WebGL scene throws. Renders the supplied fallback instead. */
export default class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err: unknown) { console.warn('3D scene disabled:', err) }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children }
}
