import React from 'react';
import ErrorMessage from './ErrorMessage';

export default function RadioGroup({
  legend, name, options, value, onChange, error, layout = 'horizontal',
}) {
  return (
    <fieldset className="field">
      <legend className="field-label">{legend}</legend>
      <div className={`flex ${layout === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} gap-2`}>
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={`cursor-pointer rounded-md border px-4 py-2.5 text-sm min-h-[44px] flex items-center ${selected ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-gray-300 text-gray-700'}`}
            >
              <input type="radio" id={id} name={name} value={opt.value} checked={selected} onChange={() => onChange(opt.value)} className="sr-only" />
              {opt.label}
            </label>
          );
        })}
      </div>
      <ErrorMessage id={`${name}-error`}>{error}</ErrorMessage>
    </fieldset>
  );
}
