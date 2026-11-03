import { Component, type ReactNode } from 'react';

/**
 * If an optional, heavy part (the 3D prologue) throws on some device,
 * render nothing in its place instead of taking the whole site down.
 */
export class SafeBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
