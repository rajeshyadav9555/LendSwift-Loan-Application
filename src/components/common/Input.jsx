import React, { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';
const Input = forwardRef(({ label, id, error, helpText, required, type='text', autoComplete, ...rest }, ref) => (
  <div className="field">
    <label htmlFor={id} className="field-label">{label}{!required && <span className="text-gray-400 font-normal"> (optional)</span>}</label>
    <input ref={ref} id={id} type={type} autoComplete={autoComplete} aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined} className={`field-input ${error ? 'field-input-error' : ''}`} {...rest} />
    {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>
  </div>
));
Input.displayName = 'Input';
export default Input;
