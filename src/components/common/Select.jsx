import React, { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';

const Select = forwardRef(({
  label, id, error, options, placeholder, required, ...rest
}, ref) => (
  <div className="field">
    <label htmlFor={id} className="field-label">
      {label}
      {!required && <span className="text-gray-400 font-normal"> (optional)</span>}
    </label>
    <select
      ref={ref}
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`field-input ${error ? 'field-input-error' : ''}`}
      {...rest}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>
  </div>
));
Select.displayName = 'Select';
export default Select;
