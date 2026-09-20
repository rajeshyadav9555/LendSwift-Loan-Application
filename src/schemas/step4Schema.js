import { z } from 'zod';
const addressFields = {
  addressLine1: z.string().min(5, 'Enter your address (min 5 characters).').max(200),
  addressLine2: z.string().optional().or(z.literal('')),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.')
};
export const step4Schema = z.object({
  ...addressFields,
  residenceType: z.enum(['owned', 'rented', 'company-provided', 'family-owned'], { errorMap: () => ({ message: 'Select your residence type.' }) }),
  rentAmount: z.number().optional(),
  yearsAtAddress: z.number({ invalid_type_error: 'Enter years at current address.' }).min(0).max(50),
  sameAsPermanent: z.boolean(),
  permanentAddressLine1: z.string().optional().or(z.literal('')),
  permanentPincode: z.string().optional().or(z.literal('')),
  permanentCity: z.string().optional().or(z.literal('')),
  permanentState: z.string().optional().or(z.literal(''))
}).superRefine((data, ctx) => {
  if (data.residenceType === 'rented' && (!data.rentAmount || data.rentAmount <= 0))
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['rentAmount'], message: 'Enter your monthly rent amount.' });
  if (!data.sameAsPermanent) {
    if (!data.permanentAddressLine1 || data.permanentAddressLine1.length < 5)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['permanentAddressLine1'], message: 'Enter your permanent address.' });
    if (!data.permanentPincode || !/^\d{6}$/.test(data.permanentPincode))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['permanentPincode'], message: 'Enter a valid 6-digit permanent address PIN code.' });
  }
});
