const MAX_WIDTH = 1200;
const TARGET_MAX_BYTES = 2 * 1024 * 1024;
const MIN_QUALITY = 0.3;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => resolve({ img, url });
    img.onerror = reject;
    img.src = url;
  });
}
function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality));
}
export async function compressImage(file) {
  if (!file.type.startsWith('image/')) {
    return {
      file, originalSize: file.size, compressedSize: file.size, compressed: false,
    };
  }
  const { img, url } = await loadImage(file);
  const scale = Math.min(1, MAX_WIDTH / img.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  let quality = 0.7;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, quality - 0.1);
    blob = await canvasToBlob(canvas, quality);
  }
  const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
  return {
    file: compressedFile, originalSize: file.size, compressedSize: compressedFile.size, compressed: true, finalQuality: quality,
  };
}
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
