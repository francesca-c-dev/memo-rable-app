import { Navigate, Outlet } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Spinner } from '@nextui-org/react';

export default function AuthLayout() {
  const { authStatus } = useAuthenticator();

  if (authStatus === 'configuring') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner 
          size="lg" 
          color="primary"
          className="mb-4"
        />
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

 

  return (
    <div>
    
      <Outlet />
    </div>
  );
}