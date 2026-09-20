import React, { useMemo, useState } from 'react';
import FileUpload from '../common/FileUpload';
import SignatureCanvas from '../common/SignatureCanvas';
import StepNavigation from '../wizard/StepNavigation';
import { getRequiredDocuments } from '../../constants/loanTypes';

const labels = {
  panCard: 'PAN card',
  aadhaarFront: 'Aadhaar front',
  aadhaarBack: 'Aadhaar back',
  bankStatements: 'Bank statements',
  photograph: 'Photograph',
  salarySlips: 'Salary slips',
  itr: 'ITR documents',
  propertyDocuments: 'Property documents',
  businessRegistration: 'Business registration',
  gstReturns: 'GST returns',
};

export default function Step7Documents({
  formState, onNext, onBack, isFirstStep, isLastStep,
}) {
  const requiredDocs = useMemo(() => getRequiredDocuments(formState.loanType, formState.employmentType, formState.panVerified), [formState.loanType, formState.employmentType, formState.panVerified]);
  const [docs, setDocs] = useState(formState.documents || {});
  const [signature, setSignature] = useState(formState.signature || null);
  const missing = requiredDocs.filter((k) => !docs[k] && !(k === 'signature' && signature));
  function next() {
    if (missing.length) return;
    onNext({ documents: docs, signature });
  }
  return (
    <div>
      <h2 id="step-heading" tabIndex={-1} className="text-xl font-semibold mb-1">Documents &amp; signature</h2>
      <p className="text-sm text-gray-500 mb-6">Upload clear documents. Files are processed locally in this demo.</p>
      <div className="space-y-4">
        {requiredDocs.filter((k) => k !== 'signature').map((k) => <FileUpload key={k} label={labels[k] || k} required existingFile={docs[k]} onFileAccepted={(file) => setDocs((prev) => ({ ...prev, [k]: { name: file.name, size: file.size, type: file.type } }))} />)}
        <SignatureCanvas label="Signature" onChange={setSignature} error={!signature ? 'Signature is required.' : null} />
      </div>
      {missing.length > 0 && <p className="mt-4 text-xs text-danger">Please complete all required uploads and signature.</p>}
      <StepNavigation onBack={onBack} onNext={next} isFirstStep={isFirstStep} isLastStep={isLastStep} />
    </div>
  );
}
