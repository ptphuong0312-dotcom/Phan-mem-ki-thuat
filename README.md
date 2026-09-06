# ⚙️ Trợ Lý Cơ Khí Xưởng (Mechanical Workshop Assistant PWA)

Ứng dụng web Progressive Web App (PWA) chuyên nghiệp phục vụ kỹ sư thiết kế máy, kỹ thuật viên tiện/phay CNC và chuyên gia bảo trì tại các nhà máy cơ khí, xi măng, khai khoáng, luyện kim. Hoạt động 100% **Offline** không cần kết nối mạng.

---

## 🌟 4 Module Chức Năng Cốt Lõi

### 1. 🔩 Tra Cứu Thông Số Ren & Tiện Ren
- **Tra cứu thuận**: Hệ Mét (ISO Metric Coarse/Fine M1-M100+), Hệ Inch (UNC/UNF/UNEF), Ren Ống (BSPP - G, BSPT - R/Rc, NPT), Ren Thang truyền lực (Trapezoidal Tr DIN 103, ACME, Stub ACME).
- **Xuất thông số chính xác**: Bước ren $P$, đường kính ngoài $d$, đường kính trung bình $d_2$, đường kính trong $d_1$, góc đỉnh ren ($60^\circ, 55^\circ, 30^\circ, 29^\circ$), **đường kính phôi tiện ngoài** và **kích thước mũi khoan taro chuẩn**.
- **Tra cứu ngược**: Nhập đường kính thực đo bằng thước kẹp $\to$ Tự động nhận diện và gợi ý loại ren phù hợp.
- **Tiện ích Camera**: Thước đo bước ren AR và OCR quét bản vẽ giấy (Tesseract.js).
- **Vẽ biên dạng 2D (Profile)**: Trực quan hóa mặt cắt profin răng ren.

### 2. 📐 Tính Toán Dung Sai Lắp Ghép ISO 286 & Then Bằng
- **Động cơ ISO 286:2010**: Cấp chính xác IT01 $\to$ IT18 cho kích thước $1 \to 3.150\text{ mm}$.
- **Hệ thống Lỗ cơ bản ($H$) & Trục cơ bản ($h$)**: Đầy đủ các miền dung sai từ $A \to ZC$ và $a \to zc$.
- **Ma trận kiểu lắp ghép (Fit Matrix)**: Tự động phân loại Lắp lỏng (Clearance), Lắp trung gian (Transition), Lắp chặt (Interference) kèm cẩm nang ứng dụng thực tế.
- **Rãnh then DIN 6885 / TCVN**: Tra cứu kích thước then bằng, chiều sâu rãnh trục $t_1$, may-ơ $t_2$, dung sai $P9, N9, JS9$.

### 3. 🔍 Tra Cứu Độ Nhám Bề Mặt & Cấp Gia Công
- **Bảng tương đương độ nhám**: Chuyển đổi giữa cấp cũ $\nabla 1 \to \nabla 14$ (TCVN 2511), $Ra$ ($\mu\text{m}$), $Rz$ ($\mu\text{m}$) và cấp ISO 1302 (N1 $\to$ N12).
- **Phương pháp gia công**: Tương quan độ nhám đạt được qua đúc cát, tiện thô, phay, tiện tinh, mài, doa, mài khôn (Honing), mài nghiền (Lapping).
- **Chỉ dẫn kỹ thuật bề mặt xưởng**: Tiêu chuẩn độ nhám cho ngỗng trục lắp ổ lăn, mặt làm việc răng bánh răng, mặt phân khuôn vỏ hộp số.

### 4. ⚙️ Cẩm Nang Kỹ Thuật 23 Hộp Số Công Nghiệp Nặng (2.2 kW - 4.000 kW)
Thư viện thông số chuyên sâu cho 23 dòng hộp số công nghiệp nặng điển hình trong nhà máy:
- **Sumitomo Cyclo 6195** (2.2 - 11 kW) - Băng tải cân, van quay
- **Haver & Boecker** (5.5 - 11 kW) - Máy đóng bao xoay
- **SEW F127 / F157** (11 - 37 kW) - Quả xoài treo trục
- **SEW K157** (15 - 55 kW) - Hộp số nón trụ chân đế
- **Nord SK 9092.1 UNICASE** (30 - 90 kW) - Vỏ đúc liền khối
- **Brevini / Dana SL3003** (45 - 110 kW) - Hành tinh quay toa máy rải liệu
- **Kiln Auxiliary Drive** (45 - 90 kW) - Truyền động phụ quay chậm lò nung
- **SEW MC3RL 08** (75 - 200 kW) - Quạt hút lò nung
- **Flender H2KV / SEW X.V** (132 - 350 kW) - Phân ly trục đứng
- **Hansen P4** (200 - 630 kW) - Quạt gió lò, bơm quặng
- **Flender H1SH / SEW M1..N** (200 - 630 kW) - 1 Cấp tốc độ cao tuabin
- **ZSY 630 / ZSY 710** (250 - 650 kW) - Trụ nghiêng 3 cấp cán thép
- **Flender Planurex 3 P3SA 22** (250 - 800 kW) - Hành tinh máy cán ép con lăn
- **DCY 630** (280 - 710 kW) - Nón - trụ 3 cấp băng tải quặng
- **Bonfiglioli HDO 160** (315 - 750 kW) - Băng tải tải nặng
- **Flender B3SH 18** (315 - 850 kW) - Băng tải clinker chính
- **David Brown Santasalo CX18** (350 - 800 kW) - Dẫn động chính lò quay
- **Flender H3SH 18** (355 - 900 kW) - Trụ nghiêng nghiền bi
- **SEW X3KS 280** (400 - 1.100 kW) - Gầu nâng đĩa siêu tải
- **SEW X3FS 300** (500 - 1.350 kW) - Nghiền than xi măng
- **Renk KPB / CBR / Maag WPU** (1.200 - 4.000 kW) - Nghiền đứng VRM chịu tải dọc 25.000 kN
- **Flender DUORED / DM3** (1.500 - 3.500 kW) - Phân dòng công suất nghiền bi
- **Flender B4SH 18** (250 - 630 kW) - Nón - trụ 4 cấp gầu tải clinker (Tích hợp Backstop)

**Dữ liệu cung cấp cho mỗi hộp số:**
- Thông số danh định ($P, T_{2N}, i, n_2, L \times W \times H, m$).
- Vị trí làm việc & đặc tính tải trong nhà máy.
- Sơ đồ chuỗi động học Topology.
- Bảng dung sai mài ngỗng trục, may-ơ, gối đỡ ổ lăn ISO 286 ($\mu\text{m}$) & mã ổ chính hãng (SKF / FAG / INA / TIMKEN).
- Cẩm nang gia công dung sai, khe hở cạnh răng ($j_n, j_r$), nung cảm ứng nhiệt, căn chỉnh khe hở dọc trục đệm shims, lực xiết bu-lông và rung động ISO 10816-3.

---

## 💻 Công Nghệ Sử Dụng

- **Frontend**: HTML5, CSS3 (Engineering Dark Theme), Vanilla JavaScript.
- **PWA (Progressive Web App)**: Service Worker cache offline, Web App Manifest.
- **Tính toán toán học**: Thuật toán nội suy dung sai ISO 286 độc lập, không dùng thư viện ngoài nặng nề.
- **Tương thích**: Chạy mượt trên mọi thiết bị: PC, Laptop xưởng, Máy tính bảng, Điện thoại Android / iOS.

---

## 📦 Cài Đặt & Chạy Cục Bộ

```bash
# Clone repository
git clone https://github.com/ptphuong0312-dotcom/Phan-mem-ki-thuat.git

# Mở trực tiếp file index.html trên bất kỳ trình duyệt nào
# Hoặc chạy server tĩnh
npx serve .
```

---

© 2026 ptphuong0312-dotcom. Giấy phép MIT.
