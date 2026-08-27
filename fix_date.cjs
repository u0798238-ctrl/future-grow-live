const fs = require('fs');
let code = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

const safeTimestampCode = `
   const getUserTimestamp = (u: MlmUser, fallbackIndex: number): number => {
      let baseTime = new Date('2023-10-01T10:00:00Z').getTime();
      if (u.joined) {
         const t = new Date(u.joined).getTime();
         if (!isNaN(t)) baseTime = t;
      } else if (u.registeredAt) {
         const t = new Date(u.registeredAt).getTime();
         if (!isNaN(t)) baseTime = t;
      }
      const idNum = parseInt(u.id.replace(/\\D/g, ''), 10) || (fallbackIndex + 1);
      return baseTime + idNum * 60000;
   };
`;

code = code.replace(
/const getUserTimestamp = \(u: MlmUser, fallbackIndex: number\): number => \{[\s\S]*?return baseTime \+ idNum \* 60000;\n   \};/,
safeTimestampCode.trim()
);

fs.writeFileSync('src/lib/mlmStore.ts', code);
