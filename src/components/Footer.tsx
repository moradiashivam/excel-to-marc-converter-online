import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateData } from '@/utils/marcValidation';
import { convertToMarc } from '@/utils/marcConverter';
import { findDuplicateRecords, mergeDuplicateRecords } from '@/utils/duplicateHandler';

interface FileUploadSectionProps {
  onFileProcessed: (output: string, errors: any[], fileName: string, format: 'txt' | 'mrk') => void;
  fileName: string;
  navigate: any;
  toast: any;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ 
  onFileProcessed, 
  fileName,
  navigate,
  toast
}) => {
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', codepage: 65001 }); // UTF-8 codepage

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON with UTF-8 handling
      const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
        raw: false, // Get formatted strings
        defval: '', // Default empty string for empty cells
        dateNF: 'yyyy-mm-dd', // Date format
        blankrows: false // Skip blank rows
      });

      // Process data
      const validationErrors = validateData(jsonData);
      const marcData = convertToMarc(jsonData);
      
      onFileProcessed(
        marcData,
        validationErrors,
        file.name,
        'mrk'
      );
    } catch (error) {
      toast({
        title: "File processing error",
        description: "Failed to process the Excel file. Please ensure it's a valid Excel file with UTF-8 encoding.",
        variant: "destructive"
      });
      console.error('Error processing file:', error);
    }
  }, [onFileProcessed, toast]);

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="excel-upload">Upload Excel File</Label>
        <Input 
          id="excel-upload" 
          type="file" 
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
        />
      </div>
      {fileName && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current file: {fileName}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
