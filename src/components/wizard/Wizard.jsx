import React, { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';
import { useFormState, useFormDispatch } from '../../store/FormStore';
import { useAutoSave, clearDraft, persistDraft } from '../../hooks/useAutoSave';
import { isCoApplicantStepRequired } from '../../constants/loanTypes';
import Step1LoanType from '../steps/Step1LoanType';
import Step2PersonalInfo from '../steps/Step2PersonalInfo';
import Step3KYC from '../steps/Step3KYC';
import Step4Address from '../steps/Step4Address';
import Step5Employment from '../steps/Step5Employment';
import Step6CoApplicant from '../steps/Step6CoApplicant';
import Step7Documents from '../steps/Step7Documents';
import Step8Review from '../steps/Step8Review';

export const STEP_DEFS = [
  { number: 1, title: 'Loan type & amount', Component: Step1LoanType },
  { number: 2, title: 'Personal information', Component: Step2PersonalInfo },
  { number: 3, title: 'Identity verification', Component: Step3KYC },
  { number: 4, title: 'Address', Component: Step4Address },
  { number: 5, title: 'Employment & income', Component: Step5Employment },
  { number: 6, title: 'Co-applicant', Component: Step6CoApplicant },
  { number: 7, title: 'Documents & signature', Component: Step7Documents },
  { number: 8, title: 'Review & submit', Component: Step8Review },
];

export default function Wizard({ onSubmitted }) {
  const formState = useFormState();
  const dispatch = useFormDispatch();
  const [currentStep, setCurrentStep] = useState(formState.currentStep || 1);
  const [manualSaveNotice, setManualSaveNotice] = useState(false);
  const step6Active = isCoApplicantStepRequired(formState.loanType, formState.loanAmount);
  const activeStepNumbers = STEP_DEFS.map((s) => s.number).filter((n) => n !== 6 || step6Active);
  const { showToast } = useAutoSave(formState, { loanType: formState.loanType, currentStep, enabled: !!formState.loanType });

  useEffect(() => {
    dispatch({ type: 'SET_STEP', payload: currentStep });
    document.getElementById('step-heading')?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, dispatch]);

  async function handleSaveDraft() {
    if (!formState.loanType) {
      return;
    }

    const saved = await persistDraft(formState, formState.loanType, currentStep);
    if (saved) {
      setManualSaveNotice(true);
      setTimeout(() => setManualSaveNotice(false), 1800);
    }
  }

  function goNext(stepData) {
    dispatch({ type: 'UPDATE_FIELDS', payload: stepData });
    const merged = { ...formState, ...stepData };
    let next = currentStep + 1;
    if (next === 6 && !isCoApplicantStepRequired(merged.loanType, merged.loanAmount)) next = 7;
    if (next <= 8) setCurrentStep(next);
  }
  function goBack() {
    let prev = currentStep - 1;
    if (prev === 6 && !step6Active) prev = 5;
    if (prev >= 1) setCurrentStep(prev);
  }
  function handleSubmit(stepData) {
    const submitted = { ...formState, ...stepData };
    dispatch({ type: 'UPDATE_FIELDS', payload: stepData });
    clearDraft(formState.loanType);
    const applicationId = `LS-${Date.now().toString().slice(-8)}`;
    onSubmitted?.({ ...submitted, applicationId });
  }

  const activeDef = STEP_DEFS.find((s) => s.number === currentStep);
  const { Component } = activeDef;
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">Application flow</p>
            <h1 className="mt-1 text-xl font-bold text-slate-800 sm:text-2xl">Secure your loan in minutes</h1>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">Fast approval</div>
        </div>
        <ProgressBar steps={STEP_DEFS} currentStep={currentStep} activeSteps={activeStepNumbers} />
      </div>
      {(showToast || manualSaveNotice) && <div className="fixed bottom-4 right-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-2xl shadow-slate-900/30" role="status">Draft saved</div>}
      <div className="glass-panel mt-6 p-5 sm:p-8">
        <Component
          formState={formState}
          onNext={currentStep === 8 ? handleSubmit : goNext}
          onBack={goBack}
          onSaveDraft={handleSaveDraft}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === 8}
          goToStep={setCurrentStep}
        />
      </div>
    </div>
  );
}
