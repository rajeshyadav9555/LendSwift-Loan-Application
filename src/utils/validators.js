export const PAN_ENTITY_TYPES = {
  P: 'Individual',
  C: 'Company',
  H: 'HUF',
  A: 'AOP',
  B: 'BOI',
  G: 'Government',
  J: 'Artificial Juridical Person',
  L: 'Local Authority',
  F: 'Firm',
  T: 'Trust',
};

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function validatePAN(pan, loanType = 'personal') {
  if (!pan || typeof pan !== 'string') return { valid: false, error: 'PAN is required.' };
  const value = pan.toUpperCase().trim();
  if (!PAN_REGEX.test(value)) {
    return { valid: false, error: 'PAN must be 10 characters in the format AAAAA9999A.' };
  }
  const entityChar = value[3];
  const entityType = PAN_ENTITY_TYPES[entityChar];
  if (!entityType) return { valid: false, error: 'PAN 4th character must indicate a valid entity type.' };
  const allowedForLoanType = { personal: ['P'], home: ['P'], business: ['P', 'C', 'F'] };
  const allowed = allowedForLoanType[loanType] || ['P'];
  if (!allowed.includes(entityChar)) {
    return { valid: false, error: `Entity type (${entityType}) not permitted for a ${loanType} loan.` };
  }
  return { valid: true, entityType, formatted: value };
}

const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

export function verhoeffValidate(numStr) {
  let c = 0;
  const digits = numStr.split('').reverse().map(Number);
  for (let i = 0; i < digits.length; i += 1) c = d[c][p[i % 8][digits[i]]];
  return c === 0;
}

export function verhoeffGenerate(numStr) {
  let c = 0;
  const digits = numStr.split('').reverse().map(Number);
  for (let i = 0; i < digits.length; i += 1) c = d[c][p[(i + 1) % 8][digits[i]]];
  return inv[c];
}

export function validateAadhaar(aadhaar) {
  if (!aadhaar || typeof aadhaar !== 'string') return { valid: false, error: 'Aadhaar number is required.' };
  const value = aadhaar.replace(/\s/g, '');
  if (!/^\d{12}$/.test(value)) return { valid: false, error: 'Aadhaar must be exactly 12 digits.' };
  if (value[0] === '0' || value[0] === '1') return { valid: false, error: 'Aadhaar number cannot start with 0 or 1.' };
  if (!verhoeffValidate(value)) return { valid: false, error: 'Aadhaar checksum is invalid. Re-check the number.' };
  return { valid: true, masked: `XXXX XXXX ${value.slice(-4)}` };
}

const GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z]\d$/;
export function validateGST(gst) {
  if (!gst) return { valid: false, error: 'GST number is required.' };
  const value = gst.toUpperCase().trim();
  if (!GST_REGEX.test(value)) return { valid: false, error: 'GST must be 15 characters in correct format.' };
  return { valid: true, formatted: value, panEmbedded: value.slice(2, 12) };
}

export const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile || '');

export function calculateAge(dobString) {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
}
