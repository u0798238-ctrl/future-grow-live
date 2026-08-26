const fs = require('fs');

// Patch mlmStore.ts
let storeContent = fs.readFileSync('src/lib/mlmStore.ts', 'utf-8');

storeContent = storeContent.replace(
  /\{\s*id: 1,\s*name: 'Premium',\s*price: 8599,[\s\S]*?Suit Length & Banarasi Saree Combo'\n\s*\]\n\s*\},\n\s*/,
  ""
);

storeContent = storeContent.replace(/defaultFee: 8599,/g, "defaultFee: 6699,");
storeContent = storeContent.replace(/if \(p\.price === 8599 \|\| p\.name\.toLowerCase\(\) === 'premium'\) \{/g, "if (p.price === 6699 || p.name.toLowerCase() === 'basic') {");
storeContent = storeContent.replace(/if \(price === 8599\) \{/g, "if (price === 6699) {");
storeContent = storeContent.replace(/totalPayable: 8599\.00,/g, "totalPayable: 6699.00,");
storeContent = storeContent.replace(/paymentAmount: 8599,/g, "paymentAmount: 6699,");
storeContent = storeContent.replace(/amount: isFree \? 0 : \(data\.paymentAmount \|\| 8599\),/g, "amount: isFree ? 0 : (data.paymentAmount || 6699),");
storeContent = storeContent.replace(/paymentAmount: isFree \? 0 : \(data\.paymentAmount \|\| 8599\),/g, "paymentAmount: isFree ? 0 : (data.paymentAmount || 6699),");
storeContent = storeContent.replace(/user\.paymentAmount = isBasic \? 6699 : 8599;/g, "user.paymentAmount = 6699;");

fs.writeFileSync('src/lib/mlmStore.ts', storeContent);

// Patch pages to remove references to 8599
const replaceFallback = (filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/\(isBasic \? 6699 : 8599\)/g, "6699");
    content = content.replace(/tx\.amount \|\| 8599/g, "tx.amount || 6699");
    content = content.replace(/8599/g, "6699");
    fs.writeFileSync(filePath, content);
  }
}

replaceFallback('src/pages/user/MyTeamPage.tsx');
replaceFallback('src/pages/user/BinaryTreePage.tsx');
replaceFallback('src/pages/admin/DashboardPage.tsx');
replaceFallback('src/pages/admin/UsersPage.tsx');
replaceFallback('src/pages/public/RegisterPage.tsx');
replaceFallback('src/pages/public/HomePage.tsx'); // Just in case, although maybe it's not there

