
import { MarcData } from './marcValidation';

/**
 * Normalizes string values by trimming and replacing multiple spaces with a single space
 * @param value String to normalize
 * @returns Normalized string
 */
const normalizeValue = (value: string): string => {
  if (!value) return '';
  return value.trim().replace(/\s+/g, ' ');
};

/**
 * Finds duplicate records in the data based on matching 020$a (ISBN) and 245$a (Title) fields
 * @param data Array of MARC data objects
 * @returns Array of duplicate record pairs with their indices
 */
export const findDuplicateRecords = (data: MarcData[]): Array<{firstIndex: number, secondIndex: number}> => {
  const duplicates: Array<{firstIndex: number, secondIndex: number}> = [];
  const isbnTitleMap = new Map<string, number>();
  
  // First pass: build a map of ISBN + Title combinations to their first occurrence index
  data.forEach((record, index) => {
    const isbn = record['020$a'];
    const title = record['245$a'];
    
    // Only process records that have both ISBN and Title
    if (isbn && title) {
      // Normalize title value by trimming and replacing multiple spaces with single space
      const normalizedTitle = normalizeValue(title);
      const key = `${isbn}__${normalizedTitle}`;
      
      if (isbnTitleMap.has(key)) {
        // Found a duplicate, record its index
        duplicates.push({
          firstIndex: isbnTitleMap.get(key)!,
          secondIndex: index
        });
      } else {
        // Record the first occurrence
        isbnTitleMap.set(key, index);
      }
    }
  });
  
  return duplicates;
};

/**
 * Merges duplicate records by combining the 952 tag data
 * @param data Original MARC data array
 * @param duplicates Array of duplicate record pairs with their indices
 * @returns New array with merged records
 */
export const mergeDuplicateRecords = (data: MarcData[], duplicates: Array<{firstIndex: number, secondIndex: number}>): MarcData[] => {
  // Create a copy of the data to avoid modifying the original
  const mergedData = [...data];
  const indicesToRemove = new Set<number>();
  
  // Process the duplicates in reverse order to handle index shifts correctly
  const sortedDuplicates = [...duplicates].sort((a, b) => b.secondIndex - a.secondIndex);
  
  for (const { firstIndex, secondIndex } of sortedDuplicates) {
    // Get the records to merge
    const primaryRecord = mergedData[firstIndex];
    const duplicateRecord = mergedData[secondIndex];
    
    // Merge the 952 tags and any other relevant fields
    mergeMarcFields(primaryRecord, duplicateRecord);
    
    // Mark the duplicate for removal
    indicesToRemove.add(secondIndex);
  }
  
  // Remove duplicates from highest index to lowest to avoid index shifting problems
  const indices = Array.from(indicesToRemove).sort((a, b) => b - a);
  for (const index of indices) {
    mergedData.splice(index, 1);
  }
  
  return mergedData;
};

/**
 * Merges MARC fields from a duplicate record into the primary record
 * @param primaryRecord The record that will be kept
 * @param duplicateRecord The record to merge from (will be removed)
 */
const mergeMarcFields = (primaryRecord: MarcData, duplicateRecord: MarcData): void => {
  // Find all 952 fields in the duplicate record
  const locationFields = Object.entries(duplicateRecord)
    .filter(([key]) => key.startsWith('952$'))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  
  // Find the highest existing 952 field index in the primary record
  let maxIndex = -1;
  Object.keys(primaryRecord).forEach(key => {
    if (key.startsWith('952$')) {
      const match = key.match(/952\$([a-z])(?:_(\d+))?/i);
      if (match && match[2]) {
        maxIndex = Math.max(maxIndex, parseInt(match[2]));
      } else if (match) {
        maxIndex = Math.max(maxIndex, 0);
      }
    }
  });
  
  // Add the duplicate's 952 fields to the primary record with new indices
  Object.entries(locationFields).forEach(([key, value]) => {
    const match = key.match(/952\$([a-z])(?:_(\d+))?/i);
    if (match) {
      const subfield = match[1];
      maxIndex++;
      const newKey = maxIndex === 0 ? `952$${subfield}` : `952$${subfield}_${maxIndex}`;
      primaryRecord[newKey] = value;
    }
  });
};
