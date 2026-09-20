import { z } from 'zod';
import { calculateAge, validateMobile } from '../utils/validators';

const nameRegex = /^[A-Za-z][A-Za-z .]{1,99}$/;
export const step2Schema = z.object({
  fullName: z.string().regex(nameRegex, 'Enter a valid full name.'),
  dob: z.string().refine((val) => { const age = calculateAge(val); return age !== null && age >= 21 && age <= 65; }, 'You must be between 21 and 65 years old to apply.'),
  gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Select a gender.' }) }),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], { errorMap: () => ({ message: 'Select a marital status.' }) }),
  fatherName: z.string().regex(nameRegex, "Enter father's full name."),
  motherName: z.string().regex(nameRegex, "Enter mother's full name."),
  email: z.string().email('Enter a valid email address.'),
  mobile: z.string().refine(validateMobile, 'Enter a valid 10-digit mobile number starting with 6–9.'),
  alternateMobile: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.alternateMobile && data.alternateMobile === data.mobile) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alternateMobile'], message: 'Alternate mobile must be different from primary mobile.' });
  if (data.alternateMobile && !validateMobile(data.alternateMobile)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['alternateMobile'], message: 'Enter a valid 10-digit mobile number.' });
});
