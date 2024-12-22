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
  Tooltip
} from '@nextui-org/react';
import { NoteWithImage, CreateNoteInput, notesService } from '../api/notes';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Trash2, InfoIcon } from 'lucide-react';

interface EditNoteProps {
  note: NoteWithImage;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditNote({ note, isOpen, onClose }: EditNoteProps) {
  const { t } = useTranslation();
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
        setError(t('notes.svgNotAllowed'));
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
    const isValid = formData.title.trim() !== '' && formData.content.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl" 
      classNames={{
        base: "bg-white dark:bg-gray-900 border-2 border-primary-500",
        header: "border-b border-primary-200 dark:border-primary-500 dark:text-primary-500",
        body: "py-6",
        footer: "border-t border-primary-200 dark:border-primary-700",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{t('notes.edit')}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label={t('notes.titleLabel')}
                value={formData.title}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                isRequired
              />
              <Textarea
                label={t('notes.contentLabel')}
                value={formData.content}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, content: e.target.value }))}
                isRequired
              />
              {note.imageUrl && keepExistingImage && (
                <div className="mt-2 relative group">
                  <p className="text-small mb-2">{t('notes.currentImage')}:</p>
                  <div className="relative">
                    <img 
                      src={note.imageUrl} 
                      alt={t('notes.currentImage')} 
                      className="w-32 h-32 object-cover rounded" 
                    />
                    <Button
                      isIconOnly
                      variant="flat"
                      size="sm"
                      className="absolute top-2 right-2 !text-[#e32f22]"
                      onPress={() => setKeepExistingImage(false)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tooltip 
                  content={t("notes.svgNotAllowed")}
                  className="bg-primary-600 text-white"
                >
                  <InfoIcon className="w-4 h-4 text-primary-600 cursor-help" />
                </Tooltip>
             
              </div>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-500"
              >
                <input {...getInputProps()} />
                {image ? (
                  <p className="text-sm text-gray-700">{image.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">{t('notes.dragDropImage')}</p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              className='text-[#e32f22] !bg-transparent hover:!bg-[#e32f22] hover:!text-white' 
              variant="light" 
              onPress={onClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              className="!bg-primary-600 !text-white hover:!bg-primary-400" 
              variant="light"
              type="submit"
              isDisabled={!isFormValid}
              isLoading={editMutation.isPending}
            >
              {t('common.saveChanges')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}