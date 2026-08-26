const fs = require('fs');
let storeContent = fs.readFileSync('src/lib/mlmStore.ts', 'utf-8');

storeContent = storeContent.replace(
  /export const getMlmPackages = \(\): MlmPackage\[\] => \{[\s\S]*?return parsed;\n      \}\n    \}\n  \} catch \(e\) \{\n    console\.error\(e\);\n  \}\n  localStorage\.setItem\('mlm_packages', JSON\.stringify\(DEFAULT_PACKAGES\)\);\n  return DEFAULT_PACKAGES;\n\};/,
  `export const getMlmPackages = (): MlmPackage[] => {
  try {
    const raw = localStorage.getItem('mlm_packages');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let updated = parsed.filter(p => p.price !== 8599 && !p.name.includes('Premium'));
        const v7Done = localStorage.getItem('mlm_pkg_v7_pant_blue_update');
        if (!v7Done) {
          updated = updated.map((p: MlmPackage) => {
            if (p.price === 6699 || p.name.toLowerCase() === 'basic') {
              return { 
                ...p, 
                directIncome: 0, 
                binaryIncome: 1000, 
                capping: 5000,
                productChoices: [
                  'Suit Length (navy blue Colour - Single Set)',
                  'Pant (navy blue Colour - Single Set)',
                  'Banarasi Saree (Single Piece)',
                  'Healthcare & Wellness Package'
                ]
              };
            }
            return p;
          });
          localStorage.setItem('mlm_packages', JSON.stringify(updated));
          localStorage.setItem('mlm_pkg_v7_pant_blue_update', 'true');
        }
        
        // Ensure 8599 is purged
        const purge8599 = localStorage.getItem('mlm_purge_8599');
        if (!purge8599) {
           updated = updated.filter(p => p.price !== 8599 && !p.name.includes('Premium'));
           localStorage.setItem('mlm_packages', JSON.stringify(updated));
           localStorage.setItem('mlm_purge_8599', 'true');
           pushMlmStateToSupabase('mlm_packages', updated);
        }
        
        return updated;
      }
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('mlm_packages', JSON.stringify(DEFAULT_PACKAGES));
  return DEFAULT_PACKAGES;
};`
);

fs.writeFileSync('src/lib/mlmStore.ts', storeContent);
