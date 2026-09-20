import { useEffect, useState } from 'react';
import pinCodeData from '../utils/pinCodeData.json';

const LOOKUP_DELAY_MS = 400;

export function usePinCodeLookup(pin) {
  const [result, setResult] = useState({ city: '', state: '', postOffice: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pin || !/^\d{6}$/.test(pin)) {
      setResult({ city: '', state: '', postOffice: '' });
      setError(null);
      return undefined;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      const match = pinCodeData[pin];
      if (match) {
        setResult(match);
        setError(null);
      } else {
        setResult({ city: '', state: '', postOffice: '' });
        setError('PIN code not found. Enter city and state manually.');
      }
      setIsLoading(false);
    }, LOOKUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pin]);

  return { ...result, isLoading, error };
}
