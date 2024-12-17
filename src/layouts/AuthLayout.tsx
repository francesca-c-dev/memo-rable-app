import { Navigate, Outlet } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function AuthLayout() {
  const { authStatus } = useAuthenticator();

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {/* We'll add the navbar and layout structure later */}
      <Outlet />
    </div>
  );
}