import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function VerifyEmail() {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus('success');
          setMessage(result.message);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <MessageSquare className="h-12 w-12 text-red-600" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h2>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'verifying' && (
            <div>
              <Loader className="h-16 w-16 text-red-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email...</h3>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Verified Successfully!</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                to="/login"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold inline-block"
              >
                Sign In to Your Account
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold inline-block"
                >
                  Create New Account
                </Link>
                <Link
                  to="/login"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold inline-block"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;