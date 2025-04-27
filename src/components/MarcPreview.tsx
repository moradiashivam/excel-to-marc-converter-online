
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MarcPreviewProps {
  marcOutput: string;
  onDownload: () => void;
  hasErrors: boolean;
}

const MarcPreview = ({ marcOutput, onDownload, hasErrors }: MarcPreviewProps) => {
  if (!marcOutput) return null;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">MARC Output Preview</h3>
        <Button
          onClick={onDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={hasErrors}
        >
          <Download className="w-4 h-4 mr-2" />
          Download MARC
        </Button>
      </div>
      <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap text-sm text-gray-800 max-h-72 overflow-y-auto">
        {marcOutput}
      </pre>
    </div>
  );
};

export default MarcPreview;
