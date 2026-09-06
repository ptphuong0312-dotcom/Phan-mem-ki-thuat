


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
    const holeRect = document.getElementById(holeRectId);
    const shaftRect = document.getElementById(shaftRectId);
    const holeLbl = document.getElementById(holeLblId);
    const shaftLbl = document.getElementById(shaftLblId);
    if (!holeRect || !shaftRect) return;

    const zeroY = 110;
    
    // Find absolute max distances from zero
    const maxUp = Math.max(fit.hole.ES, fit.shaft.es, 0);
    const maxDown = Math.max(-fit.hole.EI, -fit.shaft.ei, 0);
    
    // We have about 90 pixels above and 90 pixels below zeroY available in the 220px tall SVG
    const scaleUp = maxUp > 0 ? 80 / maxUp : 5000;
    const scaleDown = maxDown > 0 ? 80 / maxDown : 5000;
    
    // Use the smaller scale to ensure both fit
    let scale = Math.min(scaleUp, scaleDown);
    scale = Math.min(Math.max(scale, 1), 5000);

    const hY = zeroY - (fit.hole.ES * scale);
    const hHeight = Math.max((fit.hole.ES - fit.hole.EI) * scale, 8);

    holeRect.setAttribute('y', hY);
    holeRect.setAttribute('height', hHeight);
    
    // Move rectangles closer together for a tighter chart
    holeRect.setAttribute('x', 60);
    holeRect.setAttribute('width', 60);
    
    if (holeLbl) {
        holeLbl.innerText = `Lỗ (${fit.hole.letter}${fit.hole.it})`;
        holeLbl.setAttribute('x', 90);
        holeLbl.setAttribute('y', Math.max(20, hY - 8));
    }

    const sY = zeroY - (fit.shaft.es * scale);
    const sHeight = Math.max((fit.shaft.es - fit.shaft.ei) * scale, 8);

    shaftRect.setAttribute('y', sY);
    shaftRect.setAttribute('height', sHeight);
    
    shaftRect.setAttribute('x', 140);
    shaftRect.setAttribute('width', 60);
    
    if (shaftLbl) {
        shaftLbl.innerText = `Trục (${fit.shaft.letter}${fit.shaft.it})`;
        shaftLbl.setAttribute('x', 170);
        shaftLbl.setAttribute('y', Math.min(200, sY + sHeight + 15));
    }
}

function initCalcSysTables() {
    const holeTable = document.getElementById('calcHoleSysFitTable');
    if (holeTable && typeof HOLE_SYS_MATRIX !== 'undefined') {
        let html = `<thead><tr><th>Lỗ</th><th colspan="17">Lắp Ghép Trục Phù Hợp</th></tr></thead><tbody>`;
        HOLE_SYS_MATRIX.forEach(row => {
            html += `<tr><th>${row.hole}</th><td style="text-align: left;">`;
            row.shafts.forEach(s => {
                const m = s.match(/^([a-z]+)(\d+)$/i);
                if(m) {
                    const letter = m[1].toLowerCase();
                    let cls = "iso-tag-clearance";
                    if (['js','k','m'].includes(letter)) cls = "iso-tag-transition";
                    else if (['n','p','r','s','t','u','v','x','y','z'].includes(letter)) cls = "iso-tag-interference";
                    html += `<span class="iso-cell-tag ${cls}" onclick="selectCalcFitPair('${row.hole}', '${s}', this)">${row.hole}/${s}</span> `;
                }
            });
            html += `</td></tr>`;
        });
        html += `</tbody>`;
        holeTable.innerHTML = html;
    }

    const shaftTable = document.getElementById('calcShaftSysFitTable');
    if (shaftTable && typeof SHAFT_SYS_MATRIX !== 'undefined') {
        let html = `<thead><tr><th>Trục</th><th colspan="17">Lắp Ghép Lỗ Phù Hợp</th></tr></thead><tbody>`;
        SHAFT_SYS_MATRIX.forEach(row => {
            html += `<tr><th>${row.shaft}</th><td style="text-align: left;">`;
            row.holes.forEach(h => {
                const m = h.match(/^([a-z]+)(\d+)$/i);
                if(m) {
                    const letter = m[1].toUpperCase();
                    let cls = "iso-tag-clearance";
                    if (['JS','K','M'].includes(letter)) cls = "iso-tag-transition";
                    else if (['N','P','R','S','T','U','V','X','Y','Z'].includes(letter)) cls = "iso-tag-interference";
                    html += `<span class="iso-cell-tag ${cls}" onclick="selectCalcFitPair('${h}', '${row.shaft}', this)">${h}/${row.shaft}</span> `;
                }
            });
            html += `</td></tr>`;
        });
        html += `</tbody>`;
        shaftTable.innerHTML = html;
    }
}

window.selectCalcFitPair = function(hole, shaft, el) {
    document.querySelectorAll('#calcMatrixTables .iso-cell-tag').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    const hMatch = hole.match(/^([a-zA-Z]+)(\d+)$/);
    const sMatch = shaft.match(/^([a-zA-Z]+)(\d+)$/);
    if (hMatch && sMatch) {
        document.getElementById('calcHoleLetter').value = hMatch[1].toUpperCase();
        document.getElementById('calcHoleIT').value = hMatch[2];
        document.getElementById('calcShaftLetter').value = sMatch[1].toLowerCase();
        document.getElementById('calcShaftIT').value = sMatch[2];
        if (typeof window.runIsoCalcV2 === 'function') {
            window.runIsoCalcV2();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initShaftPanel();
    initHolePanel();
    initHoleSysPanel();
    initShaftSysPanel();
    if (typeof initCalcSysTables === 'function') initCalcSysTables();
});
