# Quy tắc sao lưu (Backup Rules)

Khi được người dùng yêu cầu tạo bản backup mã nguồn (Zip project folder), Agent bắt buộc phải tuân thủ quy tắc đặt tên sau:

1. **Thư mục lưu trữ**: File backup phải được đặt trong thư mục `backups/` của dự án.
2. **Định dạng file**: `.zip` (hoặc định dạng nén khác nếu người dùng chỉ định cụ thể).
3. **Quy tắc đặt tên (Naming Convention)**:
   - Tên cơ bản: `Backup_YYYYMMDD.zip` (ví dụ: `Backup_20260814.zip`).
   - Nếu trong cùng một ngày, người dùng yêu cầu tạo thêm backup và file `Backup_YYYYMMDD.zip` ĐÃ TỒN TẠI, bạn PHẢI đánh số thứ tự tăng dần ở cuối tên file.
   - Ví dụ: 
     - Lần 1: `Backup_20260814.zip`
     - Lần 2: `Backup_20260814(1).zip`
     - Lần 3: `Backup_20260814(2).zip`
     - ...và tiếp tục như vậy.
4. **Loại trừ thư mục**: Khi zip, luôn loại trừ các thư mục không cần thiết như `.git`, `node_modules`, `venv`, và chính thư mục `backups/` để tránh file quá nặng (`-x "*.git*" -x "*venv*" -x "backups/*"`).
