
import { MarcData } from './marcValidation';
import { MARC_LEADER } from './marcConstants';

const normalizeTagName = (header: string): { tag: string, subfield: string } => {
  const match = header.match(/^(\d{3})\$([a-z])/i);
  if (match) {
    return { tag: match[1], subfield: match[2] };
  }
  return { tag: '', subfield: '' };
};

// Generate proper 008 field
const generateMarc008 = (): string => {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const dateEntered = year + month + day;
  
  return `${dateEntered}s9999\\\\\\\\xx\\\\\\\\\\\\\\\\000\\0\\und\\d`;
};

export const convertToMarc = (data: MarcData[]) => {
  const marcEntries = data.map(row => {
    const lines: string[] = [];
    
    lines.push(`=LDR  ${MARC_LEADER}`);
    lines.push(`=008  ${generateMarc008()}`);
    
    const tags: { [key: string]: { indicators: string, subfields: string[] } } = {};
    
    Object.entries(row).forEach(([header, value]) => {
      if (!value) return;
      
      const { tag, subfield } = normalizeTagName(header);
      if (tag) {
        if (!tags[tag]) {
          let indicators = '\\\\';
          
          // Set proper indicators for specific tags
          if (tag === '100') indicators = '\\\\';
          else if (tag === '245') indicators = '\\0';
          
          tags[tag] = { indicators, subfields: [] };
        }
        tags[tag].subfields.push(`$${subfield}${value}`);
      }
    });
    
    Object.entries(tags)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([tag, { indicators, subfields }]) => {
        lines.push(`=${tag}  ${indicators}${subfields.join('')}`);
      });
    
    return lines.join('\n');
  });
  
  return marcEntries.join('\n\n');
};
