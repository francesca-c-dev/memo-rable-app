import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';
import { notesService, type CreateNoteInput } from '../api/notes';

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

  const createMutation = useMutation({
    mutationFn: async () => {
      return notesService.createNote({
        ...formData,
        image: image || undefined
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      handleClose();
    },
  });

  const handleClose = () => {
    setFormData({ title: '', content: '' });
    setImage(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

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
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                isRequired
              />
              <Textarea
                label={t('notes.contentLabel')}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                isRequired
              />
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
            <Button color="danger" variant="light" onPress={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button 
              color="primary" 
              type="submit"
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