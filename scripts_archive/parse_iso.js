const fs = require('fs');
let content = fs.readFileSync('js/iso286_data.js', 'utf8');
content = content.replace('const iso286Data', 'global.iso286Data');
eval(content);

const letters = [
  { l: 'a', sh: 2, ho: 2 },
  { l: 'b', sh: 3, ho: 3 },
  { l: 'c', sh: 4, ho: 4 },
  { l: 'cd', sh: 5, ho: 5 },
  { l: 'd', sh: 6, ho: 6 },
  { l: 'e', sh: 7, ho: 7 },
  { l: 'ef', sh: 8, ho: 8 },
  { l: 'f', sh: 9, ho: 9 },
  { l: 'fg', sh: 10, ho: 10 },
  { l: 'g', sh: 11, ho: 11 },
  { l: 'h', sh: 12, ho: 12 },
  // we'll skip j
  { l: 'k', sh: 17, ho: 17 }, // we saw 17 was 1 for shaft, -1 for hole
  { l: 'm', sh: 19, ho: 19 }, // we saw 19 was 7 for shaft, -7 for hole
  { l: 'n', sh: 20, ho: 20 }, // 12, -12
];
// let's figure out p to zc for shaft and hole.
// we know shaft p=18, r=23, s=28, t=33, u=40, v=50, x=64, y=90, z=130 for 10-14.
const shaftRow = iso286Data.Shaft[3];
const holeRow = iso286Data.Hole[3];

const p_to_zc_vals = { p: 18, r: 23, s: 28, t: 33, u: 40, v: 50, x: 64, y: 90, z: 130 };
for (let l in p_to_zc_vals) {
  let v = p_to_zc_vals[l];
  let s_idx = shaftRow.indexOf(v);
  let h_idx = holeRow.indexOf(-v);
  letters.push({ l: l, sh: s_idx, ho: h_idx });
}

let result = { Shaft: {}, Hole: {}, IT: {} };
for(let x of letters) {
  result.Shaft[x.l] = [];
  result.Hole[x.l] = [];
}

for(let row of iso286Data.Shaft) {
  for(let x of letters) {
    if (x.sh !== -1) {
      result.Shaft[x.l].push({ min: row[0], max: row[1], val: row[x.sh] });
    }
  }
}

for(let row of iso286Data.Hole) {
  for(let x of letters) {
    if (x.ho !== -1) {
      result.Hole[x.l].push({ min: row[0], max: row[1], val: row[x.ho] });
    }
  }
}

// Map IT
for (let row of iso286Data.IT) {
  let entry = { min: row[0], max: row[1], vals: {} };
  for (let i = 1; i <= 18; i++) {
    entry.vals[i] = row[i + 1];
  }
  result.IT[`${row[0]}-${row[1]}`] = entry;
}

fs.writeFileSync('js/iso286_clean.js', 'const isoClean = ' + JSON.stringify(result, null, 2) + ';');
console.log("Done generating js/iso286_clean.js");
