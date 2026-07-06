const fs = require('fs');
const path = require('path');

const screens = [
  'app/(customer)/home.tsx',
  'app/(customer)/profile.tsx',
  'app/(customer)/search.tsx',
  'app/(customer)/support.tsx',
  'app/(customer)/notifications.tsx',
  'app/(customer)/shop/[id].tsx' // Wait! Is shop/[id] correct as ../../../ ?
];

// Let's fix everything programmatically
function fixImports(dir, depth) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath, depth + 1);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Calculate correct relative path to constants/theme
      // Root is C:\...\SalonWala\app
      // So depth 0 (e.g. app/index.tsx) needs '../constants/theme'
      // depth 1 (e.g. app/(customer)/home.tsx) needs '../../constants/theme'
      // depth 2 (e.g. app/(customer)/shop/list.tsx) needs '../../../constants/theme'
      // depth 3 (e.g. app/(customer)/bookings/[id].tsx) needs '../../../constants/theme' wait no, bookings is depth 2
      
      const expectedPath = '../'.repeat(depth + 1) + 'constants/theme';
      
      // Replace any wrong theme import with the exact correct one
      const newContent = content.replace(/from\s+['"](?:\.\.\/)+constants\/theme['"]/g, `from '${expectedPath}'`);
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Corrected import in:', fullPath, 'to', expectedPath);
      }
    }
  }
}

fixImports(path.join(__dirname, 'app'), 0);
