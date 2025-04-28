import React, { useState } from 'react';
import { read, utils, writeFile } from 'xlsx';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [skipRows, setSkipRows] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<'txt' | 'mrk'>('txt');
  const {
    toast
  } = useToast();

  const processFile = async (file: File) => {
    setFileName(file.name);
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let jsonData = utils.sheet_to_json(worksheet) as MarcData[];

      if (skipRows > 0) {
        jsonData = jsonData.slice(skipRows);
      }
      if (!jsonData.length) {
        toast({
          title: "Error processing file",
          description: "The Excel file appears to be empty after skipping rows",
          variant: "destructive"
        });
        return;
      }
      const validationErrors = validateData(jsonData);
      setErrors(validationErrors);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation errors found",
          description: `${validationErrors.length} issues detected in your data`,
          variant: "destructive"
        });
        return;
      }
      const marcText = convertToMarc(jsonData);
      setMarcOutput(marcText);
      toast({
        title: "Excel file processed successfully",
        description: "Your MARC data is ready for preview and download"
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please make sure your Excel file is properly formatted with valid MARC tags as headers",
        variant: "destructive"
      });
      console.error("File processing error:", error);
    }
  };

  const handleDownload = () => {
    if (!marcOutput) return;
    const blob = new Blob([marcOutput], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extension = outputFormat === 'mrk' ? 'mrk' : 'txt';
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

  const downloadTemplate = () => {
    const ws = utils.json_to_sheet([{
      '020$a': '9780380001019',
      '020$c': '119.14USD',
      '040$a': 'OCLC',
      '100$a': 'Asimov, Isaac',
      '100$d': '1920-1992',
      '245$a': 'The Foundation trilogy :',
      '245$b': 'three classics of Science Fiction.',
      '245$c': 'Asimov, Isaac 1920-1992',
      '650$a': 'Science fiction.'
    }]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sample");
    writeFile(wb, "marc_template.xlsx");
    toast({
      title: "Template downloaded",
      description: "Use this file as a guide for your data structure"
    });
  };

  const openTemplateFile = () => {
    window.open('https://docs.google.com/spreadsheets/d/1eFPqeOAU4Vl1JlqViuzh0Xu5dRxt-eX7/edit?usp=sharing&ouid=107215207810054417851&rtpof=true&sd=true', '_blank');
    toast({
      title: "Template Download",
      description: "Please remember to remove all red-colored dummy data before uploading your actual data.",
      variant: "warning",
    });
  };

  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">Excel to MARC Converter</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Upload Excel File</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your Excel file should have column headers in MARC format (e.g., "100$a", "245$b")
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="skipRows" className="block text-sm font-medium text-gray-700 mb-1">
                  Skip Rows
                </label>
                <Input id="skipRows" type="number" min="0" value={skipRows} onChange={e => setSkipRows(Math.max(0, parseInt(e.target.value) || 0))} placeholder="Number of rows to skip" className="w-full" />
              </div>
              <div>
                <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Output Format
                </label>
                <Select value={outputFormat} onValueChange={(value: 'txt' | 'mrk') => setOutputFormat(value)}>
                  <SelectTrigger id="outputFormat">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="txt">.txt</SelectItem>
                    <SelectItem value="mrk">.mrk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <FileUploadZone onFileUpload={processFile} isDragging={isDragging} setIsDragging={setIsDragging} fileName={fileName} />
            
            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={openTemplateFile}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          {errors.length > 0 && <ValidationErrors errors={errors} />}

          {marcOutput && <MarcPreview marcOutput={marcOutput} onDownload={handleDownload} hasErrors={errors.length > 0} />}
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Format Your Excel File</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Each column header should be a MARC tag with subfield (e.g., "100$a", "245$b")</li>
            <li>Required fields: Title field (245$a) must be included</li>
            <li>Avoid special characters like |, ^, or \</li>
            <li>Multiple subfields for the same tag will be automatically combined</li>
            <li>For repeatable fields (like multiple 650 entries), create separate rows</li>
            <li>Use the "Skip Rows" option to ignore header rows or other content at the start of your Excel file</li>
          </ul>
        </div>
      </div>
    </div>;
};

export default ExcelToMarc;
