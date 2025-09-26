
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
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary details:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="text-gray-300 mb-4">
                The application encountered an error. Please check the console for details.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
