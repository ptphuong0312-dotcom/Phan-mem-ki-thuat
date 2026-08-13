// ==============================================================================
// ISO 286 Tolerance and Fit Calculator Logic
// Adapted for Tra Cuu Ren App with Cross-Grid rendering
// ==============================================================================

const SIZE_RANGES = [
    [0, 3], [3, 6], [6, 10], [10, 18], [18, 30], [30, 50], [50, 80],
    [80, 120], [120, 180], [180, 250], [250, 315], [315, 400], [400, 500],
    [500, 630], [630, 800], [800, 1000], [1000, 1250], [1250, 1600],
    [1600, 2000], [2000, 2500], [2500, 3150]
];

const IT_GRADES = {
    5:  [4, 5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
    6:  [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
    7:  [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
    8:  [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
    9:  [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
    10: [40, 48, 58, 70, 84, 100, 120, 140, 160, 185, 210, 230, 250],
    11: [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400],
    12: [100, 120, 150, 180, 210, 250, 300, 350, 400, 460, 520, 570, 630]
};

function getSizeIndex(size) {
    if (size <= 0) return 0;
    for (let i = 0; i < SIZE_RANGES.length; i++) {
        if (size > SIZE_RANGES[i][0] && size <= SIZE_RANGES[i][1]) return i;
    }
    return SIZE_RANGES.length - 1;
}

function getD(size) {
    if (size <= 0) return Math.sqrt(1 * 3);
    for (let i = 0; i < SIZE_RANGES.length; i++) {
        if (size > SIZE_RANGES[i][0] && size <= SIZE_RANGES[i][1]) {
            if (SIZE_RANGES[i][0] === 0) return Math.sqrt(1 * 3);
            return Math.sqrt(SIZE_RANGES[i][0] * SIZE_RANGES[i][1]);
        }
    }
    return Math.sqrt(SIZE_RANGES[SIZE_RANGES.length-1][0] * SIZE_RANGES[SIZE_RANGES.length-1][1]);
}

function getIT(itGrade, size) {
    const idx = getSizeIndex(size);
    if (itGrade >= 5 && itGrade <= 12 && idx < 13 && IT_GRADES[itGrade]) {
        return IT_GRADES[itGrade][idx] / 1000.0;
    }
    
    let D = getD(size);
    let I = (D <= 500) ? (0.45 * Math.pow(D, 1/3) + 0.001 * D) : (0.004 * D + 2.1);
    let val = 0;
    if (itGrade === 1) val = 0.8 + 0.020 * D;
    else if (itGrade === 2) val = (0.8 + 0.020 * D) * 1.58; 
    else if (itGrade === 3) val = (0.8 + 0.020 * D) * 2.5; 
    else if (itGrade === 4) val = (0.8 + 0.020 * D) * 4; 
    else if (itGrade === 5) val = 7 * I;
    else if (itGrade === 6) val = 10 * I;
    else if (itGrade === 7) val = 16 * I;
    else if (itGrade === 8) val = 25 * I;
    else if (itGrade === 9) val = 40 * I;
    else if (itGrade === 10) val = 64 * I;
    else if (itGrade === 11) val = 100 * I;
    else if (itGrade === 12) val = 160 * I;
    else if (itGrade === 13) val = 250 * I;
    else if (itGrade === 14) val = 400 * I;
    else if (itGrade === 15) val = 640 * I;
    else if (itGrade === 16) val = 1000 * I;
    else if (itGrade === 17) val = 1600 * I;
    else if (itGrade === 18) val = 2500 * I;
    else val = 16 * I;
    
    return Math.round(val) / 1000.0;
}

function getFundamentalDeviation(letter, size, itVal, itGrade) {
    const isUpper = letter[0] === letter[0].toUpperCase();
    const l = letter.toLowerCase();
    const idx = getSizeIndex(size);
    
    let devUm = null;
    
    if (idx < 13) {
        switch(l) {
            case 'a': devUm = [-270, -270, -280, -290, -300, -320, -360, -410, -580, -820, -1050, -1350, -1650][idx]; break;
            case 'b': devUm = [-140, -140, -150, -150, -160, -180, -200, -240, -310, -420, -540, -680, -840][idx]; break;
            case 'c': devUm = [-60, -70, -80, -95, -110, -130, -150, -180, -230, -280, -330, -400, -480][idx]; break;
            case 'cd': devUm = [-32, -46, -56, -95, -110, -130, -150, -180, -230, -280, -330, -400, -480][idx]; break;
            case 'd': devUm = [-20, -30, -40, -50, -65, -80, -100, -120, -145, -170, -190, -210, -230][idx]; break;
            case 'e': devUm = [-14, -20, -25, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135][idx]; break;
            case 'ef': devUm = [-10, -14, -18, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135][idx]; break;
            case 'f': devUm = [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68][idx]; break;
            case 'fg': devUm = [-4, -6, -8, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68][idx]; break;
            case 'g': devUm = [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20][idx]; break;
            case 'h': devUm = 0; break;
            case 'j': devUm = [-4, -4, -5, -6, -8, -10, -12, -15, -18, -21, -26, -28, -32][idx]; break;
            case 'k': devUm = [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5][idx]; break;
            case 'm': devUm = [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23][idx]; break;
            case 'n': devUm = [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40][idx]; break;
            case 'p': devUm = [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68][idx]; break;
            case 'r': devUm = [10, 15, 19, 23, 28, 34, 43, 54, 68, 84, 98, 114, 132][idx]; break;
            case 's': devUm = [14, 19, 23, 28, 35, 43, 59, 79, 108, 140, 170, 208, 252][idx]; break;
            case 't': devUm = [18, 23, 28, 33, 41, 54, 75, 104, 146, 196, 240, 294, 360][idx]; break;
            case 'u': devUm = [18, 23, 28, 33, 48, 70, 102, 144, 210, 284, 350, 435, 540][idx]; break;
            case 'v': devUm = [20, 28, 34, 39, 55, 81, 120, 172, 252, 340, 425, 530, 660][idx]; break;
            case 'x': devUm = [20, 28, 34, 45, 64, 97, 146, 210, 310, 425, 525, 660, 820][idx]; break;
            case 'y': devUm = [null, null, null, null, 75, 114, 174, 254, 380, 520, 650, 820, 1000][idx]; break;
            case 'z': devUm = [null, null, null, null, 88, 136, 210, 310, 465, 640, 790, 1000, 1250][idx]; break;
            case 'za': devUm = [null, null, null, null, null, null, null, null, null, null, 1000, 1300, 1600][idx]; break;
            case 'zb': devUm = [null, null, null, null, null, null, null, null, null, null, 1300, 1650, 2100][idx]; break;
            case 'zc': devUm = [null, null, null, null, null, null, null, null, null, null, 1700, 2100, 2600][idx]; break;
            case 'js': devUm = 0; break;
            default: devUm = 0;
        }
    } else {
        let D = getD(size);
        if (l === 'd') devUm = -16 * Math.pow(D, 0.44);
        else if (l === 'e') devUm = -11 * Math.pow(D, 0.41);
        else if (l === 'f') devUm = -5.5 * Math.pow(D, 0.41);
        else if (l === 'g') devUm = -2.5 * Math.pow(D, 0.34);
        else if (l === 'h' || l === 'js') devUm = 0;
        else devUm = null; 
        if (devUm !== null) devUm = Math.round(devUm);
    }
    
    if (devUm === null) return null; // Undefined combination

    const devMm = devUm / 1000.0;

    if (isUpper) {
        const L = letter.toUpperCase();
        if (['A','B','C','CD','D','E','EF','F','FG','G','H'].includes(L)) {
            const EI = -devMm; 
            return { ES: EI + itVal, EI: EI };
        } else if (['JS', 'J'].includes(L) && itGrade >= 9) {
            return { ES: itVal / 2.0, EI: -itVal / 2.0 };
        } else if (L === 'J') {
            const J_ES = {
                6: [2, 5, 5, 6, 8, 10, 13, 16, 18, 22, 25, 29, 33],
                7: [4, 6, 8, 10, 12, 14, 18, 22, 26, 30, 36, 39, 43],
                8: [6, 10, 12, 15, 20, 24, 28, 34, 41, 47, 55, 60, 66]
            };
            if (J_ES[itGrade] && idx < 13) {
                const ES = J_ES[itGrade][idx] / 1000.0;
                return { ES: ES, EI: ES - itVal };
            }
            return { ES: itVal / 2.0, EI: -itVal / 2.0 };
        } else if (L === 'JS') {
            return { ES: itVal / 2.0, EI: -itVal / 2.0 };
        } else {
            let deltaMm = 0;
            if (itGrade >= 3 && itGrade <= 8) {
                const DELTA_VALUES = [
                    [0, 0, 0, 0, 0, 0],
                    [1, 1.5, 1, 3, 4, 6],
                    [1, 1.5, 2, 3, 6, 7],
                    [1, 2, 3, 3, 7, 9],
                    [1.5, 2, 3, 4, 8, 12],
                    [1.5, 3, 4, 5, 9, 14],
                    [2, 3, 5, 6, 11, 16],
                    [2, 4, 5, 7, 13, 19],
                    [3, 4, 6, 7, 15, 23],
                    [3, 4, 6, 9, 17, 26],
                    [4, 4, 7, 9, 20, 29],
                    [4, 5, 7, 11, 21, 32],
                    [5, 5, 7, 13, 23, 34]
                ];
                
                let applies = false;
                if (['K','M','N'].includes(L) && itGrade <= 8) applies = true;
                if (['P','R','S','T','U','V','X','Y','Z','ZA','ZB','ZC'].includes(L) && itGrade <= 7) applies = true;
                
                if (applies && idx < 13) {
                    deltaMm = DELTA_VALUES[idx][itGrade - 3] / 1000.0;
                }
            }
            
            if (['K', 'M', 'N'].includes(L) && itGrade >= 9) { return { ES: 0, EI: -itVal }; }
            
            const ES = -devMm + deltaMm;
            return { ES: ES, EI: ES - itVal };
        }
    } else {
        if (['a','b','c','cd','d','e','ef','f','fg','g','h'].includes(l)) {
            return { es: devMm, ei: devMm - itVal };
        } else if (['js', 'j'].includes(l) && itGrade >= 9) {
            return { es: itVal / 2.0, ei: -itVal / 2.0 };
        } else if (l === 'j') {
            const j_es = {
                5: [2, 3, 3, 4, 5, 5, 6, 7, 9, 10, 13, 14, 16],
                6: [2, 5, 5, 6, 8, 10, 13, 16, 18, 22, 25, 29, 33],
                7: [4, 6, 8, 10, 12, 14, 18, 22, 26, 30, 36, 39, 43],
                8: [6, 10, 12, 15, 20, 24, 28, 34, 41, 47, 55, 60, 66]
            };
            if (j_es[itGrade] && idx < 13) {
                const es = j_es[itGrade][idx] / 1000.0;
                return { es: es, ei: es - itVal };
            }
            return { es: itVal / 2.0, ei: -itVal / 2.0 };
        } else if (l === 'js') {
            return { es: itVal / 2.0, ei: -itVal / 2.0 };
        } else {
            if (l === 'k' && itGrade >= 4 && itGrade <= 7) {
                return { es: itVal, ei: 0 };
            }
            return { es: devMm + itVal, ei: devMm };
        }
    }
}

function computeFit(nominal, holeLetter, holeIT, shaftLetter, shaftIT) {
    const hIT = getIT(parseInt(holeIT), nominal);
    const sIT = getIT(parseInt(shaftIT), nominal);

    const holeDev = getFundamentalDeviation(holeLetter, nominal, hIT, parseInt(holeIT));
    const shaftDev = getFundamentalDeviation(shaftLetter, nominal, sIT, parseInt(shaftIT));

    if (holeDev === null || shaftDev === null) {
        return {
           holeMax: null, holeMin: null, shaftMax: null, shaftMin: null,
           maxClearance: null, minClearance: null, fitType: "KHÔNG ÁP DỤNG", fitClass: "gray"
        };
    }


    const holeMax = nominal + holeDev.ES;
    const holeMin = nominal + holeDev.EI;
    const shaftMax = nominal + shaftDev.es;
    const shaftMin = nominal + shaftDev.ei;

    const maxClearance = holeMax - shaftMin;
    const minClearance = holeMin - shaftMax;

    let fitType = "LẮP LỎNG";
    let fitClass = "green";

    const currentFitStr = `${holeLetter}${holeIT}/${shaftLetter}${shaftIT}`;
    const forcedInterferenceFits = ["H7/n6", "H8/n7", "H8/p7", "H8/r7", "N8/h7"];

    if (minClearance >= 0) {
        fitType = "LẮP LỎNG";
        fitClass = "green";
    } else if (maxClearance <= 0 || forcedInterferenceFits.includes(currentFitStr)) {
        fitType = "LẮP DÔI";
        fitClass = "red";
    } else {
        fitType = "LẮP TRUNG GIAN";
        fitClass = "orange";
    }

    return {
        nominal,
        hole: { letter: holeLetter, it: holeIT, ES: holeDev.ES, EI: holeDev.EI, max: holeMax, min: holeMin, IT: hIT },
        shaft: { letter: shaftLetter, it: shaftIT, es: shaftDev.es, ei: shaftDev.ei, max: shaftMax, min: shaftMin, IT: sIT },
        fitType, fitClass, maxClearance, minClearance,
        maxInterference: Math.abs(minClearance), minInterference: Math.abs(maxClearance)
    };
}

function fmt(val, decimals = 3, sign = false) {
    if (val === undefined || val === null || isNaN(val)) return "-";
    let str = val.toFixed(decimals);
    if (sign && val > 0) str = "+" + str;
    return str + " mm";
}

function generateClearanceHtml(fit) {
    let html = "";
    if (fit.fitClass === "green") {
        html += `<div class="fit-clearance-row"><span>Độ hở lớn nhất (S_max):</span> <strong>${fit.maxClearance.toFixed(3)} mm</strong></div>`;
        html += `<div class="fit-clearance-row"><span>Độ hở nhỏ nhất (S_min):</span> <strong>${fit.minClearance.toFixed(3)} mm</strong></div>`;
    } else if (fit.fitClass === "red") {
        html += `<div class="fit-clearance-row"><span>Độ dôi lớn nhất (N_max):</span> <strong>${fit.maxInterference.toFixed(3)} mm</strong></div>`;
        html += `<div class="fit-clearance-row"><span>Độ dôi nhỏ nhất (N_min):</span> <strong>${fit.minInterference.toFixed(3)} mm</strong></div>`;
    } else {
        html += `<div class="fit-clearance-row"><span>Độ hở lớn nhất (S_max):</span> <strong>${fit.maxClearance.toFixed(3)} mm</strong></div>`;
        html += `<div class="fit-clearance-row"><span>Độ dôi lớn nhất (N_max):</span> <strong>${fit.maxInterference.toFixed(3)} mm</strong></div>`;
    }
    return html;
}

// ==============================================================================
// MATRIX DATA
// ==============================================================================

const PREFERRED_SHAFTS = ["h6","g6","f7","e8","d9","js6","k6","m6","n6","p6","r6","s6"];
const COMMON_SHAFTS = ["h5","h7","h8","f6","g5","e7","d8","k5","m5","n5","p5"];

const LETTERS = ['a','b','c','cd','d','e','ef','f','fg','g','h','j','js','k','m','n','p','r','s','t','u','v','x','y','z','za','zb','zc'];
const colMap = {};
LETTERS.forEach((l, i) => colMap[l] = i + 1);

const PREFERRED_HOLES = ["H6","H7","H8","H9","H11","Js7","K7","M7","N7","P7"];
const COMMON_HOLES = ["H5","H10","F7","G6","E8","D9","K6","M6","N6","P6"];

const VALID_RANGES = {
    'a': [9, 13], 'b': [9, 13], 'c': [8, 13], 'cd': [6, 10], 'd': [7, 11],
    'e': [6, 10], 'ef': [5, 9], 'f': [5, 9], 'fg': [4, 8], 'g': [4, 8],
    'h': [1, 18], 'j': [5, 8], 'js': [1, 18], 'k': [4, 8], 'm': [4, 8],
    'n': [4, 8], 'p': [4, 8], 'r': [4, 8], 's': [4, 8], 't': [5, 8],
    'u': [5, 8], 'v': [5, 8], 'x': [5, 8], 'y': [5, 8], 'z': [5, 8],
    'za': [5, 8], 'zb': [5, 8], 'zc': [5, 8]
};

const SHAFT_CLASSES = [];
const HOLE_CLASSES = [];

for (let it = 1; it <= 18; it++) {
    for (let l of LETTERS) {
        if (VALID_RANGES[l] && it >= VALID_RANGES[l][0] && it <= VALID_RANGES[l][1]) {
            SHAFT_CLASSES.push(l + it);
            let holeLetter = l === 'js' ? 'Js' : l.toUpperCase();
            HOLE_CLASSES.push(holeLetter + it);
        }
    }
}

let selectedShaftClass = "h6";
let selectedHoleClass = "H6";
let selectedHoleSysPair = { hole: "H7", shaft: "g6" };
let selectedShaftSysPair = { shaft: "h6", hole: "H7" };

// ==============================================================================
// UI LOGIC
// ==============================================================================

function switchIsoTab(panelId) {
    document.querySelectorAll('.iso-tab-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.iso-panel-body').forEach(p => p.classList.remove('active'));

    document.querySelector(`[onclick="switchIsoTab('${panelId}')"]`).classList.add('active');
    document.getElementById(panelId).classList.add('active');
}

function initShaftPanel() {
    const box = document.getElementById('shaftGridBox');
    box.innerHTML = '';
    
    // Explicitly set grid to 28 columns
    box.style.gridTemplateColumns = "repeat(28, minmax(40px, 1fr))";

    SHAFT_CLASSES.forEach(cls => {
        const m = cls.match(/^([a-z]+)(\d+)$/i);
        if (!m) return;
        
        const letter = m[1].toLowerCase();
        const num = parseInt(m[2]);
        
        const btn = document.createElement('div');
        let type = 'std';
        if (PREFERRED_SHAFTS.includes(cls)) type = 'pref';
        else if (COMMON_SHAFTS.includes(cls)) type = 'comm';

        btn.className = `iso-class-btn ${type} ${cls === selectedShaftClass ? 'active' : ''}`;
        btn.innerText = cls;
        
        // CSS Grid Placement Magic
        btn.style.gridColumn = colMap[letter] || 1;
        btn.style.gridRow = num;

        btn.onclick = () => {
            selectedShaftClass = cls;
            box.querySelectorAll('.iso-class-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateShaftPanel();
        };
        box.appendChild(btn);
    });
    updateShaftPanel();
}

function updateShaftPanel() {
    const nominal = parseFloat(document.getElementById('shaftNominalInput').value) || 100;
    const m = selectedShaftClass.match(/^([a-z]+)(\d+)$/i);
    if (!m) return;

    const itVal = getIT(parseInt(m[2]), nominal);
    const dev = getFundamentalDeviation(m[1], nominal, itVal, parseInt(m[2]));
    document.getElementById('holeSelectedTitle').innerText = selectedHoleClass;
    if (dev === null) {
        document.getElementById('holeEsTxt').innerText = "N/A";
        document.getElementById('holeEiTxt').innerText = "N/A";
        document.getElementById('holeItTxt').innerText = "N/A";
        document.getElementById('holeMaxTxt').innerText = "N/A";
        document.getElementById('holeMinTxt').innerText = "N/A";
        return;
    }
document.getElementById('holeEsTxt').innerText = fmt(dev.ES, 3, true);
    document.getElementById('holeEiTxt').innerText = fmt(dev.EI, 3, true);
    document.getElementById('holeItTxt').innerText = fmt(itVal, 3);
    document.getElementById('holeMaxTxt').innerText = fmt(nominal + dev.ES, 3);
    document.getElementById('holeMinTxt').innerText = fmt(nominal + dev.EI, 3);
}

const HOLE_SYS_MATRIX = [
    { hole: "H6", shafts: ["f5","g5","h5","js5","k5","m5","n5","p5","r5","s5","t5"] },
    { hole: "H7", shafts: ["f6","g6","h6","js6","k6","m6","n6","p6","r6","s6","t6","u6","v6","x6","y6","z6"] },
    { hole: "H8", shafts: ["e7","f7","g7","h7","js7","k7","m7","n7","p7","r7","s7","t7","u7","d8","e8","f8","h8"] },
    { hole: "H9", shafts: ["c9","d9","e9","f9","h9"] },
    { hole: "H11", shafts: ["a11","b11","c11","d11","h11"] }
];

function initHoleSysPanel() {
    const table = document.getElementById('holeSysFitTable');
    let html = `<thead><tr><th>Lỗ</th><th colspan="17">Lắp Ghép Trục Phù Hợp</th></tr></thead><tbody>`;

    HOLE_SYS_MATRIX.forEach(row => {
        html += `<tr><th>${row.hole}</th><td style="text-align: left;">`;
        const hMatch = row.hole.match(/^([a-z]+)(\d+)$/i);
        row.shafts.forEach(s => {
            const m = s.match(/^([a-z]+)(\d+)$/i);
            const fit = computeFit(100, hMatch[1], hMatch[2], m[1], m[2]);
            
            let cls = "iso-tag-clearance";
            if (fit.fitClass === "orange") cls = "iso-tag-transition";
            if (fit.fitClass === "red") cls = "iso-tag-interference";

            const active = (selectedHoleSysPair.hole === row.hole && selectedHoleSysPair.shaft === s) ? 'active' : '';
            html += `<span class="iso-cell-tag ${cls} ${active}" onclick="selectHoleSysPair('${row.hole}', '${s}', this)">${row.hole}/${s}</span> `;
        });
        html += `</td></tr>`;
    });
    html += `</tbody>`;
    table.innerHTML = html;
    updateHoleSysPanel();
}

function selectHoleSysPair(hole, shaft, el) {
    selectedHoleSysPair = { hole, shaft };
    document.querySelectorAll('#holeSysFitTable .iso-cell-tag').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    updateHoleSysPanel();
}

function updateHoleSysPanel() {
    const nominal = parseFloat(document.getElementById('holeSysNominalInput').value) || 100;
    const hMatch = selectedHoleSysPair.hole.match(/^([a-z]+)(\d+)$/i);
    const sMatch = selectedHoleSysPair.shaft.match(/^([a-z]+)(\d+)$/i);

    const fit = computeFit(nominal, hMatch[1], hMatch[2], sMatch[1], sMatch[2]);

    const fmtDev = (val) => {
        if (val === 0) return "0";
        let str = val.toFixed(4);
        if (str.endsWith('0')) str = str.slice(0, -1);
        return val > 0 ? "+" + str : str;
    };

    document.getElementById('holeSysFvcNominal').innerText = nominal;
    document.getElementById('holeSysFvcHoleClass').innerText = fit.hole.letter + fit.hole.it;
    document.getElementById('holeSysFvcHoleES').innerText = fmtDev(fit.hole.ES);
    document.getElementById('holeSysFvcHoleEI').innerText = fmtDev(fit.hole.EI);
    
    document.getElementById('holeSysFvcShaftClass').innerText = fit.shaft.letter + fit.shaft.it;
    document.getElementById('holeSysFvcShaftEs').innerText = fmtDev(fit.shaft.es);
    document.getElementById('holeSysFvcShaftEi').innerText = fmtDev(fit.shaft.ei);
    
    const badge = document.getElementById('holeSysFitType');
    badge.innerText = fit.fitType;
    badge.className = `fit-type-badge ${fit.fitClass}`;
    
    document.getElementById('holeSysClearanceInfo').innerHTML = generateClearanceHtml(fit);
    
    if (typeof getFitApplicationHtml === 'function') {
        document.getElementById('holeSysFitApp').innerHTML = getFitApplicationHtml(selectedHoleSysPair.hole, selectedHoleSysPair.shaft);
    }
    
    renderSvgChart(fit, 'holeSys');
}

const SHAFT_SYS_MATRIX = [
    { shaft: "h5", holes: ["F6","G6","H6","Js6","K6","M6","N6","P6","R6","S6","T6"] },
    { shaft: "h6", holes: ["F7","G7","H7","Js7","K7","M7","N7","P7","R7","S7","T7","U7"] },
    { shaft: "h7", holes: ["E8","F8","G8","H8","Js8","K8","M8","N8","D8","E8","F8","H8"] },
    { shaft: "h9", holes: ["C9","D9","E9","F9","H9"] },
    { shaft: "h11", holes: ["A11","B11","C11","D11","H11"] }
];

function initShaftSysPanel() {
    const table = document.getElementById('shaftSysFitTable');
    let html = `<thead><tr><th>Trục</th><th colspan="17">Lắp Ghép Lỗ Phù Hợp</th></tr></thead><tbody>`;

    SHAFT_SYS_MATRIX.forEach(row => {
        html += `<tr><th>${row.shaft}</th><td style="text-align: left;">`;
        const sMatch = row.shaft.match(/^([a-z]+)(\d+)$/i);
        row.holes.forEach(h => {
            const m = h.match(/^([a-z]+)(\d+)$/i);
            const fit = computeFit(100, m[1], m[2], sMatch[1], sMatch[2]);
            
            let cls = "iso-tag-clearance";
            if (fit.fitClass === "orange") cls = "iso-tag-transition";
            if (fit.fitClass === "red") cls = "iso-tag-interference";

            const active = (selectedShaftSysPair.shaft === row.shaft && selectedShaftSysPair.hole === h) ? 'active' : '';
            html += `<span class="iso-cell-tag ${cls} ${active}" onclick="selectShaftSysPair('${row.shaft}', '${h}', this)">${h}/${row.shaft}</span> `;
        });
        html += `</td></tr>`;
    });
    html += `</tbody>`;
    table.innerHTML = html;
    updateShaftSysPanel();
}

function selectShaftSysPair(shaft, hole, el) {
    selectedShaftSysPair = { shaft, hole };
    document.querySelectorAll('#shaftSysFitTable .iso-cell-tag').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    updateShaftSysPanel();
}

function updateShaftSysPanel() {
    const nominal = parseFloat(document.getElementById('shaftSysNominalInput').value) || 100;
    const hMatch = selectedShaftSysPair.hole.match(/^([a-z]+)(\d+)$/i);
    const sMatch = selectedShaftSysPair.shaft.match(/^([a-z]+)(\d+)$/i);

    const fit = computeFit(nominal, hMatch[1], hMatch[2], sMatch[1], sMatch[2]);

    const fmtDev = (val) => {
        if (val === 0) return "0";
        let str = val.toFixed(4);
        if (str.endsWith('0')) str = str.slice(0, -1);
        return val > 0 ? "+" + str : str;
    };

    document.getElementById('shaftSysFvcNominal').innerText = nominal;
    document.getElementById('shaftSysFvcHoleClass').innerText = fit.hole.letter + fit.hole.it;
    document.getElementById('shaftSysFvcHoleES').innerText = fmtDev(fit.hole.ES);
    document.getElementById('shaftSysFvcHoleEI').innerText = fmtDev(fit.hole.EI);
    
    document.getElementById('shaftSysFvcShaftClass').innerText = fit.shaft.letter + fit.shaft.it;
    document.getElementById('shaftSysFvcShaftEs').innerText = fmtDev(fit.shaft.es);
    document.getElementById('shaftSysFvcShaftEi').innerText = fmtDev(fit.shaft.ei);
    
    const badge = document.getElementById('shaftSysFitType');
    badge.innerText = fit.fitType;
    badge.className = `fit-type-badge ${fit.fitClass}`;
    
    document.getElementById('shaftSysClearanceInfo').innerHTML = generateClearanceHtml(fit);
    
    if (typeof getFitApplicationHtml === 'function') {
        document.getElementById('shaftSysFitApp').innerHTML = getFitApplicationHtml(selectedShaftSysPair.hole, selectedShaftSysPair.shaft);
    }
    
    renderSvgChart(fit, 'shaftSys');
}

function renderSvgChart(fit, prefix) {
    const zeroY = 110;
    const scale = 800;

    const hY = zeroY - (fit.hole.ES * scale);
    const hHeight = Math.max((fit.hole.ES - fit.hole.EI) * scale, 12);

    const holeRect = document.getElementById(prefix + 'SvgHoleRect');
    if (holeRect) {
        holeRect.setAttribute('y', hY);
        holeRect.setAttribute('height', hHeight);
        document.getElementById(prefix + 'SvgHoleLabel').textContent = `Lỗ (${fit.hole.letter}${fit.hole.it})`;
        document.getElementById(prefix + 'SvgHoleLabel').setAttribute('y', Math.min(hY - 10, 90));
    }

    const sY = zeroY - (fit.shaft.es * scale);
    const sHeight = Math.max((fit.shaft.es - fit.shaft.ei) * scale, 12);

    const shaftRect = document.getElementById(prefix + 'SvgShaftRect');
    if (shaftRect) {
        shaftRect.setAttribute('y', sY);
        shaftRect.setAttribute('height', sHeight);
        document.getElementById(prefix + 'SvgShaftLabel').textContent = `Trục (${fit.shaft.letter}${fit.shaft.it})`;
        document.getElementById(prefix + 'SvgShaftLabel').setAttribute('y', Math.max(sY + sHeight + 20, 145));
    }
}

// Khởi tạo tất cả sau khi DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Only init if we are on a page that actually has these panels
    if(document.getElementById('shaftGridBox')) {
        initShaftPanel();
        initHolePanel();
        initHoleSysPanel();
        initShaftSysPanel();
    }
});
