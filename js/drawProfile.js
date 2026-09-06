document.addEventListener('DOMContentLoaded', () => {
    const drawingModal = document.getElementById('drawingModal');
    const closeBtn = document.querySelector('.close-btn');
    const threadCanvas = document.getElementById('threadCanvas');
    const ctx = threadCanvas.getContext('2d');

    const modalThreadTitle = document.getElementById('modalThreadTitle');
    const turningDia = document.getElementById('turningDia');
    const modalTapDrill = document.getElementById('modalTapDrill');

    // Lắng nghe sự kiện click trên toàn bộ resultContainer để mở modal (Event Delegation)
    document.getElementById('resultsContainer').addEventListener('click', (e) => {
        const card = e.target.closest('.result-card');
        if (!card) return;

        const id = card.getAttribute('data-id');
        
        // Tìm data thật
        const item = threadData.find(t => t.id === id);
        if (item) {
            openModal(item);
        }
    });

    closeBtn.addEventListener('click', () => {
        drawingModal.classList.add('hidden');
    });

    // Đóng modal khi bấm ra ngoài
    window.addEventListener('click', (e) => {
        if (e.target === drawingModal) {
            drawingModal.classList.add('hidden');
        }
    });

    function openModal(item) {
        modalThreadTitle.innerText = item.size + ' (' + item.type + ')';
        
        // Tính toán phôi tiện: d_phoi = d - 0.1 * P (cho hệ mét)
        let turningVal = 'Không rõ';
        if (item.majorDia && !isNaN(parseFloat(item.majorDia)) && item.pitch && !isNaN(parseFloat(item.pitch))) {
            const d = parseFloat(item.majorDia);
            const p = parseFloat(item.pitch);
            turningVal = (d - 0.1 * p).toFixed(2) + ' mm';
        } else if (item.system.includes('Inch') && item.pitch.includes('TPI')) {
             // Ước tính cho hệ inch: P (mm) = 25.4 / TPI
             const tpiMatch = item.pitch.match(/(\d+)/);
             if (tpiMatch && item.majorDia && !isNaN(parseFloat(item.majorDia))) {
                 const p_mm = 25.4 / parseFloat(tpiMatch[1]);
                 turningVal = (parseFloat(item.majorDia) - 0.1 * p_mm).toFixed(2) + ' mm';
             }
        }
        
        turningDia.innerText = turningVal;
        modalTapDrill.innerText = item.tapDrill !== 'N/A' ? item.tapDrill + ' mm' : 'N/A';

        drawProfile(item);
        drawingModal.classList.remove('hidden');
    }

    function drawProfile(item) {
        ctx.clearRect(0, 0, threadCanvas.width, threadCanvas.height);
        
        const width = threadCanvas.width;
        const height = threadCanvas.height;
        
        // Vẽ lưới (Grid)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 20) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        }
        for (let j = 0; j < height; j += 20) {
            ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(width, j); ctx.stroke();
        }

        // Mô phỏng vẽ đường biên ren ngoài (Profile)
        ctx.strokeStyle = '#ffb74d'; // Accent color
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        let startY = 150; // Chân ren
        let peakY = 50;   // Đỉnh ren
        let pitchPx = 60; // Chiều dài 1 bước ren mô phỏng
        
        let currentX = 20;
        ctx.moveTo(currentX, startY);
        
        for (let i = 0; i < 4; i++) {
            // Lên đỉnh
            currentX += pitchPx * 0.4;
            ctx.lineTo(currentX, peakY);
            // Kéo vệt bằng ở đỉnh (nếu có)
            currentX += pitchPx * 0.1;
            ctx.lineTo(currentX, peakY);
            // Xuống chân
            currentX += pitchPx * 0.4;
            ctx.lineTo(currentX, startY);
            // Kéo vệt bằng ở chân
            currentX += pitchPx * 0.1;
            ctx.lineTo(currentX, startY);
        }
        ctx.stroke();

        // Ghi chú Pitch
        ctx.fillStyle = '#66bb6a';
        ctx.font = '14px Inter';
        ctx.fillText('Bước ren (Pitch): ' + item.pitch, 100, peakY - 20);
        
        // Ghi chú mũi tên
        ctx.beginPath();
        ctx.moveTo(44, peakY - 5);
        ctx.lineTo(104, peakY - 5);
        ctx.strokeStyle = '#66bb6a';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
});
