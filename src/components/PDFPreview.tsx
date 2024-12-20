import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';
import { Download, Eye } from "lucide-react";
import { getUrl } from 'aws-amplify/storage';
import jsPDF from 'jspdf';
import type { NoteWithImage } from '../api/notes';

interface PDFPreviewProps {
  note: NoteWithImage;
  isOpen: boolean;
  onClose: () => void;
}

export default function PDFPreview({ note, isOpen, onClose }: PDFPreviewProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text(note.title || "", 20, 20);
      
      // Add creation date
      pdf.setFontSize(12);
      pdf.text(`Created: ${new Date(note.createdAt).toLocaleDateString()}`, 20, 30);
      
      let yPosition = 40;

      // Add content
      pdf.setFontSize(12);
      const splitContent = pdf.splitTextToSize(note.content || "", 170);
      pdf.text(splitContent, 20, yPosition);
      
      yPosition += pdf.getTextDimensions(splitContent).h + 10;

      // If there's an image, get it through Amplify Storage
      if (note.imageKey) {
        try {
          // Get a signed URL using Amplify Storage
          const { url: signedUrl } = await getUrl({
            path: note.imageKey
          });

          // Convert image to base64
          const response = await fetch(signedUrl.toString());
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          // Calculate image dimensions
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = base64;
          });

          // Scale image to fit page width while maintaining aspect ratio
          const pageWidth = pdf.internal.pageSize.getWidth();
          const maxWidth = pageWidth - 40; // 20px margin on each side
          const imgWidth = Math.min(maxWidth, 170);
          const imgHeight = (img.height * imgWidth) / img.width;

          pdf.addImage(base64, 'JPEG', 20, yPosition, imgWidth, imgHeight);
        } catch (error) {
          console.error('Error loading image:', error);
          pdf.text('(Image could not be loaded)', 20, yPosition);
        }
      }

      // Download the PDF
      pdf.save(`${note.title}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex gap-1">
          <Eye className="w-6 h-6" />
          {t('notes.pdfPreview')}
        </ModalHeader>
        <ModalBody>
          <div className="p-8 bg-white rounded-lg">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{note.title}</h1>
              <p className="text-sm text-gray-500 mb-6">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </p>
              
              {note.imageUrl && (
                <div className="mb-6">
                  <img 
                    src={note.imageUrl} 
                    alt={note.title || ""}
                    className="max-w-full rounded-lg shadow-lg"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none whitespace-pre-wrap">
                {note.content}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
          >
            Close
          </Button>
          <Button
            color="primary"
            onPress={generatePDF}
            startContent={<Download className="w-4 h-4" />}
            isLoading={isGenerating}
          >
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}