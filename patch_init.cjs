const fs = require('fs');
let storeContent = fs.readFileSync('src/lib/mlmStore.ts', 'utf-8');

storeContent = storeContent.replace(
  /export const getMlmPackages = \(\): MlmPackage\[\] => \{[\s\S]*?return packages;/,
  `export const getMlmPackages = (): MlmPackage[] => {
   try {
      const stored = localStorage.getItem('mlm_packages');
      if (stored) {
         let packages = JSON.parse(stored);
         // Filter out Premium package 6699 or 8599 if they exist but we only want 6699
         // Wait, the user specifically wants 8599 deleted. Let's filter out price 8599
         // actually I'll just remove anything with price 8599
         const filtered = packages.filter(p => p.price !== 8599 && !p.name.includes('Premium'));
         if (filtered.length !== packages.length) {
            localStorage.setItem('mlm_packages', JSON.stringify(filtered));
            return filtered;
         }
         return packages;
      }
   } catch (e) {
      console.error(e);
   }
   localStorage.setItem('mlm_packages', JSON.stringify(DEFAULT_PACKAGES));
   return DEFAULT_PACKAGES;`
);

fs.writeFileSync('src/lib/mlmStore.ts', storeContent);
