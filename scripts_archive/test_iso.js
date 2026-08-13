const fs = require('fs');
const isoCode = fs.readFileSync('js/iso286_clean.js', 'utf8');
// extract isoClean object
eval(isoCode);
console.log("Shaft keys:", Object.keys(isoClean.Shaft));
console.log("Hole keys:", Object.keys(isoClean.Hole));
console.log("Hole K 10-14:", isoClean.Hole['k'].find(x => x.max === 14));
console.log("Hole R 10-14:", isoClean.Hole['r'].find(x => x.max === 14));
