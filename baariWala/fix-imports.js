const fs = require('fs');
const path = require('path');

const screens = [
  'app/(customer)/shop/list.tsx',
  'app/(customer)/offers/index.tsx',
  'app/(customer)/membership/index.tsx',
  'app/(customer)/notifications/index.tsx',
  'app/(customer)/bookings/[id].tsx',
  'app/(customer)/profile/edit.tsx',
  'app/(customer)/settings/index.tsx',
  'app/(customer)/support/index.tsx',
  'app/(customer)/about/index.tsx',
  'app/(customer)/privacy/index.tsx'
];

screens.forEach(s => {
  const fullPath = path.join(__dirname, s);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/'\.\.\/\.\.\/constants\/theme'/g, "'../../../constants/theme'");
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', s);
  }
});
