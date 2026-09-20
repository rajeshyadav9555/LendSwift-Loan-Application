import React, { forwardRef } from 'react';
import ErrorMessage from './ErrorMessage';

const Checkbox = forwardRef(({
  id, label, error, ...rest
}, ref) => (
  <div className="field">
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
        {...rest}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
    <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>
  </div>
));
Checkbox.displayName = 'Checkbox';
export default Checkbox;
