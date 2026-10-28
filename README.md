# Bắt Đầu 2 Phút (FocusAR) - Full-Stack Monorepo

> **FocusAR** là ứng dụng chống trì hoãn học tập thông minh dựa trên quy tắc 2 phút (2-Minute Rule), chia nhỏ nhiệm vụ bằng AI (GPT-4o mini), theo dõi chuyển tab qua Chrome Extension Manifest V3 và tương tác qua linh vật AR/Webcam On-Device.

---

## 🛠️ Công Nghệ & Kiến Trúc

- **Monorepo Management:** Turborepo + pnpm
- **Frontend App (`apps/web`):** Next.js 14 App Router, TypeScript Strict, TailwindCSS, Zustand, React Three Fiber (AR Guardian Overlay), Canvas CV Detector.
- **Backend API (`apps/api`):** NestJS, Prisma ORM, Socket.io Realtime, BullMQ, PostgreSQL, Redis.
- **Chrome Extension (`apps/extension`):** Manifest V3, TypeScript, Active Tab Monitor, Idle State Listener, Domain Blocklist Engine.
- **Shared Packages (`packages/*`):**
  - `packages/db`: Prisma Schema 15+ models, Database Seed & Migrations.
  - `packages/types`: Shared DTOs, Event payloads, AR/CV states.
  - `packages/ai`: OpenAI Prompts & Task Breakdown Engine.
  - `packages/cv`: MediaPipe / TF.js Face & Phone detection helpers (On-device, Privacy-first).
  - `packages/ui`: Shared Design Tokens & UI Elements.
  - `packages/config`: TSConfig, ESLint, Tailwind presets.

---

## 🚀 Hướng Dẫn Chạy Dự Án (Local Development)

### 1. Yêu Cầu Tiền Đề
- Node.js >= 18.x
- pnpm >= 8.x
- Docker & Docker Compose (cho PostgreSQL & Redis)

### 2. Cài Đặt & Khởi Chạy Database

```bash
# 1. Cài đặt toàn bộ dependencies
pnpm install

# 2. Tạo file .env từ .env.example
cp .env.example .env

# 3. Khởi chạy PostgreSQL & Redis qua Docker
docker-compose -f infra/docker-compose.yml up -d

# 4. Generate Prisma Client & Migrate/Seed database
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 3. Khởi Chạy Các Ứng Dụng

```bash
# Khởi chạy tất cả apps (Web, API, Extension) song song
pnpm dev
```

- **Next.js Web App:** [http://localhost:3000](http://localhost:3000)
- **NestJS API Service:** [http://localhost:4000](http://localhost:4000)
- **Chrome Extension:** Load unpacked từ thư mục `apps/extension/dist` vào `chrome://extensions`.

---

## 🔒 Cam Kết Quyền Riêng Tư (Privacy-First)

1. **Webcam / AR Processing:** Mọi hình ảnh phát hiện khuôn mặt, cử chỉ hoặc điện thoại đều được xử lý **100% On-Device** trên trình duyệt thông qua TensorFlow.js / MediaPipe. Không có dữ liệu hình ảnh/video nào bị gửi lên máy chủ.
2. **Chrome Extension Monitoring:** Extension chỉ đọc tên miền (URL domain) và trạng thái tab chủ động. Không đọc nội dung tài liệu hay form nhập liệu của người dùng.

---

## 📜 Các Tính Năng Nổi Bật

1. **Quy tắc 2 phút (2-Minute Rule):** Bắt đầu học cực nhẹ nhàng bằng cách cam kết làm 1 việc trong 2 phút.
2. **AI Task Decomposition:** Tự động chia nhỏ mục tiêu phức tạp thành các bước 5–25 phút có thể hoàn thành ngay.
3. **AR Focus Guardian:** Linh vật ảo phản hồi nhẹ nhàng khi phát hiện bạn rời bàn học hoặc mở tab TikTok/Facebook.
4. **Virtual Study Room:** Phòng học trực tuyến nhóm & ghép bạn học ảo để nâng cao trách nhiệm bản thân.
