/**
 * GEAR RATIO PRO - BỘ TÍNH TOÁN TỈ SỐ TRUYỀN BÁNH RĂNG TỐI ƯU
 * Tìm tổ hợp cặp bánh răng (A/B) × (C/D) tối ưu theo tỉ số mục tiêu i
 */

(function(root) {
    'use strict';

    function solveGears() {
        const targetIInput = document.getElementById('targetI');
        const minTeethInput = document.getElementById('minTeeth');
        const maxTeethInput = document.getElementById('maxTeeth');
        const extraGearsInput = document.getElementById('extraGears');
        const btn = document.getElementById('btnCalculateGears');
        const resultBody = document.getElementById('resultBodyGears');
        const stats = document.getElementById('statsGears');

        if (!targetIInput || !minTeethInput || !maxTeethInput) return;

        const targetI = parseFloat(targetIInput.value);
        const minT = parseInt(minTeethInput.value);
        const maxT = parseInt(maxTeethInput.value);
        const extraGearsRaw = extraGearsInput ? extraGearsInput.value : '';

        // Kiểm tra dữ liệu đầu vào
        if (isNaN(targetI) || targetI <= 0) {
            alert('Vui lòng nhập tỉ số i hợp lệ lớn hơn 0 (ví dụ: 1.015867).');
            targetIInput.focus();
            return;
        }
        if (isNaN(minT) || isNaN(maxT) || minT >= maxT || minT < 5) {
            alert('Phạm vi số răng không hợp lệ (Răng tối thiểu phải nhỏ hơn Răng tối đa và >= 5).');
            minTeethInput.focus();
            return;
        }

        // Giao diện đang xử lý
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Đang tính toán tối ưu...</span>';
        }
        if (stats) {
            stats.innerText = 'Đang tính toán...';
            stats.className = 'text-xs font-bold text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full';
        }

        setTimeout(() => {
            // 1. Chuẩn bị kho bánh răng (Inventory)
            let gearInventory = {};
            for (let i = minT; i <= maxT; i++) {
                gearInventory[i] = 2; // Mặc định mỗi loại có ít nhất 2 bánh răng
            }

            // Bổ sung các bánh răng lẻ
            const extras = extraGearsRaw.split(/[, \s\n]+/).map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0);
            extras.forEach(n => {
                gearInventory[n] = (gearInventory[n] || 0) + 2;
            });

            const availableGears = Object.keys(gearInventory).map(Number).sort((a, b) => a - b);

            // 2. Tạo danh sách tất cả các tỉ số đơn A / B
            let singleRatios = [];
            for (let i = 0; i < availableGears.length; i++) {
                for (let j = 0; j < availableGears.length; j++) {
                    const A = availableGears[i];
                    const B = availableGears[j];
                    singleRatios.push({ val: A / B, a: A, b: B });
                }
            }

            // Sắp xếp tăng dần theo giá trị để tìm kiếm nhị phân
            singleRatios.sort((a, b) => a.val - b.val);

            let matches = [];
            const searchThreshold = 0.0001; // Ngưỡng sai số thô ban đầu để quét

            for (let i = 0; i < singleRatios.length; i++) {
                const r1 = singleRatios[i];
                const targetR2 = targetI / r1.val;

                // Tìm kiếm nhị phân tỉ số thứ 2 lý tưởng
                let low = 0;
                let high = singleRatios.length - 1;

                while (low <= high) {
                    let mid = Math.floor((low + high) / 2);
                    const r2 = singleRatios[mid];
                    const currentI = r1.val * r2.val;
                    const diff = Math.abs(currentI - targetI);

                    if (diff < searchThreshold) {
                        // Kiểm tra kho bánh răng
                        const A = r1.a, B = r1.b, C = r2.a, D = r2.b;
                        let used = {};
                        [A, B, C, D].forEach(g => used[g] = (used[g] || 0) + 1);

                        let possible = true;
                        for (let g in used) {
                            if (used[g] > (gearInventory[g] || 0)) {
                                possible = false;
                                break;
                            }
                        }

                        if (possible) {
                            matches.push({
                                a: A, b: B, c: C, d: D,
                                val: currentI,
                                diff: diff
                            });
                        }

                        // Quét các lân cận xung quanh vị trí mid
                        let left = mid - 1;
                        while (left >= 0 && Math.abs(r1.val * singleRatios[left].val - targetI) < searchThreshold) {
                            const r2L = singleRatios[left];
                            let usedL = {};
                            [r1.a, r1.b, r2L.a, r2L.b].forEach(g => usedL[g] = (usedL[g] || 0) + 1);
                            let possL = true;
                            for (let g in usedL) {
                                if (usedL[g] > (gearInventory[g] || 0)) { possL = false; break; }
                            }
                            if (possL) {
                                matches.push({
                                    a: r1.a, b: r1.b, c: r2L.a, d: r2L.b,
                                    val: r1.val * r2L.val,
                                    diff: Math.abs(r1.val * r2L.val - targetI)
                                });
                            }
                            left--;
                        }

                        let right = mid + 1;
                        while (right < singleRatios.length && Math.abs(r1.val * singleRatios[right].val - targetI) < searchThreshold) {
                            const r2R = singleRatios[right];
                            let usedR = {};
                            [r1.a, r1.b, r2R.a, r2R.b].forEach(g => usedR[g] = (usedR[g] || 0) + 1);
                            let possR = true;
                            for (let g in usedR) {
                                if (usedR[g] > (gearInventory[g] || 0)) { possR = false; break; }
                            }
                            if (possR) {
                                matches.push({
                                    a: r1.a, b: r1.b, c: r2R.a, d: r2R.b,
                                    val: r1.val * r2R.val,
                                    diff: Math.abs(r1.val * r2R.val - targetI)
                                });
                            }
                            right++;
                        }
                    }

                    if (r2.val < targetR2) low = mid + 1;
                    else high = mid - 1;
                }
            }

            // Sắp xếp kết quả theo sai số nhỏ nhất trước
            matches.sort((a, b) => a.diff - b.diff);

            // Lọc bỏ trùng lặp về mặt toán học
            let uniqueMatches = [];
            let seen = new Set();
            for (let m of matches) {
                let p1 = `${m.a}/${m.b}`;
                let p2 = `${m.c}/${m.d}`;
                let key = [p1, p2].sort().join('*');

                if (!seen.has(key)) {
                    uniqueMatches.push(m);
                    seen.add(key);
                }
                if (uniqueMatches.length >= 1000) break;
            }

            renderResults(uniqueMatches);

            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>Bắt đầu tính toán</span> <i class="fa-solid fa-bolt"></i>';
            }
            if (stats) {
                stats.innerText = `Tìm thấy ${uniqueMatches.length} tổ hợp tối ưu`;
                stats.className = 'text-xs font-bold text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full';
            }
        }, 80);
    }

    function renderResults(data) {
        const resultBody = document.getElementById('resultBodyGears');
        if (!resultBody) return;

        if (data.length === 0) {
            resultBody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 60px 20px; text-align: center; color: #f43f5e;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size: 28px;"></i>
                            <div style="font-weight: 700;">Không tìm thấy tổ hợp bánh răng nào phù hợp!</div>
                            <div style="font-size: 12px; color: #94a3b8;">Vui lòng nới rộng phạm vi số răng (Min/Max) hoặc nhập thêm bánh răng bổ sung lẻ.</div>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        let html = '';
        for (let i = 0; i < data.length; i++) {
            const m = data[i];
            const diffStr = m.diff.toFixed(12);

            let precisionColor = '#94a3b8';
            let badgeText = 'Sai số thường';
            let badgeBg = 'rgba(148, 163, 184, 0.1)';
            let badgeBorder = 'rgba(148, 163, 184, 0.2)';

            if (m.diff < 0.00000001) {
                precisionColor = '#34d399';
                badgeText = 'Siêu chính xác < 10⁻⁸';
                badgeBg = 'rgba(52, 211, 153, 0.15)';
                badgeBorder = 'rgba(52, 211, 153, 0.3)';
            } else if (m.diff < 0.000001) {
                precisionColor = '#38bdf8';
                badgeText = 'Rất cao < 10⁻⁶';
                badgeBg = 'rgba(56, 189, 248, 0.15)';
                badgeBorder = 'rgba(56, 189, 248, 0.3)';
            } else if (m.diff < 0.00001) {
                precisionColor = '#a78bfa';
                badgeText = 'Cao < 10⁻⁵';
                badgeBg = 'rgba(167, 139, 250, 0.15)';
                badgeBorder = 'rgba(167, 139, 250, 0.3)';
            }

            html += `
                <tr style="border-bottom: 1px solid #1e293b; transition: background 0.15s;">
                    <td style="padding: 12px 16px; font-family: monospace; font-size: 12px; color: #64748b;">#${i + 1}</td>
                    <td style="padding: 12px 16px; text-align: center;">
                        <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 700; font-family: monospace; background: #1e293b; color: #38bdf8; border: 1px solid #334155;">
                            ${m.a} : ${m.b}
                        </span>
                    </td>
                    <td style="padding: 12px 16px; text-align: center;">
                        <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 700; font-family: monospace; background: #1e293b; color: #fb923c; border: 1px solid #334155;">
                            ${m.c} : ${m.d}
                        </span>
                    </td>
                    <td style="padding: 12px 16px; font-family: monospace; font-weight: 700; color: #f8fafc; font-size: 13px;">
                        ${m.val.toFixed(9)}
                    </td>
                    <td style="padding: 12px 16px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-family: monospace; font-size: 12px; font-weight: 700; color: ${precisionColor};">
                                ${diffStr}
                            </span>
                            <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: ${badgeBg}; color: ${precisionColor}; border: 1px solid ${badgeBorder}; white-space: nowrap;">
                                ${badgeText}
                            </span>
                        </div>
                    </td>
                </tr>
            `;
        }
        resultBody.innerHTML = html;
    }

    root.solveGears = solveGears;
    root.renderResultsGears = renderResults;

})(typeof window !== 'undefined' ? window : global);
