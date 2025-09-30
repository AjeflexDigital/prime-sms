import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h2>
              
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified 
                and is working to fix this issue.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Try Again
                </button>
                
                <a
                  href="/"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Go to Homepage
                </a>
              </div>
              
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-4 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">
                    <pre>{this.state.error.toString()}</pre>
                    {this.state.errorInfo.componentStack && (
                      <pre className="mt-2">{this.state.errorInfo.componentStack}</pre>
                    )}
                  </div>
                </details>
              )}
            </div>
            
            <p className="text-gray-500 text-sm mt-4">
              If the problem persists, please contact our support team at{' '}
              <a href="mailto:support@smsplatform.com" className="text-red-600 hover:text-red-500">
                support@smsplatform.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;