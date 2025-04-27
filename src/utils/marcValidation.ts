
import { MARC_TAG_PATTERN, REQUIRED_FIELDS, INVALID_CHARS } from './marcConstants';

export interface ValidationError {
  row: number;
  message: string;
}

export interface MarcData {
  [key: string]: string;
}

export const validateHeaders = (headers: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  headers.forEach(header => {
    if (!MARC_TAG_PATTERN.test(header)) {
      errors.push({
        row: 0,
        message: `Invalid MARC tag format in header: "${header}". Expected format: XXXY where XXX is a 3-digit number and Y is a lowercase letter (e.g., 245$a)`
      });
    }
  });
  
  return errors;
};

export const validateData = (data: MarcData[]): ValidationError[] => {
  const validationErrors: ValidationError[] = [];
  
  const headers = Object.keys(data[0] || {});
  const headerErrors = validateHeaders(headers);
  validationErrors.push(...headerErrors);
  
  if (headerErrors.length === 0) {
    data.forEach((row, index) => {
      REQUIRED_FIELDS.forEach(field => {
        if (!row[field]) {
          validationErrors.push({
            row: index + 1,
            message: `Missing required field: ${field}`
          });
        }
      });
      
      Object.entries(row).forEach(([field, value]) => {
        if (typeof value === 'string' && INVALID_CHARS.some(char => value.includes(char))) {
          validationErrors.push({
            row: index + 1,
            message: `Invalid character in ${field}: ${INVALID_CHARS.join(', ')} are not allowed`
          });
        }
      });
    });
  }
  
  return validationErrors;
};
