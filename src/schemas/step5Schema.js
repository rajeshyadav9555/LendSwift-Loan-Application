import { z } from 'zod';
import { validateGST } from '../utils/validators';

const salariedSchema = z.object({
  employmentType: z.literal('salaried'),
  employerName: z.string().min(2, 'Employer name is required.'),
  designation: z.string().min(2, 'Designation is required.'),
  monthlyIncome: z.number().min(15000, 'Minimum monthly income is ₹15,000.'),
  yearsExperience: z.number().min(0).max(50),
});
const selfEmployedSchema = z.object({
  employmentType: z.literal('self-employed-professional'),
  businessName: z.string().min(2, 'Business/practice name is required.'),
  businessType: z.string().min(2, 'Select a business type.'),
  annualTurnover: z.number().min(300000, 'Minimum annual turnover is ₹3,00,000.'),
  yearsInBusiness: z.number().min(2, 'Minimum 2 years in business/practice required.'),
  monthlyIncome: z.number().min(1, 'Enter your average monthly income.'),
  officeAddress: z.string().min(5, 'Enter your office/practice address.'),
});
const businessOwnerSchema = z.object({
  employmentType: z.literal('business-owner'),
  businessName: z.string().min(2, 'Business name is required.'),
  businessType: z.string().min(2, 'Select a business type.'),
  annualTurnover: z.number().min(300000, 'Minimum annual turnover is ₹3,00,000.'),
  yearsInBusiness: z.number().min(2, 'Minimum 2 years in business required.'),
  gstNumber: z.string().refine((v) => validateGST(v).valid, (v) => ({ message: validateGST(v).error || 'Invalid GST number.' })),
  officeAddress: z.string().min(5, 'Enter your business address.'),
});
export const step5Schema = z.discriminatedUnion('employmentType', [salariedSchema, selfEmployedSchema, businessOwnerSchema]);
