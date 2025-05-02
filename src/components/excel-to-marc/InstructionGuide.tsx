
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText } from 'lucide-react';

const InstructionGuide = () => {
  return (
    <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">How to Use This Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-3">Quick Start Guide</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="font-bold mr-2">1️⃣</span>
                <span>Add data to our pre-formatted Excel template</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2️⃣</span>
                <span>Upload to <a href="https://lnkd.in/deEBEbxb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">this converter</a></span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3️⃣</span>
                <span>Download .mrk file → Open in MarcEdit</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4️⃣</span>
                <span>Press Ctrl+Alt+C to generate the final .mrc file</span>
              </li>
            </ol>

            <div className="mt-4 space-y-2">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>No coding or MARC expertise needed</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Perfect for Koha migrations</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Free & browser-based</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-3">Formatting Your Excel File</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Each column header should be a MARC tag with subfield (e.g., "100$a", "245$b")</li>
              <li>Required fields: Title field (245$a) must be included</li>
              <li>Avoid special characters like |, ^, or \</li>
              <li>Multiple subfields for the same tag will be automatically combined</li>
              <li>For repeatable fields (like multiple 650 entries), create separate rows</li>
              <li>Use the "Skip Rows" option to ignore header rows or other content at the start of your Excel file</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionGuide;
