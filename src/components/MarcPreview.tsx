
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">MARC Output Preview</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={hasErrors}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
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
      </div>
      <pre className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-md overflow-x-auto whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 max-h-72 overflow-y-auto font-mono backdrop-blur-sm">
        {marcOutput}
      </pre>
    </div>
  );
};

export default MarcPreview;
