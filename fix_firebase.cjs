const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const replacement = `
// Helper to strip undefined values recursively
const stripUndefined = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(stripUndefined);
  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = stripUndefined(obj[key]);
    }
  }
  return newObj;
};

export const pushMlmStateToFirebase = async (key: string, value: any): Promise<boolean> => {
  try {
    const cleanValue = stripUndefined(value);
    
    if (key === 'mlm_users' && Array.isArray(cleanValue)) {
       const colRef = collection(db, 'mlm_users_collection');
`;

code = code.replace(
  "export const pushMlmStateToFirebase = async (key: string, value: any): Promise<boolean> => {\n  try {\n    if (key === 'mlm_users' && Array.isArray(value)) {\n       const colRef = collection(db, 'mlm_users_collection');",
  replacement
);

// Also need to use cleanValue everywhere in the function
code = code.replace(
  "for (const user of value) {",
  "for (const user of cleanValue) {"
);

code = code.replace(
  "const docRef = doc(db, 'mlm_app_data', key);\n    await setDoc(docRef, {\n      key_name: key,\n      data: value\n    }, { merge: true });",
  "const docRef = doc(db, 'mlm_app_data', key);\n    await setDoc(docRef, {\n      key_name: key,\n      data: cleanValue\n    }, { merge: true });"
);

fs.writeFileSync('src/lib/firebase.ts', code);
