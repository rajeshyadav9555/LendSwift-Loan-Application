import { useEffect, useRef, useState } from 'react';
import { encryptData } from '../utils/encryption';

const SCHEMA_VERSION = '1.0';

export function draftKey(loanType) {
  return `lendswift_draft_${loanType || 'unspecified'}`;
}

export async function persistDraft(formState, loanType, currentStep) {
  if (!loanType) return false;

  try {
    const encrypted = await encryptData(formState);
    const meta = {
      version: SCHEMA_VERSION,
      timestamp: new Date().toISOString(),
      step: currentStep,
      loanType
    };

    window.localStorage.setItem(draftKey(loanType), encrypted);
    window.localStorage.setItem(`${draftKey(loanType)}_meta`, JSON.stringify(meta));
    return true;
  } catch (err) {
    console.warn('Auto-save failed:', err);
    return false;
  }
}

export function useAutoSave(formState, { loanType, currentStep, interval = 30000, enabled = true }) {
  const timerRef = useRef(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!enabled || !loanType) return undefined;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const saved = await persistDraft(formState, loanType, currentStep);
      if (saved) {
        setLastSavedAt(new Date());
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    }, interval);

    return () => clearTimeout(timerRef.current);
  }, [JSON.stringify(formState), loanType, currentStep, enabled, interval]);

  return { lastSavedAt, showToast };
}

export function clearDraft(loanType) {
  window.localStorage.removeItem(draftKey(loanType));
  window.localStorage.removeItem(`${draftKey(loanType)}_meta`);
}
