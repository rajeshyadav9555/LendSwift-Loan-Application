import React from 'react';
import { getLoanSummary, formatINRCurrency } from '../../utils/emiCalculator';
import StepNavigation from '../wizard/StepNavigation';
import { LOAN_TYPES } from '../../constants/loanTypes';

export default function Step8Review({
  formState, onNext, onBack, isFirstStep, isLastStep,
}) {
  const summary = getLoanSummary(formState.loanType, formState.loanAmount, formState.loanTenure);
  const rows = [
    ['Loan type', LOAN_TYPES[formState.loanType]?.label || '-'],
    ['Loan amount', formatINRCurrency(formState.loanAmount)],
    ['Tenure', `${formState.loanTenure} months`],
    ['Purpose', formState.loanPurpose || '-'],
    ['Applicant', formState.fullName || '-'],
    ['Email', formState.email || '-'],
    ['Mobile', formState.mobile || '-'],
    ['Employment', formState.employmentType || '-'],
    ['Estimated EMI', formatINRCurrency(summary.emi)],
    ['Processing fee', formatINRCurrency(summary.processingFee)],
  ];
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext({}); }}>
      <h2 id="step-heading" tabIndex={-1} className="text-xl font-semibold mb-1">Review &amp; submit</h2>
      <p className="text-sm text-gray-500 mb-6">Review your application details before submission.</p>
      <div className="border rounded-md divide-y">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 rounded-md bg-gray-50 text-sm text-gray-600">
        Interest rate:
        {' '}
        {summary.annualRate}
        % p.a. · Total payable:
        {' '}
        {formatINRCurrency(summary.totalPayable)}
      </div>
      <StepNavigation onBack={onBack} onNext={() => onNext({})} isFirstStep={isFirstStep} isLastStep={isLastStep} />
    </form>
  );
}
