import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressImage, formatFileSize } from '../../utils/imageCompression';
import ErrorMessage from './ErrorMessage';

const ACCEPTED = { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] };
const MAX_SIZE_MB = 5;

export default function FileUpload({ label, required, maxSizeMB=MAX_SIZE_MB, onFileAccepted, existingFile }) {
  const [status, setStatus] = useState(existingFile ? 'done' : 'idle');
  const [error, setError] = useState(null);
  const [sizeInfo, setSizeInfo] = useState(null);
  const [preview, setPreview] = useState(existingFile?.preview || null);

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      const reason = rejected[0].errors[0];
      setError(reason.code === 'file-too-large' ? `File exceeds ${maxSizeMB}MB limit.` : 'Unsupported file type. Use PDF, JPG, or PNG.');
      setStatus('error');
      return;
    }
    const file = accepted[0];
    if (!file) return;
    setStatus('compressing'); setError(null);
    try {
      const result = await compressImage(file);
      setSizeInfo(result);
      if (file.type.startsWith('image/')) setPreview(URL.createObjectURL(result.file));
      else setPreview(null);
      setStatus('done');
      onFileAccepted?.(result.file, result);
    } catch (err) {
      setError('Could not process file. Try again.'); setStatus('error');
    }
  }, [maxSizeMB, onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED, maxSize: maxSizeMB * 1024 * 1024, maxFiles: 1
  });

  return (
    <div className="field">
      <span className="field-label">{label}{!required && <span className="text-gray-400 font-normal"> (optional)</span>}</span>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-4 cursor-pointer text-center ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'} ${status === 'error' ? 'border-danger' : ''} ${status === 'done' ? 'border-accent bg-accent/5' : ''}`}>
        <input {...getInputProps()} aria-label={label} />
        {status === 'idle' && <p className="text-sm text-gray-500">Drag a file here, or tap to choose one. PDF, JPG, PNG — up to {maxSizeMB}MB.</p>}
        {status === 'compressing' && <p className="text-sm text-gray-500">Processing file…</p>}
        {status === 'done' && <div className="flex items-center gap-3 justify-center">
          {preview ? <img src={preview} alt="" className="h-12 w-12 object-cover rounded" /> : <span className="text-2xl">📄</span>}
          <div className="text-left text-sm"><p className="text-accent font-medium">Uploaded</p>
            {sizeInfo?.compressed && <p className="text-gray-500 text-xs">{formatFileSize(sizeInfo.originalSize)} → {formatFileSize(sizeInfo.compressedSize)}</p>}
          </div>
        </div>}
        {status === 'error' && <p className="text-sm text-danger">{error}</p>}
      </div>
      <ErrorMessage>{status === 'error' ? error : null}</ErrorMessage>
    </div>
  );
}
