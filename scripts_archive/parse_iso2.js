const fs = require('fs');
let content = fs.readFileSync('js/iso286_data.js', 'utf8');
content = content.replace('const iso286Data', 'global.iso286Data');
eval(content);

let result = { Shaft: {}, Hole: {}, IT: {} };

const letters_ah = ['a', 'b', 'c', 'cd', 'd', 'e', 'ef', 'f', 'fg', 'g', 'h'];
for(let l of letters_ah) result.Shaft[l] = [];
result.Shaft['k'] = []; result.Shaft['j'] = [];
const letters_mz = ['m', 'n', 'p', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'za', 'zb', 'zc'];
for(let l of letters_mz) result.Shaft[l] = [];

for(let row of iso286Data.Shaft) {
  let min = row[0];
  let max = row[1];
  for(let i=0; i<letters_ah.length; i++) result.Shaft[letters_ah[i]].push({ min, max, val: row[i+2] });
  result.Shaft['k'].push({ min, max, val: row[17] });
  result.Shaft['j'].push({ min, max, vals: row.slice(13, 17) }); // 14=j5, 15=j6, 16=j7
  let mz_vals = row.slice(19).filter(v => v !== 9999);
  for(let i=0; i<mz_vals.length; i++) result.Shaft[letters_mz[i]].push({ min, max, val: mz_vals[i] });
}

result.Hole['j'] = [];
for(let row of iso286Data.Hole) {
  result.Hole['j'].push({ min: row[0], max: row[1], vals: row.slice(13, 17) }); // 14=J6, 15=J7, 16=J8
}

for (let row of iso286Data.IT) {
  let entry = { min: row[0], max: row[1], vals: {} };
  for (let i = 1; i <= 18; i++) entry.vals[i] = row[i + 1];
  result.IT[`${row[0]}-${row[1]}`] = entry;
}

fs.writeFileSync('js/iso286_clean.js', 'const isoClean = ' + JSON.stringify(result, null, 2) + ';');
console.log("Done generating js/iso286_clean.js");
