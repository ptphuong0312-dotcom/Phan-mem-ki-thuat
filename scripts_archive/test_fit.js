const fs = require('fs');
let code = fs.readFileSync('js/toleranceCalculator.js', 'utf-8');
code = code.replace(/document\./g, '//');
code = code.replace(/window\./g, '//');
const sandbox = {
  console: console,
  Math: Math,
  parseFloat: parseFloat,
  parseInt: parseInt
};
// Add data.js and iso286_data.js mock if needed, but computeFit relies on iso286_data.
