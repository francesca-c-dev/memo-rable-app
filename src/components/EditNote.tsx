import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from '@nextui-org/react';
import { NoteWithImage, CreateNoteInput, notesService } from '../api/notes';
import { useDropzone } from 'react-dropzone';

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
  const [keepExistingImage, setKeepExistingImage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const editMutation = useMutation({
    mutationFn: async () => {
      return notesService.updateNote(note.id, {
        ...formData,
        image: image || undefined,
        deleteImage: !keepExistingImage && !image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      if (file.type === 'image/svg+xml') {
        setError('SVG files are not allowed.');
        return;
      }
      setImage(file);
      setKeepExistingImage(false);
      setError(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    editMutation.mutate();
  };

  useEffect(() => {
    // Validate the form
    const isValid = formData.title.trim() !== '' && formData.content.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Note</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                isRequired
              />
              <Textarea
                label="Content"
                value={formData.content}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, content: e.target.value }))}
                isRequired
              />
              {note.imageUrl && keepExistingImage && (
                <div className="mt-2 relative group">
                  <p className="text-small mb-2">Current Image:</p>
                  <div className="relative">
                    <img src={note.imageUrl} alt="Current" className="w-32 h-32 object-cover rounded" />
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
                      size="sm"
                      className="absolute top-2 right-2"
                      onPress={() => setKeepExistingImage(false)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-500"
              >
                <input {...getInputProps()} />
                {image ? (
                  <p className="text-sm text-gray-700">{image.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">Drag and drop an image here, or click to select</p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isDisabled={!isFormValid}
              isLoading={editMutation.isPending}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
