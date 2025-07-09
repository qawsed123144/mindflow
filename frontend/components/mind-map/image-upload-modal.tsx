'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { useLanguage } from '@/context/language-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNodesExtracted: (nodes: { label: string; x: number; y: number }[]) => void;
}

export function ImageUploadModal({ isOpen, onClose, onNodesExtracted }: ImageUploadModalProps) {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Extract potential nodes from text
      const lines = text.split('\n').filter(line => line.trim());
      const nodes = lines.map((line, index) => ({
        label: line.trim(),
        x: 100 + (index % 3) * 200,
        y: 100 + Math.floor(index / 3) * 150
      }));

      onNodesExtracted(nodes);
      onClose();
      toast.success(t.imageProcessedSuccess);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(t.failedProcessImage);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.uploadImage}</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          `}
        >
          <input {...getInputProps()} />
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>{t.processingImage}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <p>
                {isDragActive
                  ? t.dropImageHere
                  : t.dragDropImage}
              </p>
              <p className="text-sm text-gray-500">
                {t.supportsPngJpg}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}