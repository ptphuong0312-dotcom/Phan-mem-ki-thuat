const fs = require('fs');
let content = fs.readFileSync('js/iso286_data.js', 'utf8');
content = content.replace('const iso286Data', 'global.iso286Data');
eval(content);

let cleanContent = fs.readFileSync('js/iso286_clean.js', 'utf8');
cleanContent = cleanContent.replace('const isoClean =', 'global.isoClean =');
eval(cleanContent);

function getIT(itGrade, size) {
    if (size <= 0) return 0;
    let target = null;
    for (let key in isoClean.IT) {
        let entry = isoClean.IT[key];
        if (size > entry.min && size <= entry.max) {
            target = entry;
            break;
        }
    }
    if (!target) return 0;
    const val = target.vals[itGrade];
    return val ? val / 1000.0 : 0;
}

function getDelta(letter, itGrade, size) {
    if (size <= 3) return 0;
    const l = letter.toLowerCase();
    
    let applyDelta = false;
    if (['k', 'm'].includes(l) && itGrade <= 8) applyDelta = true;
    if (l === 'n' && itGrade <= 7) applyDelta = true; // original buggy?
    if (['p', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'za', 'zb', 'zc'].includes(l) && itGrade <= 7) applyDelta = true;
    
    if (applyDelta && itGrade >= 1) {
        const it_n = getIT(itGrade, size) * 1000;
        const it_prev = getIT(itGrade - 1, size) * 1000;
        return Math.round(it_n - it_prev);
    }
    return 0;
}

function getFundamentalDeviation(letter, size, itVal, itGrade) {
    const isUpper = letter[0] === letter[0].toUpperCase();
    const l = letter.toLowerCase();
    
    if (l === 'js') {
        if (isUpper) return { ES: itVal / 2.0, EI: -itVal / 2.0 };
        else return { es: itVal / 2.0, ei: -itVal / 2.0 };
    }

    let devUm = 0;
    let isSymmetric = false;
    
    if (l === 'j') {
        let val = 7777;
        const targetObj = isUpper ? isoClean.Hole['j'] : isoClean.Shaft['j'];
        if (targetObj) {
            for (let row of targetObj) {
                if (size > row.min && size <= row.max) {
                    if (isUpper) {
                        if (itGrade === 6) val = row.vals[1];
                        else if (itGrade === 7) val = row.vals[2];
                        else if (itGrade === 8) val = row.vals[3];
                        else val = 7777;
                    } else {
                        if (itGrade === 5) val = row.vals[1];
                        else if (itGrade === 6) val = row.vals[2];
                        else if (itGrade === 7) val = row.vals[3];
                        else val = 7777;
                    }
                    break;
                }
            }
        }
        if (val === 7777 || val === 9999 || val === undefined) {
            isSymmetric = true;
        } else {
            devUm = val;
        }
    } else if (isoClean.Shaft[l]) {
        let found = false;
        for (let row of isoClean.Shaft[l]) {
            if (size > row.min && size <= row.max) {
                devUm = row.val;
                found = true;
                break;
            }
        }
        if (!found || devUm === 9999 || devUm === 7777) {
            devUm = 0;
        }
    }
    
    if (isSymmetric) {
        if (isUpper) return { ES: itVal / 2.0, EI: -itVal / 2.0 };
        else return { es: itVal / 2.0, ei: -itVal / 2.0 };
    }

    const devMm = devUm / 1000.0;

    if (isUpper) {
        if (['a','b','c','cd','d','e','ef','f','fg','g','h'].includes(l)) {
            const EI = Math.abs(devMm);
            return { ES: EI + itVal, EI: EI };
        } else if (l === 'j') {
            const ES = devMm; 
            return { ES: ES, EI: ES - itVal };
        } else {
            const deltaMm = getDelta(l, itGrade, size) / 1000.0;
            const ES = -Math.abs(devMm) + deltaMm;
            return { ES: ES, EI: ES - itVal };
        }
    } else {
        if (['a','b','c','cd','d','e','ef','f','fg','g','h'].includes(l)) {
            const es = -Math.abs(devMm);
            return { es: es, ei: es - itVal };
        } else if (l === 'j') {
            const ei = devMm; 
            return { es: ei + itVal, ei: ei };
        } else {
            const ei = Math.abs(devMm);
            return { es: ei + itVal, ei: ei };
        }
    }
}

// Compare Hole values against iso286Data.Hole!
let discrepancies = [];
const letters_ah = ['a', 'b', 'c', 'cd', 'd', 'e', 'ef', 'f', 'fg', 'g', 'h'];
// Find mz letters in iso286Data.Hole
for (let row of iso286Data.Hole) {
    let min = row[0];
    let max = row[1];
    let mid_size = (min + max) / 2.0;
    
    // Check K
    let expectedK = row[17];
    if (expectedK !== 9999 && expectedK !== 7777) {
        let itVal = getIT(6, mid_size);
        let calcES = Math.round(getFundamentalDeviation('K', mid_size, itVal, 6).ES * 1000);
        let delta = getDelta('k', 6, mid_size);
        if (calcES !== expectedK + delta) discrepancies.push(`Hole K ${min}-${max}: expected ES=${expectedK + delta}, got ${calcES}`);
    }
    
    // check Hole N
    // Hole N is at index 20. But wait, iso286Data.Hole has an extra 0 at index 21 for some rows!
    // We know exactly where the values are!
    let expectedN = row[20];
    if (expectedN !== 9999 && expectedN !== 7777) {
        let itVal6 = getIT(6, mid_size);
        let calcES6 = Math.round(getFundamentalDeviation('N', mid_size, itVal6, 6).ES * 1000);
        let delta6 = getDelta('n', 6, mid_size);
        if (calcES6 !== expectedN + delta6) discrepancies.push(`Hole N ${min}-${max} IT6: expected ES=${expectedN + delta6}, got ${calcES6}`);
        
        let itVal9 = getIT(9, mid_size);
        let calcES9 = Math.round(getFundamentalDeviation('N', mid_size, itVal9, 9).ES * 1000);
        // Is ES supposed to be 0 for Hole N IT9?
        // Let's print expectedN
        if (calcES9 !== expectedN) discrepancies.push(`Hole N ${min}-${max} IT9: expected ES=${expectedN}, got ${calcES9}`);
    }
}

if (discrepancies.length > 0) {
    console.log("Found " + discrepancies.length + " discrepancies. First 30:");
    console.log(discrepancies.slice(0, 30).join('\n'));
} else {
    console.log("No discrepancies found!");
}
