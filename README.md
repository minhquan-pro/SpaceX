# 🚀 Cosmic Explorer

Ứng dụng web khám phá vũ trụ sử dụng dữ liệu thực từ NASA và các API không gian mở. Được xây dựng với React + Vite.

## Tính năng

### 🖼️ NASA Gallery
Tìm kiếm và duyệt hàng triệu ảnh, video trong thư viện ảnh NASA Image and Video Library. Hỗ trợ tìm kiếm theo từ khóa và phân trang.

### 🚀 Rocket Launches
Xem danh sách các vụ phóng tên lửa sắp tới và đã qua từ toàn thế giới, cung cấp bởi Launch Library 2. Bao gồm thông tin về tên lửa, tổ chức phóng, địa điểm và thời gian.

### 🌍 Earth from DSCOVR
Xem ảnh Trái Đất chụp từ vệ tinh DSCOVR ở điểm Lagrange L1 (cách Trái Đất ~1.5 triệu km), cung cấp bởi NASA EPIC API. Có thể chọn ngày chụp ảnh.

### 🛸 Space Missions
Khám phá các sứ mệnh không gian và dữ liệu liên quan từ các API NASA.

## Công nghệ sử dụng

| Công nghệ | Vai trò |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Axios | HTTP client gọi API |
| NASA Image API | Thư viện ảnh/video NASA |
| NASA EPIC API | Ảnh Trái Đất từ vệ tinh DSCOVR |
| Launch Library 2 | Dữ liệu phóng tên lửa toàn cầu |

## Cài đặt & Chạy

```bash
# Clone repo
git clone https://github.com/<your-username>/cosmic-explorer.git
cd cosmic-explorer

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

## Build production

```bash
npm run build
npm run preview
```

## API sử dụng

Tất cả API đều **miễn phí và không cần API key**:

- **NASA Image and Video Library** — `https://images-api.nasa.gov`
- **NASA EPIC** — `https://epic.gsfc.nasa.gov`
- **Launch Library 2** — `https://ll.thespacedevs.com`

## Cấu trúc dự án

```
cosmic-explorer/
├── public/               # Static assets
├── src/
│   ├── api/
│   │   └── nasa.js       # Tất cả hàm gọi API
│   ├── assets/           # Hình ảnh, SVG
│   ├── components/
│   │   ├── APOD.jsx      # NASA Gallery
│   │   ├── MarsRover.jsx # Rocket Launches
│   │   ├── Asteroids.jsx # Earth from DSCOVR
│   │   └── EarthView.jsx # Space Missions
│   ├── App.jsx           # Root component + navigation
│   ├── App.css           # Component styles
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js
└── package.json
```
