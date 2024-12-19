import { useAuthenticator } from '@aws-amplify/ui-react';
import { useTranslation } from 'react-i18next';

import NotesList from '../components/NotesList';
import CreateNote from '../components/CreateNote';
import NoteStatistics from '../components/NoteStatistics';





export default function Notes() {
  const { t } = useTranslation();
  const {signOut} = useAuthenticator()


  
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>
      <div className="mb-8">
        <CreateNote />
      </div>
      <div className="mb-8">
        <NoteStatistics />
      </div>
      <NotesList />
    
      <button onClick={()=>signOut()}>{t("login.logout")}</button>
    </div>
  );
}


