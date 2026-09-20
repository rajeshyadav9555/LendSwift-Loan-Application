import React from 'react';

export default function ProgressBar({ steps, currentStep, activeSteps }) {
  const visibleSteps = steps.filter((s) => activeSteps.includes(s.number));
  const currentIndex = visibleSteps.findIndex((s) => s.number === currentStep);
  const pct = ((currentIndex + 1) / visibleSteps.length) * 100;

  return (
    <nav aria-label={`Application progress: step ${currentIndex + 1} of ${visibleSteps.length}`}>
      <div className="mb-3 flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
        <span>
          Step
          {currentIndex + 1}
          {' '}
          of
          {visibleSteps.length}
        </span>
        <span className="hidden text-slate-700 sm:inline">{visibleSteps.find((s) => s.number === currentStep)?.title}</span>
      </div>
      <div className="mb-2 flex items-center gap-2">
        {visibleSteps.map((step) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;
          return (
            <div key={step.number} className="flex-1">
              <div className={`h-2.5 rounded-full transition-all duration-300 ${isDone || isActive ? 'bg-primary' : 'bg-slate-200'}`} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{visibleSteps.find((s) => s.number === currentStep)?.title}</span>
        <span>
          {Math.round(pct)}
          %
        </span>
      </div>
    </nav>
  );
}
