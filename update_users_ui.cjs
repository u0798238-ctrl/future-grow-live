const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/UsersPage.tsx', 'utf8');

// Replace the delete button logic to toggle between Recover and Delete
const deleteBtnRegex = /<button \n\s*onClick=\{\(\) => handleActionClick\('delete', user\)\}\n\s*className="p-1.5 bg-\[#071E2C\] rounded-md text-red-500 hover:text-red-400 transition-colors" title="Delete User ID">\n\s*<Trash2 className="w-4 h-4" \/>\n\s*<\/button>/g;

const newDeleteBtn = `{user.status === 'Deleted' ? (
                        <button 
                          onClick={() => handleActionClick('recover', user)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-emerald-500 hover:text-emerald-400 transition-colors" title="Recover User ID">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActionClick('delete', user)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-red-500 hover:text-red-400 transition-colors" title="Move to Recycle Bin">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}`;

if (code.match(deleteBtnRegex)) {
    code = code.replace(deleteBtnRegex, newDeleteBtn);
} else {
    const backupReplaceStart = code.indexOf('<button \n                          onClick={() => handleActionClick(\'delete\', user)}');
    const backupReplaceEnd = code.indexOf('</button>', backupReplaceStart) + 9;
    if (backupReplaceStart !== -1) {
        code = code.substring(0, backupReplaceStart) + newDeleteBtn + code.substring(backupReplaceEnd);
    }
}

// Add the modal action handling for recover
const handleActionCase = `case 'delete':
          deleteMlmUser(actionModal.user.id);
          loadUsers();
          showToast(\`✅ User ID \${actionModal.user.id} (\${actionModal.user.name}) moved to recycle bin.\`, 'success');
          break;
        case 'recover':
          recoverMlmUser(actionModal.user.id);
          loadUsers();
          showToast(\`✅ User ID \${actionModal.user.id} (\${actionModal.user.name}) recovered successfully.\`, 'success');
          break;`;

code = code.replace(/case 'delete':\n\s*deleteMlmUser\(actionModal\.user\.id\);\n\s*loadUsers\(\);\n\s*showToast\(`✅ User ID \${actionModal\.user\.id} \(\${actionModal\.user\.name}\) and all related data completely deleted from system & database.`, 'success'\);\n\s*break;/g, handleActionCase);

// Add the modal confirmation UI for recover
const modalTitleStr = `{actionModal.type === 'delete' && \`Delete User: \${actionModal.user.id}\`}`;
const newModalTitle = `{actionModal.type === 'delete' && \`Delete User: \${actionModal.user.id}\`}
              {actionModal.type === 'recover' && \`Recover User: \${actionModal.user.id}\`}`;
code = code.replace(modalTitleStr, newModalTitle);

const modalBodyStr = `{actionModal.type === 'delete' && ( 
                <div className="space-y-4">`;

const newModalBodyStr = `{actionModal.type === 'recover' && ( 
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-950/50 border-2 border-emerald-500/50 rounded-2xl space-y-3 shadow-lg">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
                      <RefreshCw className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>Recover User ID</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      Are you sure you want to recover user <strong>{actionModal.user.name}</strong> ({actionModal.user.id})?
                    </p>
                    <p className="text-xs text-emerald-200 leading-relaxed">
                      ✅ This ID will become Active again and appear in your regular users list.
                    </p>
                  </div>
                </div>
              )}
              
              {actionModal.type === 'delete' && ( 
                <div className="space-y-4">`;

code = code.replace(modalBodyStr, newModalBodyStr);

// Change text in delete UI
code = code.replace('Permanent User Deletion Warning', 'Move to Recycle Bin');
code = code.replace('This will completely and permanently erase', 'This will move');
code = code.replace('permanently deleted', 'moved to the recycle bin');
code = code.replace('Yes, Permanently Delete ID (हटाएं)', 'Move to Recycle Bin (हटाएं)');

const modalBtnStr = `{actionModal.type === 'delete' && 'Yes, Permanently Delete ID (हटाएं)'}`;
const newModalBtn = `{actionModal.type === 'delete' && 'Move to Recycle Bin (हटाएं)'}
                  {actionModal.type === 'recover' && 'Yes, Recover User'}`;
code = code.replace(modalBtnStr, newModalBtn);
code = code.replace('Yes, Permanently Delete ID (हटाएं)', 'Move to Recycle Bin (हटाएं)'); // In case it wasn't replaced by above logic

fs.writeFileSync('src/pages/admin/UsersPage.tsx', code);
console.log("Updated UI for recovery");
