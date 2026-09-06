/**
 * GD&T UI CONTROLLER & INTERACTIVE FEATURE CONTROL FRAME (FCF) BUILDER
 * Manages symbol selection, interactive FCF rendering, and workshop inspection guides.
 */

(function() {
    'use strict';

    let currentGdt = GDT_DATABASE[0]; // Default Straightness

    window.initGdtModule = function() {
        renderGdtSymbolGrid(GDT_DATABASE);
        if (currentGdt) {
            selectGdtSymbol(currentGdt.id);
        }
    };

    window.filterGdtCategory = function(catKey, btnEl) {
        if (btnEl && btnEl.parentElement) {
            btnEl.parentElement.querySelectorAll('.gb-chip-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
        }

        let filtered = GDT_DATABASE;
        if (catKey !== 'ALL') {
            filtered = GDT_DATABASE.filter(item => item.category.includes(catKey));
        }
        renderGdtSymbolGrid(filtered);
    };

    function renderGdtSymbolGrid(list) {
        const container = document.getElementById('gdtSymbolGrid');
        if (!container) return;

        let html = '';
        list.forEach(item => {
            const isSelected = currentGdt && currentGdt.id === item.id;
            html += `
                <div class="gdt-symbol-card ${isSelected ? 'active' : ''}" onclick="selectGdtSymbol('${item.id}')">
                    <div class="gdt-card-icon">${item.symbol}</div>
                    <div class="gdt-card-text">
                        <div class="gdt-card-name">${item.nameVi}</div>
                        <div class="gdt-card-en">${item.nameEn}</div>
                    </div>
                </div>`;
        });
        container.innerHTML = html;
    }

    window.selectGdtSymbol = function(id) {
        const item = GDT_DATABASE.find(g => g.id === id);
        if (!item) return;

        currentGdt = item;

        // Highlight in cards
        document.querySelectorAll('.gdt-symbol-card').forEach(el => {
            el.classList.toggle('active', el.querySelector('.gdt-card-name')?.innerText === item.nameVi);
        });

        // Update Title & Category
        const elTitle = document.getElementById('gdtDetailTitle');
        const elCat = document.getElementById('gdtDetailCategory');
        const elZone = document.getElementById('gdtDetailZone');
        const elMethod = document.getElementById('gdtDetailMethod');
        const elApp = document.getElementById('gdtDetailApp');
        const elRule = document.getElementById('gdtDetailRule');

        if (elTitle) elTitle.innerHTML = `<span style="color: #38bdf8; font-size: 26px; margin-right: 8px;">${item.symbol}</span> ${item.nameVi} <span style="font-size: 13px; color: #94a3b8; font-weight: normal;">(${item.nameEn})</span>`;
        if (elCat) elCat.innerText = item.category;
        if (elZone) elZone.innerText = item.zoneDesc;
        if (elMethod) elMethod.innerText = item.workshopMethod;
        if (elApp) elApp.innerText = item.appExample;
        if (elRule) elRule.innerText = item.ruleIso;

        // Sync Builder Inputs
        const inSym = document.getElementById('fcfInput_sym');
        const inVal = document.getElementById('fcfInput_val');
        const inMod = document.getElementById('fcfInput_mod');
        const inA = document.getElementById('fcfInput_datumA');
        const inB = document.getElementById('fcfInput_datumB');
        const inC = document.getElementById('fcfInput_datumC');

        if (inSym) inSym.value = item.symbol;
        if (inVal) inVal.value = item.fcfDefault.val;
        if (inMod) inMod.value = item.fcfDefault.mod || '';
        if (inA) inA.value = item.fcfDefault.datumA || '';
        if (inB) inB.value = item.fcfDefault.datumB || '';
        if (inC) inC.value = item.fcfDefault.datumC || '';

        updateFeatureControlFrame();
    };

    window.updateFeatureControlFrame = function() {
        const sym = document.getElementById('fcfInput_sym')?.value || currentGdt.symbol;
        const val = document.getElementById('fcfInput_val')?.value || '0.02';
        const mod = document.getElementById('fcfInput_mod')?.value || '';
        const da = document.getElementById('fcfInput_datumA')?.value.trim() || '';
        const db = document.getElementById('fcfInput_datumB')?.value.trim() || '';
        const dc = document.getElementById('fcfInput_datumC')?.value.trim() || '';

        const frameBox = document.getElementById('fcfDisplayFrame');
        if (!frameBox) return;

        let html = `
            <div class="fcf-box">
                <div class="fcf-cell fcf-symbol">${sym}</div>
                <div class="fcf-cell fcf-tolerance">${val}${mod ? ' ' + mod : ''}</div>`;
        
        if (da) html += `<div class="fcf-cell fcf-datum">${da}</div>`;
        if (db) html += `<div class="fcf-cell fcf-datum">${db}</div>`;
        if (dc) html += `<div class="fcf-cell fcf-datum">${dc}</div>`;

        html += `</div>`;
        frameBox.innerHTML = html;
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('sectionGdt')) {
            window.initGdtModule();
        }
    });

})();
