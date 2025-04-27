
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileX } from 'lucide-react';
import { ValidationError } from '@/utils/marcValidation';

interface ValidationErrorsProps {
  errors: ValidationError[];
}

const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  if (!errors.length) return null;

  return (
    <Alert variant="destructive">
      <FileX className="h-4 w-4" />
      <AlertTitle>Validation Errors</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside mt-2">
          {errors.slice(0, 5).map((error, index) => (
            <li key={index}>Row {error.row}: {error.message}</li>
          ))}
          {errors.length > 5 && (
            <li>...and {errors.length - 5} more errors</li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default ValidationErrors;
