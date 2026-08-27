const fs = require('fs');
let code = fs.readFileSync('src/pages/user/BinaryTreePage.tsx', 'utf8');

const regex = /<TreeNode \n\s*name=\{user\.status === 'Deleted' \? 'Deleted ID' : user\.name\}\n\s*id=\{user\.id\}\n\s*left=\{user\.leftMembers\}\n\s*right=\{user\.rightMembers\}\n\s*active=\{user\.status === 'Active'\}\n\s*deleted=\{user\.status === 'Deleted'\}\n\s*name=\{user\.status === 'Deleted' \? 'Deleted ID' : user\.name\}/g;

code = code.replace(regex, 
`<TreeNode 
          name={user.status === 'Deleted' ? 'Deleted ID' : user.name}
          id={user.id}
          left={user.leftMembers}
          right={user.rightMembers}
          active={user.status === 'Active'}
          deleted={user.status === 'Deleted'}`);

fs.writeFileSync('src/pages/user/BinaryTreePage.tsx', code);
