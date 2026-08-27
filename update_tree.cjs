const fs = require('fs');
let code = fs.readFileSync('src/pages/user/BinaryTreePage.tsx', 'utf8');

const treeNodeCallRegex = /<TreeNode \n\s*name=\{user\.name\}\n\s*id=\{user\.id\}\n\s*left=\{user\.leftMembers\}\n\s*right=\{user\.rightMembers\}\n\s*active=\{user\.status === 'Active'\}/g;

const newTreeNodeCall = `<TreeNode 
          name={user.status === 'Deleted' ? 'Deleted ID' : user.name}
          id={user.id}
          left={user.leftMembers}
          right={user.rightMembers}
          active={user.status === 'Active'}
          deleted={user.status === 'Deleted'}`;

if (code.match(treeNodeCallRegex)) {
    code = code.replace(treeNodeCallRegex, newTreeNodeCall);
} else {
    // try looser replace
    code = code.replace(/active=\{user\.status === 'Active'\}/g, 'active={user.status === \'Active\'}\n          deleted={user.status === \'Deleted\'}\n          name={user.status === \'Deleted\' ? \'Deleted ID\' : user.name}');
}

// Update TreeNode props and UI
const treeNodeFuncRegex = /function TreeNode\(\{ name, id, left, right, active, empty, onClick, iconColor, isYou, packageName, paymentAmount \}: any\) \{/;
const newTreeNodeFunc = `function TreeNode({ name, id, left, right, active, deleted, empty, onClick, iconColor, isYou, packageName, paymentAmount }: any) {`;
code = code.replace(treeNodeFuncRegex, newTreeNodeFunc);

const nodeUIRegex = /<div className=\{(.*?)\}>\n\s*\{empty \? \(\n\s*<UserPlus className="w-5 h-5 text-gray-500 mx-auto mb-1" \/>\n\s*\) : \(\n\s*<UserIcon className=\{`(.*?)`\} \/>\n\s*\)\}/s;

const newNodeUI = `<div className={$1}>
        {empty ? (
          <UserPlus className="w-5 h-5 text-gray-500 mx-auto mb-1" />
        ) : deleted ? (
          <Trash2 className="w-5 h-5 text-red-700 mx-auto mb-1" />
        ) : (
          <UserIcon className={\`$2\`} />
        )}`;

code = code.replace(nodeUIRegex, newNodeUI);

// change the name color if deleted
code = code.replace(/<span className="font-semibold text-gray-200 block truncate">\{name\}<\/span>/g, `<span className={\`font-semibold block truncate \${deleted ? 'text-red-500 line-through' : 'text-gray-200'}\`}>{name}</span>`);

// Ensure Trash2 is imported
if (!code.includes('Trash2')) {
    code = code.replace('import { User as UserIcon, UserPlus, GitMerge, Search, ZoomIn, ZoomOut, Maximize2, LayoutDashboard } from \'lucide-react\';', 'import { User as UserIcon, UserPlus, GitMerge, Search, ZoomIn, ZoomOut, Maximize2, LayoutDashboard, Trash2 } from \'lucide-react\';');
}

fs.writeFileSync('src/pages/user/BinaryTreePage.tsx', code);
console.log("Updated tree for deleted users");
