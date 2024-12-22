import { useState } from 'react';
import Navbar from '../components/Navbar';
import NotesList from '../components/NotesList';
import CreateNote from '../components/CreateNote';
import NoteStatistics from '../components/NoteStatistics';
import WelcomeMessage from '../components/WelcomeMessage';

export default function Notes() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  return (
    <div className="min-h-screen bg-background">

      <Navbar onCreateNote={() => setIsCreateModalOpen(true)} />
      
      <main className="p-4 max-w-7xl mx-auto">
        <div className='w-full flex justify-start'>
      <WelcomeMessage/>
      </div>
        <div className="mb-8">
          <NoteStatistics />
        </div>
        <NotesList />
        
        <CreateNote 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </main>
    </div>
  );
}