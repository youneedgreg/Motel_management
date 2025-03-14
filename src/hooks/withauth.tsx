import React, { useState, useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

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
        setIsLoading(false); // Allow rendering if token exists
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
