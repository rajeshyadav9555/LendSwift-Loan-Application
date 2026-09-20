export const LOAN_TYPES = {
  personal: {
    label: 'Personal Loan', minAmount: 50000, maxAmount: 1000000, minTenure: 12, maxTenure: 60,
    purposes: ['Debt Consolidation', 'Medical Expense', 'Travel', 'Wedding', 'Other']
  },
  home: {
    label: 'Home Loan', minAmount: 500000, maxAmount: 10000000, minTenure: 60, maxTenure: 360,
    purposes: ['Purchase', 'Construction', 'Renovation', 'Balance Transfer']
  },
  business: {
    label: 'Business Loan', minAmount: 100000, maxAmount: 5000000, minTenure: 12, maxTenure: 120,
    purposes: ['Working Capital', 'Equipment Purchase', 'Expansion', 'Inventory']
  }
};
export function isCoApplicantStepRequired(loanType, loanAmount) {
  if (loanType === 'home') return true;
  if (loanType === 'personal') return Number(loanAmount) > 500000;
  if (loanType === 'business') return Number(loanAmount) > 2000000;
  return false;
}
export function isEmploymentTypeAllowedForLoan(loanType, employmentType) {
  if (loanType !== 'business') return true;
  return employmentType === 'self-employed-professional' || employmentType === 'business-owner';
}
export const REQUIRED_DOCS_BASE = ['panCard', 'aadhaarFront', 'aadhaarBack', 'bankStatements', 'photograph', 'signature'];
export function getRequiredDocuments(loanType, employmentType, panVerified) {
  let docs = [...REQUIRED_DOCS_BASE];
  if (panVerified) docs = docs.filter((d) => d !== 'panCard');
  docs.push(employmentType === 'salaried' ? 'salarySlips' : 'itr');
  if (loanType === 'home') docs.push('propertyDocuments');
  if (loanType === 'business') docs.push('businessRegistration', 'gstReturns');
  return docs;
}
