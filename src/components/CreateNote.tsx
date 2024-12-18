// src/components/CreateNote.tsx
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Input, Textarea } from "@nextui-org/react";
import { CreateNoteInput, notesService } from '../api/notes';

export default function CreateNote() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateNoteInput>({
    title: '',
    content: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData)
    console.log(image)
    try {
      await notesService.createNote({
        ...formData,
        image: image || undefined
      });
      // Clear form on success
      setFormData({ title: '', content: '' });
      setImage(null);
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (error) {
      console.error('Error creating note:', error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <Button type="submit" color="primary" isLoading={loading}>
        Create Note
      </Button>
    </form>
  );
}