const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.json')) {
         results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src').concat(['./index.html', './metadata.json']);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Brand Name
  content = content.replace(/NexusNetwork/g, 'Future Grow');
  content = content.replace(/Nexus Network/g, 'Future Grow');
  content = content.replace(/nexus\.net/g, 'futuregrow.in');
  content = content.replace(/nexusnetwork@upi/g, 'futuregrow@upi');
  content = content.replace(/NX-/g, 'FG-'); // User IDs
  
  // Theme replacements - Backgrounds
  content = content.replace(/bg-slate-50\/50/g, 'bg-[#011425]/50');
  content = content.replace(/bg-slate-50/g, 'bg-[#011425]');
  content = content.replace(/bg-white/g, 'bg-[#242424]');
  
  content = content.replace(/bg-slate-100/g, 'bg-[#1F4959]');
  content = content.replace(/bg-slate-200/g, 'bg-[#5C7C89]/50');
  
  content = content.replace(/bg-slate-900/g, 'bg-[#011425]');
  content = content.replace(/bg-slate-950/g, 'bg-[#011425]');
  content = content.replace(/bg-slate-800/g, 'bg-[#1F4959]');
  
  // Text colors
  content = content.replace(/text-slate-950/g, 'text-white');
  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-slate-800/g, 'text-white');
  content = content.replace(/text-slate-700/g, 'text-gray-200');
  content = content.replace(/text-slate-600/g, 'text-gray-300');
  content = content.replace(/text-slate-500/g, 'text-[#5C7C89]');
  content = content.replace(/text-slate-400/g, 'text-[#5C7C89]');
  content = content.replace(/text-slate-300/g, 'text-gray-400');
  
  // Borders
  content = content.replace(/border-slate-200/g, 'border-[#5C7C89]/50');
  content = content.replace(/border-slate-100/g, 'border-[#5C7C89]/30');
  content = content.replace(/border-slate-300/g, 'border-[#5C7C89]/70');
  
  // Primary brand colors (Blue)
  content = content.replace(/bg-blue-600/g, 'bg-[#1F4959]');
  content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#5C7C89]');
  content = content.replace(/hover:bg-blue-600/g, 'hover:bg-[#5C7C89]');
  content = content.replace(/hover:bg-blue-500/g, 'hover:bg-[#5C7C89]');
  content = content.replace(/text-blue-600/g, 'text-[#5C7C89]');
  content = content.replace(/text-blue-700/g, 'text-[#5C7C89]');
  content = content.replace(/text-blue-800/g, 'text-white');
  content = content.replace(/text-blue-900/g, 'text-white');
  content = content.replace(/bg-blue-50/g, 'bg-[#1F4959]/30');
  content = content.replace(/bg-blue-100/g, 'bg-[#1F4959]/50');
  content = content.replace(/border-blue-100/g, 'border-[#5C7C89]/50');
  content = content.replace(/border-blue-200/g, 'border-[#5C7C89]/50');
  
  // Other accents
  content = content.replace(/bg-emerald-50/g, 'bg-emerald-900/30');
  content = content.replace(/border-emerald-100/g, 'border-emerald-800/50');
  content = content.replace(/border-emerald-200/g, 'border-emerald-800/70');
  content = content.replace(/text-emerald-800/g, 'text-emerald-400');
  content = content.replace(/text-emerald-900/g, 'text-emerald-300');
  
  content = content.replace(/bg-amber-50/g, 'bg-amber-900/30');
  content = content.replace(/border-amber-100/g, 'border-amber-800/50');
  content = content.replace(/border-amber-200/g, 'border-amber-800/70');
  
  content = content.replace(/bg-purple-50/g, 'bg-purple-900/30');
  content = content.replace(/bg-purple-100/g, 'bg-purple-900/50');

  // Specific logo initial
  if (file.includes('DashboardLayout.tsx')) {
     content = content.replace(/>\s*N\s*<\/div>/, '>F</div>');
  }
  
  // HTML body tag modification for dark mode global
  if (file.includes('index.html')) {
     content = content.replace(/<body>/, '<body class="bg-[#011425] text-white">');
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Theme applied successfully.');
