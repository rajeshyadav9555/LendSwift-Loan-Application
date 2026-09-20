import React from 'react';

export default function StepNavigation({
  onBack, onNext, onSaveDraft, isFirstStep, isLastStep, isSubmitting,
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
      <button type="button" onClick={onBack} disabled={isFirstStep} className="btn-secondary" style={{ visibility: isFirstStep ? 'hidden' : 'visible' }}>Back</button>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSaveDraft} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary">Save &amp; exit</button>
        <button type="button" onClick={onNext} disabled={isSubmitting} className="btn-primary">{isLastStep ? 'Submit application' : 'Continue'}</button>
      </div>
    </div>
  );
}
