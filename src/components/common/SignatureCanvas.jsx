import React, { useRef, useState, useEffect } from 'react';
import SigCanvas from 'react-signature-canvas';
import ErrorMessage from './ErrorMessage';
export default function SignatureCanvas({ label='Signature', onChange, error }) {
  const padRef = useRef(null);
  const wrapperRef = useRef(null);
  const [width, setWidth] = useState(400);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (!wrapperRef.current) return undefined;
    const observer = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const handleEnd = () => {
    if (!padRef.current) return;
    const empty = padRef.current.isEmpty();
    setIsEmpty(empty);
    onChange?.(empty ? null : padRef.current.toDataURL('image/png'));
  };
  const handleClear = () => { padRef.current?.clear(); setIsEmpty(true); onChange?.(null); };

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div ref={wrapperRef} className="border border-gray-300 rounded-md overflow-hidden bg-white">
        <SigCanvas ref={padRef} penColor="#16233F" canvasProps={{ width, height: 160, 'aria-label': 'Draw your signature here', role: 'img' }} onEnd={handleEnd} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">{isEmpty ? 'Sign using mouse or touch.' : 'Signature captured.'}</span>
        <button type="button" onClick={handleClear} className="text-xs text-primary font-medium">Clear</button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
