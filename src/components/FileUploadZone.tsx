
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
        "border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-colors",
        isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto text-blue-500 dark:text-blue-400 mb-2" />
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">Drag and drop your Excel file here</p>
      <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">or</p>
      <Input
        id="file-upload"
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <Button variant="outline" size="sm" className="cursor-pointer text-sm sm:text-base">
        Browse Files
      </Button>
      {fileName && (
        <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-2 flex items-center justify-center gap-2">
          <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="truncate max-w-[200px] sm:max-w-[300px]">{fileName}</span>
        </p>
      )}
    </div>
  );
};

export default FileUploadZone;
