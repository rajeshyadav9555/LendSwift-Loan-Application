import React from 'react';
export default function ErrorMessage({ id, children }) {
  if (!children) return null;
  return <p id={id} role="alert" aria-live="polite" className="mt-1 text-xs text-danger flex items-start gap-1"><span aria-hidden="true">⚠</span><span>{children}</span></p>;
}
