document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const systemFilter = document.getElementById('systemFilter');
    const resultsContainer = document.getElementById('resultsContainer');

    // Mảng dữ liệu lớn, render giới hạn 100 kết quả đầu tiên để chống lag
    function renderResults(data) {
        resultsContainer.innerHTML = '';
        
        // Cắt data chỉ hiện tối đa 100 kết quả để giao diện mượt
        const displayData = data.slice(0, 100);

        if (displayData.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state">Không tìm thấy kết quả phù hợp.</div>';
            return;
        }

        displayData.forEach(item => {
            const isPopular = item.type.toLowerCase().includes("coarse") || item.type.toLowerCase().includes("unc");
            const card = document.createElement('div');
            card.className = isPopular ? 'result-card highlight-card' : 'result-card';
            card.setAttribute('data-id', item.id);
            
            let tapDrillHTML = '-';
            if (item.tapDrill && item.tapDrill !== 'N/A') {
                tapDrillHTML = `${item.tapDrill} mm`;
                if (item.system !== 'ISO Metric') {
                    const parsed = parseFloat(item.tapDrill);
                    if (!isNaN(parsed)) {
                        tapDrillHTML += ` <span class="inch-text">(${(parsed / 25.4).toFixed(3)}")</span>`;
                    }
                }
            }

            let majorDiaHTML = item.majorDia;
            if (item.majorDia && item.majorDia !== 'N/A' && item.majorDia !== 'Check specs') {
                majorDiaHTML = `${item.majorDia} mm`;
                if (item.system !== 'ISO Metric') {
                    const parsed = parseFloat(item.majorDia);
                    if (!isNaN(parsed)) {
                        majorDiaHTML += ` <span class="inch-text">(${(parsed / 25.4).toFixed(3)}")</span>`;
                    }
                }
            }

            card.innerHTML = `
                <div class="card-header">
                    <div class="thread-size">${item.size}</div>
                    <div class="thread-type ${isPopular ? 'popular-type' : ''}">${isPopular ? '⭐ ' + item.type : item.type}</div>
                </div>
                <div class="data-grid">
                    <div class="data-item">
                        <div class="data-label">Lỗ khoan Taro (Tap Drill)</div>
                        <div class="data-value highlight-value">${tapDrillHTML}</div>
                    </div>
                    <div class="data-item">
                        <div class="data-label">Đường kính đỉnh (Major Dia)</div>
                        <div class="data-value">${majorDiaHTML}</div>
                    </div>
                    <div class="data-item">
                        <div class="data-label">Bước ren / TPI</div>
                        <div class="data-value">${item.pitch}</div>
                    </div>
                </div>
            `;
            
            resultsContainer.appendChild(card);
        });
        
        if (data.length > 100) {
            const more = document.createElement('div');
            more.className = 'empty-state';
            more.innerText = `... và ${data.length - 100} kết quả khác. Hãy gõ chi tiết hơn hoặc chọn bộ lọc để thu hẹp tìm kiếm.`;
            resultsContainer.appendChild(more);
        }
    }

    function filterData() {
        const query = searchInput.value.toLowerCase().replace(/\s+/g, ''); // Bỏ khoảng trắng
        const selectedSystem = systemFilter.value;
        
        // threadData là mảng được load từ data.js
        let filtered = (typeof threadData !== 'undefined') ? threadData : [];
        
        if (selectedSystem !== 'All') {
            filtered = filtered.filter(item => item.system === selectedSystem);
        }
        
        if (query !== '') {
            filtered = filtered.filter(item => {
                const sSize = item.size.toLowerCase().replace(/\s+/g, '');
                const sType = item.type.toLowerCase().replace(/\s+/g, '');
                const sId = item.id.toLowerCase().replace(/\s+/g, '');
                return sSize.includes(query) || sType.includes(query) || sId.includes(query);
            });
        }
        
        // Sắp xếp nâng cao
        filtered.sort((a, b) => {
            const cleanA = a.size.toLowerCase().replace(/\s+/g, '');
            const cleanB = b.size.toLowerCase().replace(/\s+/g, '');
            const baseQuery = query.replace(/^[a-z]+/, ''); // "m8" -> "8", "3/8" -> "3/8"
            
            // 0. Ưu tiên tuyệt đối: Bắt đầu ĐÚNG bằng chuỗi gõ (ví dụ gõ "3/8" thì "3/8 UNC" lên trước "W 3/8")
            const startsWithA = cleanA.startsWith(query) ? 1 : 0;
            const startsWithB = cleanB.startsWith(query) ? 1 : 0;
            if (startsWithA !== startsWithB) return startsWithB - startsWithA;

            // 1. Ưu tiên Exact Match số (ví dụ gõ "m8" thì "M 8.0" lên trước "M 8.5")
            const baseA = cleanA.replace(/^[a-z]+/, '');
            const baseB = cleanB.replace(/^[a-z]+/, '');
            const exactA = (baseA === baseQuery || baseA === baseQuery + '.0' || baseA.startsWith(baseQuery + '"') || baseA.startsWith(baseQuery + '-')) ? 1 : 0;
            const exactB = (baseB === baseQuery || baseB === baseQuery + '.0' || baseB.startsWith(baseQuery + '"') || baseB.startsWith(baseQuery + '-')) ? 1 : 0;
            if (exactA !== exactB) return exactB - exactA;
            
            // 2. Ưu tiên độ phổ biến (Coarse > Fine)
            const pA = a.priority || 0;
            const pB = b.priority || 0;
            if (pA !== pB) return pB - pA;
            
            // 3. Sắp xếp theo tên và kích thước chuẩn xác
            return cleanA.localeCompare(cleanB, undefined, { numeric: true, sensitivity: 'base' });
        });
        
        renderResults(filtered);
    }

    // Lắng nghe sự kiện
    searchInput.addEventListener('input', filterData);
    systemFilter.addEventListener('change', filterData);

    // Khởi tạo
    // Đợi một chút để đảm bảo file data.js đã được parse nếu nó lớn
    setTimeout(filterData, 100);

    // Xử lý Main Sections (Ren / Dung Sai)
    const mainNavItems = document.querySelectorAll('.main-nav-item');
    const mainSections = document.querySelectorAll('.main-section');
    mainNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            mainNavItems.forEach(nav => nav.classList.remove('active'));
            mainSections.forEach(sec => sec.classList.remove('active'));

            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Xử lý Sub Tabs trong Ren
    const segBtns = document.querySelectorAll('.seg-btn');
    const renTabContents = document.querySelectorAll('#sectionRen .tab-content');
    segBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            segBtns.forEach(b => b.classList.remove('active'));
            renTabContents.forEach(tab => tab.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});
