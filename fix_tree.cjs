const fs = require('fs');
let code = fs.readFileSync('src/pages/user/BinaryTreePage.tsx', 'utf8');

code = code.replace(/name=\{user\.status === 'Deleted' \? 'Deleted ID' : user\.name\}\n\s*id=\{user\.id\}\n\s*left=\{user\.leftMembers\}\n\s*right=\{user\.rightMembers\}\n\s*active=\{user\.status === 'Active'\}\n\s*deleted=\{user\.status === 'Deleted'\}\n\s*name=\{user\.status === 'Deleted' \? 'Deleted ID' : user\.name\}/g,
`name={user.status === 'Deleted' ? 'Deleted ID' : user.name}
          id={user.id}
          left={user.leftMembers}
          right={user.rightMembers}
          active={user.status === 'Active'}
          deleted={user.status === 'Deleted'}`);
          
code = code.replace(/<TreeNode\s*\n\s*name=\{user\.name\}\s*\n\s*active=\{user\.status === 'Active'\}\s*\n\s*deleted=\{user\.status === 'Deleted'\}\s*\n\s*name=\{user\.status === 'Deleted' \? 'Deleted ID' : user\.name\}/g,
`<TreeNode 
          name={user.status === 'Deleted' ? 'Deleted ID' : user.name}
          active={user.status === 'Active'}
          deleted={user.status === 'Deleted'}`);

fs.writeFileSync('src/pages/user/BinaryTreePage.tsx', code);
console.log("Fixed JSX error in BinaryTreePage");
