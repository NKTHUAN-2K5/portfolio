# 🎨 Portfolio Website - Dynamic & Modern

Website portfolio cá nhân động với admin panel, hỗ trợ upload story, hình ảnh và quản lý nội dung hoàn chỉnh.

## 🔗 Live Links
- Portfolio (Vercel): https://portfolio-nkthuan3326.vercel.app
- Dự phòng: https://portfolio-nkt26.vercel.app
- Source GitHub: https://github.com/NKTHUAN-2K5/portfolio

Triển khai dạng web tĩnh: dữ liệu đọc từ `public/data/*.json`, ảnh phục vụ từ `public/assets` (kèm bản tên chuẩn hóa trong `public/assets/normalized`).

## ✨ Tính năng

### 🌐 Trang Portfolio (Public)
- **Hero Section**: Giới thiệu bản thân với avatar và thông tin cơ bản
- **Stories & Activities**: Timeline các câu chuyện và hoạt động gần đây (CÓ ẢNH)
- **Ảnh hoạt động**: Gallery ảnh với filter theo danh mục
- **Projects**: Hiển thị dự án đã thực hiện
- **Skills**: Hiển thị kỹ năng với progress bar
- **Experience**: Timeline kinh nghiệm làm việc
- **Education**: Học vấn
- **Awards**: Giải thưởng đạt được
- **Contact**: Thông tin liên hệ

### 🎯 Tính năng đặc biệt
- ✅ **Cài đặt trực tiếp trên trang chủ** - Không cần vào Admin!
- ✅ **Đổi màu giao diện** - 6 theme có sẵn + tùy chỉnh màu
- ✅ **Upload avatar trực tiếp** - Click vào ảnh đại diện để đổi
- ✅ Scroll animations (fade-in, reveal)
- ✅ Image lightbox (xem ảnh phóng to)
- ✅ Timeline hiển thị stories
- ✅ Filter gallery theo danh mục
- ✅ Hover effects hiện đại
- ✅ Responsive design (mobile-friendly)
- ✅ Lưu cài đặt vào localStorage (không mất khi reload)

### ⚙️ Admin Panel
- 🔐 Login bảo mật (username: `admin`, password: `admin123`)
- 📝 Quản lý Profile (tên, bio, avatar, social links)
- 📚 Quản lý Stories (thêm/sửa/xóa với upload nhiều ảnh)
- 🖼️ Quản lý Ảnh hoạt động (gallery với filter)
- 💼 Quản lý Projects
- 🎓 Quản lý Skills, Experience, Education, Awards
- 📤 Upload hình ảnh trực tiếp

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy server
```bash
npm start
```

Hoặc chạy với nodemon (auto-reload):
```bash
npm run dev
```

### 3. Truy cập website
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 📁 Cấu trúc project

```
portfolio/
├── data/                    # Dữ liệu JSON
│   ├── stories.json        # Câu chuyện & hoạt động
│   ├── gallery.json        # Ảnh hoạt động
│   ├── projects.json       # Dự án
│   ├── skills.json         # Kỹ năng
│   ├── experience.json     # Kinh nghiệm
│   ├── education.json      # Học vấn
│   ├── awards.json         # Giải thưởng
│   ├── profile.json        # Thông tin cá nhân
│   └── admin.json          # Tài khoản admin
├── public/                  # Frontend
│   ├── index.html          # Trang portfolio
│   ├── admin.html          # Admin panel
│   ├── css/
│   │   ├── style.css       # CSS portfolio
│   │   └── admin.css       # CSS admin
│   └── js/
│       ├── main.js         # JS portfolio
│       └── admin.js        # JS admin
├── server/
│   └── server.js           # Express server
├── uploads/                # Thư mục lưu ảnh upload
├── package.json
└── README.md
```

## 🎨 Sử dụng Settings Panel (Mới!)

### Mở Settings
1. Click vào nút **bánh răng (⚙️)** ở góc dưới bên phải màn hình
2. Panel cài đặt sẽ trượt ra từ bên phải

### Thay đổi Avatar (KHÔNG CẦN ADMIN!)
1. Mở Settings Panel
2. Click vào ảnh đại diện tròn
3. Chọn ảnh từ máy tính
4. Ảnh sẽ tự động cập nhật ngay lập tức
5. Ảnh được lưu vào localStorage và upload lên server

### Đổi màu giao diện

#### Cách 1: Chọn Theme có sẵn (Dễ nhất!)
- **Chuyên nghiệp** (Professional) - Xanh dương chuyên nghiệp
- **Hiện đại** (Modern) - Tím trendy
- **Đại dương** (Ocean) - Xanh nước biển
- **Hoàng hôn** (Sunset) - Cam vàng ấm áp
- **Rừng xanh** (Forest) - Xanh lá tự nhiên
- **Hồng hoa** (Rose) - Hồng nữ tính

Click vào theme bạn thích → màu sắc tự động đổi!

#### Cách 2: Tùy chỉnh màu riêng
1. Cuộn xuống phần "Màu tùy chỉnh"
2. Click vào ô màu để mở color picker
3. Chọn màu bạn thích:
   - **Màu chính**: Màu chủ đạo của website
   - **Màu phụ**: Màu gradient
   - **Màu nhấn**: Màu điểm nhấn
4. Màu sẽ thay đổi ngay lập tức

### Lưu & Đặt lại
- **Nút Lưu**: Lưu tất cả cài đặt (màu sắc + avatar) vào trình duyệt
- **Nút Đặt lại**: Khôi phục về cài đặt mặc định

### Ưu điểm của Settings Panel
✅ Không cần đăng nhập Admin  
✅ Thay đổi ngay lập tức, không cần reload  
✅ Lưu vĩnh viễn trên trình duyệt  
✅ 6 theme đẹp có sẵn  
✅ Tùy chỉnh màu không giới hạn  
✅ Upload avatar cực dễ  

## 🎨 Sử dụng Admin Panel

### Đăng nhập
1. Truy cập http://localhost:3000/admin
2. Nhập username: `admin`, password: `admin123`

### Upload Stories (Câu chuyện)
1. Click **Stories** trên sidebar
2. Click **Thêm Story Mới**
3. Nhập tiêu đề, nội dung, chọn danh mục
4. Upload nhiều hình ảnh (chọn nhiều file cùng lúc)
5. Click **Lưu Story**

### Upload Ảnh hoạt động
1. Click **Ảnh hoạt động** trên sidebar
2. Click **Thêm Ảnh**
3. Nhập tiêu đề, mô tả, chọn danh mục
4. Upload 1 hình ảnh
5. Click **Lưu**

### Cập nhật Profile
1. Click **Profile** trên sidebar
2. Cập nhật thông tin: tên, chức danh, bio, email, phone
3. Thêm links mạng xã hội (GitHub, LinkedIn, Facebook, Twitter)
4. Click **Lưu Profile**

### Quản lý Projects, Skills, Experience, Education, Awards
- Mỗi section có nút **Thêm mới**
- Click icon **Edit** (✏️) để chỉnh sửa
- Click icon **Delete** (🗑️) để xóa

## 🛠️ Công nghệ sử dụng

### Frontend
- HTML5
- CSS3 (với animations)
- JavaScript (Vanilla JS)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- Multer (upload file)
- Body Parser
- CORS

### Database
- JSON files (đơn giản, dễ maintain)

## 📸 Upload hình ảnh

### Cách 1: Upload trực tiếp qua Admin Panel
- Stories: Chọn nhiều ảnh cùng lúc
- Gallery: Upload từng ảnh một
- Ảnh sẽ được lưu vào thư mục `uploads/`

### Cách 2: Thêm URL ảnh
- Project image: Nhập URL ảnh từ internet
- Avatar: Nhập URL ảnh avatar

## ⚡ Tính năng đặc biệt

### Settings Panel - Tùy chỉnh giao diện ngay tức thì!
- **Vị trí**: Nút bánh răng (⚙️) góc dưới phải màn hình
- **Chức năng**:
  - Upload avatar trực tiếp (click vào ảnh)
  - Chọn 1 trong 6 theme có sẵn
  - Tùy chỉnh màu sắc tự do
  - Lưu cài đặt vào localStorage
  - Đặt lại về mặc định
- **Không cần Admin**: Mọi người xem web đều có thể tùy chỉnh theo sở thích

### Story Timeline
- Hiển thị câu chuyện mới nhất ở trên cùng
- Mỗi story có:
  - Tiêu đề
  - Nội dung
  - Danh mục (tag)
  - Ngày đăng
  - 1 hoặc nhiều hình ảnh
- Click để xem chi tiết story
- Click ảnh để xem phóng to (lightbox)

### Gallery với Filter
- Hiển thị tất cả ảnh hoạt động
- Filter theo danh mục: Tất cả / Công việc / Hoạt động / Sự kiện / Khác
- Hover để xem thông tin ảnh
- Click để xem phóng to

### Animations
- Scroll reveal: Elements hiện ra khi scroll
- Hover effects: Zoom, shadow
- Smooth scroll navigation
- Timeline animations

## 🔒 Bảo mật

- Username/password lưu trong `data/admin.json`
- Đổi password: Edit file `data/admin.json`
- **LƯU Ý**: Đây là demo, production cần thêm encryption và session management

## 📝 Customize

### Thay đổi màu sắc
Có 2 cách:

**Cách 1: Dùng Settings Panel (Khuyến nghị)**
1. Click nút ⚙️ góc dưới phải
2. Chọn theme có sẵn hoặc tùy chỉnh màu
3. Click "Lưu"

**Cách 2: Sửa code CSS** (nếu muốn thay đổi mặc định)
Edit file `public/css/style.css`:
```css
:root {
    --primary-color: #2563eb;  /* Màu chính */
    --secondary-color: #3b82f6; /* Màu phụ */
    --accent-color: #0ea5e9;    /* Màu nhấn */
}
```

### Thay đổi font
Thêm Google Fonts vào `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng
Đổi PORT trong `server/server.js`:
```javascript
const PORT = 5000; // Thay đổi port
```

### Ảnh không hiển thị
- Kiểm tra thư mục `uploads/` đã được tạo
- Kiểm tra đường dẫn ảnh trong data files

### Không đăng nhập được Admin
- Kiểm tra file `data/admin.json`
- Default: username `admin`, password `admin123`

## 📱 Responsive

Website tự động responsive cho:
- 📱 Mobile (< 640px)
- 📱 Tablet (< 968px)
- 💻 Desktop (> 968px)

## 🎯 Demo Data

Project đã có sẵn dữ liệu mẫu trong các file JSON. Bạn có thể:
1. Giữ nguyên để xem demo
2. Xóa và thêm dữ liệu của riêng bạn qua Admin Panel

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Made with ❤️ - Portfolio Website 2025**

Chúc bạn thành công với portfolio của mình! 🚀
