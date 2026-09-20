const PASSPHRASE = 'lendswift-draft-v1-static-passphrase';
const SALT = 'lendswift-salt';

async function deriveKey() {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', enc.encode(PASSPHRASE), { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(SALT), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}
function bufToBase64(buf) { return btoa(String.fromCharCode(...new Uint8Array(buf))); }
function base64ToBuf(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
export async function encryptData(data) {
  const key = await deriveKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0); combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return bufToBase64(combined.buffer);
}
export async function decryptData(base64String) {
  const key = await deriveKey();
  const combined = new Uint8Array(base64ToBuf(base64String));
  const plaintextBuf = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: combined.slice(0, 12) }, key, combined.slice(12)
  );
  return JSON.parse(new TextDecoder().decode(plaintextBuf));
}
