import { z } from 'zod';
import { validatePAN, validateAadhaar } from '../utils/validators';
export function buildStep3Schema(loanType) {
  return z.object({
    pan: z.string().refine((v) => validatePAN(v, loanType).valid, (v) => ({ message: validatePAN(v, loanType).error || 'Invalid PAN.' })),
    aadhaar: z.string().refine((v) => validateAadhaar(v).valid, (v) => ({ message: validateAadhaar(v).error || 'Invalid Aadhaar.' })),
    aadhaarConsent: z.literal(true, { errorMap: () => ({ message: 'You must consent to Aadhaar-based verification to proceed.' }) }),
    voterId: z.string().regex(/^[A-Z]{3}\d{7}$/, 'Voter ID must be 3 letters followed by 7 digits.').optional().or(z.literal('')),
    passport: z.string().regex(/^[A-Z]\d{7}$/, 'Passport must be 1 letter followed by 7 digits.').optional().or(z.literal(''))
  });
}
