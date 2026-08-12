const FIT_APPLICATIONS = [
    {
        match: (h, s) => ['a','b','c','d'].includes(s.charAt(0).toLowerCase()) || ['a','b','c','d'].includes(h.charAt(0).toLowerCase()),
        title: "Lắp lỏng rất lớn (Loose Clearance)",
        apps: [
            "Các chi tiết chuyển động trong môi trường khắc nghiệt, nhiều bụi bẩn, cặn bã.",
            "Làm việc ở điều kiện nhiệt độ cao, độ giãn nở nhiệt lớn (ví dụ: chi tiết động cơ đốt trong, trục khuỷu).",
            "Bản lề cửa, trục quay bánh xe ròng rọc thô, các khớp nối ở máy móc nông nghiệp, máy khai thác mỏ.",
            "Các vị trí lắp ráp thô, không yêu cầu độ chính xác định tâm."
        ]
    },
    {
        match: (h, s) => ['e','f'].includes(s.charAt(0).toLowerCase()) || ['e','f'].includes(h.charAt(0).toLowerCase()),
        title: "Lắp lỏng chuyển động trơn (Free & Normal Running)",
        apps: [
            "Ổ trượt thông thường trong các hộp giảm tốc, trục vít, trục cam.",
            "Gối đỡ trục quay tốc độ cao hoặc trung bình, được bôi trơn bằng mỡ hoặc dầu.",
            "Các cụm chi tiết đòi hỏi dễ dàng xoay và trượt trơn tru (ví dụ: con lăn, puli không tải).",
            "Được sử dụng rất phổ biến trong chế tạo máy chung, máy công cụ và động cơ điện."
        ]
    },
    {
        match: (h, s) => s.charAt(0).toLowerCase() === 'g' || h.charAt(0).toLowerCase() === 'g',
        title: "Lắp lỏng chính xác (Close Running / Spigot Fit)",
        apps: [
            "Các chi tiết cần khe hở cực nhỏ để đảm bảo độ đồng tâm cao nhưng vẫn có thể xoay, trượt trơn tru.",
            "Trục chính của máy công cụ (máy tiện, máy phay) với ổ trượt màng dầu.",
            "Các thanh trượt dọc, thanh dẫn hướng chính xác, pít-tông và xilanh thủy lực.",
            "Bánh răng trượt trên trục, bộ ly hợp, con trượt chữ T."
        ]
    },
    {
        match: (h, s) => s.charAt(0).toLowerCase() === 'h' && h.charAt(0).toLowerCase() === 'h',
        title: "Lắp trượt định vị (Sliding / Locating Fit)",
        apps: [
            "Lắp ráp các chi tiết cố định tĩnh nhưng dễ dàng tháo lắp bằng tay, không cần dùng lực.",
            "Các chi tiết dùng để định vị, không có chuyển động tương đối với nhau khi máy làm việc.",
            "Bánh răng thay thế trên trục, tay quay, đĩa phân độ, chốt định vị, bạc lót định hướng mũi khoan.",
            "Vành trong của ổ bi, khớp nối trục thông thường."
        ]
    },
    {
        match: (h, s) => ['js','j','k','m'].some(prefix => s.toLowerCase().startsWith(prefix) || h.toLowerCase().startsWith(prefix)),
        title: "Lắp trung gian / Lắp đẩy (Push / Wringing Fit)",
        apps: [
            "Định vị cực kỳ chính xác, quá trình tháo lắp cần dùng búa gỗ, búa nhựa hoặc lực ép nhẹ.",
            "Vành trong của ổ bi ráp trên trục, vành ngoài ổ bi ráp vào thân vỏ (tùy tải trọng).",
            "Bánh răng, puli lắp trên trục truyền động có sử dụng then chốt để truyền momen xoắn.",
            "Chốt định vị khuôn mẫu, các loại nắp chặn mỡ, bạc lót bằng đồng."
        ]
    },
    {
        match: (h, s) => ['n','p'].includes(s.charAt(0).toLowerCase()) || ['n','p'].includes(h.charAt(0).toLowerCase()),
        title: "Lắp chặt nhẹ (Press Fit)",
        apps: [
            "Ghép nối cố định vững chắc, truyền momen xoắn nhỏ mà không nhất thiết phải dùng then (dù thường vẫn kết hợp then).",
            "Có thể tháo rời để bảo dưỡng bằng vam hoặc máy ép chuyên dụng mà không làm trầy xước, hỏng chi tiết.",
            "Bạc lót bằng đồng hoặc thép ép chặt vào thân vỏ máy (vỏ bơm, vỏ bưởng).",
            "Bánh răng lớn ép lên trục, vành đai ốp thân máy."
        ]
    },
    {
        match: (h, s) => ['r','s','t','u','v','x','y','z'].includes(s.charAt(0).toLowerCase()) || ['r','s','t','u','v','x','y','z'].includes(h.charAt(0).toLowerCase()),
        title: "Lắp chặt cực nặng (Heavy Drive / Force Fit)",
        apps: [
            "Ghép nối vĩnh cửu, không tháo rời. Chịu lực uốn, lực dọc trục và momen xoắn cực cao mà hoàn toàn không cần then.",
            "Thường phải lắp ráp bằng phương pháp gia nhiệt (nung nóng lỗ) hoặc làm lạnh sâu trục bằng nito lỏng.",
            "Lõi thép roto của động cơ điện công suất lớn ép thẳng lên trục.",
            "Vành bánh răng bằng đồng hoặc thép hợp kim ép lên tâm thép cán.",
            "Công nghiệp nặng: Ép bánh xe lửa vào trục toa xe, ghép nối các trục thép không tâm."
        ]
    }
];

function getFitApplicationHtml(holeStr, shaftStr) {
    const hole = holeStr.replace(/[0-9]/g, '');
    const shaft = shaftStr.replace(/[0-9]/g, '');
    
    let resultObj = FIT_APPLICATIONS.find(app => app.match(hole, shaft));
    
    if (!resultObj) {
        return `<div style="font-style: italic;">Không tìm thấy dữ liệu ứng dụng cụ thể cho kiểu lắp ghép này.</div>`;
    }

    let html = `
        <div style="margin-bottom: 8px; font-weight: bold; color: #38bdf8; text-transform: uppercase;">
            ${resultObj.title}
        </div>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #cbd5e1;">
            ${resultObj.apps.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
        </ul>
    `;
    return html;
}
