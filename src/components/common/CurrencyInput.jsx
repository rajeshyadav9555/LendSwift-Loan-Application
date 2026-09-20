import React, { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';
import { formatINR } from '../../utils/emiCalculator';
const CurrencyInput = forwardRef(({ label, id, error, value, onChange, required, ...rest }, ref) => {
  const displayValue = value || value === 0 ? formatINR(value) : '';
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}{!required && <span className="text-gray-400 font-normal"> (optional)</span>}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
        <input ref={ref} id={id} type="text" inputMode="numeric" value={displayValue}
          onChange={(e) => { const raw = e.target.value.replace(/[^0-9]/g, ''); onChange(raw === '' ? undefined : Number(raw)); }}
          aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
          className={`field-input pl-7 ${error ? 'field-input-error' : ''}`} {...rest} />
      </div>
      <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>
    </div>
  );
});
CurrencyInput.displayName = 'CurrencyInput';
export default CurrencyInput;
