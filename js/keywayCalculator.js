window.KeywayCalc = (function() {
    function findData(d) {
        if (!window.KEYWAY_DATA) return null;
        for (let row of window.KEYWAY_DATA) {
            if (d > row.min_d && d <= row.max_d) {
                return row;
            }
        }
        return null;
    }

    function calculate(d) {
        const data = findData(d);
        if (!data) return null;

        const b = data.b;
        
        // Key Tolerance (Always h9)
        const keyTol = window.IsoCalcV2.calculateTolerance(b, 'h', 9);
        
        // Fits (8 standard combinations)
        const fits = {
            trung_gian: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'N', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'JS', 9)
            },
            trung_gian_chat: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'N', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'N', 9)
            },
            trung_gian_de: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'N', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'H', 9)
            },
            long_truot: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'h', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'D', 10)
            },
            truot_chinh_xac: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'h', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'F', 8)
            },
            truot_rong: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'h', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'C', 11)
            },
            chat: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'P', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'P', 9)
            },
            chat_truc_de_moayo: {
                shaft: window.IsoCalcV2.calculateTolerance(b, 'P', 9),
                hole: window.IsoCalcV2.calculateTolerance(b, 'JS', 9)
            }
        };

        return {
            d, data, b, key: keyTol, fits
        };
    }

    return {
        calculate: calculate
    };
})();

// UI Glue Code
window.runKeywayCalc = function() {
    const dInput = document.getElementById('calcNominal');
    if (!dInput) return;
    
    const d = parseFloat(dInput.value);

    const emptyState = document.getElementById('kwEmptyState');
    const contentArea = document.getElementById('kwContentArea');
    const dRangeText = document.getElementById('kw_d_range');

    const updateDashboard = (data, d) => {
        const elBH = document.getElementById('dash_kw_bh');
        const elT1 = document.getElementById('dash_kw_t1');
        const elDM1 = document.getElementById('dash_kw_d_minus_t1');
        const elT2 = document.getElementById('dash_kw_t2');
        const elDP2 = document.getElementById('dash_kw_d_plus_t2');

        if (!data || !elBH) {
            if(elBH) elBH.textContent = '-';
            if(elT1) elT1.textContent = '-';
            if(elDM1) elDM1.textContent = '-';
            if(elT2) elT2.textContent = '-';
            if(elDP2) elDP2.textContent = '-';
            return;
        }

        elBH.textContent = `${data.b} x ${data.h} mm`;
        elT1.textContent = `${data.t1} mm`;
        elDM1.textContent = (d - data.t1).toFixed(2);
        elT2.textContent = `${data.t2} mm`;
        elDP2.textContent = (d + data.t2).toFixed(2);
    };

    if (isNaN(d) || d <= 6 || d > 500) {
        updateDashboard(null);
        if(emptyState) emptyState.style.display = 'block';
        if(contentArea) contentArea.style.display = 'none';
        return;
    }

    const result = window.KeywayCalc.calculate(d);
    if (!result) {
        updateDashboard(null);
        if(emptyState) emptyState.style.display = 'block';
        if(contentArea) contentArea.style.display = 'none';
        return;
    }

    updateDashboard(result.data, d);

    if(emptyState) emptyState.style.display = 'none';
    if(contentArea) contentArea.style.display = 'block';

    // Populate Data
    if(dRangeText) dRangeText.innerHTML = `Đường kính trục của bạn nằm trong khoảng: <span style="color:#38bdf8; font-weight:bold;">d > ${result.data.min_d} ÷ ${result.data.max_d} mm</span>. Dưới đây là kích thước then bằng tiêu chuẩn tương ứng (DIN 6885-1 / ISO 773):`;

    document.getElementById('kw_b').textContent = result.b + " mm";
    document.getElementById('kw_h').textContent = result.data.h + " mm";
    document.getElementById('kw_t1').textContent = result.data.t1 + " mm";
    document.getElementById('kw_t2').textContent = result.data.t2 + " mm";
    document.getElementById('kw_r').textContent = result.data.rmin.toFixed(2) + " ÷ " + result.data.rmax.toFixed(2) + " mm";

    const formatDev = (val) => {
        if (val === 0) return "+0";
        if (val > 0) return "+" + val;
        return val;
    };
    const formatDim = (nominal, dev) => {
        return (nominal + dev / 1000).toFixed(3);
    };

    const updateFitCard = (type, shaftTol, holeTol) => {
        const sDimEl = document.getElementById(`kw_${type}_shaft_dim`);
        const sDevEl = document.getElementById(`kw_${type}_shaft_dev`);
        const hDimEl = document.getElementById(`kw_${type}_hole_dim`);
        const hDevEl = document.getElementById(`kw_${type}_hole_dev`);

        if (!sDimEl || !sDevEl || !hDimEl || !hDevEl) return;

        if (!shaftTol || !holeTol) {
            sDimEl.textContent = "-";
            sDevEl.textContent = "-";
            hDimEl.textContent = "-";
            hDevEl.textContent = "-";
            return;
        }

        const sEI = shaftTol.EI !== undefined ? shaftTol.EI : shaftTol.ei;
        const sES = shaftTol.ES !== undefined ? shaftTol.ES : shaftTol.es;
        const hEI = holeTol.EI !== undefined ? holeTol.EI : holeTol.ei;
        const hES = holeTol.ES !== undefined ? holeTol.ES : holeTol.es;

        const sMin = formatDim(result.b, sEI);
        const sMax = formatDim(result.b, sES);
        const hMin = formatDim(result.b, hEI);
        const hMax = formatDim(result.b, hES);

        sDimEl.textContent = `${sMin} ÷ ${sMax} mm`;
        sDevEl.textContent = `(${formatDev(sEI)} / ${formatDev(sES)} µm)`;
        
        hDimEl.textContent = `${hMin} ÷ ${hMax} mm`;
        hDevEl.textContent = `(${formatDev(hEI)} / ${formatDev(hES)} µm)`;
    };

    updateFitCard('trung_gian', result.fits.trung_gian.shaft, result.fits.trung_gian.hole);
    updateFitCard('trung_gian_chat', result.fits.trung_gian_chat.shaft, result.fits.trung_gian_chat.hole);
    updateFitCard('trung_gian_de', result.fits.trung_gian_de.shaft, result.fits.trung_gian_de.hole);
    
    updateFitCard('long_truot', result.fits.long_truot.shaft, result.fits.long_truot.hole);
    updateFitCard('truot_chinh_xac', result.fits.truot_chinh_xac.shaft, result.fits.truot_chinh_xac.hole);
    updateFitCard('truot_rong', result.fits.truot_rong.shaft, result.fits.truot_rong.hole);
    
    updateFitCard('chat', result.fits.chat.shaft, result.fits.chat.hole);
    updateFitCard('chat_truc_de_moayo', result.fits.chat_truc_de_moayo.shaft, result.fits.chat_truc_de_moayo.hole);
};

// Initial run
window.addEventListener('DOMContentLoaded', () => {
    if(window.runKeywayCalc) window.runKeywayCalc();
});
