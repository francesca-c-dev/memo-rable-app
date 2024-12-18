import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface CreateNoteInput {
  title: string;
  content: string;
  image?: File;
}

export type Nullable<T> = T | null;

// Base type matching what the API returns
export interface ApiNote {
  id: string;
  title: Nullable<string>;
  content: Nullable<string>;
  imageKey: Nullable<string>;
  owner: Nullable<string>;
  createdAt: string;
  updatedAt: string;
}

// Extended type with imageUrl
export interface NoteWithImage extends ApiNote {
  imageUrl?: string;
}


export interface CreateNoteInput {
  title: string;
  content: string;
  image?: File;
}

export const notesService = {
    async createNote({ title, content, image }: CreateNoteInput) {
        let imagePath: string | undefined;
    
        if (image) {
          const user = await getCurrentUser();
          imagePath = `notes/${user.userId}-${Date.now()}-${image.name}`; 
          await uploadData({
            path: imagePath,
            data: image,
            options: {
              contentType: image.type
            }
          }).result;
        }
  
      const result = await client.models.Note.create({
        title,
        content,
        imageKey: imagePath,
      });
  
      return result.data;
    },
  
    async getNotes(): Promise<NoteWithImage[]> {
      const result = await client.models.Note.list();
      
      const notesWithImages = await Promise.all(
        result.data.map(async (note): Promise<NoteWithImage> => {
          if (note?.imageKey) {
            const { url } = await getUrl({
              path: note.imageKey,
              options: {
                expiresIn: 3600
              }
            });
            return { ...note, imageUrl: url.toString() };
          }
          return note as NoteWithImage;
        })
      );
  
      return notesWithImages;
    },

  async deleteNote(id: string) {
    const result = await client.models.Note.get({ id });
    
    if (result.data?.imageKey) {
      // Note: implement delete when available
    }

    const deleteResult = await client.models.Note.delete({ id });
    return deleteResult.data;
  },

  async updateNote(id: string, data: Partial<CreateNoteInput>) {
    const result = await client.models.Note.get({ id });
    if (!result.data) throw new Error('Note not found');

    let imagePath = result.data.imageKey;

    if (data.image) {
      const user = await getCurrentUser();
      imagePath = `notes/${user.userId}/${Date.now()}-${data.image.name}`;
      await uploadData({
        path: imagePath,
        data: data.image,
        options: {
          contentType: data.image.type
        }
      }).result;
    }

    const updateResult = await client.models.Note.update({
      id,
      title: data.title,
      content: data.content,
      imageKey: imagePath
    });

    return updateResult.data;
  }
};