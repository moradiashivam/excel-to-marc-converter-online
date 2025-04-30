
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { type ValidationError } from '@/utils/marcValidation';
import FileUploadSection from './FileUploadSection';
import ValidationErrors from '@/components/ValidationErrors';
import MarcPreview from '@/components/MarcPreview';
import InstructionGuide from './InstructionGuide';

const ExcelToMarc = () => {
  const [marcOutput, setMarcOutput] = useState<string>('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<'txt' | 'mrk'>('txt');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProcessedFile = (processedOutput: string, validationErrors: ValidationError[], processedFileName: string, format: 'txt' | 'mrk') => {
    setMarcOutput(processedOutput);
    setErrors(validationErrors);
    setFileName(processedFileName);
    setOutputFormat(format);
    
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

  const handleDownload = (format: 'txt' | 'mrk' | 'mrc') => {
    if (!marcOutput) return;

    let downloadContent = marcOutput;
    let mimeType = 'text/plain';
    
    // For MRC format, convert the MRK to binary MRC format
    if (format === 'mrc') {
      downloadContent = simpleMrkToMrc(marcOutput);
      mimeType = 'application/octet-stream';
    }
    
    const blob = new Blob([downloadContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extension = format;
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

  // Simple function to convert MRK text to binary MRC format
  const simpleMrkToMrc = (mrkText: string): string => {
    // This is a simplified conversion just to demonstrate the concept
    // In a real implementation, this would properly encode the MARC binary format
    
    // For now, we just add a header to indicate it's a binary format
    const binaryPrefix = "This is a simplified MRC binary format.\n\n";
    return binaryPrefix + mrkText;
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
              onDownload={(format) => handleDownload(format || outputFormat)} 
              hasErrors={errors.length > 0} 
              outputFormat={outputFormat}
            />
          )}
        </div>

        <InstructionGuide />
      </div>
    </div>
  );
};

export default ExcelToMarc;
