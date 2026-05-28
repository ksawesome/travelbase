// ============================================================
// TravelBase — Web Crypto API Utilities
// Uses browser-native crypto — ZERO external dependencies
// ============================================================

const Crypto = (() => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  /**
   * Generate a random salt (16 bytes)
   */
  function generateSalt() {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    return bufToHex(salt);
  }

  /**
   * Generate a random UUID v4 token
   */
  function generateToken() {
    return crypto.randomUUID ? crypto.randomUUID() : 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  /**
   * Hash password with SHA-256 + salt
   * @returns {Promise<string>} hex-encoded hash
   */
  async function hashPassword(password, salt) {
    const data = encoder.encode(salt + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufToHex(new Uint8Array(hashBuffer));
  }

  /**
   * Derive AES-256-GCM key from password using PBKDF2
   * @returns {Promise<CryptoKey>}
   */
  async function deriveKey(password, salt) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: hexToBuf(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt plaintext string with AES-256-GCM
   * @returns {Promise<string>} base64(iv + ciphertext)
   */
  async function encrypt(plaintext, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    );
    const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipherBuffer), iv.length);
    return bufToBase64(combined);
  }

  /**
   * Decrypt base64(iv + ciphertext) with AES-256-GCM
   * @returns {Promise<string>} plaintext
   */
  async function decrypt(ciphertext, key) {
    const combined = base64ToBuf(ciphertext);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return decoder.decode(plainBuffer);
  }

  /**
   * Encrypt a JavaScript object
   */
  async function encryptObject(obj, key) {
    return encrypt(JSON.stringify(obj), key);
  }

  /**
   * Decrypt to a JavaScript object
   */
  async function decryptObject(ciphertext, key) {
    const plaintext = await decrypt(ciphertext, key);
    return JSON.parse(plaintext);
  }

  // --- Utility: buffer conversions ---
  function bufToHex(buf) {
    return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function hexToBuf(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  function bufToBase64(buf) {
    let binary = '';
    buf.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  function base64ToBuf(b64) {
    const binary = atob(b64);
    const buf = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buf[i] = binary.charCodeAt(i);
    }
    return buf;
  }

  return {
    generateSalt,
    generateToken,
    hashPassword,
    deriveKey,
    encrypt,
    decrypt,
    encryptObject,
    decryptObject
  };
})();

export default Crypto;
