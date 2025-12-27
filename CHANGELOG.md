# Changelog

All notable changes to this project are documented here. Dates use YYYY-MM-DD.

## 2025-12-27
- Features: Embedded static Gallery items directly in `public/index.html` to ensure immediate visibility without API.
- Frontend: Guarded dynamic gallery loader in `public/js/main.js` to skip fetch when static items exist.
- Frontend: Lightbox now navigates both story and gallery images.
- Settings: Added "Thêm ảnh hoạt động" upload form (file + title + description + category) in `public/index.html`.
- Settings: Implemented client upload flow in `public/js/main.js` (POST `/api/upload`, then `/api/gallery`, live append to grid).
- Content: Updated `data/stories.json` with HR-style career milestones (6 phases) and improved wording.
- Fix: Corrected broken image path for "Đổi mới sáng tạo Công Nghệ / Văn Hiến" in `public/index.html`.

## 2025-12-26
- Backend: Added static `/assets` route serving local folder `Giải Thưởng các cuộc thi- Nguyễn Khắt Thuần- 231A011097`.
- Content: Replaced `data/gallery.json` with entries pointing to local assets (BizTech Hackathon, Smart CITY, UII Sandbox, CLB hoạt động, nghiên cứu...).

## 2025-12-25
- UI/UX: Moved Settings into top Navigation; removed palette icon for a cleaner look; ensured mobile responsiveness.
- Theming: Switched site to light theme (white background, darker text) and refreshed nav/link styles.
- Skills: Restyled skill cards with modern gradient visuals.

## 2025-12-24
- Content: Updated profile, experience, education, skills, awards, and projects per CV details.
  - `data/profile.json`, `data/experience.json`, `data/education.json`, `data/skills.json`, `data/awards.json`, `data/projects.json`.

## 2025-12-23
- Backend: Node.js/Express API with JSON storage created; endpoints for profile, stories, gallery, projects, skills, experience, education, awards.
- Uploads: Implemented image upload endpoints with Multer (`/api/upload`, `/api/upload-multiple`), and served `/uploads` statically.
- Frontend: Built portfolio UI (Hero, Stories, Gallery, Projects, Skills, Experience, Education, Awards, Contact) and Settings panel.

## How to add future entries
- Add a new dated section at the top with concise bullets grouped by type: Features, Frontend, Backend, Content, Fixes, Docs.
- Reference changed files with paths for easy traceability.
- Keep descriptions short, action-oriented, and verifiable.
