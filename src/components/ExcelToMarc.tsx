
import React, { useState } from 'react';
import { read, utils, writeFile } from 'xlsx';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import FileUploadZone from './FileUploadZone';
import ValidationErrors from './ValidationErrors';
import MarcPreview from './MarcPreview';
import { validateData, type ValidationError, type MarcData } from '@/utils/marcValidation';
import { convertToMarc } from '@/utils/marcConverter';

const ExcelToMarc = () => {
  const [marcOutput, setMarcOutput] = useState<string>('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const processFile = async (file: File) => {
    setFileName(file.name);
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet) as MarcData[];
      
      if (!jsonData.length) {
        toast({
          title: "Error processing file",
          description: "The Excel file appears to be empty",
          variant: "destructive",
        });
        return;
      }

      const validationErrors = validateData(jsonData);
      setErrors(validationErrors);
      
      if (validationErrors.length > 0) {
        toast({
          title: "Validation errors found",
          description: `${validationErrors.length} issues detected in your data`,
          variant: "destructive",
        });
        return;
      }

      const marcText = convertToMarc(jsonData);
      setMarcOutput(marcText);
      
      toast({
        title: "Excel file processed successfully",
        description: "Your MARC data is ready for preview and download",
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please make sure your Excel file is properly formatted with valid MARC tags as headers",
        variant: "destructive",
      });
      console.error("File processing error:", error);
    }
  };

  const handleDownload = () => {
    if (!marcOutput) return;
    
    const blob = new Blob([marcOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `${fileName.split('.')[0]}_marc.txt` : 'marc_output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your MARC file is being downloaded",
    });
  };

  const downloadTemplate = () => {
    const ws = utils.json_to_sheet([
      {
        '020$a': '9780380001019',
        '020$c': '119.14USD',
        '040$a': 'OCLC',
        '100$a': 'Asimov, Isaac',
        '100$d': '1920-1992',
        '245$a': 'The Foundation trilogy :',
        '245$b': 'three classics of Science Fiction.',
        '245$c': 'Asimov, Isaac 1920-1992',
        '650$a': 'Science fiction.'
      }
    ]);
    
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sample");
    writeFile(wb, "marc_template.xlsx");
    
    toast({
      title: "Template downloaded",
      description: "Use this file as a guide for your data structure",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Excel to MARC Converter</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Excel File</h2>
            <p className="text-gray-600 mb-4">
              Your Excel file should have column headers in MARC format (e.g., "100$a", "245$b")
            </p>
            
            <FileUploadZone
              onFileUpload={processFile}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              fileName={fileName}
            />
            
            <div className="mt-4 flex justify-between items-center">
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {errors.length > 0 && <ValidationErrors errors={errors} />}

          {marcOutput && (
            <MarcPreview
              marcOutput={marcOutput}
              onDownload={handleDownload}
              hasErrors={errors.length > 0}
            />
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Format Your Excel File</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Each column header should be a MARC tag with subfield (e.g., "100$a", "245$b")</li>
            <li>Required fields: Title field (245$a) must be included</li>
            <li>Avoid special characters like |, ^, or \</li>
            <li>Multiple subfields for the same tag will be automatically combined</li>
            <li>For repeatable fields (like multiple 650 entries), create separate rows</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExcelToMarc;
