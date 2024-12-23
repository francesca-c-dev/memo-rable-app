import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Button, ButtonGroup, Input, Image, Spinner } from "@nextui-org/react";
import { List, Grid2X2, Search, Edit, Trash2, Download } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { notesService, type NoteWithImage } from '../api/notes';
import EditNote from './EditNote';
import PDFPreview from './PDFPreview';




export default function NotesList() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingNote, setEditingNote] = useState<NoteWithImage | null>(null);
    const [pdfPreviewNote, setPdfPreviewNote] = useState<NoteWithImage | null>(null);

    const { data: notes = [], isLoading } = useQuery({
        queryKey: ['notes'],
        queryFn: notesService.getNotes
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => notesService.deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });

    // Filter notes based on search term
    const filteredNotes = notes?.filter((note: any) => {
        const search = searchTerm.toLowerCase();
        return note.title?.toLowerCase().includes(search) || 
               note.content?.toLowerCase().includes(search);
    });

    // Separate notes into recent and older, sorted by creation date (newest first)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentNotes = filteredNotes
        .filter(note => new Date(note.createdAt) > oneDayAgo)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const olderNotes = filteredNotes
        .filter(note => new Date(note.createdAt) <= oneDayAgo)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (isLoading) return  <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
    <Spinner 
      size="lg" 
      color="primary"
      className="mb-4"
    />
    <p className="text-primary-600 dark:text-primary-400">
      {t('common.loading')}
    </p>
  </div>

    const NotesSection = ({ title, notes }: { title: string, notes: NoteWithImage[] }) => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-primary-500">{title}</h2>
            
            <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"}>
                {notes.map((note) => (
                    viewMode === 'grid' ? (
                        <Card key={note.id} className="max-w-md">
                            <CardHeader className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <p className="text-md font-bold">{note.title}</p>
                                    <p className="text-small text-default-500">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <ButtonGroup>
                                    <Button 
                                        isIconOnly 
                                        className='!text-primary-500'
                                        variant="light" 
                                        onPress={() => setPdfPreviewNote(note)}
                                    >
                                        <Download className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        color="primary"
                                        variant="light"
                                        onPress={() => setEditingNote(note)}
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Button>
                                    <Button 
                                        isIconOnly 
                                className='!text-[#e32f22]'
                                        variant="light" 
                                        onPress={() => deleteMutation.mutate(note.id)}
                                        isLoading={deleteMutation.isPending}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </ButtonGroup>
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
                    ) : (
                        <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="font-bold">{note.title}</p>
                                    <p className="text-sm text-default-500">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {note.imageUrl && (
                                    <Image
                                        alt="Note image"
                                        className="w-12 h-12 object-cover rounded"
                                        src={note.imageUrl}
                                    />
                                )}
                            </div>
                            <ButtonGroup>
                                <Button 
                                    isIconOnly 
                                    className='!text-primary-500'
                                    variant="light" 
                                    onPress={() => setPdfPreviewNote(note)}
                                >
                                    <Download className="w-5 h-5" />
                                </Button>
                                <Button
                                    isIconOnly
                                    color="primary"
                                    variant="light"
                                    onPress={() => setEditingNote(note)}
                                >
                                    <Edit className="w-5 h-5" />
                                </Button>
                                <Button 
                                    isIconOnly 
                                   className='!text-[#e32f22]'
                                    variant="light" 
                                    onPress={() => deleteMutation.mutate(note.id)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </ButtonGroup>
                        </div>
                    )
                ))}
            </div>
        </div>
    );

    return (
        <div>
          
            <div className="flex justify-between items-center mb-6">
                <Input
                    placeholder={t('notes.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<Search className="text-default-400" />}
                    className="w-full max-w-xs"
                />
                <ButtonGroup>
                    <Button
                        isIconOnly
                        variant="light"
                        className={`${viewMode === 'grid' ? 'text-primary-500 ' : ' text-gray-400 dark:text-gray-200'}`}
                     
                        onPress={() => setViewMode('grid')}
                    >
                        <Grid2X2 className="w-5 h-5" />
                    </Button>
                    <Button
                        isIconOnly
                        variant="light"
                        className={`${viewMode === 'list' ? 'text-primary-500 ' : ' text-gray-400 dark:text-gray-200'}`}
                        onPress={() => setViewMode('list')}
                    >
                        <List className="w-5 h-5" />
                    </Button>
                </ButtonGroup>
            </div>

            {recentNotes.length > 0 && (
                <NotesSection title={t('notes.recent')} notes={recentNotes} />
            )}

            {olderNotes.length > 0 && (
                <NotesSection title={t('notes.older')} notes={olderNotes} />
            )}

            {editingNote && (
                <EditNote
                    note={editingNote}
                    isOpen={!!editingNote}
                    onClose={() => setEditingNote(null)}
                />
            )}

            {pdfPreviewNote && (
                <PDFPreview
                    note={pdfPreviewNote}
                    isOpen={!!pdfPreviewNote}
                    onClose={() => setPdfPreviewNote(null)}
                />
            )}
        </div>
    );
}
