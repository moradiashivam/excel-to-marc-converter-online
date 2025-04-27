import React, { useState, useRef } from 'react';
import { read, utils, writeFile } from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Upload, FileText, FileX } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface MarcData {
  [key: string]: string;
}

interface ValidationError {
  row: number;
  message: string;
}

const MARC_TAG_PATTERN = /^(\d{3})\$([a-z])$/i;
const REQUIRED_FIELDS = ['245$a']; // Title is required
const INVALID_CHARS = ['|', '^', '\\'];

const ExcelToMarc = () => {
  const [marcOutput, setMarcOutput] = useState<string>('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateHeaders = (headers: string[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    headers.forEach(header => {
      if (!MARC_TAG_PATTERN.test(header)) {
        errors.push({
          row: 0, // Header row
          message: `Invalid MARC tag format in header: "${header}". Expected format: XXXY where XXX is a 3-digit number and Y is a lowercase letter (e.g., 245$a)`
        });
      }
    });
    
    return errors;
  };

  const validateData = (data: MarcData[]): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    
    const headers = Object.keys(data[0] || {});
    const headerErrors = validateHeaders(headers);
    validationErrors.push(...headerErrors);
    
    if (headerErrors.length === 0) {
      data.forEach((row, index) => {
        REQUIRED_FIELDS.forEach(field => {
          if (!row[field]) {
            validationErrors.push({
              row: index + 1,
              message: `Missing required field: ${field}`
            });
          }
        });
        
        Object.entries(row).forEach(([field, value]) => {
          if (typeof value === 'string' && INVALID_CHARS.some(char => value.includes(char))) {
            validationErrors.push({
              row: index + 1,
              message: `Invalid character in ${field}: ${INVALID_CHARS.join(', ')} are not allowed`
            });
          }
        });
      });
    }
    
    return validationErrors;
  };

  const convertToMarc = (data: MarcData[]) => {
    const marcEntries = data.map(row => {
      const tags: { [key: string]: { indicators: string, subfields: string[] } } = {};
      
      Object.entries(row).forEach(([header, value]) => {
        if (!value) return;
        
        const match = header.match(MARC_TAG_PATTERN);
        if (match) {
          const [, tag, subfield] = match;
          if (!tags[tag]) {
            let indicators = '##';
            if (tag === '100' || tag === '700') indicators = '1#';
            else if (tag === '245') indicators = '14';
            
            tags[tag] = { indicators, subfields: [] };
          }
          tags[tag].subfields.push(`$${subfield}${value}`);
        }
      });
      
      return Object.entries(tags).map(([tag, { indicators, subfields }]) => {
        return `${tag}${indicators}${subfields.join('')}`;
      }).join('\n');
    });
    
    return marcEntries.join('\n\n');
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files.length) {
      await processFile(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

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
            
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
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

          {errors.length > 0 && (
            <div className="mb-6">
              <Alert variant="destructive">
                <FileX className="h-4 w-4" />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2">
                    {errors.slice(0, 5).map((error, index) => (
                      <li key={index}>Row {error.row}: {error.message}</li>
                    ))}
                    {errors.length > 5 && (
                      <li>...and {errors.length - 5} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {marcOutput && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">MARC Output Preview</h3>
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={errors.length > 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download MARC
                </Button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap text-sm text-gray-800 max-h-72 overflow-y-auto">
                {marcOutput}
              </pre>
            </div>
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
