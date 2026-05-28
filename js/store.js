// ============================================================
// TravelBase — State Management (localStorage + IndexedDB)
// ============================================================

import Crypto from './crypto.js';

const Store = (() => {
  let _encryptionKey = null;
  let _userId = null;

  function init(userId, role) {
    _userId = userId;
    // Demo user doesn't need encryption
    if (role === 'demo') {
      _encryptionKey = null;
    }
  }

  function _key(name) {
    return `tb_${name}_${_userId}`;
  }

  // --- localStorage (plaintext for demo, structured data) ---

  function save(name, data) {
    try {
      localStorage.setItem(_key(name), JSON.stringify(data));
    } catch (e) {
      console.error('Store.save error:', e);
    }
  }

  function load(name, defaultValue = null) {
    try {
      const raw = localStorage.getItem(_key(name));
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function remove(name) {
    localStorage.removeItem(_key(name));
  }

  function has(name) {
    return localStorage.getItem(_key(name)) !== null;
  }

  // --- Global settings (not user-scoped) ---

  function saveGlobal(name, data) {
    try {
      localStorage.setItem(`tb_${name}`, JSON.stringify(data));
    } catch (e) {
      console.error('Store.saveGlobal error:', e);
    }
  }

  function loadGlobal(name, defaultValue = null) {
    try {
      const raw = localStorage.getItem(`tb_${name}`);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // --- IndexedDB for documents (binary blobs) ---

  const DB_NAME = 'TravelBaseDB';
  const DB_VERSION = 1;
  const DOC_STORE = 'documents';

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DOC_STORE)) {
          const store = db.createObjectStore(DOC_STORE, { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveDocument(doc) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DOC_STORE, 'readwrite');
      tx.objectStore(DOC_STORE).put({
        ...doc,
        userId: _userId,
        uploadedAt: doc.uploadedAt || Date.now()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getDocument(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DOC_STORE, 'readonly');
      const request = tx.objectStore(DOC_STORE).get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getAllDocuments() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DOC_STORE, 'readonly');
      const idx = tx.objectStore(DOC_STORE).index('userId');
      const request = idx.getAll(_userId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function deleteDocument(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DOC_STORE, 'readwrite');
      tx.objectStore(DOC_STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- Export / Import ---

  async function exportAll() {
    const data = {};
    const prefix = `tb_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        data[key] = localStorage.getItem(key);
      }
    }
    // Include IndexedDB docs metadata (not blobs — too large)
    const docs = await getAllDocuments();
    data._docs_meta = docs.map(d => ({
      id: d.id,
      name: d.name,
      category: d.category,
      mimeType: d.mimeType,
      size: d.size,
      uploadedAt: d.uploadedAt
    }));
    return JSON.stringify(data, null, 2);
  }

  function importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('tb_') && key !== '_docs_meta') {
          localStorage.setItem(key, value);
        }
      });
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  // --- Factory reset ---
  function clearAll() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('tb_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    indexedDB.deleteDatabase(DB_NAME);
  }

  return {
    init,
    save,
    load,
    remove,
    has,
    saveGlobal,
    loadGlobal,
    saveDocument,
    getDocument,
    getAllDocuments,
    deleteDocument,
    exportAll,
    importAll,
    clearAll
  };
})();

export default Store;
