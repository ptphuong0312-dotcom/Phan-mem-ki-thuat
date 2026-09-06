/**
 * GD&T KNOWLEDGE BASE & ISO 1101 / ASME Y14.5 SPECIFICATIONS
 * 14 Geometric Characteristics across Form, Orientation, Location, Runout & Profile
 */

const GDT_CATEGORIES = {
    FORM: 'Hình Dạng (Form) - Không dùng chuẩn',
    ORIENTATION: 'Hướng (Orientation) - Bắt buộc có chuẩn',
    LOCATION: 'Vị Trí (Location) - Bắt buộc có chuẩn',
    RUNOUT: 'Độ Đảo (Runout) - Dựa trên đường tâm chuẩn',
    PROFILE: 'Biên Dạng (Profile) - Có hoặc không chuẩn'
};

const GDT_DATABASE = [
    // ---------------- FORM ----------------
    {
        id: 'straightness',
        symbol: '⎯',
        nameVi: 'Độ Thẳng',
        nameEn: 'Straightness',
        category: GDT_CATEGORIES.FORM,
        datumRequired: false,
        zoneDesc: 'Vùng dung sai giới hạn bởi hai đường thẳng song song cách nhau khoảng t (trên mặt phẳng), hoặc hình trụ đường kính ⌀t (đối với đường tâm trục).',
        fcfDefault: { sym: '⎯', val: '0.02', mod: '', datumA: '', datumB: '', datumC: '' },
        workshopMethod: 'Đặt chi tiết lên bàn máp phẳng. Dùng đồng hồ so (Dial Indicator) rà dọc theo đường sinh của trục hoặc mép chi tiết. Độ chênh lệch lớn nhất giữa các điểm đọc là độ thẳng thực tế.',
        appExample: 'Đường sinh trục dài, thanh trượt dẫn hướng, then bằng, sống trượt bàn máy tiện.',
        ruleIso: 'ISO 1101: Áp dụng cho từng đường sinh riêng biệt hoặc đường tâm trục.'
    },
    {
        id: 'flatness',
        symbol: '⏢',
        nameVi: 'Độ Phẳng',
        nameEn: 'Flatness',
        category: GDT_CATEGORIES.FORM,
        datumRequired: false,
        zoneDesc: 'Vùng dung sai nằm giữa hai mặt phẳng song song lý tưởng cách nhau khoảng cách t.',
        fcfDefault: { sym: '⏢', val: '0.03', mod: '', datumA: '', datumB: '', datumC: '' },
        workshopMethod: 'Đặt chi tiết lên 3 điểm kê trên bàn máp đá granit. Dùng đồng hồ so gắn đế từ quét toàn bộ bề mặt theo đường zíc-zắc. Hiệu số giữa điểm cao nhất và thấp nhất là độ phẳng.',
        appExample: 'Mặt phân khuôn vỏ hộp giảm tốc (ngăn rò rỉ dầu), mặt bích nắp ổ trục, chân đế máy.',
        ruleIso: 'Bề mặt thực tế không được vượt ra ngoài hai mặt phẳng giới hạn.'
    },
    {
        id: 'circularity',
        symbol: '⌭',
        nameVi: 'Độ Tròn',
        nameEn: 'Circularity / Roundness',
        category: GDT_CATEGORIES.FORM,
        datumRequired: false,
        zoneDesc: 'Trên mỗi mặt cắt vuông góc với trục, biên dạng tròn phải nằm giữa hai đường tròn đồng tâm có bán kính chênh lệch nhau một khoảng t.',
        fcfDefault: { sym: '⌭', val: '0.01', mod: '', datumA: '', datumB: '', datumC: '' },
        workshopMethod: 'Đặt trục lên hai khối V (V-block) trên bàn máp. Đặt đầu kim đồng hồ so tiếp xúc đỉnh ngỗng trục, quay trục 1 vòng (360°). Độ biến thiên kim chỉ giá trị độ tròn.',
        appExample: 'Ngỗng trục lắp ổ bi, xi lanh pít-tông, cổ trục phớt chặn dầu.',
        ruleIso: 'Đo trên từng mặt cắt ngang độc lập.'
    },
    {
        id: 'cylindricity',
        symbol: '⌭',
        nameVi: 'Độ Trụ',
        nameEn: 'Cylindricity',
        category: GDT_CATEGORIES.FORM,
        datumRequired: false,
        zoneDesc: 'Toàn bộ bề mặt trụ phải nằm giữa hai mặt trụ đồng trục có bán kính chênh lệch nhau t (bao gồm cả độ thẳng, độ tròn và độ côn).',
        fcfDefault: { sym: '⌭', val: '0.015', mod: '', datumA: '', datumB: '', datumC: '' },
        workshopMethod: 'Đo trên máy đo độ tròn/độ trụ chuyên dụng hoặc máy CMM bằng cách quét xoắn ốc dọc chiều dài trục. Đo xưởng: kết hợp đo độ tròn nhiều vị trí và độ thẳng đường sinh.',
        appExample: 'Lỗ sơ mi xi lanh thủy lực, ngỗng trục chính máy phay/tiện cao tốc.',
        ruleIso: 'Dung sai hình dạng phức tạp và nghiêm ngặt nhất.'
    },

    // ---------------- ORIENTATION ----------------
    {
        id: 'parallelism',
        symbol: '∥',
        nameVi: 'Độ Song Song',
        nameEn: 'Parallelism',
        category: GDT_CATEGORIES.ORIENTATION,
        datumRequired: true,
        zoneDesc: 'Vùng dung sai giới hạn bởi hai mặt phẳng (hoặc hình trụ ⌀t) song song với mặt chuẩn A.',
        fcfDefault: { sym: '∥', val: '0.02', mod: '', datumA: 'A', datumB: '', datumC: '' },
        workshopMethod: 'Gá mặt chuẩn A áp sát mặt bàn máp. Dùng đồng hồ so chân gập gắn đế từ rà khắp mặt cần kiểm tra. Chênh lệch cực đại là độ song song đối với mặt A.',
        appExample: 'Mặt đáy và mặt đỉnh thân hộp số, các rãnh dẫn hướng trượt, hai mặt bích đối đỉnh.',
        ruleIso: 'Phải luôn chỉ định ít nhất 1 bề mặt hoặc trục chuẩn.'
    },
    {
        id: 'perpendicularity',
        symbol: '⟂',
        nameVi: 'Độ Vuông Góc',
        nameEn: 'Perpendicularity',
        category: GDT_CATEGORIES.ORIENTATION,
        datumRequired: true,
        zoneDesc: 'Vùng dung sai nằm giữa hai mặt phẳng vuông góc chính xác 90° với mặt chuẩn A.',
        fcfDefault: { sym: '⟂', val: '0.02', mod: '', datumA: 'A', datumB: '', datumC: '' },
        workshopMethod: 'Đặt mặt chuẩn A lên bàn máp. Áp ke vuông góc đá hoa cương (Granite Square) vào chi tiết, rà đồng hồ so trượt theo cạnh đứng của ke vuông.',
        appExample: 'Mặt bích tựa ổ lăn so với đường tâm trục, vai trục tựa bánh răng, vách ngăn vỏ hộp số.',
        ruleIso: 'Quan trọng hàng đầu để tránh lệch bi và nghiêng bánh răng khi siết ốc.'
    },
    {
        id: 'angularity',
        symbol: '∠',
        nameVi: 'Độ Nghiêng',
        nameEn: 'Angularity',
        category: GDT_CATEGORIES.ORIENTATION,
        datumRequired: true,
        zoneDesc: 'Vùng dung sai nằm giữa hai mặt phẳng song song nghiêng một góc danh nghĩa chính xác so với mặt chuẩn.',
        fcfDefault: { sym: '∠', val: '0.03', mod: '', datumA: 'A', datumB: '', datumC: '' },
        workshopMethod: 'Gá phôi lên bàn nghiêng sin (Sine bar) được kê căn mẫu đạt góc lý thuyết. Đặt đồng hồ so rà phẳng bề mặt: nếu chỉ số không đổi nghĩa là góc nghiêng chính xác.',
        appExample: 'Bánh răng nón côn xoắn, rãnh mang cá góc 45°/60°, mặt nêm định vị.',
        ruleIso: 'Góc danh nghĩa phải được đóng khung kích thước lý thuyết (Basic Dimension).'
    },

    // ---------------- LOCATION ----------------
    {
        id: 'position',
        symbol: '⌖',
        nameVi: 'Vị Trí Thực',
        nameEn: 'True Position',
        category: GDT_CATEGORIES.LOCATION,
        datumRequired: true,
        zoneDesc: 'Tâm hoặc mặt trung hòa phải nằm trong vùng dung sai đường kính ⌀t có tâm tại vị trí danh nghĩa lý thuyết tuyệt đối.',
        fcfDefault: { sym: '⌖', val: '⌀ 0.05', mod: 'Ⓜ', datumA: 'A', datumB: 'B', datumC: 'C' },
        workshopMethod: 'Sử dụng dưỡng kiểm (Functional Gauge) theo điều kiện MMC (Ⓜ) hoặc đo tọa độ X, Y trên máy CMM để tính sai lệch vị trí tâm: 2 × √(ΔX² + ΔY²).',
        appExample: 'Vòng chia tâm lỗ bu-lông nắp hộp số, tâm các trục truyền ăn khớp bánh răng, lỗ định vị chốt.',
        ruleIso: 'Có thể kết hợp điều kiện vật liệu tối đa MMC (Ⓜ) để tăng vùng dung sai chế tạo.'
    },
    {
        id: 'concentricity',
        symbol: '◎',
        nameVi: 'Độ Đồng Tâm / Đồng Trục',
        nameEn: 'Concentricity / Coaxiality',
        category: GDT_CATEGORIES.LOCATION,
        datumRequired: true,
        zoneDesc: 'Đường tâm của chi tiết được kiểm tra phải nằm trong hình trụ có đường kính t đồng trục với trục chuẩn A.',
        fcfDefault: { sym: '◎', val: '0.02', mod: '', datumA: 'A', datumB: '', datumC: '' },
        workshopMethod: 'Chống tâm hai đầu trục chuẩn A. Dùng đồng hồ so đo đảo tại nhiều tiết diện và loại trừ sai số độ tròn để tính toán sai lệch tâm trục.',
        appExample: 'Cổ trục gắn phớt chặn dầu so với cổ trục lắp ổ bi, ngỗng trục lắp khớp nối.',
        ruleIso: 'Theo ASME Y14.5-2018, độ đồng tâm dần được thay thế bằng Vị trí thực (Position) hoặc Độ đảo.'
    },
    {
        id: 'symmetry',
        symbol: '⌯',
        nameVi: 'Độ Đối Xứng',
        nameEn: 'Symmetry',
        category: GDT_CATEGORIES.LOCATION,
        datumRequired: true,
        zoneDesc: 'Mặt phẳng trung hòa của hai bề mặt phải nằm giữa hai mặt phẳng song song cách nhau t và đối xứng qua mặt phẳng chuẩn.',
        fcfDefault: { sym: '⌯', val: '0.03', mod: '', datumA: 'A', datumB: '', datumC: '' },
        workshopMethod: 'Đặt mặt chuẩn lên bàn máp. Dùng đồng hồ so đo chiều cao bề mặt 1, lật ngược chi tiết đo bề mặt 2. So sánh độ lệch tâm trung hòa so với chuẩn.',
        appExample: 'Rãnh then bằng trên trục so với đường tâm trục, then hoa, rãnh chữ T.',
        ruleIso: 'Đảm bảo then ăn khớp đều hai bên thành may-ơ, không bị cấn lệch.'
    },

    // ---------------- RUNOUT ----------------
    {
        id: 'circular_runout',
        symbol: '↗',
        nameVi: 'Độ Đảo Hướng Tâm / Mặt Đầu',
        nameEn: 'Circular Runout',
        category: GDT_CATEGORIES.RUNOUT,
        datumRequired: true,
        zoneDesc: 'Độ biến thiên tổng của đồng hồ so (FIM/TIR) tại một mặt cắt tròn bất kỳ khi chi tiết quay 360° quanh trục chuẩn.',
        fcfDefault: { sym: '↗', val: '0.015', mod: '', datumA: 'A-B', datumB: '', datumC: '' },
        workshopMethod: 'Gá trục lên hai mũi tâm hoặc đặt cổ trục lên hai gối bi chuẩn. Đặt mũi kim đồng hồ so vuông góc với mặt cần đo. Quay chậm trục 360°. Độ nhảy kim lớn nhất chính là giá trị độ đảo.',
        appExample: 'Vành răng ăn khớp, mặt tựa chặn bi của trục, rãnh puly đai thang.',
        ruleIso: 'Kiểm tra độ nhảy riêng biệt tại từng vòng cắt đơn lẻ.'
    },
    {
        id: 'total_runout',
        symbol: '⌫',
        nameVi: 'Độ Đảo Toàn Phần',
        nameEn: 'Total Runout',
        category: GDT_CATEGORIES.RUNOUT,
        datumRequired: true,
        zoneDesc: 'Độ biến thiên tổng của đồng hồ so trên toàn bộ chiều dài bề mặt trụ hoặc phẳng khi chi tiết quay 360° quanh trục chuẩn kết hợp tịnh tiến kim.',
        fcfDefault: { sym: '⌫', val: '0.03', mod: '', datumA: 'A-B', datumB: '', datumC: '' },
        workshopMethod: 'Chống tâm trục trên bàn máp. Vừa quay trục 360° vừa dịch chuyển đầu đo đồng hồ so dọc theo toàn bộ bề mặt. Độ chênh lệch cực đại là độ đảo toàn phần.',
        appExample: 'Thân trục truyền động quay tốc độ cao (tuabin, quạt gió lò), trục cán thép nặng.',
        ruleIso: 'Bao gồm cả độ đảo hướng tâm, độ côn, độ cong và độ gợn sóng bề mặt.'
    },

    // ---------------- PROFILE ----------------
    {
        id: 'profile_line',
        symbol: '⌒',
        nameVi: 'Profile Đường Nét',
        nameEn: 'Profile of a Line',
        category: GDT_CATEGORIES.PROFILE,
        datumRequired: false,
        zoneDesc: 'Tại mỗi mặt cắt, đường bao thực tế phải nằm giữa hai đường bao cách đều đường profile lý thuyết một khoảng t.',
        fcfDefault: { sym: '⌒', val: '0.04', mod: '', datumA: 'A', datumB: 'B', datumC: '' },
        workshopMethod: 'Sử dụng máy chiếu quang học (Optical Comparator) đối chiếu dưỡng mẫu hoặc máy đo tọa độ CMM quét đường biên cong 2D.',
        appExample: 'Biên dạng răng thân khai của bánh răng, cánh quạt tuabin, cam hình học.',
        ruleIso: 'Áp dụng cho từng mặt cắt đường nét 2D riêng lẻ.'
    },
    {
        id: 'profile_surface',
        symbol: '⌓',
        nameVi: 'Profile Bề Mặt',
        nameEn: 'Profile of a Surface',
        category: GDT_CATEGORIES.PROFILE,
        datumRequired: false,
        zoneDesc: 'Toàn bộ bề mặt thực tế 3D phải nằm giữa hai mặt cong bọc cách đều bề mặt hình học lý thuyết t.',
        fcfDefault: { sym: '⌓', val: '0.05', mod: '', datumA: 'A', datumB: 'B', datumC: 'C' },
        workshopMethod: 'Quét đám mây điểm 3D (3D Laser Scanner) hoặc đầu chạm máy đo tọa độ CMM so sánh trực tiếp với mô hình CAD 3D gốc.',
        appExample: 'Mặt khuôn đúc dập kim loại, bề mặt vỏ hộp số khí động học, cánh bơm ly tâm cong phức tạp.',
        ruleIso: 'Dung sai toàn diện kiểm soát cả hình dạng, hướng, vị trí và kích thước bề mặt.'
    }
];
