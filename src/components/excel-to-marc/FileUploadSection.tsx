
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import FileUploadZone from '@/components/FileUploadZone';
import { validateData, type ValidationError, type MarcData } from '@/utils/marcValidation';
import { convertToMarc } from '@/utils/marcConverter';
import { findDuplicateRecords, mergeDuplicateRecords } from '@/utils/duplicateHandler';

interface FileUploadSectionProps {
  onFileProcessed: (marcOutput: string, errors: ValidationError[], fileName: string, format: 'txt' | 'mrk') => void;
  fileName: string;
  navigate: any;
  toast: any;
}

const FileUploadSection = ({ onFileProcessed, fileName, navigate, toast }: FileUploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [skipRows, setSkipRows] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<'txt' | 'mrk'>('txt');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateData, setDuplicateData] = useState<{
    jsonData: MarcData[];
    duplicates: Array<{firstIndex: number, secondIndex: number}>;
  } | null>(null);

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

      // Check for duplicates based on 020$a and 245$a
      const duplicates = findDuplicateRecords(jsonData);
      
      if (duplicates.length > 0) {
        // Store data and show duplicate dialog
        setDuplicateData({ jsonData, duplicates });
        setShowDuplicateDialog(true);
        return;
      }
      
      // If no duplicates, proceed with normal validation and processing
      completeFileProcessing(jsonData, file.name);
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please make sure your Excel file is properly formatted with valid MARC tags as headers",
        variant: "destructive"
      });
      console.error("File processing error:", error);
    }
  };

  const completeFileProcessing = (jsonData: MarcData[], originalFileName: string) => {
    const validationErrors = validateData(jsonData);
    
    if (validationErrors.length === 0) {
      const marcText = convertToMarc(jsonData);
      onFileProcessed(marcText, validationErrors, originalFileName, outputFormat);
    } else {
      onFileProcessed('', validationErrors, originalFileName, outputFormat);
    }
  };

  const handleMergeDuplicates = () => {
    if (!duplicateData) return;
    
    // Merge the duplicates
    const mergedData = mergeDuplicateRecords(duplicateData.jsonData, duplicateData.duplicates);
    
    // Close dialog and process the merged data
    setShowDuplicateDialog(false);
    completeFileProcessing(mergedData, fileName || "merged_data.xlsx");
    
    toast({
      title: "Duplicates merged",
      description: `${duplicateData.duplicates.length} duplicate records were merged successfully`
    });
  };

  const handleSkipMerge = () => {
    if (!duplicateData) return;
    
    // Skip merging and process the original data
    setShowDuplicateDialog(false);
    completeFileProcessing(duplicateData.jsonData, fileName || "data.xlsx");
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
    <div className="mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Upload Excel File</h2>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
        Your Excel file should have column headers in MARC format (e.g., "100$a", "245$b")
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label htmlFor="skipRows" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Skip Rows
          </label>
          <Input id="skipRows" type="number" min="0" value={skipRows} onChange={e => setSkipRows(Math.max(0, parseInt(e.target.value) || 0))} placeholder="Number of rows to skip" className="w-full" />
        </div>
        <div>
          <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
      
      <div className="mt-3 sm:mt-4 flex flex-wrap justify-between items-center">
        <Button
          variant="outline"
          onClick={openTemplateDialog}
          className="flex items-center gap-2 text-sm w-full sm:w-auto mb-2 sm:mb-0"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* Template Dialog */}
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

      {/* Duplicate Records Dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Duplicate Records Found</DialogTitle>
            <DialogDescription>
              {duplicateData?.duplicates.length} duplicate records were found based on matching 020$a (ISBN) and 245$a (Title) fields.
              Do you want to merge these records?
            </DialogDescription>
          </DialogHeader>
          <div className="text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 my-2">
            <p className="text-gray-600 dark:text-gray-400 mb-1">During merging:</p>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
              <li>Records with the same ISBN and Title will be combined</li>
              <li>The 952 tag data (location codes) will be preserved from all duplicate records</li>
            </ul>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={handleSkipMerge}>
              Skip Merging
            </Button>
            <Button variant="default" onClick={handleMergeDuplicates} className="ml-2">
              Merge Records
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUploadSection;
