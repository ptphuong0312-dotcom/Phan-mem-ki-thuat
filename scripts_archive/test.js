const fs = require('fs');
eval(fs.readFileSync('js/iso286_clean.js', 'utf8').replace('const isoClean', 'global.isoClean'));
console.log(Object.keys(isoClean.Hole));
