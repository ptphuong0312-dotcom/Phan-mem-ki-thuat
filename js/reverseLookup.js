document.addEventListener('DOMContentLoaded', () => {
    const btnReverseSearch = document.getElementById('btnReverseSearch');
    const measuredDia = document.getElementById('measuredDia');
    const threadPlacement = document.getElementById('threadPlacement');
    const reverseResultsContainer = document.getElementById('reverseResultsContainer');

    btnReverseSearch.addEventListener('click', () => {
        const val = parseFloat(measuredDia.value);
        if (isNaN(val) || val <= 0) {
            reverseResultsContainer.innerHTML = '<div class="empty-state">Vui lòng nhập đường kính hợp lệ.</div>';
            return;
        }

        const isExternal = threadPlacement.value === 'external'; // Đo đỉnh ren
        const selectedSystem = document.getElementById('reverseSystemFilter').value;

        // Nếu đo ngoài (Đỉnh ren) -> so sánh với MajorDia
        // Nếu đo trong (Lỗ taro) -> so sánh với TapDrill

        // Lọc những ren có data hợp lệ và đúng khoanh vùng
        let validThreads = threadData.filter(item => {
            // Lọc hệ ren
            if (selectedSystem !== 'All' && item.system !== selectedSystem) {
                return false;
            }

            if (isExternal) {
                return item.majorDia && item.majorDia !== 'N/A' && item.majorDia !== 'Check specs' && !isNaN(parseFloat(item.majorDia));
            } else {
                return item.tapDrill && item.tapDrill !== 'N/A' && !isNaN(parseFloat(item.tapDrill));
            }
        });

        // Tính toán độ lệch (delta)
        validThreads = validThreads.map(item => {
            let targetVal = isExternal ? parseFloat(item.majorDia) : parseFloat(item.tapDrill);
            return {
                ...item,
                targetVal: targetVal,
                delta: Math.abs(targetVal - val)
            };
        });

        // Sắp xếp theo độ lệch tăng dần
        validThreads.sort((a, b) => a.delta - b.delta);

        // Lấy top 20
        const top20 = validThreads.slice(0, 20);

        renderReverseResults(top20, isExternal, val);
    });

    function renderReverseResults(data, isExternal, originalVal) {
        reverseResultsContainer.innerHTML = '';

        if (data.length === 0) {
            reverseResultsContainer.innerHTML = '<div class="empty-state">Không tìm thấy dữ liệu.</div>';
            return;
        }

        data.forEach(item => {
            const isPopular = item.priority === 100;
            const card = document.createElement('div');
            card.className = isPopular ? 'result-card highlight-card' : 'result-card';
            
            // Highlight màu đỏ nếu lệch nhiều, xanh nếu cực chuẩn
            const delta = item.delta.toFixed(2);
            let deltaColor = 'var(--text-muted)';
            if (delta <= 0.1) deltaColor = 'var(--success)';
            else if (delta > 0.5) deltaColor = 'var(--danger)';

            let targetValHTML = `${item.targetVal} mm`;
            if (item.system !== 'ISO Metric') {
                const inchVal = (item.targetVal / 25.4).toFixed(3);
                targetValHTML += ` <span class="inch-text">(${inchVal}")</span>`;
            }

            card.innerHTML = `
                <div class="card-header">
                    <div class="thread-size">${item.size}</div>
                    <div class="thread-type ${isPopular ? 'popular-type' : ''}">${item.type}</div>
                </div>
                <div class="data-grid">
                    <div class="data-item">
                        <div class="data-label">Độ lệch so với thước đo</div>
                        <div class="data-value" style="color: ${deltaColor}">± ${delta} mm</div>
                    </div>
                    <div class="data-item">
                        <div class="data-label">${isExternal ? 'Đỉnh ren chuẩn' : 'Lỗ taro chuẩn'}</div>
                        <div class="data-value">${targetValHTML}</div>
                    </div>
                    <div class="data-item">
                        <div class="data-label">Bước ren / TPI</div>
                        <div class="data-value">${item.pitch}</div>
                    </div>
                </div>
            `;
            reverseResultsContainer.appendChild(card);
        });
    }
});
