const fs = require('fs');

let fbContent = fs.readFileSync('src/lib/firebase.ts', 'utf-8');
if (!fbContent.includes('deleteDoc')) {
  fbContent = fbContent.replace(/import {([^}]+)} from 'firebase\/firestore';/, (match, p1) => {
     return `import { ${p1.trim()}, deleteDoc } from 'firebase/firestore';`;
  });
}

if (!fbContent.includes('export const deleteUserFromCloud')) {
  fbContent += `
export const deleteUserFromCloud = async (userId: string) => {
   try {
      const colRef = collection(db, 'mlm_users');
      await deleteDoc(doc(colRef, userId));
      lastKnownUsers.delete(userId);
      console.log('Successfully deleted user from cloud:', userId);
   } catch (e) {
      console.error('Failed to delete user from cloud:', e);
   }
};
`;
}
fs.writeFileSync('src/lib/firebase.ts', fbContent);

let mlmContent = fs.readFileSync('src/lib/mlmStore.ts', 'utf-8');
if (!mlmContent.includes('deleteUserFromCloud')) {
  mlmContent = mlmContent.replace(/export const deleteMlmUser = \(userId: string\) => {/, `export const deleteMlmUser = (userId: string) => {
   import('@/lib/firebase').then(m => m.deleteUserFromCloud(userId)).catch(console.error);`);
}
fs.writeFileSync('src/lib/mlmStore.ts', mlmContent);
