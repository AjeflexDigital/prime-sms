// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// // API configuration
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Configure axios defaults
// axios.defaults.baseURL = API_BASE_URL;

// // Request interceptor to add auth token
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for token refresh
// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (refreshToken) {
//         try {
//           const response = await axios.post('/auth/refresh-token', { refreshToken });
//           const { accessToken } = response.data;
          
//           localStorage.setItem('accessToken', accessToken);
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
//           return axios(originalRequest);
//         } catch (refreshError) {
//           // Refresh failed, redirect to login
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('refreshToken');
//           localStorage.removeItem('user');
//           window.location.href = '/login';
//         }
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Initialize auth state from localStorage
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedUser = localStorage.getItem('user');
//         const accessToken = localStorage.getItem('accessToken');
        
//         if (storedUser && accessToken) {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
          
//           // Validate token by making a test request
//           try {
//             const response = await axios.get('/user/profile');
//             // Update user data if needed
//             if (response.data.user) {
//               setUser(response.data.user);
//               localStorage.setItem('user', JSON.stringify(response.data.user));
//             }
//           } catch (error) {
//             // Token is invalid, clear auth state
//             logout();
//           }
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/auth/login', { email, password });
//       const { user: userData, accessToken, refreshToken } = response.data;
      
//       // Store tokens and user data
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);
//       localStorage.setItem('user', JSON.stringify(userData));
      
//       setUser(userData);
      
//       return { success: true, user: userData };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed';
//       return { success: false, message };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('/auth/register', userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Registration failed';
//       return { success: false, message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const updateUser = (updatedUserData) => {
//     const newUser = { ...user, ...updatedUserData };
//     setUser(newUser);
//     localStorage.setItem('user', JSON.stringify(newUser));
//   };

//   const forgotPassword = async (email) => {
//     try {
//       const response = await axios.post('/auth/forgot-password', { email });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to send reset email';
//       return { success: false, message };
//     }
//   };

//   const resetPassword = async (token, password) => {
//     try {
//       const response = await axios.post('/auth/reset-password', { token, password });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Password reset failed';
//       return { success: false, message };
//     }
//   };

//   const verifyEmail = async (token) => {
//     try {
//       const response = await axios.post('/auth/verify-email', { token });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Email verification failed';
//       return { success: false, message };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     updateUser,
//     forgotPassword,
//     resetPassword,
//     verifyEmail
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


// export default AuthContext;







import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh-token', { refreshToken });
          const { accessToken } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');
        
        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Validate token by making a test request
          try {
            const response = await axios.get('/user/profile');
            // Update user data if needed
            if (response.data.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            // Token is invalid, clear auth state
            logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user: userData, accessToken, refreshToken } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const googleSignIn = async (credential, userInfo) => {
    try {
      const response = await axios.post('/auth/google-signin', { credential, userInfo });
      const { user: userData, accessToken, refreshToken } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      
      return { success: true, user: userData, isNewUser: response.data.isNewUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Google Sign-In failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      return { success: false, message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post('/auth/reset-password', { token, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      return { success: false, message };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await axios.post('/auth/verify-email', { token });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleSignIn,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;