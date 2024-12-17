import { Link } from 'react-router-dom';
import { Button } from '@nextui-org/react';


export default function NotFound() {

  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Button as={Link} to="/" color="primary">
        Go Home
      </Button>
    </div>
  );
}