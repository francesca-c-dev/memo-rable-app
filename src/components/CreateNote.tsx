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
import { useTranslation } from 'react-i18next';
import { notesService, type CreateNoteInput } from '../api/notes';
import { useDropzone } from 'react-dropzone';

interface CreateNoteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateNote({ isOpen, onClose }: CreateNoteProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateNoteInput>({
    title: '',
    content: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const createMutation = useMutation({
    mutationFn: async () => {
      return notesService.createNote({
        ...formData,
        image: image || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      handleClose();
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
      setError(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleClose = () => {
    setFormData({ title: '', content: '' });
    setImage(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    createMutation.mutate();
  };

  useEffect(() => {
    // Validate the form
    const isValid = formData.title.trim() !== '' && formData.content.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{t('notes.create')}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label={t('notes.titleLabel')}
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, title: e.target.value }))
                }
                isRequired
              />
              <Textarea
                label={t('notes.contentLabel')}
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, content: e.target.value }))
                }
                isRequired
              />
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
            <Button color="danger" variant="light" onPress={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              type="submit"
              isDisabled={!isFormValid}
              isLoading={createMutation.isPending}
            >
              {t('common.create')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
