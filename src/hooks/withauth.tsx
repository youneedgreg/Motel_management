import React, { useState, useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  // Add other relevant properties if needed, based on your JWT payload structure
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ProtectedComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const validateToken = () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.log('No token found in local storage');
          router.push('/'); // Redirect to login if no token
          return;
        }

        console.log('Token found:', token);

        try {
          const decoded = jwtDecode<JwtPayload>(token); // Specify the type for decoding

          // Checking if the token is expired
          if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            console.log('Token expired');
            router.push('/'); // Redirect to login if token expired
            return;
          }

          console.log('Token is valid:', decoded);
        } catch (error) {
          console.error('Invalid token:', error);
          router.push('/'); // Redirect to login if token invalid
          return;
        }

        setIsLoading(false); // Allow rendering if token is valid
      };

      validateToken();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Render a loading spinner or message
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default withAuth;
