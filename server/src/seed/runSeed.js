// Loads the curriculum content JSON files into the file-based store.
// Run with: npm run seed
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { collection } = require('../db/store');

const CONTENT_DIR = path.join(__dirname, 'content');
const languages = collection('languages');
const modules = collection('modules');

function seedLanguage(fileName) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), 'utf-8');
  const data = JSON.parse(raw);

  languages.upsert(
    (l) => l.id === data.id,
    { id: data.id, name: data.name, description: data.description, moduleCount: data.modules.length }
  );

  const existingModuleIds = modules.filter((m) => m.languageId === data.id).map((m) => m.id);
  const otherModules = modules.all().filter((m) => m.languageId !== data.id);

  const newModules = data.modules.map((m, i) => ({
    id: existingModuleIds[i] || uuidv4(),
    languageId: data.id,
    order: m.order,
    title: m.title,
    pages: m.pages || [],
    codeExamples: m.codeExamples || [],
    keyTakeaways: m.keyTakeaways || [],
    tryItYourself: m.tryItYourself || [],
  }));

  modules.replaceAll([...otherModules, ...newModules]);
  console.log(`Seeded ${data.name}: ${newModules.length} modules`);
}

const LANGUAGE_FILES = ['python.json', 'java.json', 'cpp.json', 'c.json'];

function run() {
  LANGUAGE_FILES.forEach(seedLanguage);
  console.log('Seeding complete.');
}

if (require.main === module) {
  run();
}

module.exports = { run };
