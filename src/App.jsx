import React from 'react';
import { FormStoreProvider, useFormDispatch } from './store/FormStore';
import { useFormPersistence } from './hooks/useFormPersistence';
import Wizard from './components/wizard/Wizard';

function ResumeModal({ pendingDraft, onResume, onDiscard }) {
  if (!pendingDraft) return null;
  const savedAt = new Date(pendingDraft.meta.timestamp).toLocaleString('en-IN');

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="bg-white rounded-lg max-w-sm w-full p-6">
        <h2 id="resume-title" className="text-lg font-semibold text-gray-900 mb-2">
          Resume your application?
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          You have a saved
          {' '}
          {pendingDraft.loanType}
          {' '}
          loan application from
          {' '}
          {savedAt}
          .
        </p>
        <p className="text-sm text-gray-600 mb-6">
          You were on step
          {' '}
          {pendingDraft.meta.step}
          {' '}
          of 8.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={onDiscard} className="btn-secondary flex-1">Start fresh</button>
          <button type="button" onClick={onResume} className="btn-primary flex-1">Resume</button>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const { pendingDraft, checked, discard } = useFormPersistence();
  const dispatch = useFormDispatch();
  const [submittedData, setSubmittedData] = React.useState(null);

  function handleResume() {
    dispatch({ type: 'RESTORE', payload: pendingDraft.data });
    discard();
  }

  if (!checked) return null;

  if (submittedData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="glass-panel max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl shadow-inner shadow-emerald-200/80">✅</div>
          <h1 className="mb-2 text-2xl font-bold text-primary">Application submitted</h1>
          <p className="text-base text-slate-600">
            Thank you — your reference is
            {' '}
            <strong className="text-slate-900">{submittedData.applicationId}</strong>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ResumeModal pendingDraft={pendingDraft} onResume={handleResume} onDiscard={discard} />
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-600 text-base font-bold text-white shadow-lg shadow-primary/20">LS</div>
            <div>
              <div className="text-lg font-bold tracking-tight text-primary">LendSwift</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Digital lending</div>
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium tracking-wide text-emerald-700">RBI-registered NBFC simulation</span>
        </div>
      </header>
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <Wizard onSubmitted={setSubmittedData} />
      </main>
    </>
  );
}

export default function App() {
  return (
    <FormStoreProvider>
      <AppShell />
    </FormStoreProvider>
  );
}
