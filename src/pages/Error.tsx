import { useRouteError, Link } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export default function ErrorPage() {
  const error = useRouteError();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-4">Sorry, an unexpected error has occurred.</p>
      <p className="mb-8 text-gray-600">
        {(error as Error)?.message || 'Unknown error'}
      </p>
      <Button as={Link} to="/" color="primary">
        Go Home
      </Button>
    </div>
  );
}