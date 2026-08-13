// ==============================================================================
// ISO 286 Calculator V2 - Pure Mathematical Engine
// Independent module for calculating precise ISO tolerances (up to 3150mm)
// ==============================================================================

const IsoCalcV2 = (function() {
    
    // Step 2: 21 standard size ranges up to 3150mm
    const SIZE_RANGES = [
        [0, 3], [3, 6], [6, 10], [10, 18], [18, 30], [30, 50], [50, 80],
        [80, 120], [120, 180], [180, 250], [250, 315], [315, 400], [400, 500],
        [500, 630], [630, 800], [800, 1000], [1000, 1250], [1250, 1600],
        [1600, 2000], [2000, 2500], [2500, 3150]
    ];

    function getD(size) {
        if (size <= 0) return Math.sqrt(1 * 3);
        for (let i = 0; i < SIZE_RANGES.length; i++) {
            if (size > SIZE_RANGES[i][0] && size <= SIZE_RANGES[i][1]) {
                if (SIZE_RANGES[i][0] === 0) return Math.sqrt(1 * 3);
                return Math.sqrt(SIZE_RANGES[i][0] * SIZE_RANGES[i][1]);
            }
        }
        return Math.sqrt(2500 * 3150);
    }
    
    function getSizeIndex(size) {
        for (let i = 0; i < SIZE_RANGES.length; i++) {
            if (size > SIZE_RANGES[i][0] && size <= SIZE_RANGES[i][1]) return i;
        }
        return SIZE_RANGES.length - 1;
    }

    // Step 3: IT Matrix using mathematical formulas
    // To be perfectly standards-compliant, some values below 500mm are hardcoded
    const IT_TABLE_UP_TO_500 = {
        1: [0.8, 1, 1, 1.2, 1.5, 1.5, 2, 2.5, 3.5, 4.5, 6, 7, 8],
        2: [1.2, 1.5, 1.5, 2, 2.5, 2.5, 3, 4, 5, 7, 8, 9, 10],
        3: [2, 2.5, 2.5, 3, 4, 4, 5, 6, 8, 10, 12, 13, 15],
        4: [3, 4, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20],
        5: [4, 5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
        6: [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
        7: [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
        8: [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
        9: [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
        10: [40, 48, 58, 70, 84, 100, 120, 140, 160, 185, 210, 230, 250],
        11: [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400],
        12: [100, 120, 150, 180, 210, 250, 300, 350, 400, 460, 520, 570, 630],
        13: [140, 180, 220, 270, 330, 390, 460, 540, 630, 720, 810, 890, 970],
        14: [250, 300, 360, 430, 520, 620, 740, 870, 1000, 1150, 1300, 1400, 1550],
        15: [400, 480, 580, 700, 840, 1000, 1200, 1400, 1600, 1850, 2100, 2300, 2500],
        16: [600, 750, 900, 1100, 1300, 1600, 1900, 2200, 2500, 2900, 3200, 3600, 4000],
        17: [1000, 1200, 1500, 1800, 2100, 2500, 3000, 3500, 4000, 4600, 5200, 5700, 6300],
        18: [1400, 1800, 2200, 2700, 3300, 3900, 4600, 5400, 6300, 7200, 8100, 8900, 9700]
    };

    function getIT(grade, size) {
        let idx = getSizeIndex(size);
        if (idx < 13 && IT_TABLE_UP_TO_500[grade]) {
            return IT_TABLE_UP_TO_500[grade][idx]; // returns in um
        }
        
        let D = getD(size);
        let I = (D <= 500) ? (0.45 * Math.pow(D, 1/3) + 0.001 * D) : (0.004 * D + 2.1);
        let val = 0;
        if (grade === 1) val = 0.8 + 0.020 * D;
        else if (grade === 2) val = (0.8 + 0.020 * D) * 1.58; 
        else if (grade === 3) val = (0.8 + 0.020 * D) * 2.5; 
        else if (grade === 4) val = (0.8 + 0.020 * D) * 4; 
        else if (grade === 5) val = 7 * I;
        else if (grade === 6) val = 10 * I;
        else if (grade === 7) val = 16 * I;
        else if (grade === 8) val = 25 * I;
        else if (grade === 9) val = 40 * I;
        else if (grade === 10) val = 64 * I;
        else if (grade === 11) val = 100 * I;
        else if (grade === 12) val = 160 * I;
        else if (grade === 13) val = 250 * I;
        else if (grade === 14) val = 400 * I;
        else if (grade === 15) val = 640 * I;
        else if (grade === 16) val = 1000 * I;
        else if (grade === 17) val = 1600 * I;
        else if (grade === 18) val = 2500 * I;
        else val = 16 * I;
        
        return Math.round(val);
    }

    // Step 4: Fundamental Deviations (Master Data for exceptions up to 500)
    // Values that don't fit the pure formula mathematically perfectly (rounded specially in ISO)
    const DEV_TABLE_UP_TO_500 = {
        'a': [-270, -270, -280, -290, -300, -320, -360, -410, -580, -820, -1050, -1350, -1650],
        'b': [-140, -140, -150, -150, -160, -180, -200, -240, -310, -420, -540, -680, -840],
        'c': [-60, -70, -80, -95, -110, -130, -150, -180, -230, -280, -330, -400, -480],
        'cd': [-32, -46, -56, -95, -110, -130, -150, -180, -230, -280, -330, -400, -480],
        'd': [-20, -30, -40, -50, -65, -80, -100, -120, -145, -170, -190, -210, -230],
        'e': [-14, -20, -25, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135],
        'ef': [-10, -14, -18, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135],
        'f': [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
        'fg': [-4, -6, -8, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
        'g': [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20],
        'h': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'j': [-4, -4, -5, -6, -8, -10, -12, -15, -18, -21, -26, -28, -32],
        'k': [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5],
        'm': [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23],
        'n': [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40],
        'p': [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68],
        'r': [10, 15, 19, 23, 28, 34, 43, 54, 68, 84, 98, 114, 132],
        's': [14, 19, 23, 28, 35, 43, 59, 79, 108, 140, 170, 208, 252],
        't': [18, 23, 28, 33, 41, 54, 75, 104, 146, 196, 240, 294, 360],
        'u': [18, 23, 28, 33, 48, 70, 102, 144, 210, 284, 350, 435, 540],
        'v': [20, 28, 34, 39, 55, 81, 120, 172, 252, 340, 425, 530, 660],
        'x': [20, 28, 34, 45, 64, 97, 146, 210, 310, 425, 525, 660, 820],
        'y': [null, null, null, null, 75, 114, 174, 254, 380, 520, 650, 820, 1000],
        'z': [null, null, null, null, 88, 136, 210, 310, 465, 640, 790, 1000, 1250],
        'za': [null, null, null, null, null, null, null, null, null, null, 1000, 1300, 1600],
        'zb': [null, null, null, null, null, null, null, null, null, null, 1300, 1650, 2100],
        'zc': [null, null, null, null, null, null, null, null, null, null, 1700, 2100, 2600]
    };

    function getShaftFundamentalDeviation(letter, size, itGrade) {
        let l = letter.toLowerCase();
        let idx = getSizeIndex(size);
        
        if (l === 'js') return 0; // handled special
        
        if (idx < 13 && DEV_TABLE_UP_TO_500[l] !== undefined) {
            let val = DEV_TABLE_UP_TO_500[l][idx];
            if (val === null) return null;
            return val;
        }
        
        // For > 500mm
        let D = getD(size);
        let devUm = null;
        if (l === 'd') devUm = -16 * Math.pow(D, 0.44);
        else if (l === 'e') devUm = -11 * Math.pow(D, 0.41);
        else if (l === 'f') devUm = -5.5 * Math.pow(D, 0.41);
        else if (l === 'g') devUm = -2.5 * Math.pow(D, 0.34);
        else if (l === 'h') devUm = 0;
        
        if (devUm !== null) return Math.round(devUm);
        return null;
    }

    function getDelta(letter, itGrade, size) {
        let l = letter.toUpperCase();
        let idx = getSizeIndex(size);
        
        if (itGrade >= 3 && itGrade <= 8 && idx < 13) {
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
            if (['K','M','N'].includes(l) && itGrade <= 8) applies = true;
            if (['P','R','S','T','U','V','X','Y','Z','ZA','ZB','ZC'].includes(l) && itGrade <= 7) applies = true;
            
            if (applies) {
                return DELTA_VALUES[idx][itGrade - 3];
            }
        }
        return 0;
    }

    function fmt(val, decimals = 3) {
        if (val === null || val === undefined) return "N/A";
        return val.toFixed(decimals).replace(/\.?0+$/, "");
    }

    // Visual Diagram logic
    function drawDiagram(canvasId, result) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        if (!result) return;

        // Determine min/max Y to fit on screen
        let minUm = -100;
        let maxUm = 100;
        
        if (result.hole) {
            minUm = Math.min(minUm, result.hole.EI);
            maxUm = Math.max(maxUm, result.hole.ES);
        }
        if (result.shaft) {
            minUm = Math.min(minUm, result.shaft.ei);
            maxUm = Math.max(maxUm, result.shaft.es);
        }
        
        const padding = (maxUm - minUm) * 0.2 || 50;
        minUm -= padding;
        maxUm += padding;

        function getY(val) {
            return H - ((val - minUm) / (maxUm - minUm)) * H;
        }

        // Draw Zero line
        ctx.beginPath();
        ctx.moveTo(0, getY(0));
        ctx.lineTo(W, getY(0));
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.fillText("0 (Danh nghĩa)", 10, getY(0) - 5);

        // Draw Hole
        if (result.hole) {
            const hTop = getY(result.hole.ES);
            const hBot = getY(result.hole.EI);
            const hH = hBot - hTop;
            
            ctx.fillStyle = "rgba(59, 130, 246, 0.4)"; // Blue-500 with opacity
            ctx.strokeStyle = "rgb(59, 130, 246)";
            ctx.lineWidth = 2;
            ctx.fillRect(W * 0.15, hTop, W * 0.3, hH);
            ctx.strokeRect(W * 0.15, hTop, W * 0.3, hH);
            
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(result.hole.letter + result.hole.it, W * 0.3, hTop - 10);
        }

        // Draw Shaft
        if (result.shaft) {
            const sTop = getY(result.shaft.es);
            const sBot = getY(result.shaft.ei);
            const sH = sBot - sTop;
            
            ctx.fillStyle = "rgba(239, 68, 68, 0.4)"; // Red-500 with opacity
            ctx.strokeStyle = "rgb(239, 68, 68)";
            ctx.lineWidth = 2;
            ctx.fillRect(W * 0.55, sTop, W * 0.3, sH);
            ctx.strokeRect(W * 0.55, sTop, W * 0.3, sH);
            
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(result.shaft.letter + result.shaft.it, W * 0.7, sTop - 10);
        }
    }

    // Pipeline Step 1-7 Runner
    return {
        // Parse "30H7/g6", "50h6", "100 H7"
        parseInput: function(str) {
            let m = str.trim().match(/^(\d+(?:\.\d+)?)\s*([A-Za-z]+)(\d+)(?:\s*\/\s*([A-Za-z]+)(\d+))?$/);
            if (!m) return null;
            let size = parseFloat(m[1]);
            if (size <= 0 || size > 3150) return null; // out of range
            
            let isFit = m[4] !== undefined;
            let p1 = m[2];
            let g1 = parseInt(m[3]);
            
            if (isFit) {
                let p2 = m[4];
                let g2 = parseInt(m[5]);
                let hole = (p1 === p1.toUpperCase()) ? { letter: p1, it: g1 } : { letter: p2, it: g2 };
                let shaft = (p1 === p1.toLowerCase()) ? { letter: p1, it: g1 } : { letter: p2, it: g2 };
                return { mode: 'fit', size, hole, shaft };
            } else {
                let isHole = (p1 === p1.toUpperCase());
                return { mode: 'single', size, isHole, letter: p1, it: g1 };
            }
        },

        calculateTolerance: function(size, letter, itGrade) {
            let isHole = (letter === letter.toUpperCase());
            let l = letter.toLowerCase();
            let itVal = getIT(itGrade, size); // in um
            let fundDev = getShaftFundamentalDeviation(l, size, itGrade);
            
            if (fundDev === null && l !== 'js') return null; // Invalid combination

            let ES = 0, EI = 0, es = 0, ei = 0;

            if (isHole) {
                if (l === 'js') {
                    ES = itVal / 2.0;
                    EI = -itVal / 2.0;
                } else if (l === 'h') {
                    EI = 0;
                    ES = itVal;
                } else if (['a','b','c','cd','d','e','ef','f','fg','g'].includes(l)) {
                    EI = -fundDev;
                    ES = EI + itVal;
                } else {
                    let delta = getDelta(letter, itGrade, size);
                    if (['k', 'm', 'n'].includes(l) && itGrade >= 9) {
                        ES = 0;
                        EI = -itVal;
                    } else {
                        ES = -fundDev + delta;
                        EI = ES - itVal;
                    }
                }
                return { letter, it: itGrade, ES, EI, itVal, max: size + ES/1000, min: size + EI/1000 };
            } else {
                if (l === 'js') {
                    es = itVal / 2.0;
                    ei = -itVal / 2.0;
                } else if (['a','b','c','cd','d','e','ef','f','fg','g','h'].includes(l)) {
                    es = fundDev;
                    ei = es - itVal;
                } else {
                    if (l === 'k' && itGrade >= 4 && itGrade <= 7) {
                        es = itVal;
                        ei = 0;
                    } else {
                        ei = fundDev;
                        es = ei + itVal;
                    }
                }
                return { letter, it: itGrade, es, ei, itVal, max: size + es/1000, min: size + ei/1000 };
            }
        },

        calculateFit: function(size, holeLetter, holeIT, shaftLetter, shaftIT) {
            let hole = this.calculateTolerance(size, holeLetter, holeIT);
            let shaft = this.calculateTolerance(size, shaftLetter, shaftIT);

            if (!hole || !shaft) return null;

            let maxClearance = hole.max - shaft.min;
            let minClearance = hole.min - shaft.max;

            let type = "LẮP TRUNG GIAN (Transition Fit)";
            if (minClearance >= 0) type = "LẮP LỎNG (Clearance Fit)";
            else if (maxClearance <= 0) type = "LẮP DÔI (Interference Fit)";

            return { hole, shaft, maxClearance, minClearance, type };
        },
        
        drawDiagram: drawDiagram
    };
})();

// UI Binding
window.runIsoCalcV2 = function() {
    const size = parseFloat(document.getElementById('calcNominal').value);
    const hl = document.getElementById('calcHoleLetter').value;
    const hi = document.getElementById('calcHoleIT').value;
    const sl = document.getElementById('calcShaftLetter').value;
    const si = document.getElementById('calcShaftIT').value;
    
    const errObj = document.getElementById('calcErrorMsg');
    const outObj = document.getElementById('calcOutputArea');
    const titleObj = document.getElementById('calcResultTitle');
    const typeObj = document.getElementById('calcFitType');
    const gridObj = document.getElementById('calcGridRes');

    if (isNaN(size) || size <= 0 || size > 3150) {
        errObj.style.display = 'block';
        errObj.innerText = "Lỗi: Kích thước phải nằm trong khoảng 0.1mm - 3150mm.";
        outObj.style.display = 'none';
        return;
    }
    
    let parsed = null;
    let validHole = hl !== '-' && hi !== '-';
    let validShaft = sl !== '-' && si !== '-';
    
    if (validHole && validShaft) {
        parsed = { mode: 'fit', size, hole: { letter: hl, it: parseInt(hi) }, shaft: { letter: sl, it: parseInt(si) } };
    } else if (validHole) {
        parsed = { mode: 'single', size, isHole: true, letter: hl, it: parseInt(hi) };
    } else if (validShaft) {
        parsed = { mode: 'single', size, isHole: false, letter: sl, it: parseInt(si) };
    }

    if (!parsed) {
        errObj.style.display = 'block';
        errObj.innerText = "Lỗi: Vui lòng chọn ít nhất một Lỗ hoặc Trục hợp lệ.";
        outObj.style.display = 'none';
        return;
    }

    errObj.style.display = 'none';
    outObj.style.display = 'block';
    gridObj.innerHTML = '';
    typeObj.innerText = '';
    
    function makeCard(title, valStr, colorClass, highlight = false) {
        return `<div class="iso-res-item-card ${colorClass}">
            <div class="title-txt">${title}</div>
            <div class="value-txt ${highlight ? 'highlight-'+colorClass : ''}">${valStr}</div>
        </div>`;
    }
    
    function fmt(val, decimals = 3, sign = false) {
        if (val === null || val === undefined) return "N/A";
        let str = val.toFixed(decimals).replace(/\.?0+$/, "");
        if (str === "") str = "0";
        if (sign && val > 0) return "+" + str;
        return str;
    }

    let resultForDiagram = null;

    if (parsed.mode === 'single') {
        const res = IsoCalcV2.calculateTolerance(parsed.size, parsed.letter, parsed.it);
        if (!res) {
            titleObj.innerText = `Không áp dụng cho ${parsed.size}${parsed.letter}${parsed.it}`;
            IsoCalcV2.drawDiagram('calcDiagramCanvas', null);
            return;
        }
        
        titleObj.innerText = `Dung sai ${parsed.isHole ? 'Lỗ' : 'Trục'} - ${parsed.size}${parsed.letter}${parsed.it}`;
        
        let c = parsed.isHole ? 'cyan' : 'orange';
        let html = '';
        if (parsed.isHole) {
            html += makeCard('Sai lệch trên (ES)', fmt(res.ES, 3, true) + ' µm', c, true);
            html += makeCard('Sai lệch dưới (EI)', fmt(res.EI, 3, true) + ' µm', c, true);
        } else {
            html += makeCard('Sai lệch trên (es)', fmt(res.es, 3, true) + ' µm', c, true);
            html += makeCard('Sai lệch dưới (ei)', fmt(res.ei, 3, true) + ' µm', c, true);
        }
        html += makeCard('Dung sai (IT)', fmt(res.itVal, 3) + ' µm', c, true);
        html += makeCard('Kích thước Max', fmt(res.max, 4) + ' mm', '');
        html += makeCard('Kích thước Min', fmt(res.min, 4) + ' mm', '');
        
        gridObj.innerHTML = html;
        
        resultForDiagram = parsed.isHole ? { hole: res } : { shaft: res };
    } else {
        const fit = IsoCalcV2.calculateFit(parsed.size, parsed.hole.letter, parsed.hole.it, parsed.shaft.letter, parsed.shaft.it);
        if (!fit) {
            titleObj.innerText = `Không áp dụng cho ${parsed.size}${parsed.hole.letter}${parsed.hole.it}/${parsed.shaft.letter}${parsed.shaft.it}`;
            IsoCalcV2.drawDiagram('calcDiagramCanvas', null);
            return;
        }
        
        titleObj.innerText = `Lắp Ghép - ${parsed.size}${parsed.hole.letter}${parsed.hole.it}/${parsed.shaft.letter}${parsed.shaft.it}`;
        typeObj.innerText = fit.type;
        
        let html = '';
        // Hole cards
        html += makeCard('Lỗ (ES)', fmt(fit.hole.ES, 3, true) + ' µm', 'cyan', true);
        html += makeCard('Lỗ (EI)', fmt(fit.hole.EI, 3, true) + ' µm', 'cyan', true);
        html += makeCard('Lỗ Max', fmt(fit.hole.max, 4) + ' mm', '');
        html += makeCard('Lỗ Min', fmt(fit.hole.min, 4) + ' mm', '');
        
        // Shaft cards
        html += makeCard('Trục (es)', fmt(fit.shaft.es, 3, true) + ' µm', 'orange', true);
        html += makeCard('Trục (ei)', fmt(fit.shaft.ei, 3, true) + ' µm', 'orange', true);
        html += makeCard('Trục Max', fmt(fit.shaft.max, 4) + ' mm', '');
        html += makeCard('Trục Min', fmt(fit.shaft.min, 4) + ' mm', '');
        
        // Fit analysis
        html += makeCard('Smax / Nmax', fmt(fit.maxClearance * 1000, 3) + ' µm', 'green', true);
        html += makeCard('Smin / Nmin', fmt(fit.minClearance * 1000, 3) + ' µm', 'green', true);
        
        gridObj.innerHTML = html;
        resultForDiagram = fit;
    }

    IsoCalcV2.drawDiagram('calcDiagramCanvas', resultForDiagram);
};

// Initial render
setTimeout(() => {
    if (document.getElementById('calcInputStr') || document.getElementById('calcNominal')) {
        window.runIsoCalcV2();
    }
}, 500);
