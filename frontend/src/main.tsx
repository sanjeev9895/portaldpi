import ReactDOM from 'react-dom/client'
import { Component } from 'react'
import type { ReactNode } from 'react'

import {
  HashRouter,
} from 'react-router-dom'

import App from './App'
import './index.css'

/**
 * Catches any runtime error in the app and shows a readable message
 * instead of a blank white screen.
 */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '40px auto' }}>
          <h2 style={{ color: '#b91c1c' }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fef2f2', padding: 12, borderRadius: 8, color: '#7f1d1d' }}>
            {String(this.state.error)}
          </pre>
          <p style={{ color: '#475569' }}>
            Check the browser console (F12) for details. If this mentions Supabase
            configuration, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and rebuild.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(
  document.getElementById('root')!
).render(

  <ErrorBoundary>
    <HashRouter>
      <App />
    </HashRouter>
  </ErrorBoundary>
)
