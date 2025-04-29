
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { type ValidationError, type MarcData } from '@/utils/marcValidation';
import { convertToMarc } from '@/utils/marcConverter';
import FileUploadSection from './FileUploadSection';
import ValidationErrors from '@/components/ValidationErrors';
import MarcPreview from '@/components/MarcPreview';
import InstructionGuide from './InstructionGuide';

const ExcelToMarc = () => {
  const [marcOutput, setMarcOutput] = useState<string>('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProcessedFile = (processedOutput: string, validationErrors: ValidationError[], processedFileName: string) => {
    setMarcOutput(processedOutput);
    setErrors(validationErrors);
    setFileName(processedFileName);
    
    if (validationErrors.length > 0) {
      toast({
        title: "Validation errors found",
        description: `${validationErrors.length} issues detected in your data`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Excel file processed successfully",
      description: "Your MARC data is ready for preview and download"
    });
  };

  const handleDownload = (format: 'txt' | 'mrk') => {
    if (!marcOutput) return;
    const blob = new Blob([marcOutput], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extension = format === 'mrk' ? 'mrk' : 'txt';
    a.download = fileName ? `${fileName.split('.')[0]}.${extension}` : `marc_output.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download started",
      description: `Your MARC file is being downloaded as .${extension}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">Excel to MARC Converter</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <FileUploadSection 
            onFileProcessed={handleProcessedFile}
            fileName={fileName}
            navigate={navigate}
            toast={toast}
          />

          {errors.length > 0 && <ValidationErrors errors={errors} />}

          {marcOutput && (
            <MarcPreview 
              marcOutput={marcOutput} 
              onDownload={() => handleDownload(outputFormat)} 
              hasErrors={errors.length > 0} 
            />
          )}
        </div>

        <InstructionGuide />
      </div>
    </div>
  );
};

export default ExcelToMarc;
