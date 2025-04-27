
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFileUpload: (file: File) => Promise<void>;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  fileName: string;
}

const FileUploadZone = ({ onFileUpload, isDragging, setIsDragging, fileName }: FileUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files.length) {
      await onFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-12 h-12 mx-auto text-blue-500 mb-2" />
      <p className="text-gray-600 mb-2">Drag and drop your Excel file here</p>
      <p className="text-gray-400 text-sm mb-4">or</p>
      <Input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <Button variant="outline" className="cursor-pointer">
        Browse Files
      </Button>
      {fileName && (
        <p className="text-blue-600 mt-2 flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          {fileName}
        </p>
      )}
    </div>
  );
};

export default FileUploadZone;
