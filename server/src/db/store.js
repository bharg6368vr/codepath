// Lightweight file-based JSON storage. No database server required —
// the whole app's persistent state lives in server/src/data/db.json.
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const DEFAULT_DB = {
  users: [],
  languages: [],
  modules: [],
  progress: [],
  quizAttempts: [],
  certificates: [],
  bookmarks: [],
  userNotes: [],
  onboardingState: [],
  analytics: [],
};

function load() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return { ...DEFAULT_DB, ...JSON.parse(raw) };
}

let db = load();

function persist() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getStore() {
  return db;
}

function updateStore(newDb) {
  if (newDb && typeof newDb === 'object') {
    db = newDb;
  }
  persist();
  return db;
}

function saveStore() {
  persist();
  return db;
}

// Simple collection accessor: db.collection('users').find(...), .insert(...), etc.
function collection(name) {
  if (!db[name]) db[name] = [];
  return {
    all: () => db[name],
    find: (predicate) => db[name].find(predicate),
    filter: (predicate) => db[name].filter(predicate),
    insert: (doc) => {
      db[name].push(doc);
      persist();
      return doc;
    },
    update: (predicate, updates) => {
      const idx = db[name].findIndex(predicate);
      if (idx === -1) return null;
      db[name][idx] = { ...db[name][idx], ...updates };
      persist();
      return db[name][idx];
    },
    upsert: (predicate, doc) => {
      const idx = db[name].findIndex(predicate);
      if (idx === -1) {
        db[name].push(doc);
      } else {
        db[name][idx] = { ...db[name][idx], ...doc };
      }
      persist();
      return doc;
    },
    replaceAll: (docs) => {
      db[name] = docs;
      persist();
    },
  };
}

module.exports = { collection, persist, getStore, updateStore, saveStore };
