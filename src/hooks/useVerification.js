import { useCallback, useState } from 'react';
import { validatePAN, validateAadhaar } from '../utils/validators';

const SIMULATED_DELAY_MS = 1500;

export function useVerification(type, loanType = 'personal') {
  const [state, setState] = useState({ isVerifying: false, isVerified: false, error: null });

  const verify = useCallback((value) => {
    const localCheck = type === 'pan' ? validatePAN(value, loanType) : validateAadhaar(value);
    if (!localCheck.valid) {
      setState({ isVerifying: false, isVerified: false, error: localCheck.error });
      return Promise.resolve(false);
    }
    setState({ isVerifying: true, isVerified: false, error: null });
    return new Promise((resolve) => {
      setTimeout(() => {
        setState({ isVerifying: false, isVerified: true, error: null });
        resolve(true);
      }, SIMULATED_DELAY_MS);
    });
  }, [type, loanType]);

  const reset = useCallback(() => {
    setState({ isVerifying: false, isVerified: false, error: null });
  }, []);

  return { ...state, verify, reset };
}
