// ==========================================================================
// Saves in IndexedDB.
//
// A year is a long time to trust a browser with a valley, so saves go to
// IndexedDB (much roomier than localStorage) under two keys: "main", written
// every 20 seconds and when the page hides, and "backup", written at most every
// 10 minutes. A valley saved by the first Creekfolk in localStorage is moved
// over on first load. Export/import of a backup file still works as before.
// ==========================================================================

var ValleyStore = class {
  constructor() {
    this.db = null;
    this.ready = this.open();
  }
  open() {
    return new Promise((resolve) => {
      let req;
      try {
        req = indexedDB.open("creekfolk", 1);
      } catch (e) {
        resolve(null);
        return;
      }
      req.onupgradeneeded = () => req.result.createObjectStore("saves");
      req.onsuccess = () => {
        this.db = req.result;
        resolve(this.db);
      };
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    });
  }
  async get(key) {
    let db = await this.ready;
    if (!db) return null;
    return new Promise((resolve) => {
      let tx = db.transaction("saves", "readonly"),
        r = tx.objectStore("saves").get(key);
      r.onsuccess = () => resolve(r.result ?? null);
      r.onerror = () => resolve(null);
    });
  }
  async put(key, value) {
    let db = await this.ready;
    if (!db) throw new Error("IndexedDB is not available");
    return new Promise((resolve, reject) => {
      let tx = db.transaction("saves", "readwrite");
      tx.objectStore("saves").put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  get available() {
    return !!this.db;
  }
};
