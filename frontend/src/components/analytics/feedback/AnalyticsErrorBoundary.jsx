import React from 'react';

class AnalyticsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Analytics Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-red-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <span className="text-red-500 font-bold text-xl">!</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Failed to load analytics</h3>
          <p className="text-sm text-slate-500 max-w-md">
            We encountered an unexpected error while preparing your data. Please try refreshing the page.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AnalyticsErrorBoundary;
