
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileX, Info, ChevronDown, ChevronUp, Check, Download, FileSpreadsheet, Edit } from 'lucide-react';
import { ValidationError } from '@/utils/marcValidation';
import { write, utils } from 'xlsx';
import { Textarea } from '@/components/ui/textarea';

interface ValidationErrorsProps {
  errors: ValidationError[];
}

const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [readErrors, setReadErrors] = useState<number[]>([]);
  const [correctionsVisible, setCorrectionsVisible] = useState<number[]>([]);
  
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
  
  const toggleCorrection = (errorId: number) => {
    setCorrectionsVisible(prev => {
      if (prev.includes(errorId)) {
        return prev.filter(id => id !== errorId);
      } else {
        return [...prev, errorId];
      }
    });
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
      ['Cell', 'Error Type', 'Error Message', 'Status', 'Suggested Correction']
    ];

    errors.forEach((error, index) => {
      const errorType = error.message.includes('Missing') ? 'Missing Field' : 
                        error.message.includes('Invalid character') ? 'Invalid Character' :
                        error.message.includes('Invalid MARC') ? 'Format Issue' : 'Other Issue';
                        
      const message = error.message.replace(`Row ${error.row}: `, '');
      const status = readErrors.includes(index) ? "Reviewed" : "Pending Review";
      const cellRef = error.column ? `${error.column}${error.row}` : `Row ${error.row}`;
      const correction = getSuggestedCorrection(error);
      
      // Convert all values to strings to fix the type error
      wsData.push([
        cellRef,  // Cell reference instead of just row
        errorType,
        message,
        status,
        correction
      ]);
    });

    // Create worksheet
    const ws = utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const wscols = [
      { wch: 8 },   // Cell column
      { wch: 20 },  // Error type column
      { wch: 60 },  // Error message column
      { wch: 15 },  // Status column
      { wch: 60 }   // Correction column
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
    a.download = 'marc_validation_errors_with_corrections.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSuggestedCorrection = (error: ValidationError): string => {
    if (error.message.includes('Missing required field')) {
      const fieldMatch = error.message.match(/Missing required field: (\S+)/);
      if (fieldMatch && fieldMatch[1]) {
        const field = fieldMatch[1];
        if (field === '245$a') return 'Add a title in the 245$a column';
        if (field === '100$a') return 'Add an author name in the 100$a column';
        if (field === '020$a') return 'Add an ISBN in the 020$a column';
        return `Add required data in the ${field} column`;
      }
    } else if (error.message.includes('Invalid MARC tag format')) {
      const tagMatch = error.message.match(/Invalid MARC tag format in header: "([^"]+)"/);
      if (tagMatch && tagMatch[1]) {
        const invalidTag = tagMatch[1];
        // Extract numbers if they exist in the invalid tag
        const numbers = invalidTag.match(/\d+/);
        const suggestedTag = numbers ? `${numbers[0]}$a` : '245$a';
        return `Replace "${invalidTag}" with a valid MARC tag format like "${suggestedTag}"`;
      }
      return 'Use format XXX$y where XXX is a 3-digit number and y is a lowercase letter (e.g., 245$a)';
    } else if (error.message.includes('Invalid character')) {
      const charMatch = error.message.match(/Invalid character in (\S+): ([^a-zA-Z0-9\s]+)/);
      if (charMatch && charMatch[2]) {
        const invalidChars = charMatch[2];
        // Start with the original string, then replace all invalid chars with empty string
        return `Remove these characters: ${invalidChars}`;
      }
    }
    return 'No specific correction available. Review data format requirements.';
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
        <p className="text-sm mb-3">Please fix the following issues before proceeding. Click on 'Show Correction' to see suggested fixes:</p>
        
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
                    const isCorrectionVisible = correctionsVisible.includes(errorId);
                    const cellRef = formatCellReference(error);
                    return (
                      <li 
                        key={`${type}-${index}`} 
                        className={`text-sm ${isRead ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start gap-2">
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
                          <div className="flex-1">
                            <span>
                              <span className="font-medium">Cell {cellRef}:</span> {error.message.replace(`Row ${error.row}: `, '')}
                            </span>
                            <div className="flex items-center mt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs px-2 py-0 flex items-center gap-1"
                                onClick={() => toggleCorrection(errorId)}
                              >
                                <Edit className="h-3 w-3" /> 
                                {isCorrectionVisible ? 'Hide Correction' : 'Show Correction'}
                              </Button>
                            </div>
                            {isCorrectionVisible && (
                              <div className="ml-6 mt-2 border-l-2 border-green-500 pl-2">
                                <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Suggested correction:</p>
                                <div className="bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-900 p-2 mb-2">
                                  <p className="text-xs">{getSuggestedCorrection(error)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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
              const isCorrectionVisible = correctionsVisible.includes(index);
              const cellRef = formatCellReference(error);
              return (
                <li 
                  key={index}
                  className={`text-sm ${isRead ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-2">
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
                    <div className="flex-1">
                      <span>
                        <span className="font-medium">Cell {cellRef}:</span> {error.message.replace(`Row ${error.row}: `, '')}
                      </span>
                      <div className="flex items-center mt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs px-2 py-0 flex items-center gap-1"
                          onClick={() => toggleCorrection(index)}
                        >
                          <Edit className="h-3 w-3" /> 
                          {isCorrectionVisible ? 'Hide Correction' : 'Show Correction'}
                        </Button>
                      </div>
                      {isCorrectionVisible && (
                        <div className="ml-6 mt-2 border-l-2 border-green-500 pl-2">
                          <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Suggested correction:</p>
                          <div className="bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-900 p-2 mb-2">
                            <p className="text-xs">{getSuggestedCorrection(error)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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

