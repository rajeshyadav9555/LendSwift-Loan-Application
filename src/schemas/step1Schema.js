import { z } from 'zod';
import { LOAN_TYPES } from '../constants/loanTypes';

export function buildStep1Schema({ applicantAge } = {}) {
  return z.object({
    loanType: z.enum(['personal', 'home', 'business'], { errorMap: () => ({ message: 'Select a loan type.' }) }),
    loanAmount: z.number({ invalid_type_error: 'Enter a loan amount.' }),
    loanTenure: z.number({ invalid_type_error: 'Select a tenure.' }),
    loanPurpose: z.string().min(1, 'Select a purpose for your loan.'),
    referralCode: z.string().regex(/^[A-Za-z0-9]{6,10}$/, 'Referral code must be 6–10 alphanumeric characters.').optional().or(z.literal('')),
  }).superRefine((data, ctx) => {
    const config = LOAN_TYPES[data.loanType];
    if (!config) return;
    if (data.loanAmount < config.minAmount || data.loanAmount > config.maxAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanAmount'],
        message: `Amount must be between ₹${config.minAmount.toLocaleString('en-IN')} and ₹${config.maxAmount.toLocaleString('en-IN')}.`,
      });
    }
    let { maxTenure } = config;
    if (applicantAge) {
      const maxTenureByAge = (65 - applicantAge) * 12;
      maxTenure = Math.min(config.maxTenure, Math.max(maxTenureByAge, config.minTenure));
    }
    if (data.loanTenure < config.minTenure || data.loanTenure > maxTenure) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['loanTenure'],
        message: `Tenure must be between ${config.minTenure} and ${maxTenure} months.`,
      });
    }
  });
}
