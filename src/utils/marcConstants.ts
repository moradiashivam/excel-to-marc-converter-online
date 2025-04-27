
export const MARC_TAG_PATTERN = /^(\d{3})\$([a-z])(?:_\d+)?$/i;
export const REQUIRED_FIELDS = ['245$a']; // Title is required
export const INVALID_CHARS = ['|', '^', '\\'];
export const MARC_LEADER = '00000nam a2200000la 4500';
export const MARC_008_DEFAULT = `${new Date().toISOString().slice(2,8)}s99999|||||xx||||||||||||||||||und||`;
