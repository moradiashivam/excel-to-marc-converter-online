
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileX, Info, ChevronDown, ChevronUp, Check, Download, FileSpreadsheet } from 'lucide-react';
import { ValidationError } from '@/utils/marcValidation';
import { write, utils } from 'xlsx';

interface ValidationErrorsProps {
  errors: ValidationError[];
}

const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [readErrors, setReadErrors] = useState<number[]>([]);

  if (!errors.length) return null;

  // Group errors by type for better organization
  const errorsByType: { [key: string]: ValidationError[] } = {};
  errors.forEach(error => {
    const errorType = error.message.includes('Missing') ? 'Missing Fields' : 
                    error.message.includes('Invalid character') ? 'Invalid Characters' :
                    error.message.includes('Invalid MARC') ? 'Format Issues' : 'Other Issues';
    
    if (!errorsByType[errorType]) {
      errorsByType[errorType] = [];
    }
    errorsByType[errorType].push(error);
  });

  const errorTypes = Object.keys(errorsByType);
  const displayedErrors = showAllErrors ? errors : errors.slice(0, 5);
  const hasMoreErrors = errors.length > 5;
  
  const toggleReadStatus = (errorId: number) => {
    setReadErrors(prevReadErrors => {
      if (prevReadErrors.includes(errorId)) {
        return prevReadErrors.filter(id => id !== errorId);
      } else {
        return [...prevReadErrors, errorId];
      }
    });
  };
  
  const markAllAsRead = () => {
    setReadErrors(errors.map((_, index) => index));
  };
  
  const downloadErrorList = () => {
    const errorLines = errors.map((error, index) => {
      const status = readErrors.includes(index) ? "[REVIEWED]" : "[PENDING]";
      const cellRef = error.column ? `${error.column}${error.row}` : `Row ${error.row}`;
      return `${status} Cell ${cellRef}: ${error.message.replace(`Row ${error.row}: `, '')}`;
    });
    
    const errorText = errorLines.join('\n');
    const blob = new Blob([errorText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marc_validation_errors.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadErrorsAsExcel = () => {
    // Create worksheet data
    const wsData = [
      ['Cell', 'Error Type', 'Error Message', 'Status']
    ];

    errors.forEach((error, index) => {
      const errorType = error.message.includes('Missing') ? 'Missing Field' : 
                        error.message.includes('Invalid character') ? 'Invalid Character' :
                        error.message.includes('Invalid MARC') ? 'Format Issue' : 'Other Issue';
                        
      const message = error.message.replace(`Row ${error.row}: `, '');
      const status = readErrors.includes(index) ? "Reviewed" : "Pending Review";
      const cellRef = error.column ? `${error.column}${error.row}` : `Row ${error.row}`;
      
      // Convert all values to strings to fix the type error
      wsData.push([
        cellRef,  // Cell reference instead of just row
        errorType,
        message,
        status
      ]);
    });

    // Create worksheet
    const ws = utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const wscols = [
      { wch: 8 },   // Cell column
      { wch: 20 },  // Error type column
      { wch: 60 },  // Error message column
      { wch: 15 }   // Status column
    ];
    ws['!cols'] = wscols;
    
    // Create workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Validation Errors");
    
    // Generate Excel file and download
    const wbout = write(wb, { bookType: 'xlsx', type: 'binary' });
    
    // Convert to blob and download
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) {
      view[i] = wbout.charCodeAt(i) & 0xFF;
    }
    
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marc_validation_errors.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCellReference = (error: ValidationError) => {
    return error.column ? `${error.column}${error.row}` : `Row ${error.row}`;
  };

  return (
    <Alert variant="destructive" className="mb-6">
      <FileX className="h-5 w-5" />
      <AlertTitle className="text-lg mb-2 flex justify-between items-center">
        <span>{errors.length === 1 ? '1 Validation Error' : `${errors.length} Validation Errors`}</span>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-xs flex items-center gap-1"
            onClick={markAllAsRead}
          >
            <Check className="w-4 h-4" /> Mark All as Read
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-xs flex items-center gap-1"
            onClick={downloadErrorList}
          >
            <Download className="w-4 h-4" /> Download as Text
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 text-xs flex items-center gap-1"
            onClick={downloadErrorsAsExcel}
          >
            <FileSpreadsheet className="w-4 h-4" /> Download as Excel
          </Button>
        </div>
      </AlertTitle>
      <AlertDescription>
        <p className="text-sm mb-3">Please fix the following issues before proceeding:</p>
        
        {errorTypes.length > 1 ? (
          <div className="space-y-3">
            {errorTypes.map(type => (
              <div key={type} className="bg-red-50 dark:bg-red-950/30 rounded-md p-3">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" /> {type} ({errorsByType[type].length})
                </h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {(showAllErrors ? errorsByType[type] : errorsByType[type].slice(0, 3)).map((error, index) => {
                    const errorId = errors.findIndex(e => e === error);
                    const isRead = readErrors.includes(errorId);
                    const cellRef = formatCellReference(error);
                    return (
                      <li 
                        key={`${type}-${index}`} 
                        className={`text-sm flex items-start gap-2 ${isRead ? 'opacity-60' : ''}`}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 -ml-1 mt-0.5"
                          onClick={() => toggleReadStatus(errorId)}
                        >
                          <div className={`h-4 w-4 rounded-sm border ${isRead ? 'bg-gray-400 border-gray-400' : 'border-red-500'} flex items-center justify-center`}>
                            {isRead && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </Button>
                        <span>
                          <span className="font-medium">Cell {cellRef}:</span> {error.message.replace(`Row ${error.row}: `, '')}
                        </span>
                      </li>
                    );
                  })}
                  {!showAllErrors && errorsByType[type].length > 3 && (
                    <li className="italic text-sm">
                      + {errorsByType[type].length - 3} more {type.toLowerCase()}...
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {displayedErrors.map((error, index) => {
              const isRead = readErrors.includes(index);
              const cellRef = formatCellReference(error);
              return (
                <li 
                  key={index}
                  className={`text-sm flex items-start gap-2 ${isRead ? 'opacity-60' : ''}`}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 -ml-1 mt-0.5"
                    onClick={() => toggleReadStatus(index)}
                  >
                    <div className={`h-4 w-4 rounded-sm border ${isRead ? 'bg-gray-400 border-gray-400' : 'border-red-500'} flex items-center justify-center`}>
                      {isRead && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </Button>
                  <span>
                    <span className="font-medium">Cell {cellRef}:</span> {error.message.replace(`Row ${error.row}: `, '')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        
        {hasMoreErrors && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAllErrors(!showAllErrors)}
            className="mt-3 text-xs flex items-center"
          >
            {showAllErrors ? (
              <>Show Less <ChevronUp className="ml-1 h-3 w-3" /></>
            ) : (
              <>Show All {errors.length} Errors <ChevronDown className="ml-1 h-3 w-3" /></>
            )}
          </Button>
        )}
        
        <div className="mt-4 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
          <p className="font-medium">Need help?</p>
          <ul className="list-disc list-inside mt-1">
            <li>Make sure all required fields (e.g., 245$a for Title) are filled</li>
            <li>Verify your column headers follow the MARC format (e.g., 100$a, 245$b)</li>
            <li>Remove any invalid characters (|, ^, \) from your data</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ValidationErrors;
