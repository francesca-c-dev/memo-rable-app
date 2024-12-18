import { useAuthenticator } from '@aws-amplify/ui-react';
import { useTranslation } from 'react-i18next';

import NotesList from '../components/NotesList';
import CreateNote from '../components/CreateNote';





export default function Notes() {
  const { t } = useTranslation();
  const {signOut} = useAuthenticator()
  
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('notes.title')}</h1>
      <div className="mb-8">
        <CreateNote />
      </div>
      <NotesList />
      <button onClick={()=>signOut()}>sign out</button>
    </div>
  );
}


