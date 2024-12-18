import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { notesService, NoteWithImage } from '../api/notes';


export default function NotesList() {
  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const result = await notesService.getNotes();
      return result as NoteWithImage[];
    }
  });

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  if (error) {
    return <div>Error loading notes: {(error as Error).message}</div>;
  }

  if (!notes?.length) {
    return <div>No notes yet. Create your first note!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <Card key={note.id} className="max-w-md">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md font-bold">{note.title}</p>
              <p className="text-small text-default-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="mb-3">{note.content}</p>
            {note.imageUrl && (
              <Image
                alt="Note image"
                className="object-cover rounded-xl"
                src={note.imageUrl}
                width={270}
              />
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}