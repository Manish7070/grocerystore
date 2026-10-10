import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

window.addEventListener('error', (event) => {
  console.error('Captured window error:', event.error || event.message);
  const root = document.getElementById('root');
  if (root && (!root.children.length || root.innerHTML === '')) {
    root.innerHTML = `
      <div style="padding: 30px; font-family: system-ui, sans-serif; background: #fff1f2; color: #9f1239; border-left: 6px solid #e11d48; margin: 24px; border-radius: 8px;">
        <h2 style="margin: 0 0 12px; font-size: 20px;">Runtime JavaScript Exception</h2>
        <p style="margin: 0 0 12px; font-size: 14px; font-weight: bold;">${event.message || 'Unknown runtime error'}</p>
        <pre style="background: #ffe4e6; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap;">${event.error?.stack || event.filename + ':' + event.lineno}</pre>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', background: '#fff1f2', color: '#9f1239', borderLeft: '6px solid #e11d48', margin: '24px', borderRadius: '8px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '20px' }}>React Component Error</h2>
          <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 'bold' }}>{this.state.error?.message}</p>
          <pre style={{ background: '#ffe4e6', padding: '12px', borderRadius: '6px', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
