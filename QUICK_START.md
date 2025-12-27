# 🚀 HƯỚNG DẪN NHANH - PORTFOLIO WEBSITE

## 📦 Cài đặt & Chạy (5 phút)

```bash
# 1. Cài đặt
npm install

# 2. Chạy server
npm start

# 3. Mở trình duyệt
http://localhost:3000
```

---

## ⚙️ SETTINGS PANEL - TÍNH NĂNG HOT! 🔥

### Mở Settings
👉 Click nút **bánh răng (⚙️)** góc dưới bên phải

### 3 Việc quan trọng nhất:

#### 1️⃣ THAY ẢNH ĐẠI DIỆN (3 giây)
- Click vào ảnh tròn trong Settings
- Chọn ảnh từ máy
- XONG! (không cần Admin)

#### 2️⃣ ĐỔI MÀU GIAO DIỆN (2 click)
**6 Theme có sẵn:**
- 🔵 **Chuyên nghiệp** (xanh dương) - Mặc định
- 🟣 **Hiện đại** (tím)
- 🌊 **Đại dương** (xanh nước biển)
- 🌅 **Hoàng hôn** (cam vàng)
- 🌲 **Rừng xanh** (xanh lá)
- 🌸 **Hồng hoa** (hồng)

👉 Click vào theme → Đổi ngay!

#### 3️⃣ TÙY CHỈNH MÀU RIÊNG
- Cuộn xuống "Màu tùy chỉnh"
- Click ô màu → Chọn màu bạn thích
- 3 loại màu: Chính / Phụ / Nhấn

### Lưu lại:
✅ Click nút **"Lưu"** → Cài đặt được lưu vĩnh viễn  
🔄 Click **"Đặt lại"** → Về mặc định

---

## 🎨 ADMIN PANEL (Nếu cần quản lý nội dung)

```
URL: http://localhost:3000/admin
Username: admin
Password: admin123
```

### Quản lý được gì?
- ✏️ Profile (tên, bio, social links)
- 📚 Stories (câu chuyện + nhiều ảnh)
- 🖼️ Ảnh hoạt động (gallery)
- 💼 Projects
- 🎓 Skills, Experience, Education, Awards

---

## 🎯 SO SÁNH: Settings vs Admin

| Tính năng | Settings Panel | Admin Panel |
|-----------|----------------|-------------|
| **Đăng nhập** | ❌ Không cần | ✅ Cần login |
| **Đổi avatar** | ✅ | ✅ |
| **Đổi màu** | ✅ | ❌ |
| **Sửa nội dung** | ❌ | ✅ |
| **Ai dùng?** | Tất cả mọi người | Chỉ admin |

💡 **Khi nào dùng Settings?**
- Muốn thay ảnh đại diện nhanh
- Muốn đổi màu giao diện
- Không muốn đăng nhập

💡 **Khi nào dùng Admin?**
- Cập nhật nội dung: stories, projects, skills...
- Quản lý toàn bộ website

---

## 🎨 CẢI TIẾN MÀU SẮC MỚI

### Trước đây (Cũ):
❌ Màu tím/hồng - Không chuyên nghiệp  
❌ Phải sửa code CSS  
❌ Không linh hoạt

### Bây giờ (Mới):
✅ Màu xanh dương chuyên nghiệp (mặc định)  
✅ 6 theme đẹp sẵn có  
✅ Đổi màu bằng 2 click  
✅ Tùy chỉnh không giới hạn  
✅ Lưu cài đặt tự động

---

## 📱 RESPONSIVE

Website tự động đẹp trên:
- 📱 Điện thoại
- 📱 Máy tính bảng
- 💻 Laptop/Desktop

---

## 🆘 TROUBLESHOOTING

### Settings không mở?
- Kiểm tra console (F12) xem có lỗi không
- Reload trang (Ctrl + F5)

### Màu không đổi?
- Click nút "Lưu" sau khi chọn theme
- Xóa cache trình duyệt và reload

### Ảnh avatar không hiển thị?
- Chọn ảnh dung lượng nhỏ hơn 5MB
- Format: JPG, PNG, GIF, WebP

### Port 3000 bị chiếm?
Sửa file `server/server.js`:
```javascript
const PORT = 5000; // Đổi sang port khác
```

---

## ⚡ TIPS & TRICKS

1. **Đổi màu theo tâm trạng**  
   Mở Settings → Thử các theme khác nhau

2. **Ảnh đại diện chuyên nghiệp**  
   - Nền trơn  
   - Ánh sáng tốt  
   - Khuôn mặt rõ nét  
   - Size: 300x300px trở lên

3. **Kết hợp màu đẹp**  
   - Chuyên nghiệp: Xanh dương  
   - Sáng tạo: Tím/Hồng  
   - Công nghệ: Xanh lá/Xanh nước biển  
   - Ấm áp: Cam/Vàng

---

## 🎉 TÓM TẮT

✅ **Không cần vào Admin để đổi giao diện**  
✅ **6 theme đẹp chọn ngay**  
✅ **Tùy chỉnh màu tự do**  
✅ **Upload avatar 1 click**  
✅ **Lưu vĩnh viễn vào trình duyệt**

---

**Made with ❤️ - Happy Coding! 🚀**
