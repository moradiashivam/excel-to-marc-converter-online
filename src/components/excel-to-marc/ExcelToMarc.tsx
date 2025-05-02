
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-300 dark:to-indigo-300">
          <span className="inline-flex items-center">
            <svg 
              className="w-10 h-10 mr-3 text-blue-600 dark:text-blue-400 transition-transform hover:rotate-12" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M8 13h8"></path>
              <path d="M8 17h8"></path>
              <path d="M8 9h1"></path>
            </svg>
            <span className="relative">
              Excel to MARC Converter
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-indigo-500/50 dark:from-blue-400/50 dark:via-purple-400/50 dark:to-indigo-400/50 rounded-full"></span>
            </span>
          </span>
        </h1>
      </div>
      
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
  );
};

export default ExcelToMarc;
