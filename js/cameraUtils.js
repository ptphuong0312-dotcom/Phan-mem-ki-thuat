document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const btnArGauge = document.getElementById('btnArGauge');
    const btnOcrScan = document.getElementById('btnOcrScan');
    const cameraWorkspace = document.getElementById('cameraWorkspace');
    const arSection = document.getElementById('arSection');
    const ocrSection = document.getElementById('ocrSection');

    // AR Elements
    const arVideo = document.getElementById('arVideo');
    const arCanvas = document.getElementById('arCanvas');
    const gridSlider = document.getElementById('gridSlider');
    const gridVal = document.getElementById('gridVal');
    let stream = null;
    let arAnimationId = null;

    // OCR Elements
    const btnRunOcr = document.getElementById('btnRunOcr');
    const ocrInput = document.getElementById('ocrInput');
    const ocrStatus = document.getElementById('ocrStatus');
    const ocrResults = document.getElementById('ocrResults');

    btnArGauge.addEventListener('click', () => {
        cameraWorkspace.classList.remove('hidden');
        ocrSection.classList.add('hidden');
        arSection.classList.remove('hidden');
        startAR();
    });

    btnOcrScan.addEventListener('click', () => {
        cameraWorkspace.classList.remove('hidden');
        arSection.classList.add('hidden');
        ocrSection.classList.remove('hidden');
        stopAR();
    });

    // ==========================================
    // 1. AR GAUGE LOGIC
    // ==========================================
    function startAR() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(function (mediaStream) {
                    stream = mediaStream;
                    arVideo.srcObject = mediaStream;
                    arVideo.onloadedmetadata = () => {
                        arVideo.play();
                        arCanvas.width = arVideo.clientWidth;
                        arCanvas.height = arVideo.clientHeight;
                        drawARGrid();
                    };
                })
                .catch(function (err) {
                    alert("Không thể truy cập camera: " + err.message);
                });
        } else {
            alert("Trình duyệt không hỗ trợ Camera API.");
        }
    }

    function stopAR() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        if (arAnimationId) {
            cancelAnimationFrame(arAnimationId);
            arAnimationId = null;
        }
    }

    gridSlider.addEventListener('input', (e) => {
        gridVal.innerText = e.target.value;
    });

    function drawARGrid() {
        const ctx = arCanvas.getContext('2d');
        ctx.clearRect(0, 0, arCanvas.width, arCanvas.height);

        // Kích thước lưới mô phỏng, nhân với một hệ số scale pixel
        const pitchMm = parseFloat(gridSlider.value);
        const pixelPerMm = 20; // Giả định 1mm = 20px trên màn hình
        const spacing = pitchMm * pixelPerMm;

        ctx.strokeStyle = 'rgba(102, 187, 106, 0.7)'; // Màu xanh lá
        ctx.lineWidth = 1.5;

        // Vẽ lưới ngang
        for (let y = arCanvas.height / 2; y < arCanvas.height; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(arCanvas.width, y); ctx.stroke();
        }
        for (let y = arCanvas.height / 2; y > 0; y -= spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(arCanvas.width, y); ctx.stroke();
        }

        // Đường chuẩn giữa
        ctx.strokeStyle = 'rgba(255, 183, 77, 0.9)'; // Màu cam
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(0, arCanvas.height / 2); 
        ctx.lineTo(arCanvas.width, arCanvas.height / 2); 
        ctx.stroke();

        arAnimationId = requestAnimationFrame(drawARGrid);
    }

    // ==========================================
    // 2. OCR SCANNER LOGIC
    // ==========================================
    btnRunOcr.addEventListener('click', () => {
        if (!ocrInput.files || ocrInput.files.length === 0) {
            alert("Vui lòng chọn hoặc chụp một ảnh bản vẽ.");
            return;
        }

        const file = ocrInput.files[0];
        ocrStatus.innerText = "Đang khởi tạo AI (có thể mất vài giây)...";
        ocrResults.innerHTML = '';

        // Đảm bảo thư viện Tesseract đã được load
        if (typeof Tesseract === 'undefined') {
            ocrStatus.innerText = "Lỗi: Thư viện Tesseract AI chưa được tải xong, vui lòng kiểm tra mạng.";
            return;
        }

        Tesseract.recognize(
            file,
            'eng',
            { logger: m => {
                if(m.status === 'recognizing text') {
                    ocrStatus.innerText = `Đang quét chữ... ${(m.progress * 100).toFixed(0)}%`;
                }
            }}
        ).then(({ data: { text } }) => {
            ocrStatus.innerText = "Quét thành công! Đang phân tích dữ liệu...";
            parseOcrText(text);
        }).catch(err => {
            ocrStatus.innerText = "Lỗi quét: " + err.message;
        });
    });

    function parseOcrText(text) {
        // Tìm các mẫu ren: M8, M10x1.5, 1/4-20 UNC, v.v.
        const regex = /([M]\d+(?:[xX]\d+\.?\d*)?|\d+\/\d+-\d+\s*(?:UNC|UNF))/gi;
        const matches = text.match(regex);

        if (!matches || matches.length === 0) {
            ocrResults.innerHTML = '<div class="empty-state">Không tìm thấy mã ren nào trong ảnh.</div>';
            ocrStatus.innerText = "";
            return;
        }

        // Lọc trùng lặp
        const uniqueMatches = [...new Set(matches.map(m => m.toUpperCase()))];
        ocrStatus.innerText = `Tìm thấy ${uniqueMatches.length} mã ren trên bản vẽ.`;

        uniqueMatches.forEach(code => {
            // Chuẩn hóa để search
            const searchCode = code.replace('X', 'x');
            const selectedSystem = document.getElementById('ocrSystemFilter').value;
            
            // Dò trong DB
            const foundThreads = threadData.filter(t => {
                // Lọc hệ ren
                if (selectedSystem !== 'All' && t.system !== selectedSystem) {
                    return false;
                }
                return t.size.toUpperCase() === searchCode || t.id.toUpperCase().includes(searchCode);
            });
            
            const card = document.createElement('div');
            card.className = 'result-card';
            
            if (foundThreads.length > 0) {
                const item = foundThreads[0];
                card.innerHTML = `
                    <div class="card-header">
                        <div class="thread-size">${item.size}</div>
                        <div class="thread-type">${item.type}</div>
                    </div>
                    <div class="data-grid">
                        <div class="data-item">
                            <div class="data-label">Cần chuẩn bị Mũi khoan</div>
                            <div class="data-value highlight-value">${item.tapDrill} mm</div>
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="card-header">
                        <div class="thread-size">${searchCode}</div>
                        <div class="thread-type">Không có sẵn trong DB</div>
                    </div>
                `;
            }
            ocrResults.appendChild(card);
        });
    }
});
