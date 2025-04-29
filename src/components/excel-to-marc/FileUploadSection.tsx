
import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import FileUploadZone from '@/components/FileUploadZone';
import { validateData, type ValidationError, type MarcData } from '@/utils/marcValidation';
import { convertToMarc } from '@/utils/marcConverter';

interface FileUploadSectionProps {
  onFileProcessed: (marcOutput: string, errors: ValidationError[], fileName: string) => void;
  fileName: string;
  navigate: any;
  toast: any;
}

const FileUploadSection = ({ onFileProcessed, fileName, navigate, toast }: FileUploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [skipRows, setSkipRows] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<'txt' | 'mrk'>('txt');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const processFile = async (file: File) => {
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
      
      if (validationErrors.length === 0) {
        const marcText = convertToMarc(jsonData);
        onFileProcessed(marcText, validationErrors, file.name);
      } else {
        onFileProcessed('', validationErrors, file.name);
      }
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please make sure your Excel file is properly formatted with valid MARC tags as headers",
        variant: "destructive"
      });
      console.error("File processing error:", error);
    }
  };

  const openTemplateDialog = () => {
    setShowTemplateDialog(true);
  };

  const handleTemplateDownload = () => {
    setShowTemplateDialog(false);
    window.open('https://docs.google.com/spreadsheets/d/1eFPqeOAU4Vl1JlqViuzh0Xu5dRxt-eX7/edit?usp=sharing&ouid=107215207810054417851&rtpof=true&sd=true', '_blank');
    toast({
      title: "Template Download",
      description: "Please remember to remove all red-colored dummy data before uploading your actual data.",
      variant: "destructive"
    });
  };

  const handleCancelTemplate = () => {
    setShowTemplateDialog(false);
    navigate('/');
  };

  return (
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
          onClick={openTemplateDialog}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      <AlertDialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download Template</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to download a template file. Please remember to remove all red-colored dummy data before uploading your actual data. Would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelTemplate}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTemplateDownload}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FileUploadSection;
