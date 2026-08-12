let selectedShaftClass = "h6";
let selectedHoleClass = "H6";
let selectedHoleSysPair = { hole: "H7", shaft: "g6" };
let selectedShaftSysPair = { shaft: "h6", hole: "H7" };

const PREFERRED_SHAFTS = ["h6","g6","f7","e8","d9","js6","k6","m6","n6","p6","r6","s6"];
const COMMON_SHAFTS = ["h5","h7","h8","f6","g5","e7","d8","k5","m5","n5","p5"];
const SHAFT_CLASSES = [
    "h1","js1","h2","js2","h3","js3","g4","h4","js4","k4","m4","n4","p4","r4","s4",
    "f5","g5","h5","j5","js5","k5","m5","n5","p5","r5","s5","t5","u5","v5","x5","y5","z5",
    "e6","f6","g6","h6","j6","js6","k6","m6","n6","p6","r6","s6","t6","u6","v6","x6","y6","z6",
    "d7","e7","f7","g7","h7","j7","js7","k7","m7","n7","p7","r7","s7","t7","u7","v7","x7","y7","z7",
    "c8","d8","e8","f8","g8","h8","js8","k8","m8","n8","p8","r8","s8","t8","u8","v8","x8","y8","z8"
];

const PREFERRED_HOLES = ["H6","H7","H8","H9","H11","JS7","K7","M7","N7","P7"];
const COMMON_HOLES = ["H5","H10","F7","G6","E8","D9","K6","M6","N6","P6"];
const HOLE_CLASSES = [
    "H1","Js1","H2","Js2","H3","Js3","H4","Js4","K4","M4","G5","H5","Js5","K5","M5","N5","P5","R5","S5",
    "F6","G6","H6","J6","Js6","K6","M6","N6","P6","R6","S6","T6","U6","V6","X6","Y6","Z6",
    "D7","E7","F7","G7","H7","J7","Js7","K7","M7","N7","P7","R7","S7","T7","U7","V7","X7","Y7","Z7",
    "C8","D8","E8","F8","G8","H8","J8","Js8","K8","M8","N8","P8","R8","S8","T8","U8","V8","X8","Y8","Z8"
];

const HOLE_SYS_MATRIX = [
    { hole: "H6", shafts: ["f5","g5","h5","js5","k5","m5","n5","p5","r5","s5","t5"] },
    { hole: "H7", shafts: ["f6","g6","h6","js6","k6","m6","n6","p6","r6","s6","t6","u6","v6","x6","y6","z6"] },
    { hole: "H8", shafts: ["e7","f7","g7","h7","js7","k7","m7","n7","p7","r7","s7","t7","u7","d8","e8","f8","h8"] },
    { hole: "H9", shafts: ["c9","d9","e9","f9","h9"] },
    { hole: "H11", shafts: ["a11","b11","c11","d11","h11"] }
];

const SHAFT_SYS_MATRIX = [
    { shaft: "h5", holes: ["F6","G6","H6","Js6","K6","M6","N6","P6","R6","S6","T6"] },
    { shaft: "h6", holes: ["F7","G7","H7","Js7","K7","M7","N7","P7","R7","S7","T7","U7"] },
    { shaft: "h7", holes: ["E8","F8","G8","H8","Js8","K8","M8","N8","D8","E8","F8","H8"] },
    { shaft: "h9", holes: ["C9","D9","E9","F9","H9"] },
    { shaft: "h11", holes: ["A11","B11","C11","D11","H11"] }
];

function fmt(val, decimals = 3, sign = false) {
    if (val === undefined || val === null || isNaN(val)) return "-";
    let str = val.toFixed(decimals);
    if (sign && val > 0) str = "+" + str;
    return str + " mm";
}

function computeFit(nominal, holeLetter, holeIT, shaftLetter, shaftIT) {
    const hITVal = getIT(parseInt(holeIT), nominal);
    const sITVal = getIT(parseInt(shaftIT), nominal);

    const holeDev = getFundamentalDeviation(holeLetter, nominal, hITVal, parseInt(holeIT));
    const shaftDev = getFundamentalDeviation(shaftLetter, nominal, sITVal, parseInt(shaftIT));

    const holeMax = nominal + holeDev.ES;
    const holeMin = nominal + holeDev.EI;
    const shaftMax = nominal + shaftDev.es;
    const shaftMin = nominal + shaftDev.ei;

    const maxClearance = holeMax - shaftMin;
    const minClearance = holeMin - shaftMax;

    let fitType = "Clearance Fit (Lắp lỏng)";
    let fitClass = "green";

    if (minClearance >= 0) {
        fitType = "LẮP LỎNG";
        fitClass = "green";
    } else if (maxClearance <= 0) {
        fitType = "LẮP DÔI";
        fitClass = "red";
    } else {
        fitType = "LẮP TRUNG GIAN";
        fitClass = "orange";
    }

    return {
        nominal,
        hole: { letter: holeLetter, it: holeIT, ES: holeDev.ES, EI: holeDev.EI, max: holeMax, min: holeMin, IT: hITVal },
        shaft: { letter: shaftLetter, it: shaftIT, es: shaftDev.es, ei: shaftDev.ei, max: shaftMax, min: shaftMin, IT: sITVal },
        fitType, fitClass, maxClearance, minClearance,
        maxInterference: Math.abs(minClearance), minInterference: Math.abs(maxClearance)
    };
}

function switchIsoTab(panelId) {
    document.querySelectorAll('.iso-tab-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.iso-panel-body').forEach(p => p.classList.remove('active'));

    document.querySelector(`[onclick="switchIsoTab('${panelId}')"]`).classList.add('active');
    document.getElementById(panelId).classList.add('active');
}

function initShaftPanel() {
    const box = document.getElementById('shaftGridBox');
    if (!box) return;
    box.innerHTML = '';
    SHAFT_CLASSES.forEach(cls => {
        const btn = document.createElement('button');
        let type = 'std';
        if (PREFERRED_SHAFTS.includes(cls)) type = 'pref';
        else if (COMMON_SHAFTS.includes(cls)) type = 'comm';

        btn.className = `class-btn ${type} ${cls === selectedShaftClass ? 'active' : ''}`;
        btn.innerText = cls;
        btn.onclick = () => {
            selectedShaftClass = cls;
            box.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
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

    document.getElementById('shaftSelectedTitle').innerText = selectedShaftClass;
    document.getElementById('shaftEsTxt').innerText = fmt(dev.es || dev.ES, 3, true);
    document.getElementById('shaftEiTxt').innerText = fmt(dev.ei || dev.EI, 3, true);
    document.getElementById('shaftItTxt').innerText = fmt(itVal, 3);
    document.getElementById('shaftMaxTxt').innerText = fmt(nominal + (dev.es || dev.ES), 3);
    document.getElementById('shaftMinTxt').innerText = fmt(nominal + (dev.ei || dev.EI), 3);
}

function initHolePanel() {
    const box = document.getElementById('holeGridBox');
    if (!box) return;
    box.innerHTML = '';
    HOLE_CLASSES.forEach(cls => {
        const btn = document.createElement('button');
        let type = 'std';
        if (PREFERRED_HOLES.includes(cls)) type = 'pref';
        else if (COMMON_HOLES.includes(cls)) type = 'comm';

        btn.className = `class-btn ${type} ${cls === selectedHoleClass ? 'active' : ''}`;
        btn.innerText = cls;
        btn.onclick = () => {
            selectedHoleClass = cls;
            box.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
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
    const dev = getFundamentalDeviation(m[1], nominal, itVal, parseInt(m[2]));

    document.getElementById('holeSelectedTitle').innerText = selectedHoleClass;
    document.getElementById('holeEsTxt').innerText = fmt(dev.ES || dev.es, 3, true);
    document.getElementById('holeEiTxt').innerText = fmt(dev.EI || dev.ei, 3, true);
    document.getElementById('holeItTxt').innerText = fmt(itVal, 3);
    document.getElementById('holeMaxTxt').innerText = fmt(nominal + (dev.ES || dev.es), 3);
    document.getElementById('holeMinTxt').innerText = fmt(nominal + (dev.EI || dev.ei), 3);
}

function initHoleSysPanel() {
    const table = document.getElementById('holeSysFitTable');
    if (!table) return;
    let html = `<thead><tr><th>Hole</th><th colspan="17">Matching Shaft Fits</th></tr></thead><tbody>`;

    HOLE_SYS_MATRIX.forEach(row => {
        html += `<tr><th>${row.hole}</th><td style="text-align: left;">`;
        row.shafts.forEach(s => {
            const m = s.match(/^([a-z]+)(\d+)$/i);
            const letter = m[1].toLowerCase();
            let cls = "tag-clearance";
            if (['js','k','m'].includes(letter)) cls = "tag-transition";
            else if (['n','p','r','s','t','u','v','x','y','z'].includes(letter)) cls = "tag-interference";

            const active = (selectedHoleSysPair.hole === row.hole && selectedHoleSysPair.shaft === s) ? 'active' : '';
            html += `<span class="cell-tag ${cls} ${active}" onclick="selectHoleSysPair('${row.hole}', '${s}', this)">${row.hole}/${s}</span> `;
        });
        html += `</td></tr>`;
    });
    html += `</tbody>`;
    table.innerHTML = html;
    updateHoleSysPanel();
}

function selectHoleSysPair(hole, shaft, el) {
    selectedHoleSysPair = { hole, shaft };
    document.querySelectorAll('#holeSysFitTable .cell-tag').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    updateHoleSysPanel();
}

function updateHoleSysPanel() {
    const nominal = parseFloat(document.getElementById('holeSysNominalInput').value) || 100;
    const hMatch = selectedHoleSysPair.hole.match(/^([a-z]+)(\d+)$/i);
    const sMatch = selectedHoleSysPair.shaft.match(/^([a-z]+)(\d+)$/i);

    const fit = computeFit(nominal, hMatch[1], hMatch[2], sMatch[1], sMatch[2]);

    document.getElementById('holeSysFvcNominal').innerText = nominal;
    document.getElementById('holeSysFvcHoleClass').innerText = selectedHoleSysPair.hole;
    document.getElementById('holeSysFvcHoleES').innerText = fmt(fit.hole.ES, 3, true);
    document.getElementById('holeSysFvcHoleEI').innerText = fmt(fit.hole.EI, 3, true);

    document.getElementById('holeSysFvcShaftClass').innerText = selectedHoleSysPair.shaft;
    document.getElementById('holeSysFvcShaftEs').innerText = fmt(fit.shaft.es, 3, true);
    document.getElementById('holeSysFvcShaftEi').innerText = fmt(fit.shaft.ei, 3, true);

    const fitTypeBadge = document.getElementById('holeSysFitType');
    fitTypeBadge.innerText = fit.fitType;
    fitTypeBadge.className = `fit-type-badge ${fit.fitClass}`;

    let infoHtml = '';
    if (fit.fitClass === 'green') {
        infoHtml = `S_max = ${fmt(fit.maxClearance)}<br>S_min = ${fmt(fit.minClearance)}`;
    } else if (fit.fitClass === 'red') {
        infoHtml = `N_max = ${fmt(fit.maxInterference)}<br>N_min = ${fmt(fit.minInterference)}`;
    } else {
        infoHtml = `S_max = ${fmt(fit.maxClearance)}<br>N_max = ${fmt(fit.maxInterference)}`;
    }
    document.getElementById('holeSysClearanceInfo').innerHTML = infoHtml;
    
    // Add App Info
    if (typeof getFitApplicationHtml === 'function') {
        const appInfoEl = document.getElementById('holeSysAppInfo');
        if (appInfoEl) {
            appInfoEl.innerHTML = getFitApplicationHtml(selectedHoleSysPair.hole, selectedHoleSysPair.shaft);
            appInfoEl.style.display = 'block';
        }
    }

    renderFitChart(fit, 'holeSysSvgHoleRect', 'holeSysSvgHoleLabel', 'holeSysSvgShaftRect', 'holeSysSvgShaftLabel');
}

function initShaftSysPanel() {
    const table = document.getElementById('shaftSysFitTable');
    if (!table) return;
    let html = `<thead><tr><th>Shaft</th><th colspan="17">Matching Hole Fits</th></tr></thead><tbody>`;

    SHAFT_SYS_MATRIX.forEach(row => {
        html += `<tr><th>${row.shaft}</th><td style="text-align: left;">`;
        row.holes.forEach(h => {
            const m = h.match(/^([a-z]+)(\d+)$/i);
            const letter = m[1].toUpperCase();
            let cls = "tag-clearance";
            if (['JS','K','M'].includes(letter)) cls = "tag-transition";
            else if (['N','P','R','S','T','U','V','X','Y','Z'].includes(letter)) cls = "tag-interference";

            const active = (selectedShaftSysPair.shaft === row.shaft && selectedShaftSysPair.hole === h) ? 'active' : '';
            html += `<span class="cell-tag ${cls} ${active}" onclick="selectShaftSysPair('${row.shaft}', '${h}', this)">${h}/${row.shaft}</span> `;
        });
        html += `</td></tr>`;
    });
    html += `</tbody>`;
    table.innerHTML = html;
    updateShaftSysPanel();
}

function selectShaftSysPair(shaft, hole, el) {
    selectedShaftSysPair = { shaft, hole };
    document.querySelectorAll('#shaftSysFitTable .cell-tag').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    updateShaftSysPanel();
}

function updateShaftSysPanel() {
    const nominal = parseFloat(document.getElementById('shaftSysNominalInput').value) || 100;
    const hMatch = selectedShaftSysPair.hole.match(/^([a-z]+)(\d+)$/i);
    const sMatch = selectedShaftSysPair.shaft.match(/^([a-z]+)(\d+)$/i);

    const fit = computeFit(nominal, hMatch[1], hMatch[2], sMatch[1], sMatch[2]);

    document.getElementById('shaftSysFvcNominal').innerText = nominal;
    document.getElementById('shaftSysFvcHoleClass').innerText = selectedShaftSysPair.hole;
    document.getElementById('shaftSysFvcHoleES').innerText = fmt(fit.hole.ES, 3, true);
    document.getElementById('shaftSysFvcHoleEI').innerText = fmt(fit.hole.EI, 3, true);

    document.getElementById('shaftSysFvcShaftClass').innerText = selectedShaftSysPair.shaft;
    document.getElementById('shaftSysFvcShaftEs').innerText = fmt(fit.shaft.es, 3, true);
    document.getElementById('shaftSysFvcShaftEi').innerText = fmt(fit.shaft.ei, 3, true);

    const fitTypeBadge = document.getElementById('shaftSysFitType');
    fitTypeBadge.innerText = fit.fitType;
    fitTypeBadge.className = `fit-type-badge ${fit.fitClass}`;

    let infoHtml = '';
    if (fit.fitClass === 'green') {
        infoHtml = `S_max = ${fmt(fit.maxClearance)}<br>S_min = ${fmt(fit.minClearance)}`;
    } else if (fit.fitClass === 'red') {
        infoHtml = `N_max = ${fmt(fit.maxInterference)}<br>N_min = ${fmt(fit.minInterference)}`;
    } else {
        infoHtml = `S_max = ${fmt(fit.maxClearance)}<br>N_max = ${fmt(fit.maxInterference)}`;
    }
    document.getElementById('shaftSysClearanceInfo').innerHTML = infoHtml;

    // Add App Info
    if (typeof getFitApplicationHtml === 'function') {
        const appInfoEl = document.getElementById('shaftSysAppInfo');
        if (appInfoEl) {
            appInfoEl.innerHTML = getFitApplicationHtml(selectedShaftSysPair.hole, selectedShaftSysPair.shaft);
            appInfoEl.style.display = 'block';
        }
    }

    renderFitChart(fit, 'shaftSysSvgHoleRect', 'shaftSysSvgHoleLabel', 'shaftSysSvgShaftRect', 'shaftSysSvgShaftLabel');
}

function renderFitChart(fit, holeRectId, holeLblId, shaftRectId, shaftLblId) {
    const zeroY = 110;
    const scale = 800;

    const hY = zeroY - (fit.hole.ES * scale);
    const hHeight = Math.max((fit.hole.ES - fit.hole.EI) * scale, 12);

    const holeRect = document.getElementById(holeRectId);
    if (holeRect) {
        holeRect.setAttribute('y', hY);
        holeRect.setAttribute('height', hHeight);
        const lbl = document.getElementById(holeLblId);
        lbl.innerText = `Lỗ (${fit.hole.letter}${fit.hole.it})`;
        lbl.setAttribute('y', Math.min(hY - 10, 90));
    }

    const sY = zeroY - (fit.shaft.es * scale);
    const sHeight = Math.max((fit.shaft.es - fit.shaft.ei) * scale, 12);

    const shaftRect = document.getElementById(shaftRectId);
    if (shaftRect) {
        shaftRect.setAttribute('y', sY);
        shaftRect.setAttribute('height', sHeight);
        const lbl2 = document.getElementById(shaftLblId);
        lbl2.innerText = `Trục (${fit.shaft.letter}${fit.shaft.it})`;
        lbl2.setAttribute('y', Math.max(sY + sHeight + 20, 145));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initShaftPanel();
    initHolePanel();
    initHoleSysPanel();
    initShaftSysPanel();
});
