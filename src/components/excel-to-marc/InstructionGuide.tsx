
import React from 'react';

const InstructionGuide = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">How to Format Your Excel File</h3>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
        <li>Each column header should be a MARC tag with subfield (e.g., "100$a", "245$b")</li>
        <li>Required fields: Title field (245$a) must be included</li>
        <li>Avoid special characters like |, ^, or \</li>
        <li>Multiple subfields for the same tag will be automatically combined</li>
        <li>For repeatable fields (like multiple 650 entries), create separate rows</li>
        <li>Use the "Skip Rows" option to ignore header rows or other content at the start of your Excel file</li>
      </ul>
    </div>
  );
};

export default InstructionGuide;
