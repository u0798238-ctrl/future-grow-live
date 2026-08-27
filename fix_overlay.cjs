const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const overlayStr = `      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "absolute inset-0 z-40 bg-[#071E2C]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-in-out",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />`;

const newOverlay = `      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-[#071E2C]/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}`;

if (layout.includes(overlayStr)) {
    layout = layout.replace(overlayStr, newOverlay);
    fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
    console.log("Reverted overlay strictly");
} else {
    // try a more generic replacement
    const startIdx = layout.indexOf('{/* Mobile Sidebar Overlay */}');
    if (startIdx !== -1) {
        const endIdx = layout.indexOf('</div>', startIdx) + '</div>'.length; // Not quite right, but close. Actually, the div is self-closing />
        
        // Let's just find the closing tag
        const closingIdx1 = layout.indexOf('/>', startIdx);
        const closingIdx2 = layout.indexOf('</div>', startIdx);
        
        // it's self-closing
        layout = layout.slice(0, startIdx) + newOverlay + '\n    </div>\n  );\n}'; // Brute force end of file since it's at the end
        
        fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
        console.log("Brute force replaced overlay");
    }
}
