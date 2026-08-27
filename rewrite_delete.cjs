const fs = require('fs');
let code = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

const oldDelete = `export const deleteMlmUser = (userId: string) => {
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return;
   
   // Protect Root Admin from accidental deletion
   if (userId === 'FGPL000001') {
      console.warn("Cannot delete root admin");
      return;
   }

   // 1. Delete from Firebase Database
   import('@/lib/firebase').then(m => {
     m.deleteUserFromCloud(userId);
     m.broadcastSystemUpdate(\`User \${userId} deleted by admin\`);
   }).catch(console.error);

   // 2. Delete from Supabase Database
   import('@/lib/supabase').then(m => {
     m.deleteUserFromSupabase(userId);
   }).catch(console.error);

   // 3. Clear active session
   import('@/lib/sessionManager').then(m => {
     m.clearActiveUserSession(userId);
   }).catch(console.error);
   
   // 4. Clean up tree structure and safely re-link downlines
   const userLeftChildId = user.leftId || null;
   const userRightChildId = user.rightId || null;
   const parentUser = user.parentId ? users.find(u => u.id === user.parentId) : null;
   const fallbackSponsor = user.sponsorId || 'FGPL000001';

   users.forEach(u => {
      // If u was parent of deleted user, re-link parent's branch to child
      if (u.leftId === userId) {
         u.leftId = userLeftChildId || userRightChildId || null;
      }
      if (u.rightId === userId) {
         u.rightId = userLeftChildId || userRightChildId || null;
      }
      
      // Relink Sponsor
      if (u.sponsorId === userId) {
         u.sponsorId = fallbackSponsor;
      }
      
      // Relink Parent
      if (u.parentId === userId) {
         u.parentId = parentUser ? parentUser.id : fallbackSponsor;
      }
   });

   // 5. Remove the user
   users = users.filter(u => u.id !== userId);

   // 6. Delete all transactions related to user
   users.forEach(u => {
      if (u.transactions) {
         u.transactions = u.transactions.filter(t => t.fromUserId !== userId);
      }
   });

   // 7. Process pending withdrawals cleanup
   let withdrawals = JSON.parse(localStorage.getItem('mlm_withdrawals') || '[]');
   withdrawals = withdrawals.filter((w: any) => w.userId !== userId);
   localStorage.setItem('mlm_withdrawals', JSON.stringify(withdrawals));

   // 8. Process deposits cleanup
   let deposits = JSON.parse(localStorage.getItem('mlm_deposits') || '[]');
   deposits = deposits.filter((d: any) => d.userId !== userId);
   localStorage.setItem('mlm_deposits', JSON.stringify(deposits));

   // 9. Process support tickets cleanup
   let inquiries = JSON.parse(localStorage.getItem('mlm_inquiries') || '[]');
   inquiries = inquiries.filter((i: any) => i.userId !== userId);
   localStorage.setItem('mlm_inquiries', JSON.stringify(inquiries));

   // 10. Reset current session if deleted
   if (localStorage.getItem('current_user_id') === userId) {
      localStorage.setItem('current_user_id', 'FGPL000001');
   }
   
   // 11. Recalculate tree and save
   users = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(users)); 
   
   // Actually remove from cloud databases so it doesn't reappear
   try {
       deleteUserFromCloud(userId);
       deleteUserFromSupabase(userId);
   } catch (e) {
       console.error('Cloud delete error:', e);
   }

   pushMlmStateToSupabase('mlm_users', users);
   pushMlmStateToFirebase('mlm_users', users);
   
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
}`;

const newDelete = `export const deleteMlmUser = (userId: string) => {
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return;
   
   // Protect Root Admin from accidental deletion
   if (userId === 'FGPL000001') {
      console.warn("Cannot delete root admin");
      return;
   }

   // 3. Clear active session
   import('@/lib/sessionManager').then(m => {
     m.clearActiveUserSession(userId);
   }).catch(console.error);
   
   // 4. Soft Delete instead of hard delete
   user.status = 'Deleted';

   // 10. Reset current session if deleted
   if (localStorage.getItem('current_user_id') === userId) {
      localStorage.setItem('current_user_id', 'FGPL000001');
   }
   
   // 11. Recalculate tree and save
   users = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(users)); 
   
   pushMlmStateToSupabase('mlm_users', users);
   pushMlmStateToFirebase('mlm_users', users);
   
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
};

export const recoverMlmUser = (userId: string) => {
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return;
   
   if (user.status === 'Deleted') {
       user.status = 'Inactive';
       users = recalculateTreeStats(users);
       localStorage.setItem('mlm_users', JSON.stringify(users)); 
       
       pushMlmStateToSupabase('mlm_users', users);
       pushMlmStateToFirebase('mlm_users', users);
       
       window.dispatchEvent(new Event('mlm_update'));
       window.dispatchEvent(new Event('current_user_change'));
   }
};`;

if (code.includes('export const deleteMlmUser = (userId: string) => {')) {
    // We will do a manual replace since the exact string might differ due to formatting.
    const startIdx = code.indexOf('export const deleteMlmUser = (userId: string) => {');
    const endIdx = code.indexOf('window.dispatchEvent(new Event(\'current_user_change\'));\n}', startIdx);
    
    if (endIdx !== -1) {
        code = code.substring(0, startIdx) + newDelete + code.substring(endIdx + 58);
        fs.writeFileSync('src/lib/mlmStore.ts', code);
        console.log("Successfully rewrote deleteMlmUser and added recoverMlmUser");
    } else {
        console.log("Could not find end of deleteMlmUser");
    }
} else {
    console.log("Could not find deleteMlmUser");
}
