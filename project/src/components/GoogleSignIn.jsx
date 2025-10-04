// import React, { useEffect } from 'react';

// // Google Sign-In Component
// function GoogleSignIn({ onSuccess, onError, text = "Sign in with Google" }) {
//   useEffect(() => {
//     // Load Google Sign-In script
//     const script = document.createElement('script');
//     script.src = 'https://accounts.google.com/gsi/client';
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       if (window.google) {
//         window.google.accounts.id.initialize({
//           client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
//           callback: handleCredentialResponse,
//           auto_select: false,
//           cancel_on_tap_outside: true,
//         });

//         window.google.accounts.id.renderButton(
//           document.getElementById('google-signin-button'),
//           {
//             theme: 'outline',
//             size: 'large',
//             width: '100%',
//             text: 'signin_with',
//             shape: 'rectangular',
//           }
//         );
//       }
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleCredentialResponse = async (response) => {
//     try {
//       // Decode the JWT token to get user info
//       const userInfo = parseJwt(response.credential);
      
//       // Send to your backend for verification and user creation/login
//       const result = await fetch('/api/auth/google-signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           credential: response.credential,
//           userInfo: {
//             email: userInfo.email,
//             name: userInfo.name,
//             picture: userInfo.picture,
//             email_verified: userInfo.email_verified,
//           }
//         }),
//       });

//       const data = await result.json();

//       if (result.ok) {
//         onSuccess(data);
//       } else {
//         onError(data.message || 'Google Sign-In failed');
//       }
//     } catch (error) {
//       console.error('Google Sign-In error:', error);
//       onError('Google Sign-In failed');
//     }
//   };

//   // Helper function to parse JWT token
//   const parseJwt = (token) => {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       );
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error('Error parsing JWT:', error);
//       return {};
//     }
//   };

//   return (
//     <div className="w-full">
//       <div id="google-signin-button" className="w-full"></div>
//     </div>
//   );
// }

// export default GoogleSignIn;



import React, { useEffect } from 'react';

// Google Sign-In Component
function GoogleSignIn({ onSuccess, onError, text = "Sign in with Google" }) {
  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Decode the JWT token to get user info
      const userInfo = parseJwt(response.credential);
      
      // Send to your backend for verification and user creation/login
      const result = await fetch('/api/auth/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
          userInfo: {
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            email_verified: userInfo.email_verified,
          }
        }),
      });

      const data = await result.json();

      if (result.ok) {
        // Store auth data and call success handler
        if (data.accessToken && data.refreshToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        onSuccess(data);
      } else {
        onError(data.message || 'Google Sign-In failed');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      onError('Google Sign-In failed');
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return {};
    }
  };

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full"></div>
    </div>
  );
}

export default GoogleSignIn;