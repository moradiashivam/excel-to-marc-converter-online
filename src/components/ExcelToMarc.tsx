
import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface MarcData {
  [key: string]: string;
}

const ExcelToMarc = () => {
  const [marcOutput, setMarcOutput] = useState<string>('');
  const { toast } = useToast();

  const convertToMarc = (data: MarcData[]) => {
    const marcEntries = data.map(row => {
      const tags: { [key: string]: string[] } = {};
      
      // Group by MARC tag numbers
      Object.entries(row).forEach(([header, value]) => {
        if (!value) return;
        
        const match = header.match(/^(\d+)\$([a-z])$/i);
        if (match) {
          const [, tag, subfield] = match;
          if (!tags[tag]) tags[tag] = [];
          tags[tag].push(`$${subfield}${value}`);
        }
      });
      
      // Convert to MARC format
      return Object.entries(tags).map(([tag, subfields]) => {
        const indicators = '##'; // Default indicators
        return `${tag}${indicators}${subfields.join('')}`;
      }).join('\n');
    });
    
    return marcEntries.join('\n\n');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      const marcText = convertToMarc(jsonData as MarcData[]);
      setMarcOutput(marcText);
      
      toast({
        title: "Excel file processed successfully",
        description: "Your MARC data is ready for download",
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please make sure your Excel file is properly formatted",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!marcOutput) return;
    
    const blob = new Blob([marcOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marc_output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your MARC file is being downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Excel to MARC Converter</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Excel File</h2>
            <p className="text-gray-600 mb-4">
              Your Excel file should have column headers in MARC format (e.g., "100$a", "200$b")
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {marcOutput && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">MARC Output</h3>
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download MARC
                </Button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap text-sm text-gray-800">
                {marcOutput}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Format Your Excel File</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Each column header should be a MARC tag with subfield (e.g., "100$a", "245$b")</li>
            <li>Multiple subfields for the same tag will be automatically combined</li>
            <li>Empty cells will be ignored in the output</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExcelToMarc;
