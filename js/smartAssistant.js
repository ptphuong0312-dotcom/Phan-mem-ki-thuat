/**
 * Smart Assistant Module for "Trợ lý cơ khí xưởng"
 * Features:
 * 1. Smart Universal Search (Cross-module live search with shortcuts)
 * 2. Smart Fit Presets for ISO 286
 * 3. Quick Filter Chips & Live Search for 23 Industrial Gearboxes
 * 4. Interactive Surface Roughness Converter
 */

(function() {
    'use strict';

    // -------------------------------------------------------------
    // 1. DATA DICTIONARIES FOR SMART SEARCH
    // -------------------------------------------------------------
    const SEARCH_ITEMS = [
        // THREADS
        { type: 'ren', title: 'Ren M6 (Thô: P=1.0 | Mịn: P=0.75)', desc: 'Tiện ngoài: ⌀5.88 | Khoan taro: ⌀5.0', query: 'M6', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M8 (Thô: P=1.25 | Mịn: P=1.0)', desc: 'Tiện ngoài: ⌀7.86 | Khoan taro: ⌀6.8', query: 'M8', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M10 (Thô: P=1.5 | Mịn: P=1.25, 1.0)', desc: 'Tiện ngoài: ⌀9.85 | Khoan taro: ⌀8.5', query: 'M10', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M12 (Thô: P=1.75 | Mịn: P=1.5, 1.25)', desc: 'Tiện ngoài: ⌀11.83 | Khoan taro: ⌀10.2', query: 'M12', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M14 (Thô: P=2.0 | Mịn: P=1.5)', desc: 'Tiện ngoài: ⌀13.82 | Khoan taro: ⌀12.0', query: 'M14', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M16 (Thô: P=2.0 | Mịn: P=1.5)', desc: 'Tiện ngoài: ⌀15.82 | Khoan taro: ⌀14.0', query: 'M16', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M20 (Thô: P=2.5 | Mịn: P=2.0, 1.5)', desc: 'Tiện ngoài: ⌀19.79 | Khoan taro: ⌀17.5', query: 'M20', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M24 (Thô: P=3.0 | Mịn: P=2.0)', desc: 'Tiện ngoài: ⌀23.77 | Khoan taro: ⌀21.0', query: 'M24', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren M30 (Thô: P=3.5 | Mịn: P=2.0)', desc: 'Tiện ngoài: ⌀29.74 | Khoan taro: ⌀26.5', query: 'M30', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren Ống G 1/2" (BSPP - 14 TPI)', desc: 'Ren ống song song thủy lực/khí nén', query: 'G 1/2', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren Ống NPT 1/2" (14 TPI Côn)', desc: 'Ren ống kín áp chuẩn Mỹ', query: 'NPT 1/2', tab: 'sectionRen' },
        { type: 'ren', title: 'Ren Thang Tr 20x4 (DIN 103)', desc: 'Ren truyền lực vít me máy tiện', query: 'Tr 20', tab: 'sectionRen' },

        // ISO 286 FITS
        { type: 'dungsai', title: 'Lắp Vòng Bi Lên Trục: k6 / m6 (Lắp trung gian/chặt nhẹ)', desc: 'Tiêu chuẩn lắp ổ lăn FAG/SKF', tab: 'sectionTolerance', preset: 'brg_shaft' },
        { type: 'dungsai', title: 'Lắp Vòng Bi Vào Lỗ Vỏ: H7 / J7 (Lắp định tâm)', desc: 'Tiêu chuẩn ổ lăn vào gối đỡ', tab: 'sectionTolerance', preset: 'brg_hole' },
        { type: 'dungsai', title: 'Lắp Bánh Răng Có Then: H7 / js6 (Tháo lắp tự do)', desc: 'Mối ghép then bằng DIN 6885', tab: 'sectionTolerance', preset: 'gear_key' },
        { type: 'dungsai', title: 'Lắp Bánh Răng Ép Độ Dôi: H7 / r6 - H7 / u6 (Tải nặng)', desc: 'Truyền mô-men xoắn lớn bằng độ dôi', tab: 'sectionTolerance', preset: 'press_fit' },
        { type: 'dungsai', title: 'Lắp Bạc Trượt / Ống Lót: H7 / f7 (Lắp lỏng có khe hở)', desc: 'Trục quay tự do trơn tru trong bạc', tab: 'sectionTolerance', preset: 'bushing' },
        { type: 'dungsai', title: 'Lắp Chốt Định Vị: H7 / h6 (Lắp khít định vị)', desc: 'Định vị chính xác mặt phân khuôn', tab: 'sectionTolerance', preset: 'dowel_pin' },
        { type: 'dungsai', title: 'Tra Cứu Kích Thước Rãnh Then Bằng (DIN 6885-1)', desc: 'Chiều sâu t1 trục, t2 may-ơ, dung sai P9/N9', tab: 'sectionTolerance', preset: 'keyway' },

        // ROUGHNESS
        { type: 'nham', title: 'Độ Nhám Ra = 0.4 µm (∇9 / N5 - Siêu tinh)', desc: 'Mài tròn ngoài trục mạ crôm, cổ trục phớt dầu', tab: 'sectionRoughness', ra: 0.4 },
        { type: 'nham', title: 'Độ Nhám Ra = 0.8 µm (∇8 / N6 - Mài tinh)', desc: 'Ngỗng trục lắp ổ lăn, bề mặt làm việc răng', tab: 'sectionRoughness', ra: 0.8 },
        { type: 'nham', title: 'Độ Nhám Ra = 1.6 µm (∇7 / N7 - Tiện/Phay tinh)', desc: 'Mặt vai tựa ổ lăn, mặt lắp ghép then bằng', tab: 'sectionRoughness', ra: 1.6 },
        { type: 'nham', title: 'Độ Nhám Ra = 3.2 µm (∇6 / N8 - Bán tinh)', desc: 'Mặt phân khuôn hộp giảm tốc, bích nắp ổ', tab: 'sectionRoughness', ra: 3.2 },
        { type: 'nham', title: 'Độ Nhám Ra = 6.3 µm (∇5 / N9 - Tiện/Phay thô)', desc: 'Bề mặt không lắp ghép, chân đế hộp số', tab: 'sectionRoughness', ra: 6.3 },

        // 23 GEARBOXES
        { type: 'hopso', id: 'gb10', title: '1. Sumitomo Cyclo 6195 (2.2 - 11 kW)', desc: 'Băng tải cân, van quay xả bụi (i=29÷87)', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb21', title: '2. Máy đóng bao xoay Haver & Boecker (5.5 - 11 kW)', desc: 'Cơ cấu xoay tháp đóng bao xi măng', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb19', title: '3. Quả xoài treo trục SEW F127 (11 - 37 kW)', desc: 'Hộp số treo trục băng tải phụ', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb9',  title: '4. Hộp số nón trụ SEW K157 (15 - 55 kW)', desc: 'Băng tải than, nạp liệu clinker', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb16', title: '5. NORD SK 9092.1 UNICASE (30 - 90 kW)', desc: 'Vỏ đúc liền khối chịu lực xoắn cao', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb18', title: '6. Mâm quay Brevini / Dana SL3003 (45 - 110 kW)', desc: 'Hành tinh quay toa máy rải liệu (Stacker)', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb20', title: '7. Phụ trợ quay lò Kiln Auxiliary (45 - 90 kW)', desc: 'Dẫn động quay chậm lò nung dừng sự cố', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb8',  title: '8. Trụ nghiêng SEW MC3RL 08 (75 - 200 kW)', desc: 'Quạt hút lò nung, bơm tuần hoàn', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb17', title: '9. Phân ly trục đứng Flender H2KV (132 - 350 kW)', desc: 'Truyền động lồng phân ly bột mịn nghiền đứng', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb15', title: '10. HANSEN P4 (Sumitomo) (200 - 630 kW)', desc: 'Quạt gió lò chính, bơm bùn quặng', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb22', title: '11. Tốc độ cao 1 cấp Flender H1SH (200 - 630 kW)', desc: 'Máy nén khí tuabin, quạt cao áp', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb5',  title: '12. Trụ nghiêng 3 cấp ZSY 630 / 710 (250 - 650 kW)', desc: 'Máy cán thép thô, nghiền than', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb7',  title: '13. Hành tinh Flender Planurex 3 P3SA (250 - 800 kW)', desc: 'Máy ép cán con lăn con ép clinker (Roller Press)', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb14', title: '14. Nón trụ 3 cấp DCY 630 (280 - 710 kW)', desc: 'Băng tải vận chuyển đá vôi mỏ lộ thiên', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb6',  title: '15. Bonfiglioli HDO 160 (315 - 750 kW)', desc: 'Hộp số công nghiệp nặng băng tải quặng chính', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb1',  title: '16. Nón trụ Flender B3SH 18 (315 - 850 kW)', desc: 'Truyền động băng tải clinker chính', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb13', title: '17. Dẫn động chính lò David Brown CX18 (350 - 800 kW)', desc: 'Ăn khớp bánh răng vành quay lò nung xi măng', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb2',  title: '18. Trụ nghiêng Flender H3SH 18 (355 - 900 kW)', desc: 'Máy nghiền bi sơ cấp clinker', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb3',  title: '19. Nón trụ SEW X3KS 280 (400 - 1.100 kW)', desc: 'Gầu nâng đĩa tải trọng cực lớn', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb4',  title: '20. Trụ nghiêng SEW X3FS 300 (500 - 1.350 kW)', desc: 'Máy nghiền than xi măng tải nặng', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb12', title: '21. Nghiền đứng RENK VRM (1.200 - 4.000 kW)', desc: 'Bàn nghiền con lăn đứng VRM - Tải dọc 25.000 kN', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb11', title: '22. Phân dòng công suất Flender DUORED (1.500 - 3.500 kW)', desc: 'Máy nghiền bi xi măng công suất khủng', tab: 'sectionGearbox' },
        { type: 'hopso', id: 'gb23', title: '23. Nón - Trụ 4 cấp Flender B4SH 18 (250 - 630 kW)', desc: 'Gầu nâng clinker cao tầng (Tích hợp Backstop)', tab: 'sectionGearbox' },

        // GD&T (Dung sai hình học & vị trí)
        { type: 'gdt', id: 'flatness', title: 'Độ Phẳng (Flatness ⏢ - ISO 1101)', desc: 'Kiểm tra mặt phân khuôn hộp số, bàn máp & rà đồng hồ so', tab: 'sectionGdt' },
        { type: 'gdt', id: 'straightness', title: 'Độ Thẳng (Straightness ⎯ - ISO 1101)', desc: 'Đường sinh trục dài, then bằng, sống trượt máy', tab: 'sectionGdt' },
        { type: 'gdt', id: 'perpendicularity', title: 'Độ Vuông Góc (Perpendicularity ⟂)', desc: 'Mặt tựa ổ bi so với đường tâm trục, vai trục bánh răng', tab: 'sectionGdt' },
        { type: 'gdt', id: 'circular_runout', title: 'Độ Đảo Hướng Tâm & Mặt Đầu (↗)', desc: 'Đo biến thiên đồng hồ so FIM quay 360° vành răng & cổ trục', tab: 'sectionGdt' },
        { type: 'gdt', id: 'position', title: 'Vị Trí Thực (True Position ⌖)', desc: 'Tâm các lỗ bu-lông, tâm trục bánh răng ăn khớp kèm MMC Ⓜ', tab: 'sectionGdt' },
        { type: 'gdt', id: 'concentricity', title: 'Độ Đồng Tâm / Đồng Trục (◎)', desc: 'Cổ trục phớt chắn dầu so với ngỗng trục lắp vòng bi', tab: 'sectionGdt' },

        // 06. Tỉ Số Truyền Bánh Răng Tối Ưu
        { type: 'tisotruyen', id: 'gear_ratio', title: 'Bộ Tính Tỉ Số Truyền Bánh Răng (A/B) × (C/D)', desc: 'Tối ưu hóa tổ hợp 4 bánh răng theo tỉ số mục tiêu i và kho răng', tab: 'sectionGearRatio' },
        { type: 'tisotruyen', id: 'gear_ratio_calc', title: 'Tính Tỉ Số Truyền Bánh Răng Thay Thế (Chạc Bánh Răng)', desc: 'Tìm cặp bánh răng ăn khớp với sai số siêu nhỏ < 10⁻⁸', tab: 'sectionGearRatio' },

        // 07. Tra Cứu & Xác Định Modul Bánh Răng
        { type: 'modul', id: 'modul_finder', title: 'Tra Cứu & Xác Định Modul Bánh Răng Hiệu Chỉnh', desc: 'Phân tích bước răng đo thực tế t (mm) tra Modul chuẩn (25.4 - 0.2) & góc áp lực α', tab: 'sectionModuleFinder' },
        { type: 'modul', id: 'modul_dp', title: 'Tính Bước Răng Đo Thực Tế t & Quy Đổi DP (Diametral Pitch)', desc: 'Công thức t = m × π × cos(α) và kiểm tra 165 Modul chuẩn hóa', tab: 'sectionModuleFinder' }
    ];

    // -------------------------------------------------------------
    // 2. SMART SEARCH INITIALIZATION
    // -------------------------------------------------------------
    function initSmartSearch() {
        const input = document.getElementById('smartGlobalInput');
        const dropdown = document.getElementById('smartSearchDropdown');
        if (!input || !dropdown) return;

        // Global hotkey: '/' or 'Ctrl+K' / 'Cmd+K'
        document.addEventListener('keydown', (e) => {
            if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== input) {
                e.preventDefault();
                input.focus();
                input.select();
            } else if (e.key === 'Escape' && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });

        // Search on input
        input.addEventListener('input', () => {
            const val = input.value.trim().toLowerCase();
            if (!val) {
                dropdown.classList.remove('active');
                dropdown.innerHTML = '';
                return;
            }

            const matches = SEARCH_ITEMS.filter(item => {
                return item.title.toLowerCase().includes(val) ||
                       item.desc.toLowerCase().includes(val) ||
                       (item.query && item.query.toLowerCase().includes(val));
            }).slice(0, 8); // Top 8 relevant results

            if (matches.length === 0) {
                dropdown.innerHTML = `
                    <div style="padding: 14px; text-align: center; color: #64748b; font-size: 13px;">
                        Không tìm thấy kết quả phù hợp cho "<strong>${escapeHtml(input.value)}</strong>"
                    </div>`;
                dropdown.classList.add('active');
                return;
            }

            let html = '';
            matches.forEach(item => {
                let badgeBg = '#38bdf8', badgeText = '#0f172a', badgeLabel = 'REN';
                if (item.type === 'dungsai') { badgeBg = '#c084fc'; badgeLabel = 'DUNG SAI'; }
                else if (item.type === 'nham') { badgeBg = '#4ade80'; badgeLabel = 'ĐỘ NHÁM'; }
                else if (item.type === 'hopso') { badgeBg = '#f59e0b'; badgeLabel = 'HỘP SỐ'; }
                else if (item.type === 'gdt') { badgeBg = '#fb7185'; badgeLabel = 'GD&T'; }
                else if (item.type === 'tisotruyen') { badgeBg = '#38bdf8'; badgeLabel = 'TỈ SỐ TRUYỀN'; }
                else if (item.type === 'modul') { badgeBg = '#818cf8'; badgeLabel = 'MODUL'; }

                html += `
                    <div class="smart-search-item" data-type="${item.type}" data-tab="${item.tab}" data-id="${item.id || ''}" data-query="${item.query || ''}" data-preset="${item.preset || ''}" data-ra="${item.ra || ''}">
                        <div>
                            <div style="color: #f8fafc; font-size: 13px; font-weight: bold; margin-bottom: 2px;">${item.title}</div>
                            <div style="color: #94a3b8; font-size: 11px;">${item.desc}</div>
                        </div>
                        <span class="smart-search-tag" style="background: ${badgeBg}; color: ${badgeText};">${badgeLabel}</span>
                    </div>`;
            });

            dropdown.innerHTML = html;
            dropdown.classList.add('active');

            // Attach click listeners to items
            dropdown.querySelectorAll('.smart-search-item').forEach(el => {
                el.addEventListener('click', () => {
                    handleSearchResultClick(el);
                    dropdown.classList.remove('active');
                    input.value = '';
                });
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.smart-search-wrapper')) {
                dropdown.classList.remove('active');
            }
        });
    }

    function handleSearchResultClick(el) {
        const targetTab = el.getAttribute('data-tab');
        const type = el.getAttribute('data-type');

        // 1. Switch Main Tab
        if (window.switchMainModule) {
            window.switchMainModule(targetTab);
        } else {
            const navBtn = document.querySelector(`.main-nav-item[data-target="${targetTab}"]`);
            if (navBtn) navBtn.click();
        }

        // 2. Perform contextual action
        if (type === 'ren') {
            const query = el.getAttribute('data-query');
            const searchInput = document.getElementById('searchInput');
            if (searchInput && query) {
                searchInput.value = query;
                searchInput.dispatchEvent(new Event('input'));
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (type === 'dungsai') {
            const preset = el.getAttribute('data-preset');
            if (preset) applyFitPreset(preset);
        } else if (type === 'nham') {
            const raVal = parseFloat(el.getAttribute('data-ra'));
            if (!isNaN(raVal) && window.setInteractiveRoughness) {
                window.setInteractiveRoughness(raVal);
            }
        } else if (type === 'hopso') {
            const gbId = el.getAttribute('data-id');
            if (gbId && window.switchGearboxSelect) {
                const select = document.getElementById('gearboxSelect');
                if (select) {
                    select.value = gbId;
                    window.switchGearboxSelect(gbId);
                    document.getElementById(gbId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } else if (type === 'gdt') {
            const gdtId = el.getAttribute('data-id');
            if (gdtId && window.selectGdtSymbol) {
                window.selectGdtSymbol(gdtId);
                document.getElementById('gdtDetailTitle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // -------------------------------------------------------------
    // 2. SMART FIT PRESETS FOR ISO 286
    // -------------------------------------------------------------
    window.applyFitPreset = function(presetKey) {
        const nomInput = document.getElementById('calcNominal');
        const hLetter = document.getElementById('calcHoleLetter');
        const hGrade = document.getElementById('calcHoleGrade');
        const sLetter = document.getElementById('calcShaftLetter');
        const sGrade = document.getElementById('calcShaftGrade');

        if (!nomInput) return;

        switch (presetKey) {
            case 'brg_shaft': // k6
                if (!nomInput.value || parseFloat(nomInput.value) <= 0) nomInput.value = 50;
                if (hLetter) hLetter.value = 'H';
                if (hGrade) hGrade.value = '7';
                if (sLetter) sLetter.value = 'k';
                if (sGrade) sGrade.value = '6';
                break;
            case 'brg_hole': // H7
                if (!nomInput.value || parseFloat(nomInput.value) <= 0) nomInput.value = 90;
                if (hLetter) hLetter.value = 'H';
                if (hGrade) hGrade.value = '7';
                if (sLetter) sLetter.value = 'h';
                if (sGrade) sGrade.value = '6';
                break;
            case 'gear_key': // H7/js6
                if (!nomInput.value || parseFloat(nomInput.value) <= 0) nomInput.value = 45;
                if (hLetter) hLetter.value = 'H';
                if (hGrade) hGrade.value = '7';
                if (sLetter) sLetter.value = 'js';
                if (sGrade) sGrade.value = '6';
                break;
            case 'press_fit': // H7/r6
                if (!nomInput.value || parseFloat(nomInput.value) <= 0) nomInput.value = 65;
                if (hLetter) hLetter.value = 'H';
                if (hGrade) hGrade.value = '7';
                if (sLetter) sLetter.value = 'r';
                if (sGrade) sGrade.value = '6';
                break;
            case 'bushing': // H7/f7
                if (!nomInput.value || parseFloat(nomInput.value) <= 0) nomInput.value = 35;
                if (hLetter) hLetter.value = 'H';
                if (hGrade) hGrade.value = '7';
                if (sLetter) sLetter.value = 'f';
                if (sGrade) sGrade.value = '7';
                break;
            case 'dowel_pin': // H7/h6
                if (!nomInput.value || parseFloat(nomInput.value) <= 0) nomInput.value = 20;
                if (hLetter) hLetter.value = 'H';
                if (hGrade) hGrade.value = '7';
                if (sLetter) sLetter.value = 'h';
                if (sGrade) sGrade.value = '6';
                break;
            case 'keyway':
                if (window.switchIsoTab) window.switchIsoTab('keywayPanel');
                return;
        }

        // Trigger ISO calculation engine
        if (window.runIsoCalcV2) window.runIsoCalcV2();
        if (window.runKeywayCalc) window.runKeywayCalc();

        // Highlight preset button
        document.querySelectorAll('.smart-preset-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-preset') === presetKey);
        });
    };

    // -------------------------------------------------------------
    // 3. QUICK FILTER CHIPS FOR 23 GEARBOXES
    // -------------------------------------------------------------
    const GB_METADATA = [
        { id: 'gb10', kw: 11, brand: 'Sumitomo', app: 'Băng Tải' },
        { id: 'gb21', kw: 11, brand: 'Haver', app: 'Đóng Bao' },
        { id: 'gb19', kw: 37, brand: 'SEW', app: 'Băng Tải' },
        { id: 'gb9',  kw: 55, brand: 'SEW', app: 'Băng Tải' },
        { id: 'gb16', kw: 90, brand: 'Nord', app: 'Băng Tải' },
        { id: 'gb18', kw: 110, brand: 'Brevini', app: 'Rải Liệu' },
        { id: 'gb20', kw: 90, brand: 'Khác', app: 'Lò Nung' },
        { id: 'gb8',  kw: 200, brand: 'SEW', app: 'Bơm Quạt' },
        { id: 'gb17', kw: 350, brand: 'Flender', app: 'Nghiền Đứng' },
        { id: 'gb15', kw: 630, brand: 'Hansen', app: 'Bơm Quạt' },
        { id: 'gb22', kw: 630, brand: 'Flender', app: 'Tuabin' },
        { id: 'gb5',  kw: 650, brand: 'Khác', app: 'Cán Thép' },
        { id: 'gb7',  kw: 800, brand: 'Flender', app: 'Cán Ép' },
        { id: 'gb14', kw: 710, brand: 'Khác', app: 'Băng Tải' },
        { id: 'gb6',  kw: 750, brand: 'Bonfiglioli', app: 'Băng Tải' },
        { id: 'gb1',  kw: 850, brand: 'Flender', app: 'Băng Tải' },
        { id: 'gb13', kw: 800, brand: 'David Brown', app: 'Lò Nung' },
        { id: 'gb2',  kw: 900, brand: 'Flender', app: 'Nghiền Bi' },
        { id: 'gb3',  kw: 1100, brand: 'SEW', app: 'Gầu Nâng' },
        { id: 'gb4',  kw: 1350, brand: 'SEW', app: 'Nghiền Bi' },
        { id: 'gb12', kw: 4000, brand: 'Renk', app: 'Nghiền Đứng' },
        { id: 'gb11', kw: 3500, brand: 'Flender', app: 'Nghiền Bi' },
        { id: 'gb23', kw: 630, brand: 'Flender', app: 'Gầu Nâng' }
    ];

    let currentGbFilter = { power: 'all', brand: 'all', app: 'all', text: '' };

    window.filterGearboxByChip = function(filterType, filterValue, el) {
        currentGbFilter[filterType] = filterValue;

        // Active class on chips
        if (el && el.parentElement) {
            el.parentElement.querySelectorAll('.gb-chip-btn').forEach(b => b.classList.remove('active'));
            el.classList.add('active');
        }

        applyGearboxFilter();
    };

    window.filterGearboxByText = function(text) {
        currentGbFilter.text = text.trim().toLowerCase();
        applyGearboxFilter();
    };

    function applyGearboxFilter() {
        const select = document.getElementById('gearboxSelect');
        if (!select) return;

        let visibleCount = 0;
        let firstVisibleId = null;

        Array.from(select.options).forEach(opt => {
            const gbId = opt.value;
            const meta = GB_METADATA.find(m => m.id === gbId);
            const optText = opt.text.toLowerCase();

            let match = true;

            // Power filter
            if (meta) {
                if (currentGbFilter.power === '<50' && meta.kw >= 50) match = false;
                else if (currentGbFilter.power === '50-250' && (meta.kw < 50 || meta.kw > 250)) match = false;
                else if (currentGbFilter.power === '250-1000' && (meta.kw < 250 || meta.kw > 1000)) match = false;
                else if (currentGbFilter.power === '>1000' && meta.kw <= 1000) match = false;

                // Brand filter
                if (currentGbFilter.brand !== 'all' && meta.brand !== currentGbFilter.brand) match = false;

                // Application filter
                if (currentGbFilter.app !== 'all' && meta.app !== currentGbFilter.app) match = false;
            }

            // Text query
            if (currentGbFilter.text && !optText.includes(currentGbFilter.text)) match = false;

            // Show/Hide option
            opt.hidden = !match;
            if (match) {
                visibleCount++;
                if (!firstVisibleId) firstVisibleId = gbId;
            }
        });

        // Update count badge
        const countBadge = document.getElementById('gbFilterCount');
        if (countBadge) {
            countBadge.innerText = `${visibleCount}/23 Hộp số`;
        }

        // If currently selected option is hidden, select first visible
        if (select.selectedOptions[0]?.hidden && firstVisibleId) {
            select.value = firstVisibleId;
            if (window.switchGearboxSelect) window.switchGearboxSelect(firstVisibleId);
        }
    }

    // -------------------------------------------------------------
    // 4. INTERACTIVE ROUGHNESS CONVERTER
    // -------------------------------------------------------------
    const ROUGHNESS_TABLE = [
        { ra: 0.025, rz: 0.1, n: 'N1', tcvn: '∇14', tech: 'Siêu đánh bóng (Lapping / Honing đặc biệt)' },
        { ra: 0.05,  rz: 0.2, n: 'N2', tcvn: '∇13', tech: 'Đánh bóng quang học, mài nghiền siêu mịn' },
        { ra: 0.1,   rz: 0.4, n: 'N3', tcvn: '∇12', tech: 'Mài nghiền phẳng (Lapping), mài tròn ngoài siêu tinh' },
        { ra: 0.2,   rz: 0.8, n: 'N4', tcvn: '∇11', tech: 'Mài khôn xi lanh (Honing), mài bóng trục' },
        { ra: 0.4,   rz: 1.6, n: 'N5', tcvn: '∇10', tech: 'Mài tròn ngoài trục chính xác, cổ phớt chặn dầu' },
        { ra: 0.8,   rz: 3.2, n: 'N6', tcvn: '∇9',  tech: 'Mài tinh ngỗng trục lắp ổ lăn, mài răng bánh răng' },
        { ra: 1.6,   rz: 6.3, n: 'N7', tcvn: '∇8',  tech: 'Tiện tinh bóng, phay tinh, doa lỗ, mài phẳng' },
        { ra: 3.2,   rz: 12.5, n: 'N8', tcvn: '∇7', tech: 'Tiện/phay bán tinh, mặt phân khuôn vỏ hộp giảm tốc' },
        { ra: 6.3,   rz: 25,  n: 'N9', tcvn: '∇6',  tech: 'Tiện thô, phay phá, mặt đáy chân đế hộp số' },
        { ra: 12.5,  rz: 50,  n: 'N10', tcvn: '∇5', tech: 'Bào thô, cắt plasma, cưa đĩa cơ khí' },
        { ra: 25,    rz: 100, n: 'N11', tcvn: '∇4', tech: 'Phôi rèn dập nóng, cắt hơi oxy-gas' },
        { ra: 50,    rz: 200, n: 'N12', tcvn: '∇3', tech: 'Phôi đúc khuôn cát thô, cán nóng kim loại' }
    ];

    window.setInteractiveRoughness = function(raInputVal) {
        const raVal = parseFloat(raInputVal);
        if (isNaN(raVal)) return;

        // Find closest match in table
        let closest = ROUGHNESS_TABLE[0];
        let minDiff = Math.abs(ROUGHNESS_TABLE[0].ra - raVal);
        for (let i = 1; i < ROUGHNESS_TABLE.length; i++) {
            const diff = Math.abs(ROUGHNESS_TABLE[i].ra - raVal);
            if (diff < minDiff) {
                minDiff = diff;
                closest = ROUGHNESS_TABLE[i];
            }
        }

        // Update UI
        const elRa = document.getElementById('ir_ra_val');
        const elRz = document.getElementById('ir_rz_val');
        const elN = document.getElementById('ir_n_val');
        const elTcvn = document.getElementById('ir_tcvn_val');
        const elTech = document.getElementById('ir_tech_val');

        if (elRa) elRa.innerText = `${closest.ra} µm`;
        if (elRz) elRz.innerText = `${closest.rz} µm`;
        if (elN) elN.innerText = closest.n;
        if (elTcvn) elTcvn.innerText = closest.tcvn;
        if (elTech) elTech.innerText = closest.tech;
    };

    // -------------------------------------------------------------
    // 5. SCALABLE MODULE HUB & NAVIGATION CONTROLLER
    // -------------------------------------------------------------
    window.switchMainModule = function(moduleId) {
        if (!moduleId) return;

        // 1. Switch Active Section
        const targetSec = document.getElementById(moduleId);
        if (!targetSec) return;

        document.querySelectorAll('.main-section').forEach(sec => {
            sec.classList.remove('active');
        });
        targetSec.classList.add('active');

        // 2. Toggle in-module navigation bar visibility
        const inModuleNav = document.getElementById('inModuleNav');
        if (inModuleNav) {
            inModuleNav.style.display = (moduleId === 'sectionPortal') ? 'none' : 'flex';
        }

        // 3. Sync quick select dropdown
        const quickSelect = document.getElementById('moduleQuickSelect');
        if (quickSelect && moduleId !== 'sectionPortal') {
            quickSelect.value = moduleId;
        }

        // 4. Update Module Pills Bar
        document.querySelectorAll('.module-pill-btn').forEach(btn => {
            const isMatch = btn.getAttribute('data-target') === moduleId;
            btn.classList.toggle('active', isMatch);
            if (isMatch) {
                btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        });

        // 5. Update Bottom Nav
        document.querySelectorAll('.main-nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-target') === moduleId);
        });

        // 6. Update Module Hub Cards
        document.querySelectorAll('.module-hub-card').forEach(card => {
            card.classList.toggle('active', card.getAttribute('data-target') === moduleId);
        });

        // 7. Save state
        try {
            localStorage.setItem('active_module_id', moduleId);
        } catch (e) {}

        // 8. Close Hub if open
        window.closeModuleHub();

        // 9. Scroll smoothly to top of module
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Portal Hero Filter Function (matching banh-rang.vercel.app)
    window.filterTools = function() {
        const input = (document.getElementById('portalSearchInput')?.value || '').toLowerCase().trim();
        const cards = document.querySelectorAll('#toolsGrid .tool-card');
        let count = 0;

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (!input || text.includes(input)) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        const toolCount = document.getElementById('toolCount');
        if (toolCount) {
            toolCount.textContent = `Hiển thị ${count} / ${cards.length} module`;
        }
    };

    // PWA Mobile Installation Controller
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const btn = document.getElementById('btnPWAInstall');
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-download" style="font-size: 14px;"></i> <span>Cài Đặt App Ngay</span>';
        }
    });

    window.handlePWAInstall = function() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                deferredPrompt = null;
            });
        } else {
            const guide = document.getElementById('iosInstallGuide');
            if (guide) {
                guide.style.display = (guide.style.display === 'none' || !guide.style.display) ? 'block' : 'none';
            }
        }
    };

    window.openModuleHub = function() {
        const overlay = document.getElementById('moduleHubOverlay');
        if (overlay) {
            overlay.classList.add('active');
            const searchInput = document.getElementById('moduleHubSearch');
            if (searchInput) {
                searchInput.value = '';
                window.filterModuleHub('');
                setTimeout(() => searchInput.focus(), 150);
            }
        }
    };

    window.closeModuleHub = function() {
        const overlay = document.getElementById('moduleHubOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    };

    window.filterModuleHub = function(query) {
        const q = (query || '').trim().toLowerCase();
        const cards = document.querySelectorAll('.module-hub-card');
        const groups = document.querySelectorAll('.module-hub-group');

        cards.forEach(card => {
            const title = (card.querySelector('.module-card-title')?.innerText || '').toLowerCase();
            const desc = (card.querySelector('.module-card-desc')?.innerText || '').toLowerCase();
            const badge = (card.querySelector('.module-card-badge')?.innerText || '').toLowerCase();
            const match = !q || title.includes(q) || desc.includes(q) || badge.includes(q);
            card.style.display = match ? 'flex' : 'none';
        });

        // Hide empty groups
        groups.forEach(grp => {
            const visibleCards = grp.querySelectorAll('.module-hub-card[style*="display: flex"], .module-hub-card:not([style*="display: none"])');
            grp.style.display = visibleCards.length > 0 ? 'block' : 'none';
        });
    };

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', () => {
        initSmartSearch();

        if (window.initGdtModule) window.initGdtModule();

        // Restore active module or default to Portal
        const savedModule = localStorage.getItem('active_module_id');
        if (savedModule && document.getElementById(savedModule)) {
            window.switchMainModule(savedModule);
        } else {
            window.switchMainModule('sectionPortal');
        }

        // Detect iOS for custom instruction text
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const pwaText = document.getElementById('pwaInstructionText');
        if (isIOS && pwaText) {
            pwaText.innerHTML = 'Được tối ưu riêng cho <strong>iPhone & iPad (iOS Safari)</strong>. Dùng 100% Offline không cần mạng.';
        }

        // Close Hub on Esc or click overlay background
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.closeModuleHub();
        });
        const hubOverlay = document.getElementById('moduleHubOverlay');
        if (hubOverlay) {
            hubOverlay.addEventListener('click', (e) => {
                if (e.target === hubOverlay) window.closeModuleHub();
            });
        }
    });

})();
