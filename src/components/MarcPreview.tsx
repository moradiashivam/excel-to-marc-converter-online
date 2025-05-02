
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MarcPreviewProps {
  marcOutput: string;
  onDownload: (format?: 'txt' | 'mrk' | 'mrc') => void;
  hasErrors: boolean;
  outputFormat?: 'txt' | 'mrk';
}

const MarcPreview = ({ marcOutput, onDownload, hasErrors, outputFormat = 'txt' }: MarcPreviewProps) => {
  if (!marcOutput) return null;

  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">MARC Output Preview</h3>
        
        {hasErrors ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
            <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-xs sm:text-sm text-red-500">Fix errors to enable download</span>
            </div>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto"
              size="sm"
              onClick={() => onDownload(outputFormat)}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Download Anyway</span>
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                size="sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Download</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload('txt')}>
                Download as .txt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload('mrk')}>
                Download as .mrk
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload('mrc')}>
                Download as .mrc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <pre className={`bg-white/90 dark:bg-gray-800/90 p-3 sm:p-4 rounded-md overflow-x-auto whitespace-pre-wrap text-xs sm:text-sm text-gray-800 dark:text-gray-200 max-h-48 sm:max-h-60 md:max-h-72 overflow-y-auto font-mono backdrop-blur-sm ${hasErrors ? 'opacity-50' : ''}`}>
        {hasErrors ? 
          marcOutput || "Cannot generate MARC output due to validation errors." : 
          marcOutput}
      </pre>
    </div>
  );
};

export default MarcPreview;
