import { useEffect, useState } from 'react';
import { decryptData } from '../utils/encryption';
import { draftKey, clearDraft } from './useAutoSave';

const TTL_HOURS = 72;
const LOAN_TYPES = ['personal', 'home', 'business'];

export function useFormPersistence() {
  const [pendingDraft, setPendingDraft] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function scan() {
      for (const loanType of LOAN_TYPES) {
        const raw = window.localStorage.getItem(draftKey(loanType));
        const metaRaw = window.localStorage.getItem(`${draftKey(loanType)}_meta`);
        if (!raw || !metaRaw) continue;
        try {
          const meta = JSON.parse(metaRaw);
          const ageHours = (Date.now() - new Date(meta.timestamp).getTime()) / 3.6e6;
          if (ageHours > TTL_HOURS) {
            clearDraft(loanType);
            continue;
          }
          const data = await decryptData(raw);
          if (meta.version !== '1.0') {
            clearDraft(loanType);
            continue;
          }
          setPendingDraft({ loanType, meta, data });
          break;
        } catch (err) {
          clearDraft(loanType);
        }
      }
      setChecked(true);
    }
    scan();
  }, []);

  function dismiss() { setPendingDraft(null); }
  function discard() {
    if (pendingDraft) clearDraft(pendingDraft.loanType);
    setPendingDraft(null);
  }
  return {
    pendingDraft, checked, dismiss, discard,
  };
}
