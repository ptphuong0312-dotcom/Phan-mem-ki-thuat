/**
 * BEARING CALCULATOR & INTERACTIVE LOOKUP ENGINE
 * 1. 2-way Search: Code lookup & Reverse Caliper lookup (d x D x B)
 * 2. ISO 5753-1 Clearance Finder (C2, CN, C3, C4, C5)
 * 3. 1-touch Fit recommendation linking to ISO 286 Module
 * 4. Adapter Sleeve (Măng xông) finder
 */

(function() {
    'use strict';

    let currentSelectedBearing = BEARING_DATABASE[19]; // Default 6208
    let currentFilterType = 'ALL';

    window.initBearingModule = function() {
        renderBearingList(BEARING_DATABASE);
        if (currentSelectedBearing) {
            selectBearing(currentSelectedBearing.code);
        }

        // Attach listeners
        const searchInput = document.getElementById('bearingSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const val = searchInput.value.trim().toLowerCase();
                const filtered = BEARING_DATABASE.filter(b => {
                    const matchType = currentFilterType === 'ALL' || b.type.includes(currentFilterType);
                    const matchText = b.code.toLowerCase().includes(val) || 
                                     b.type.toLowerCase().includes(val) ||
                                     `${b.d}x${b.D}x${b.B}`.includes(val);
                    return matchType && matchText;
                });
                renderBearingList(filtered);
            });
        }
    };

    window.filterBearingByType = function(typeKey, btnEl) {
        currentFilterType = typeKey;
        if (btnEl && btnEl.parentElement) {
            btnEl.parentElement.querySelectorAll('.gb-chip-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
        }

        const searchInput = document.getElementById('bearingSearchInput');
        const val = searchInput ? searchInput.value.trim().toLowerCase() : '';

        const filtered = BEARING_DATABASE.filter(b => {
            const matchType = currentFilterType === 'ALL' || b.type.includes(currentFilterType);
            const matchText = !val || b.code.toLowerCase().includes(val) || `${b.d}x${b.D}x${b.B}`.includes(val);
            return matchType && matchText;
        });

        renderBearingList(filtered);
    };

    window.reverseLookupBearing = function() {
        const in_d = parseFloat(document.getElementById('brgRev_d')?.value);
        const in_D = parseFloat(document.getElementById('brgRev_D')?.value);
        const in_B = parseFloat(document.getElementById('brgRev_B')?.value);

        if (isNaN(in_d) && isNaN(in_D) && isNaN(in_B)) {
            alert('Vui lòng nhập ít nhất 1 kích thước (Đường kính trong d, ngoài D hoặc bề rộng B)!');
            return;
        }

        const matches = BEARING_DATABASE.filter(b => {
            let match = true;
            if (!isNaN(in_d) && Math.abs(b.d - in_d) > 0.5) match = false;
            if (!isNaN(in_D) && Math.abs(b.D - in_D) > 1.0) match = false;
            if (!isNaN(in_B) && Math.abs(b.B - in_B) > 1.0) match = false;
            return match;
        });

        const resContainer = document.getElementById('brgRevResults');
        if (!resContainer) return;

        if (matches.length === 0) {
            resContainer.innerHTML = `
                <div style="padding: 16px; text-align: center; color: #94a3b8; background: #0f172a; border-radius: 8px; border: 1px dashed #334155;">
                    Không tìm thấy vòng bi tiêu chuẩn nào khớp kích thước: d=${in_d||'?'} × D=${in_D||'?'} × B=${in_B||'?'}.<br>
                    <span style="font-size: 11px; color: #64748b;">(Thử bỏ bớt điều kiện hoặc kiểm tra lại kích thước đo thước kẹp)</span>
                </div>`;
            return;
        }

        let html = `<div style="color: #38bdf8; font-weight: bold; font-size: 13px; margin-bottom: 8px;">Tìm thấy ${matches.length} vòng bi phù hợp:</div>`;
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px;">`;
        matches.forEach(b => {
            html += `
                <div onclick="selectBearing('${b.code}'); document.getElementById('bearingDetailCard')?.scrollIntoView({ behavior: 'smooth' });" style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='#334155'">
                    <div style="font-weight: bold; color: #f8fafc; font-size: 14px;">${b.code}</div>
                    <div style="color: #38bdf8; font-size: 12px; font-family: monospace;">⌀${b.d} × ⌀${b.D} × ${b.B} mm</div>
                    <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">${b.type.split('(')[0]}</div>
                </div>`;
        });
        html += `</div>`;
        resContainer.innerHTML = html;
    };

    function renderBearingList(list) {
        const container = document.getElementById('bearingListContainer');
        const countBadge = document.getElementById('bearingCountBadge');
        if (!container) return;

        if (countBadge) {
            countBadge.innerText = `${list.length} mã`;
        }

        if (list.length === 0) {
            container.innerHTML = `
                <div style="padding: 24px; text-align: center; color: #64748b; font-size: 13px;">
                    Không tìm thấy mã vòng bi phù hợp.
                </div>`;
            return;
        }

        let html = '';
        list.forEach(b => {
            const isSelected = currentSelectedBearing && currentSelectedBearing.code === b.code;
            html += `
                <div class="bearing-list-item ${isSelected ? 'active' : ''}" onclick="selectBearing('${b.code}')">
                    <div>
                        <div style="font-weight: 700; color: #f8fafc; font-size: 13px;">${b.code}</div>
                        <div style="color: #94a3b8; font-size: 11px; margin-top: 1px;">⌀${b.d} × ⌀${b.D} × ${b.B} mm</div>
                    </div>
                    <span style="font-size: 11px; font-weight: 600; color: #38bdf8; background: rgba(56,189,248,0.1); padding: 3px 8px; border-radius: 6px;">
                        C: ${b.C} kN
                    </span>
                </div>`;
        });
        container.innerHTML = html;
    }

    window.selectBearing = function(code) {
        const b = BEARING_DATABASE.find(item => item.code === code);
        if (!b) return;

        currentSelectedBearing = b;

        // Highlight in list
        document.querySelectorAll('.bearing-list-item').forEach(el => {
            const isMatch = el.querySelector('div')?.innerText.includes(code);
            el.classList.toggle('active', isMatch);
        });

        // Update Details Card
        const elCode = document.getElementById('brgDet_code');
        const elType = document.getElementById('brgDet_type');
        const elDim = document.getElementById('brgDet_dim');
        const elD = document.getElementById('brgDet_d');
        const elOuterD = document.getElementById('brgDet_D');
        const elB = document.getElementById('brgDet_B');
        const elC = document.getElementById('brgDet_C');
        const elC0 = document.getElementById('brgDet_C0');
        const elSpeedG = document.getElementById('brgDet_speedG');
        const elSpeedO = document.getElementById('brgDet_speedO');
        const elWt = document.getElementById('brgDet_weight');
        const elShaftFit = document.getElementById('brgDet_shaftFit');
        const elHousingFit = document.getElementById('brgDet_housingFit');

        if (elCode) elCode.innerText = b.code;
        if (elType) elType.innerText = b.type;
        if (elDim) elDim.innerText = `⌀${b.d} × ⌀${b.D} × ${b.B} mm`;
        if (elD) elD.innerText = `${b.d} mm`;
        if (elOuterD) elOuterD.innerText = `${b.D} mm`;
        if (elB) elB.innerText = `${b.B} mm`;
        if (elC) elC.innerText = `${b.C} kN`;
        if (elC0) elC0.innerText = `${b.C0} kN`;
        if (elSpeedG) elSpeedG.innerText = `${b.rpmG.toLocaleString()} rpm`;
        if (elSpeedO) elSpeedO.innerText = `${b.rpmO.toLocaleString()} rpm`;
        if (elWt) elWt.innerText = `${b.wt} kg`;
        if (elShaftFit) elShaftFit.innerText = b.shaftFit;
        if (elHousingFit) elHousingFit.innerText = b.housingFit;

        // Update ISO 5753-1 Clearance Grid
        renderClearanceTable(b);

        // Update Adapter Sleeve (Măng xông)
        renderAdapterSleeve(b);
    };

    function renderClearanceTable(b) {
        const container = document.getElementById('brgClearanceContainer');
        if (!container) return;

        let table = BALL_CLEARANCE_ISO5753;
        let isSpherical = b.type.includes('Tang Trống');
        if (isSpherical) {
            table = SPHERICAL_CLEARANCE_ISO5753;
        }

        const row = table.find(r => b.d >= r.dMin && b.d <= r.dMax) || table[table.length - 1];
        if (!row) {
            container.innerHTML = '<div style="color: #64748b; font-size: 12px;">Không có dữ liệu khe hở cho d này.</div>';
            return;
        }

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center;">
                <div style="background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                    <div style="color: #94a3b8; font-size: 11px; font-weight: bold;">C2 (Hẹp)</div>
                    <div style="color: #38bdf8; font-size: 14px; font-weight: bold; font-family: monospace; margin-top: 4px;">${row.c2[0]} ÷ ${row.c2[1]}</div>
                    <div style="color: #64748b; font-size: 10px;">µm</div>
                </div>
                <div style="background: #0f172a; border: 1px solid #38bdf8; border-radius: 8px; padding: 10px; box-shadow: 0 0 10px rgba(56,189,248,0.15);">
                    <div style="color: #38bdf8; font-size: 11px; font-weight: bold;">CN (Chuẩn)</div>
                    <div style="color: #f8fafc; font-size: 14px; font-weight: bold; font-family: monospace; margin-top: 4px;">${row.cn[0]} ÷ ${row.cn[1]}</div>
                    <div style="color: #38bdf8; font-size: 10px;">Bình thường</div>
                </div>
                <div style="background: #0f172a; border: 1px solid #f59e0b; border-radius: 8px; padding: 10px; box-shadow: 0 0 10px rgba(245,158,11,0.15);">
                    <div style="color: #f59e0b; font-size: 11px; font-weight: bold;">C3 (Lớn) ⭐</div>
                    <div style="color: #fbbf24; font-size: 14px; font-weight: bold; font-family: monospace; margin-top: 4px;">${row.c3[0]} ÷ ${row.c3[1]}</div>
                    <div style="color: #f59e0b; font-size: 10px;">Hộp số/Nhiệt</div>
                </div>
                <div style="background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                    <div style="color: #94a3b8; font-size: 11px; font-weight: bold;">C4 (Rất lớn)</div>
                    <div style="color: #f8fafc; font-size: 14px; font-weight: bold; font-family: monospace; margin-top: 4px;">${row.c4[0]} ÷ ${row.c4[1]}</div>
                    <div style="color: #64748b; font-size: 10px;">µm</div>
                </div>
                <div style="background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                    <div style="color: #94a3b8; font-size: 11px; font-weight: bold;">C5 (Cực lớn)</div>
                    <div style="color: #f8fafc; font-size: 14px; font-weight: bold; font-family: monospace; margin-top: 4px;">${row.c5[0]} ÷ ${row.c5[1]}</div>
                    <div style="color: #64748b; font-size: 10px;">µm</div>
                </div>
            </div>
            <div style="color: #94a3b8; font-size: 11px; margin-top: 8px; line-height: 1.4;">
                💡 <strong>Khuyến nghị xưởng:</strong> Với hộp số công nghiệp chạy liên tục hoặc ngỗng trục lắp chặt (k6, m6), <strong>bắt buộc chọn C3</strong> để bù trừ độ dãn nở nhiệt và tránh hiện tượng kẹt bi gây cháy ổ.
            </div>
        `;
    }

    function renderAdapterSleeve(b) {
        const sleeveBox = document.getElementById('brgSleeveBox');
        if (!sleeveBox) return;

        const codeK = `${b.code} K`;
        const sleeveInfo = ADAPTER_SLEEVES.find(s => s.bearing === codeK || s.bearing.startsWith(b.code));

        if (!sleeveInfo) {
            sleeveBox.style.display = 'none';
            return;
        }

        sleeveBox.style.display = 'block';
        sleeveBox.innerHTML = `
            <div style="background: rgba(249, 115, 22, 0.08); border: 1px solid #f97316; border-radius: 10px; padding: 14px; margin-top: 15px;">
                <div style="display: flex; align-items: center; gap: 8px; color: #f97316; font-weight: bold; font-size: 13px; margin-bottom: 8px;">
                    <span>🔩</span> Ống Lót Măng Xông Côn 1:12 Cho Bản Lỗ Côn (${codeK}):
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; font-size: 12px;">
                    <div><span style="color: #94a3b8;">Mã măng xông:</span> <strong style="color: #f8fafc;">${sleeveInfo.sleeve}</strong></div>
                    <div><span style="color: #94a3b8;">Đường kính trục:</span> <strong style="color: #38bdf8;">⌀${sleeveInfo.dShaft} mm</strong></div>
                    <div><span style="color: #94a3b8;">Ren đai ốc KM:</span> <strong style="color: #f8fafc;">${sleeveInfo.thread}</strong></div>
                    <div><span style="color: #94a3b8;">Đai ốc &amp; Long-đen:</span> <strong style="color: #10b981;">${sleeveInfo.nut} / ${sleeveInfo.washer}</strong></div>
                </div>
            </div>`;
    }

    window.jumpToIsoFit = function(dia, fitLetter, fitGrade) {
        if (!window.switchMainModule) return;
        window.switchMainModule('sectionTolerance');

        const nomInput = document.getElementById('calcNominal');
        const sLetter = document.getElementById('calcShaftLetter');
        const sGrade = document.getElementById('calcShaftGrade');
        const hLetter = document.getElementById('calcHoleLetter');
        const hGrade = document.getElementById('calcHoleGrade');

        if (nomInput && dia) nomInput.value = dia;
        if (sLetter && fitLetter) sLetter.value = fitLetter;
        if (sGrade && fitGrade) sGrade.value = fitGrade;
        if (hLetter) hLetter.value = 'H';
        if (hGrade) hGrade.value = '7';

        if (window.runIsoCalcV2) window.runIsoCalcV2();
        if (window.runKeywayCalc) window.runKeywayCalc();
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('sectionBearing')) {
            window.initBearingModule();
        }
    });

})();
