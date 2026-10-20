// ==========================================================================
// Saves in IndexedDB.
//
// A year is a long time to trust a browser with a valley, so saves go to
// IndexedDB (much roomier than localStorage) under two keys: "main", written
// every 20 seconds and when the page hides, and "backup", written at most every
// 10 minutes. Export/import of a backup file still works as before.
//
// Every build has its own database (Phase 3A): "creekfolk-<BUILD_VERSION>", and
// the dev build "creekfolk-<BUILD_VERSION>-dev", so a new version never opens an
// old version's valley and a dev jump can never touch a real one. The dev build's
// database also keeps snapshots taken before every jump ("snapshots" store).
// ==========================================================================

var VALLEY_DB = "creekfolk-" + BUILD_VERSION + (DEV_BUILD ? "-dev" : "");

var ValleyStore = class {
  constructor() {
    this.db = null;
    this.ready = this.open();
  }
  open() {
    return new Promise((resolve) => {
      let req;
      try {
        req = indexedDB.open(VALLEY_DB, 1);
      } catch (e) {
        resolve(null);
        return;
      }
      req.onupgradeneeded = () => {
        req.result.createObjectStore("saves");
        req.result.createObjectStore("snapshots");
      };
      req.onsuccess = () => {
        this.db = req.result;
        resolve(this.db);
      };
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    });
  }
  async get(key, store = "saves") {
    let db = await this.ready;
    if (!db) return null;
    return new Promise((resolve) => {
      let tx = db.transaction(store, "readonly"),
        r = tx.objectStore(store).get(key);
      r.onsuccess = () => resolve(r.result ?? null);
      r.onerror = () => resolve(null);
    });
  }
  async put(key, value, store = "saves") {
    let db = await this.ready;
    if (!db) throw new Error("IndexedDB is not available");
    return new Promise((resolve, reject) => {
      let tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  async keys(store = "snapshots") {
    let db = await this.ready;
    if (!db) return [];
    return new Promise((resolve) => {
      let tx = db.transaction(store, "readonly"),
        r = tx.objectStore(store).getAllKeys();
      r.onsuccess = () => resolve(r.result || []);
      r.onerror = () => resolve([]);
    });
  }
  async del(key, store = "snapshots") {
    let db = await this.ready;
    if (!db) return;
    return new Promise((resolve) => {
      let tx = db.transaction(store, "readwrite");
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }
  get available() {
    return !!this.db;
  }
};
