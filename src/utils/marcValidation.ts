
import { MARC_TAG_PATTERN, REQUIRED_FIELDS, INVALID_CHARS } from './marcConstants';

export interface ValidationError {
  row: number;
  column?: string;
  message: string;
  actualRow?: number; // Added to track actual row including skip rows
}

export interface MarcData {
  [key: string]: string;
}

export const validateHeaders = (headers: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  headers.forEach((header, index) => {
    if (!MARC_TAG_PATTERN.test(header)) {
      errors.push({
        row: 0,
        column: getColumnLabel(index),
        message: `Invalid MARC tag format in header: "${header}". Expected format: XXXY where XXX is a 3-digit number and Y is a lowercase letter (e.g., 245$a)`
      });
    }
  });
  
  return errors;
};

export const validateData = (data: MarcData[], skipRows: number = 0): ValidationError[] => {
  const validationErrors: ValidationError[] = [];
  
  const headers = Object.keys(data[0] || {});
  const headerErrors = validateHeaders(headers);
  validationErrors.push(...headerErrors);
  
  if (headerErrors.length === 0) {
    data.forEach((row, rowIndex) => {
      // We need to account for header row, 0-indexing, and skipped rows
      const displayRowNumber = rowIndex + 1; // For displaying in messages
      const actualRowNumber = rowIndex + 1 + 1 + skipRows; // Actual Excel row (+1 for header, +1 for 0-indexing, +skipRows for skipped rows)
      
      REQUIRED_FIELDS.forEach(field => {
        if (!row[field]) {
          const columnIndex = headers.indexOf(field);
          validationErrors.push({
            row: displayRowNumber,
            actualRow: actualRowNumber,
            column: getColumnLabel(columnIndex),
            message: `Missing required field: ${field}`
          });
        }
      });
      
      Object.entries(row).forEach(([field, value], columnIndex) => {
        const fieldIndex = headers.indexOf(field);
        // Skip character validation for 245$a field (title) to allow non-English characters
        if (field !== '245$a' && typeof value === 'string' && INVALID_CHARS.some(char => value.includes(char))) {
          validationErrors.push({
            row: displayRowNumber,
            actualRow: actualRowNumber,
            column: getColumnLabel(fieldIndex),
            message: `Invalid character in ${field}: ${INVALID_CHARS.join(', ')} are not allowed`
          });
        }
      });
    });
  }
  
  return validationErrors;
};

/**
 * Converts a zero-based column index to an Excel-style column label (A, B, C, ... Z, AA, AB, etc.)
 * @param columnIndex Zero-based column index
 * @returns Excel-style column label
 */
export const getColumnLabel = (columnIndex: number): string => {
  let columnLabel = '';
  let num = columnIndex;
  
  while (num >= 0) {
    columnLabel = String.fromCharCode(65 + (num % 26)) + columnLabel;
    num = Math.floor(num / 26) - 1;
  }
  
  return columnLabel;
};
