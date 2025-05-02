
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileX, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { ValidationError } from '@/utils/marcValidation';

interface ValidationErrorsProps {
  errors: ValidationError[];
}

const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  const [showAllErrors, setShowAllErrors] = useState(false);

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

  return (
    <Alert variant="destructive" className="mb-6">
      <FileX className="h-5 w-5" />
      <AlertTitle className="text-lg mb-2">
        {errors.length === 1 ? '1 Validation Error' : `${errors.length} Validation Errors`}
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
                  {(showAllErrors ? errorsByType[type] : errorsByType[type].slice(0, 3)).map((error, index) => (
                    <li key={`${type}-${index}`} className="text-sm">
                      <span className="font-medium">Row {error.row}:</span> {error.message.replace(`Row ${error.row}: `, '')}
                    </li>
                  ))}
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
            {displayedErrors.map((error, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">Row {error.row}:</span> {error.message.replace(`Row ${error.row}: `, '')}
              </li>
            ))}
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
