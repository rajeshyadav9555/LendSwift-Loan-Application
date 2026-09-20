import { buildStep1Schema } from './step1Schema';
import { step2Schema } from './step2Schema';
import { buildStep3Schema } from './step3Schema';
import { step4Schema } from './step4Schema';
import { step5Schema } from './step5Schema';
import { step6Schema } from './step6Schema';
import { calculateAge } from '../utils/validators';
import { isCoApplicantStepRequired, isEmploymentTypeAllowedForLoan } from '../constants/loanTypes';

export function getSchemaForStep(step, formData) {
  switch (step) {
    case 1: return buildStep1Schema({ applicantAge: calculateAge(formData?.dob) });
    case 2: return step2Schema;
    case 3: return buildStep3Schema(formData?.loanType);
    case 4: return step4Schema;
    case 5: return step5Schema;
    case 6: return step6Schema;
    default: return null;
  }
}

export function runCrossStepChecks(formData) {
  const errors = [];
  if (formData.loanType === 'business' && formData.employmentType
      && !isEmploymentTypeAllowedForLoan(formData.loanType, formData.employmentType)) {
    errors.push({ step: 5, message: 'Business loans require Self-Employed or Business Owner status.' });
  }
  const needsCoApplicant = isCoApplicantStepRequired(formData.loanType, formData.loanAmount);
  if (needsCoApplicant && !formData.coApplicantRequired) {
    errors.push({ step: 6, message: 'Co-applicant details are required for this loan amount/type.' });
  }
  return errors;
}
