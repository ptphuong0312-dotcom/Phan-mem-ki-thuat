# UI & Design Guidelines

Khi làm việc với dự án Tra Cứu Ren, Antigravity và các Agent con CẦN PHẢI tuân thủ các quy tắc thiết kế giao diện sau:

## 1. Phong Cách Bản Vẽ Kỹ Thuật (Engineering Drawing Style)
Tab "Tính Toán Dung Sai" đã được thiết kế theo phong cách bản vẽ kỹ thuật CAD.
- **Kích thước danh nghĩa**: Cỡ chữ lớn, font `monospace`, màu `#fb923c` (cam).
- **Lỗ/Trục (Hole/Shaft)**: Các ký hiệu như H7, g6 phải được hiển thị to rõ với cỡ chữ `32px` (màu trắng).
- **Trị số sai lệch (ES, EI, es, ei)**: Hiển thị ngay bên cạnh ký hiệu cấp chính xác, dạng xếp chồng trên/dưới. Sử dụng font `monospace`, màu `#fb923c` (cam), và **BẮT BUỘC** hiển thị dấu cộng `+` cho các giá trị dương.
- **Badge kiểu lắp ghép**: Sử dụng thẻ (badge) hiển thị kiểu lắp (LẮP LỎNG, LẮP TRUNG GIAN, LẮP CHẶT) với màu sắc tương ứng (green, yellow, red).

## 2. Công Nghệ Sử Dụng
- **HTML/CSS/JS thuần**: Ứng dụng này sử dụng kiến trúc Vanilla JS.
- **KHÔNG SỬ DỤNG TailwindCSS**: Mọi tùy chỉnh CSS phải được viết trực tiếp vào file `css/` hoặc inline-style. Không cài đặt và không sử dụng các class Tailwind.

## 3. Quy Cấu Trúc Bố Cục (Layout)
- Ứng dụng có các khu vực nội dung được đặt trong `div.iso-panel-body`.
- Giao diện tra cứu có màu nền tối (Dark Theme) sử dụng các biến CSS `--bg-dark`, `--card-bg`, `--text-light`.
- Các bảng biểu (Tables) phải được bọc trong `div.iso-fit-matrix-wrapper` và sử dụng class `iso-fit-table` để duy trì sự nhất quán.
