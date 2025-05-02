import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, Download, Upload, FileInput } from 'lucide-react';

const InstructionGuide = () => {
  return (
    <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          How to Use This Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Quick Start Guide Section */}
          <section>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              Quick Start Guide
            </h3>
            <ol className="space-y-4 text-gray-700 dark:text-gray-300">
              {[
                {
                  icon: <FileInput className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
                  text: "Add data to our pre-formatted Excel template"
                },
                {
                  icon: <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
                  text: "Upload to our this tool"
                },
                {
                  icon: <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
                  text: "Download .mrk file → Open in MarcEdit"
                },
                {
                  icon: <span className="font-mono text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">Ctrl+Alt+C</span>,
                  text: "Press Ctrl+Alt+C to generate the final .mrc file"
                }
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span>{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 space-y-3">
              {[
                "No coding or MARC expertise needed",
                "Perfect for Koha migrations",
                "Free & browser-based"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Excel Formatting Section */}
          <section>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
              Formatting Your Excel File
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {[
                "Each column header should be a MARC tag with subfield (e.g., '100$a', '245$b')",
                "Required fields: Title field (245$a) must be included",
                "Avoid special characters like |, ^, or \\",
                "Multiple subfields for the same tag will be automatically combined",
                "For repeatable fields (like multiple 650 entries), create separate rows",
                "Use the 'Skip Rows' option to ignore header rows or other content at the start of your Excel file"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionGuide;
