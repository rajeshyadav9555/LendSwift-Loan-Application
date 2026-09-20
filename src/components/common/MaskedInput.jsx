import React, { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';
const MaskedInput = forwardRef(({ label, id, error, value, onChange, isVerified, isVerifying, maskWhenVerified=true, ...rest }, ref) => {
  const showMasked = isVerified && maskWhenVerified && value;
  const displayValue = showMasked ? `${'X'.repeat(Math.max(value.length - 4, 0))}${value.slice(-4)}` : value;
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        <input ref={ref} id={id} type="text" value={displayValue || ''} onChange={(e) => onChange(e.target.value.toUpperCase())}
          readOnly={showMasked} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
          className={`field-input pr-10 uppercase ${error ? 'field-input-error' : ''}`} {...rest} />
        {isVerifying && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">Verifying…</span>}
        {isVerified && !isVerifying && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent text-sm">✓ Verified</span>}
      </div>
      <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>
    </div>
  );
});
MaskedInput.displayName = 'MaskedInput';
export default MaskedInput;
