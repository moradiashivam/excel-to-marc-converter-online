
import { MarcData } from './marcValidation';
import { MARC_LEADER, MARC_008_DEFAULT } from './marcConstants';

const normalizeTagName = (header: string): { tag: string, subfield: string } => {
  const match = header.match(/^(\d{3})\$([a-z])/i);
  if (match) {
    return { tag: match[1], subfield: match[2] };
  }
  return { tag: '', subfield: '' };
};

export const convertToMarc = (data: MarcData[]) => {
  const marcEntries = data.map(row => {
    const lines: string[] = [];
    
    lines.push(`LDR ${MARC_LEADER}`);
    lines.push(`008 ${MARC_008_DEFAULT}`);
    
    const tags: { [key: string]: { indicators: string, subfields: string[] } } = {};
    
    Object.entries(row).forEach(([header, value]) => {
      if (!value) return;
      
      const { tag, subfield } = normalizeTagName(header);
      if (tag) {
        if (!tags[tag]) {
          let indicators = '\\\\';
          
          // Changed indicator for tag 245 from '\0' to '\\'
          if (tag === '100') indicators = '\\\\';
          else if (tag === '245') indicators = '\\\\';
          
          tags[tag] = { indicators, subfields: [] };
        }
        tags[tag].subfields.push(`$${subfield}${value}`);
      }
    });
    
    Object.entries(tags)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([tag, { indicators, subfields }]) => {
        lines.push(`${tag} ${indicators}${subfields.join('')}`);
      });
    
    return lines.join('\n');
  });
  
  return marcEntries.join('\n\n');
};
