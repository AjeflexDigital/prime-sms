import React from 'react';
import { Loader } from 'lucide-react';

function LoadingSpinner({ size = 'default', message = 'Loading...' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader className={`${sizeClasses[size]} text-red-600 animate-spin mx-auto mb-4`} />
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we load your content...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;