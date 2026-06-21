import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary details:', error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      const msg = this.state.error?.message ?? 'Ismeretlen hiba';
      return (
        <div className="min-h-screen flex items-center justify-center bg-nf-bg text-white p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold">Hoppá, valami félrement</h1>
            <p className="text-nf-text-muted text-sm">
              Az oldal egy hibába futott. Próbáld újratölteni, vagy menj vissza a főoldalra.
            </p>
            <details className="text-left text-xs bg-nf-surface border border-nf-border rounded-lg p-3">
              <summary className="cursor-pointer text-electric-300">Részletek</summary>
              <pre className="whitespace-pre-wrap break-words mt-2 text-nf-text-muted">{msg}</pre>
            </details>
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.reset}
                className="bg-electric-300 hover:bg-electric-400 text-black font-medium px-4 py-2 rounded-full text-sm"
              >
                Próbáld újra
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-nf-surface hover:bg-nf-surface-alt border border-nf-border px-4 py-2 rounded-full text-sm"
              >
                Oldal újratöltése
              </button>
              <button
                onClick={() => (window.location.href = '/admin')}
                className="bg-nf-surface hover:bg-nf-surface-alt border border-nf-border px-4 py-2 rounded-full text-sm"
              >
                Admin főoldal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
