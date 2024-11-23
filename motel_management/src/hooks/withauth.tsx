import React, { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ProtectedComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/'); // Redirect to login if not authenticated
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default withAuth;
