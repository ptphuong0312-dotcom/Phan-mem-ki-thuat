// ==============================================================================
// ISO 286 Tolerance and Fit Calculator Logic
// Adapted for Tra Cuu Ren App with Cross-Grid rendering
// ==============================================================================

const SIZE_RANGES = [
    [0, 3], [3, 6], [6, 10], [10, 18], [18, 30], [30, 50], [50, 80],
    [80, 120], [120, 180], [180, 250], [250, 315], [315, 400], [400, 500]
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

function getIT(itGrade, size) {
    const idx = getSizeIndex(size);
    const table = IT_GRADES[itGrade] || IT_GRADES[7]; // Default to IT7 if missing
    return table[idx] / 1000.0;
}

function getFundamentalDeviation(letter, size, itVal) {
    const isUpper = letter[0] === letter[0].toUpperCase();
    const l = letter.toLowerCase();
    const idx = getSizeIndex(size);

    let devUm = 0;
    switch(l) {
        case 'a': devUm = -270 - size*0.5; break;
        case 'b': devUm = -140 - size*0.3; break;
        case 'c': devUm = -60 - size*0.2; break;
        case 'd': devUm = [-20, -30, -40, -50, -65, -80, -100, -120, -145, -170, -190, -210, -230][idx]; break;
        case 'e': devUm = [-14, -20, -25, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135][idx]; break;
        case 'f': devUm = [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68][idx]; break;
        case 'g': devUm = [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20][idx]; break;
        case 'h': case 'js': devUm = 0; break;
        case 'j': devUm = 0; break; // Simplified for J
        case 'k': devUm = 0; break; // Simplified for K
        case 'm': devUm = [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23][idx]; break;
        case 'n': devUm = [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 37, 40, 43][idx]; break;
        case 'p': devUm = [6, 12, 15, 18, 22, 26, 32, 37, 43, 51, 60, 65, 71][idx]; break;
        case 'r': devUm = [10, 16, 20, 23, 28, 34, 41, 48, 60, 73, 86, 95, 104][idx]; break;
        case 's': devUm = [14, 20, 27, 33, 41, 48, 60, 72, 93, 117, 140, 160, 180][idx]; break;
        case 't': devUm = [18, 24, 32, 40, 48, 54, 73, 90, 118, 148, 180, 210, 240][idx]; break;
        case 'u': devUm = [20, 28, 37, 45, 54, 64, 88, 112, 148, 190, 236, 280, 320][idx]; break;
        case 'v': devUm = [22, 32, 43, 52, 64, 78, 108, 140, 188, 245, 308, 360, 420][idx]; break;
        case 'x': devUm = [26, 40, 56, 70, 86, 106, 150, 200, 275, 360, 450, 530, 620][idx]; break;
        case 'y': devUm = [30, 48, 70, 88, 110, 136, 198, 268, 370, 490, 620, 740, 870][idx]; break;
        case 'z': devUm = [36, 60, 86, 110, 140, 176, 258, 350, 490, 650, 820, 980, 1150][idx]; break;
        default: devUm = 0;
    }

    const devMm = devUm / 1000.0;

    if (isUpper) {
        // Hole
        if (['A','B','C','D','E','F','G','H'].includes(letter)) {
            const EI = Math.abs(devMm);
            return { ES: EI + itVal, EI: EI };
        } else if (letter === 'JS') {
            return { ES: itVal / 2.0, EI: -itVal / 2.0 };
        } else {
            const ES = -Math.abs(devMm);
            return { ES: ES, EI: ES - itVal };
        }
    } else {
        // Shaft
        if (['a','b','c','d','e','f','g','h'].includes(l)) {
            const es = -Math.abs(devMm);
            return { es: es, ei: es - itVal };
        } else if (l === 'js') {
            return { es: itVal / 2.0, ei: -itVal / 2.0 };
        } else {
            const ei = Math.abs(devMm);
            return { es: ei + itVal, ei: ei };
        }
    }
}

function computeFit(nominal, holeLetter, holeIT, shaftLetter, shaftIT) {
    const hIT = getIT(parseInt(holeIT), nominal);
    const sIT = getIT(parseInt(shaftIT), nominal);

    const holeDev = getFundamentalDeviation(holeLetter, nominal, hIT);
    const shaftDev = getFundamentalDeviation(shaftLetter, nominal, sIT);

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

// Extended to complete the cross shape (1 to 13)
const SHAFT_CLASSES = [
    "h1","js1","h2","js2","h3","js3","g4","h4","js4","k4","m4","n4","p4","r4","s4",
    "f5","g5","h5","j5","js5","k5","m5","n5","p5","r5","s5","t5","u5","v5","x5","y5","z5",
    "e6","f6","g6","h6","j6","js6","k6","m6","n6","p6","r6","s6","t6","u6","v6","x6","y6","z6",
    "d7","e7","f7","g7","h7","j7","js7","k7","m7","n7","p7","r7","s7","t7","u7","v7","x7","y7","z7",
    "c8","d8","e8","f8","g8","h8","js8","k8","m8","n8","p8","r8","s8","t8","u8","v8","x8","y8","z8",
    "a9","b9","c9","d9","e9","f9","h9","js9",
    "a10","b10","c10","d10","e10","h10","js10",
    "a11","b11","c11","d11","h11","js11",
    "a12","b12","c12","h12","js12",
    "a13","b13","c13","h13","js13"
];

const PREFERRED_HOLES = ["H6","H7","H8","H9","H11","JS7","K7","M7","N7","P7"];
const COMMON_HOLES = ["H5","H10","F7","G6","E8","D9","K6","M6","N6","P6"];

const HOLE_CLASSES = [
    "H1","Js1","H2","Js2","H3","Js3","H4","Js4","K4","M4","G5","H5","Js5","K5","M5","N5","P5","R5","S5",
    "F6","G6","H6","J6","Js6","K6","M6","N6","P6","R6","S6","T6","U6","V6","X6","Y6","Z6",
    "D7","E7","F7","G7","H7","J7","Js7","K7","M7","N7","P7","R7","S7","T7","U7","V7","X7","Y7","Z7",
    "C8","D8","E8","F8","G8","H8","J8","Js8","K8","M8","N8","P8","R8","S8","T8","U8","V8","X8","Y8","Z8",
    "A9","B9","C9","D9","E9","F9","H9","Js9",
    "A10","B10","C10","D10","E10","H10","Js10",
    "A11","B11","C11","D11","H11","Js11",
    "A12","B12","C12","H12","Js12",
    "A13","B13","C13","H13","Js13"
];

// Map letter to column index (1 to 22) for the cross shape
const colMap = { 'a':1, 'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7, 'h':8, 'j':9, 'js':10, 'k':11, 'm':12, 'n':13, 'p':14, 'r':15, 's':16, 't':17, 'u':18, 'v':19, 'x':20, 'y':21, 'z':22 };

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
    
    // Explicitly set grid to 22 columns
    box.style.gridTemplateColumns = "repeat(22, minmax(40px, 1fr))";

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
    const dev = getFundamentalDeviation(m[1], nominal, itVal);

    document.getElementById('shaftSelectedTitle').innerText = selectedShaftClass;
    document.getElementById('shaftEsTxt').innerText = fmt(dev.es, 3, true);
    document.getElementById('shaftEiTxt').innerText = fmt(dev.ei, 3, true);
    document.getElementById('shaftItTxt').innerText = fmt(itVal, 3);
    document.getElementById('shaftMaxTxt').innerText = fmt(nominal + dev.es, 3);
    document.getElementById('shaftMinTxt').innerText = fmt(nominal + dev.ei, 3);
}

function initHolePanel() {
    const box = document.getElementById('holeGridBox');
    box.innerHTML = '';
    
    box.style.gridTemplateColumns = "repeat(22, minmax(40px, 1fr))";

    HOLE_CLASSES.forEach(cls => {
        const m = cls.match(/^([a-z]+)(\d+)$/i);
        if (!m) return;
        
        const letter = m[1].toLowerCase();
        const num = parseInt(m[2]);

        const btn = document.createElement('div');
        let type = 'std';
        if (PREFERRED_HOLES.includes(cls)) type = 'pref';
        else if (COMMON_HOLES.includes(cls)) type = 'comm';

        btn.className = `iso-class-btn ${type} ${cls === selectedHoleClass ? 'active' : ''}`;
        btn.innerText = cls;
        
        btn.style.gridColumn = colMap[letter] || 1;
        btn.style.gridRow = num;

        btn.onclick = () => {
            selectedHoleClass = cls;
            box.querySelectorAll('.iso-class-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateHolePanel();
        };
        box.appendChild(btn);
    });
    updateHolePanel();
}

function updateHolePanel() {
    const nominal = parseFloat(document.getElementById('holeNominalInput').value) || 100;
    const m = selectedHoleClass.match(/^([a-z]+)(\d+)$/i);
    if (!m) return;

    const itVal = getIT(parseInt(m[2]), nominal);
    const dev = getFundamentalDeviation(m[1], nominal, itVal);

    document.getElementById('holeSelectedTitle').innerText = selectedHoleClass;
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

    const fmtDev = (val) => val === 0 ? "0" : (val > 0 ? "+" + val.toFixed(3) : val.toFixed(3));

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

    const fmtDev = (val) => val === 0 ? "0" : (val > 0 ? "+" + val.toFixed(3) : val.toFixed(3));

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
