const fs = require('fs');
let code = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

const regex = /export const activateUserAccount = \(userId: string, packageName: string\) => \{[\s\S]*?EOF/g;
const startIdx = code.indexOf('export const activateUserAccount = (userId: string, packageName: string) => {\n   let users = getMlmUsers();\n   const user = users.find(u => u.id === userId);');
if (startIdx !== -1) {
    // Only keep the first occurrences of them, wait, the ones I just appended are at the very end of the file.
    // I can just find the first export of activateUserAccount and the second.
}
