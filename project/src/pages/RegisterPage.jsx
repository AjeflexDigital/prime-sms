import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <MessageSquare className="h-12 w-12 text-red-600" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join thousands of businesses using our SMS platform</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="e.g., +234 800 000 0000"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="Your company name"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-colors"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-red-600 hover:text-red-500 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-red-600 hover:text-red-500 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-red-600 hover:text-red-500 font-semibold"
            >
              Sign in to your account
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              100 Free Credits
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              No Setup Fees
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
              Instant Activation
            </div>
          </div>
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

export default RegisterPage;










// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { MessageSquare, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import GoogleSignIn from '../components/GoogleSignIn';

// function RegisterPage() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     company: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return false;
//     }
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     if (!validateForm()) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const result = await register(formData);
      
//       if (result.success) {
//         setSuccess(result.message);
//         setTimeout(() => {
//           navigate('/login');
//         }, 3000);
//       } else {
//         setError(result.message);
//       }
//     } catch (err) {
//       setError('An unexpected error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center justify-center mb-6">
//             <MessageSquare className="h-12 w-12 text-red-600" />
//           </Link>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
//           <p className="text-gray-600">Join thousands of businesses using our SMS platform</p>
//         </div>

//         {/* Registration Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
//               <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
//               <span className="text-red-700 text-sm">{error}</span>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
//               <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//               <span className="text-green-700 text-sm">{success}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Full Name */}
//             <div>
//               <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name *
//               </label>
//               <input
//                 id="fullName"
//                 name="fullName"
//                 type="text"
//                 required
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
//                 placeholder="Enter your full name"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address *
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
//                 placeholder="Enter your email"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
//                 placeholder="e.g., +234 800 000 0000"
//               />
//             </div>

//             {/* Company */}
//             <div>
//               <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
//                 Company Name (Optional)
//               </label>
//               <input
//                 id="company"
//                 name="company"
//                 type="text"
//                 value={formData.company}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
//                 placeholder="Your company name"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password *
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-colors"
//                   placeholder="Create a strong password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-4"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password *
//               </label>
//               <div className="relative">
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-colors"
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-4"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Terms Agreement */}
//             <div className="flex items-start">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 required
//                 className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
//               />
//               <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
//                 I agree to the{' '}
//                 <a href="#" className="text-red-600 hover:text-red-500 font-medium">
//                   Terms of Service
//                 </a>{' '}
//                 and{' '}
//                 <a href="#" className="text-red-600 hover:text-red-500 font-medium">
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader className="animate-spin h-5 w-5 mr-2" />
//                   Creating Account...
//                 </>
//               ) : (
//                 'Create Account'
//               )}
//             </button>
//           </form>

//           {/* Google Sign-In */}
//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//               </div>
//             </div>
            
//             <div className="mt-6">
//               <GoogleSignIn
//                 onSuccess={(data) => {
//                   if (data.isNewUser) {
//                     setSuccess('Account created successfully! You can now access your dashboard.');
//                     setTimeout(() => {
//                       navigate('/dashboard');
//                     }, 2000);
//                   } else {
//                     navigate('/dashboard');
//                   }
//                 }}
//                 onError={(error) => {
//                   setError(error);
//                 }}
//               />
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="my-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Already have an account?</span>
//               </div>
//             </div>
//           </div>

//           {/* Sign In Link */}
//           <div className="text-center">
//             <Link
//               to="/login"
//               className="text-red-600 hover:text-red-500 font-semibold"
//             >
//               Sign in to your account
//             </Link>
//           </div>
//         </div>

//         {/* Benefits */}
//         <div className="mt-8 text-center">
//           <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
//             <div className="flex items-center">
//               <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
//               100 Free Credits
//             </div>
//             <div className="flex items-center">
//               <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
//               No Setup Fees
//             </div>
//             <div className="flex items-center">
//               <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
//               Instant Activation
//             </div>
//           </div>
//         </div>

//         {/* Back to Home */}
//         <div className="mt-8 text-center">
//           <Link
//             to="/"
//             className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
//           >
//             ← Back to homepage
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RegisterPage;







// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { MessageSquare, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';

// function RegisterPage() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     company: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return false;
//     }
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     if (!validateForm()) {
//       setLoading(false);
//       return;
//     }

//     // Simulate API call
//     setTimeout(() => {
//       setSuccess('Account created successfully!');
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//       setLoading(false);
//     }, 1500);
//   };

//   const handleGoogleSignIn = () => {
//     setLoading(true);
//     // Simulate Google sign-in
//     setTimeout(() => {
//       setSuccess('Account created with Google successfully!');
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 2000);
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center py-6 px-4">
//       <div className="max-w-5xl w-full">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <Link to="/" className="inline-flex items-center justify-center mb-3">
//             <MessageSquare className="h-10 w-10 text-red-600" />
//           </Link>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
//           <p className="text-gray-600">Join thousands of businesses using our SMS platform</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column - Main Form */}
//           <div className="bg-white rounded-2xl shadow-xl p-6">
//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
//                 <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
//                 <span className="text-red-700 text-sm">{error}</span>
//               </div>
//             )}

//             {success && (
//               <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
//                 <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
//                 <span className="text-green-700 text-sm">{success}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="space-y-4">
//                 {/* Full Name & Email Row */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
//                       Full Name *
//                     </label>
//                     <input
//                       id="fullName"
//                       name="fullName"
//                       type="text"
//                       required
//                       value={formData.fullName}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       placeholder="John Doe"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                       Email *
//                     </label>
//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       placeholder="john@company.com"
//                     />
//                   </div>
//                 </div>

//                 {/* Phone & Company Row */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                       Phone Number
//                     </label>
//                     <input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       placeholder="+234 800 000 0000"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
//                       Company (Optional)
//                     </label>
//                     <input
//                       id="company"
//                       name="company"
//                       type="text"
//                       value={formData.company}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       placeholder="Company name"
//                     />
//                   </div>
//                 </div>

//                 {/* Password & Confirm Password Row */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                       Password *
//                     </label>
//                     <div className="relative">
//                       <input
//                         id="password"
//                         name="password"
//                         type={showPassword ? 'text' : 'password'}
//                         required
//                         value={formData.password}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
//                         placeholder="••••••••"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute inset-y-0 right-0 flex items-center pr-3"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5 text-gray-400" />
//                         ) : (
//                           <Eye className="h-5 w-5 text-gray-400" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                       Confirm Password *
//                     </label>
//                     <div className="relative">
//                       <input
//                         id="confirmPassword"
//                         name="confirmPassword"
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         required
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
//                         placeholder="••••••••"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute inset-y-0 right-0 flex items-center pr-3"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="h-5 w-5 text-gray-400" />
//                         ) : (
//                           <Eye className="h-5 w-5 text-gray-400" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Terms Agreement */}
//                 <div className="flex items-start">
//                   <input
//                     id="terms"
//                     name="terms"
//                     type="checkbox"
//                     required
//                     className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
//                   />
//                   <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
//                     I agree to the{' '}
//                     <a href="#" className="text-red-600 hover:text-red-500 font-medium">
//                       Terms of Service
//                     </a>{' '}
//                     and{' '}
//                     <a href="#" className="text-red-600 hover:text-red-500 font-medium">
//                       Privacy Policy
//                     </a>
//                   </label>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader className="animate-spin h-5 w-5 mr-2" />
//                       Creating Account...
//                     </>
//                   ) : (
//                     'Create Account'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Right Column - Google Sign In & Benefits */}
//           <div className="space-y-6">
//             {/* Google Sign In Card */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Sign Up</h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Sign up faster with your Google account
//               </p>
              
//               <button
//                 onClick={handleGoogleSignIn}
//                 disabled={loading}
//                 className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-200 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 Continue with Google
//               </button>

//               <div className="relative my-4">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or use email</span>
//                 </div>
//               </div>

//               <p className="text-xs text-gray-500 text-center">
//                 Already have an account?{' '}
//                 <Link to="/login" className="text-red-600 hover:text-red-500 font-semibold">
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//             {/* git remote add origin https://github.com/AjeflexDigital/prime-sms.git
//  */}

//             {/* Benefits Card */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Get</h3>
//               <div className="space-y-3">
               

//                 <div className="flex items-start">
//                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
//                     <CheckCircle className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 text-sm">No Setup Fees</h4>
//                     <p className="text-xs text-gray-600">Get started with zero upfront costs</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
//                     <CheckCircle className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 text-sm">Instant Activation</h4>
//                     <p className="text-xs text-gray-600">Your account is ready to use right away</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3">
//                     <CheckCircle className="h-5 w-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 text-sm">24/7 Support</h4>
//                     <p className="text-xs text-gray-600">We're here to help whenever you need us</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Back to Home */}
//         <div className="mt-6 text-center">
//           <Link
//             to="/"
//             className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
//           >
//             ← Back to homepage
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RegisterPage;