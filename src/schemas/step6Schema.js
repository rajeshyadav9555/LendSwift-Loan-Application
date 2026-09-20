import { z } from 'zod';
import { validatePAN } from '../utils/validators';
export const step6Schema = z.object({
  coApplicantRequired: z.boolean(), coApplicantName: z.string().optional().or(z.literal('')),
  relationship: z.enum(['spouse', 'parent', 'sibling', 'business-partner']).optional(),
  coApplicantPan: z.string().optional().or(z.literal('')), coApplicantIncome: z.number().optional(),
  coApplicantConsent: z.boolean().optional()
}).superRefine((data, ctx) => {
  if (!data.coApplicantRequired) return;
  if (!data.coApplicantName || data.coApplicantName.trim().length < 2)
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['coApplicantName'], message: 'Co-applicant name is required.' });
  if (!data.relationship)
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['relationship'], message: 'Select relationship to co-applicant.' });
  const panCheck = validatePAN(data.coApplicantPan || '');
  if (!panCheck.valid)
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['coApplicantPan'], message: panCheck.error });
  if (!data.coApplicantIncome || data.coApplicantIncome <= 0)
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['coApplicantIncome'], message: 'Enter co-applicant income.' });
  if (!data.coApplicantConsent)
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['coApplicantConsent'], message: 'Co-applicant consent is required.' });
});
