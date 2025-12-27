const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Serve external assets folder containing activity photos
app.use('/assets', express.static(path.join(__dirname, '../')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'));
    }
  }
});

// Helper functions to read/write JSON files
const readJSON = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeJSON = (filename, data) => {
  const filePath = path.join(__dirname, '../data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Admin authentication
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = readJSON('admin.json');

  if (username === admin.username && password === admin.password) {
    res.json({ success: true, message: 'Đăng nhập thành công' });
  } else {
    res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
  }
});

// ==================== PROFILE ENDPOINTS ====================
app.get('/api/profile', (req, res) => {
  const profile = readJSON('profile.json');
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  writeJSON('profile.json', req.body);
  res.json({ success: true, message: 'Cập nhật profile thành công' });
});

// ==================== STORY ENDPOINTS ====================
app.get('/api/stories', (req, res) => {
  const stories = readJSON('stories.json');
  // Sort by date descending (newest first)
  stories.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(stories);
});

app.get('/api/stories/:id', (req, res) => {
  const stories = readJSON('stories.json');
  const story = stories.find(s => s.id === parseInt(req.params.id));
  if (story) {
    res.json(story);
  } else {
    res.status(404).json({ message: 'Không tìm thấy story' });
  }
});

app.post('/api/stories', (req, res) => {
  const stories = readJSON('stories.json');
  const newStory = {
    id: stories.length > 0 ? Math.max(...stories.map(s => s.id)) + 1 : 1,
    ...req.body,
    date: req.body.date || new Date().toISOString().split('T')[0],
    images: req.body.images || []
  };
  stories.push(newStory);
  writeJSON('stories.json', stories);
  res.json({ success: true, story: newStory });
});

app.put('/api/stories/:id', (req, res) => {
  const stories = readJSON('stories.json');
  const index = stories.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    stories[index] = { ...stories[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('stories.json', stories);
    res.json({ success: true, story: stories[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy story' });
  }
});

app.delete('/api/stories/:id', (req, res) => {
  const stories = readJSON('stories.json');
  const filtered = stories.filter(s => s.id !== parseInt(req.params.id));
  writeJSON('stories.json', filtered);
  res.json({ success: true, message: 'Xóa story thành công' });
});

// ==================== PROJECT ENDPOINTS ====================
app.get('/api/projects', (req, res) => {
  const projects = readJSON('projects.json');
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const projects = readJSON('projects.json');
  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    ...req.body
  };
  projects.push(newProject);
  writeJSON('projects.json', projects);
  res.json({ success: true, project: newProject });
});

app.put('/api/projects/:id', (req, res) => {
  const projects = readJSON('projects.json');
  const index = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('projects.json', projects);
    res.json({ success: true, project: projects[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy project' });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  const projects = readJSON('projects.json');
  const filtered = projects.filter(p => p.id !== parseInt(req.params.id));
  writeJSON('projects.json', filtered);
  res.json({ success: true, message: 'Xóa project thành công' });
});

// ==================== SKILL ENDPOINTS ====================
app.get('/api/skills', (req, res) => {
  const skills = readJSON('skills.json');
  res.json(skills);
});

app.post('/api/skills', (req, res) => {
  const skills = readJSON('skills.json');
  const newSkill = {
    id: skills.length > 0 ? Math.max(...skills.map(s => s.id)) + 1 : 1,
    ...req.body
  };
  skills.push(newSkill);
  writeJSON('skills.json', skills);
  res.json({ success: true, skill: newSkill });
});

app.put('/api/skills/:id', (req, res) => {
  const skills = readJSON('skills.json');
  const index = skills.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    skills[index] = { ...skills[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('skills.json', skills);
    res.json({ success: true, skill: skills[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy skill' });
  }
});

app.delete('/api/skills/:id', (req, res) => {
  const skills = readJSON('skills.json');
  const filtered = skills.filter(s => s.id !== parseInt(req.params.id));
  writeJSON('skills.json', filtered);
  res.json({ success: true, message: 'Xóa skill thành công' });
});

// ==================== EXPERIENCE ENDPOINTS ====================
app.get('/api/experience', (req, res) => {
  const experience = readJSON('experience.json');
  res.json(experience);
});

app.post('/api/experience', (req, res) => {
  const experience = readJSON('experience.json');
  const newExp = {
    id: experience.length > 0 ? Math.max(...experience.map(e => e.id)) + 1 : 1,
    ...req.body
  };
  experience.push(newExp);
  writeJSON('experience.json', experience);
  res.json({ success: true, experience: newExp });
});

app.put('/api/experience/:id', (req, res) => {
  const experience = readJSON('experience.json');
  const index = experience.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    experience[index] = { ...experience[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('experience.json', experience);
    res.json({ success: true, experience: experience[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy experience' });
  }
});

app.delete('/api/experience/:id', (req, res) => {
  const experience = readJSON('experience.json');
  const filtered = experience.filter(e => e.id !== parseInt(req.params.id));
  writeJSON('experience.json', filtered);
  res.json({ success: true, message: 'Xóa experience thành công' });
});

// ==================== EDUCATION ENDPOINTS ====================
app.get('/api/education', (req, res) => {
  const education = readJSON('education.json');
  res.json(education);
});

app.post('/api/education', (req, res) => {
  const education = readJSON('education.json');
  const newEdu = {
    id: education.length > 0 ? Math.max(...education.map(e => e.id)) + 1 : 1,
    ...req.body
  };
  education.push(newEdu);
  writeJSON('education.json', education);
  res.json({ success: true, education: newEdu });
});

app.put('/api/education/:id', (req, res) => {
  const education = readJSON('education.json');
  const index = education.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    education[index] = { ...education[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('education.json', education);
    res.json({ success: true, education: education[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy education' });
  }
});

app.delete('/api/education/:id', (req, res) => {
  const education = readJSON('education.json');
  const filtered = education.filter(e => e.id !== parseInt(req.params.id));
  writeJSON('education.json', filtered);
  res.json({ success: true, message: 'Xóa education thành công' });
});

// ==================== AWARD ENDPOINTS ====================
app.get('/api/awards', (req, res) => {
  const awards = readJSON('awards.json');
  res.json(awards);
});

app.post('/api/awards', (req, res) => {
  const awards = readJSON('awards.json');
  const newAward = {
    id: awards.length > 0 ? Math.max(...awards.map(a => a.id)) + 1 : 1,
    ...req.body
  };
  awards.push(newAward);
  writeJSON('awards.json', awards);
  res.json({ success: true, award: newAward });
});

app.put('/api/awards/:id', (req, res) => {
  const awards = readJSON('awards.json');
  const index = awards.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    awards[index] = { ...awards[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('awards.json', awards);
    res.json({ success: true, award: awards[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy award' });
  }
});

app.delete('/api/awards/:id', (req, res) => {
  const awards = readJSON('awards.json');
  const filtered = awards.filter(a => a.id !== parseInt(req.params.id));
  writeJSON('awards.json', filtered);
  res.json({ success: true, message: 'Xóa award thành công' });
});

// ==================== LINKS ENDPOINTS ====================
app.get('/api/links', (req, res) => {
  const links = readJSON('links.json');
  res.json(links);
});

app.post('/api/links', (req, res) => {
  const links = readJSON('links.json');
  const newLink = {
    id: links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1,
    ...req.body
  };
  links.push(newLink);
  writeJSON('links.json', links);
  res.json({ success: true, link: newLink });
});

app.put('/api/links/:id', (req, res) => {
  const links = readJSON('links.json');
  const index = links.findIndex(l => l.id === parseInt(req.params.id));
  if (index !== -1) {
    links[index] = { ...links[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('links.json', links);
    res.json({ success: true, link: links[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy link' });
  }
});

app.delete('/api/links/:id', (req, res) => {
  const links = readJSON('links.json');
  const filtered = links.filter(l => l.id !== parseInt(req.params.id));
  writeJSON('links.json', filtered);
  res.json({ success: true, message: 'Xóa link thành công' });
});

// ==================== GALLERY ENDPOINTS ====================
app.get('/api/gallery', (req, res) => {
  const gallery = readJSON('gallery.json');
  res.json(gallery);
});

app.post('/api/gallery', (req, res) => {
  const gallery = readJSON('gallery.json');
  const newItem = {
    id: gallery.length > 0 ? Math.max(...gallery.map(g => g.id)) + 1 : 1,
    ...req.body
  };
  gallery.push(newItem);
  writeJSON('gallery.json', gallery);
  res.json({ success: true, item: newItem });
});

app.put('/api/gallery/:id', (req, res) => {
  const gallery = readJSON('gallery.json');
  const index = gallery.findIndex(g => g.id === parseInt(req.params.id));
  if (index !== -1) {
    gallery[index] = { ...gallery[index], ...req.body, id: parseInt(req.params.id) };
    writeJSON('gallery.json', gallery);
    res.json({ success: true, item: gallery[index] });
  } else {
    res.status(404).json({ message: 'Không tìm thấy item' });
  }
});

app.delete('/api/gallery/:id', (req, res) => {
  const gallery = readJSON('gallery.json');
  const filtered = gallery.filter(g => g.id !== parseInt(req.params.id));
  writeJSON('gallery.json', filtered);
  res.json({ success: true, message: 'Xóa item thành công' });
});

// ==================== IMAGE UPLOAD ====================
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Không có file được upload' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl: imageUrl });
});

app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Không có file được upload' });
  }

  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ success: true, imageUrls: imageUrls });
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📱 Portfolio: http://localhost:${PORT}`);
  console.log(`⚙️  Admin Panel: http://localhost:${PORT}/admin`);
});
