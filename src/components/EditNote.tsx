// src/components/EditNote.tsx
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@nextui-org/react";
import { NoteWithImage, CreateNoteInput, notesService } from '../api/notes';


interface EditNoteProps {
  note: NoteWithImage;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditNote({ note, isOpen, onClose }: EditNoteProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateNoteInput>({
    title: note.title || '',
    content: note.content || '',
  });
  const [image, setImage] = useState<File | null>(null);

  const editMutation = useMutation({
    mutationFn: async () => {
      return notesService.updateNote(note.id, {
        ...formData,
        image: image || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader>Edit Note</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  label="Content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
                {note.imageUrl && (
                  <div className="mt-2">
                    <p className="text-small mb-2">Current Image:</p>
                    <img src={note.imageUrl} alt="Current" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                           file:rounded-full file:border-0 file:text-sm file:font-semibold
                           file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                type="submit"
                isLoading={editMutation.isPending}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}