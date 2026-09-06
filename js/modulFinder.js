/**
 * MODUL FINDER - TRA CỨU & XÁC ĐỊNH MODUL BÁNH RĂNG HIỆU CHỈNH
 * Phân tích bước răng đo thực tế (t) dựa trên 165 giá trị Modul chuẩn hóa (dải 25.4 - 0.2)
 */

(function(root) {
    'use strict';

    const MODULES = [
        25.4000, 25.2658, 25.0000, 24.2550, 24.0000, 23.8732, 23.2446, 22.2817, 22.2339, 22.0000, 
        21.2233, 20.6901, 20.3200, 20.2127, 20.0000, 19.2020, 19.0986, 18.1914, 18.0000, 17.5070, 
        17.1808, 16.9333, 16.1701, 16.0000, 15.9155, 15.1595, 15.0000, 14.5143, 14.3239, 14.1489, 
        14.0000, 13.1382, 13.0000, 12.7324, 12.7000, 12.1276, 12.0958, 12.0000, 11.6223, 11.4592, 
        11.2889, 11.1170, 11.0000, 10.8225, 10.6117, 10.1859, 10.1600, 10.1063, 10.0000, 9.6010, 
        9.5493, 9.2364, 9.0957, 9.0000, 8.9127, 8.5904, 8.4667, 8.2761, 8.0851, 8.0000, 
        7.9577, 7.8154, 7.6394, 7.5798, 7.2571, 7.0744, 7.0028, 7.0000, 6.7733, 6.5691, 
        6.3662, 6.3500, 6.0638, 6.0479, 6.0000, 5.7296, 5.6444, 5.5585, 5.5000, 5.4113, 
        5.0930, 5.0800, 5.0532, 5.0000, 4.7746, 4.6182, 4.5479, 4.5000, 4.4563, 4.2333, 
        4.1380, 4.0425, 4.0000, 3.9077, 3.8197, 3.6286, 3.5372, 3.5014, 3.5000, 3.1831, 
        3.1750, 3.0319, 3.0239, 3.0000, 2.8648, 2.8222, 2.7500, 2.7056, 2.5465, 2.5400, 
        2.5266, 2.5000, 2.3873, 2.3091, 2.2500, 2.2282, 2.1167, 2.0690, 2.0213, 2.0000, 
        1.9538, 1.9099, 1.8143, 1.7507, 1.7500, 1.6933, 1.5915, 1.5875, 1.5160, 1.5000, 
        1.4324, 1.4111, 1.2732, 1.2700, 1.2500, 1.1545, 1.1141, 1.1043, 1.0583, 1.0160, 
        1.0106, 1.0000, 0.9769, 0.9549, 0.9071, 0.8759, 0.8467, 0.8000, 0.7958, 0.7938, 
        0.7500, 0.7471, 0.7056, 0.6684, 0.6366, 0.6350, 0.5644, 0.5080, 0.5053, 0.5000, 
        0.4775, 0.4000, 0.3183, 0.3000, 0.2000
    ];

    const ALPHAS = [14.5, 15, 17.5, 20, 22.5, 25, 27.5, 30];

    const PRIORITY_MODULES = [
        0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 
        25.4, 16.9333, 12.7, 10.16, 8.4667, 6.35, 5.08, 4.2333, 3.175, 2.54, 2.1167, 
        1.5875, 1.27, 1.0583, 0.7938, 0.5292, 0.3969, 0.3528, 0.3175, 0.2646, 0.2117
    ];

    const STD_MODULES = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25];

    function isPriority(m) {
        return PRIORITY_MODULES.some(pm => Math.abs(pm - m) < 0.0005);
    }

    function findBestMatches(tMeasured) {
        let allMatches = [];
        const PI = Math.PI;

        MODULES.forEach(m => {
            ALPHAS.forEach(alpha => {
                const alphaRad = alpha * (PI / 180);
                const tCalculated = m * PI * Math.cos(alphaRad);
                const diff = Math.abs(tMeasured - tCalculated);
                const percentError = (diff / tMeasured) * 100;

                if (percentError < 15) { 
                    allMatches.push({
                        m: m,
                        alpha: alpha,
                        tCalculated: tCalculated,
                        diff: diff,
                        percentError: percentError,
                        isStd: STD_MODULES.some(sm => Math.abs(sm - m) < 0.0005),
                        isPriority: isPriority(m)
                    });
                }
            });
        });

        allMatches.sort((a, b) => a.percentError - b.percentError);
        return allMatches.slice(0, 20);
    }

    function getErrorConfig(error) {
        if (error < 0.2) {
            return {
                badge: 'Tuyệt vời',
                classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                glow: 'shadow-emerald-500/10',
                bar: 'bg-emerald-500',
                color: '#34d399'
            };
        }
        if (error < 1.0) {
            return {
                badge: 'Chấp nhận',
                classes: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                glow: 'shadow-amber-500/10',
                bar: 'bg-amber-500',
                color: '#fbbf24'
            };
        }
        return {
            badge: 'Độ lệch cao',
            classes: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
            glow: 'shadow-rose-500/10',
            bar: 'bg-rose-500',
            color: '#fb7185'
        };
    }

    function renderModulResults() {
        const tInput = document.getElementById('tInputModul');
        const resultsGrid = document.getElementById('resultsGridModul');
        const resultArea = document.getElementById('resultAreaModul');
        const emptyState = document.getElementById('emptyStateModul');

        if (!tInput || !resultsGrid) return;

        const val = parseFloat(tInput.value);
        if (isNaN(val) || val <= 0) {
            tInput.style.borderColor = '#f43f5e';
            tInput.focus();
            setTimeout(() => tInput.style.borderColor = '#334155', 1500);
            return;
        }

        const matches = findBestMatches(val);
        resultsGrid.innerHTML = '';

        if (matches.length === 0) {
            resultsGrid.innerHTML = `
                <div style="text-align: center; padding: 48px 20px; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b;">
                    <i class="fa-solid fa-circle-question" style="font-size: 32px; color: #64748b; margin-bottom: 12px;"></i>
                    <p style="color: #94a3b8; font-weight: 700; margin: 0;">Không tìm thấy Modul phù hợp trong dải sai số < 15%.</p>
                    <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Vui lòng kiểm tra lại độ chính xác của bước răng đo thực tế t.</p>
                </div>`;
        } else {
            matches.forEach((item, index) => {
                const config = getErrorConfig(item.percentError);
                const dp = 25.4 / item.m;
                const dpDisplay = Math.abs(dp - Math.round(dp)) < 0.005 ? Math.round(dp) : dp.toFixed(2);

                const card = document.createElement('div');
                card.style.cssText = 'background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; transition: all 0.2s;';
                card.onmouseenter = () => card.style.borderColor = '#38bdf8';
                card.onmouseleave = () => card.style.borderColor = '#1e293b';

                card.innerHTML = `
                    <div style="flex: 1; min-width: 180px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                            <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em;">Modul (m)</span>
                            ${item.isPriority ? '<span style="background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; font-size: 9px; padding: 2px 8px; border-radius: 9999px; font-weight: 800; text-transform: uppercase; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);">⭐ Khuyên dùng</span>' : ''}
                            ${item.isStd && !item.isPriority ? '<span style="background: #2563eb; color: #ffffff; font-size: 9px; padding: 2px 8px; border-radius: 9999px; font-weight: 800; text-transform: uppercase;">Chuẩn</span>' : ''}
                            <span style="background: #1e293b; color: #94a3b8; font-size: 9px; padding: 2px 8px; border-radius: 9999px; font-weight: 700; border: 1px solid #334155;">DP ${dpDisplay}</span>
                        </div>
                        <div style="font-size: 28px; font-weight: 900; color: #ffffff; font-family: monospace; letter-spacing: -0.02em;">
                            ${item.m.toFixed(4)}
                        </div>
                    </div>

                    <div style="flex: 1; min-width: 140px; padding: 0 16px; border-left: 1px solid #1e293b;">
                        <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Góc áp lực (α)</span>
                        <div style="display: flex; align-items: baseline; gap: 4px;">
                            <span style="font-size: 24px; font-weight: 800; color: #38bdf8; font-family: monospace;">${item.alpha}</span>
                            <span style="font-size: 16px; font-weight: 700; color: #64748b;">°</span>
                        </div>
                    </div>

                    <div style="flex: 1; min-width: 150px; padding: 0 16px; border-left: 1px solid #1e293b;">
                        <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em; display: block; margin-bottom: 4px; font-style: italic;">Bước tính (t_calc)</span>
                        <div style="font-size: 18px; font-weight: 700; color: #cbd5e1; font-family: monospace;">
                            ${item.tCalculated.toFixed(4)} <span style="font-size: 11px; color: #64748b;">mm</span>
                        </div>
                    </div>

                    <div style="flex: 1.2; min-width: 180px; padding-left: 16px; border-left: 1px solid #1e293b;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                            <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em;">Sai số</span>
                            <span style="font-size: 10px; font-weight: 800; color: ${config.color}; text-transform: uppercase; padding: 1px 6px; border-radius: 4px; background: rgba(15, 23, 42, 0.8); border: 1px solid ${config.color}33;">
                                ${config.badge}
                            </span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="flex: 1; height: 6px; background: #1e293b; border-radius: 9999px; overflow: hidden;">
                                <div style="height: 100%; width: ${Math.max(5, Math.min(100, (1 - item.percentError / 2) * 100))}%; background: ${config.color}; border-radius: 9999px; transition: width 0.6s ease;"></div>
                            </div>
                            <span style="font-size: 13px; font-weight: 800; font-family: monospace; color: ${config.color}; min-width: 60px; text-align: right;">
                                ${item.percentError.toFixed(3)}%
                            </span>
                        </div>
                    </div>
                `;
                resultsGrid.appendChild(card);
            });
        }

        if (emptyState) emptyState.style.display = 'none';
        if (resultArea) resultArea.style.display = 'block';

        if (window.innerWidth < 768 && resultArea) {
            setTimeout(() => {
                resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    root.findBestMatches = findBestMatches;
    root.renderModulResults = renderModulResults;

})(typeof window !== 'undefined' ? window : global);
