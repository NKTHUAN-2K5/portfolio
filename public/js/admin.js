// API Base URL
const API_URL = 'http://localhost:3000/api';

let isAuthenticated = false;
let currentStoryImages = [];
let currentGalleryImage = '';

// ==================== LOGIN ====================
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            isAuthenticated = true;
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'grid';
            loadProfile();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Lỗi đăng nhập: ' + error.message);
    }
});

function logout() {
    isAuthenticated = false;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

// ==================== NAVIGATION ====================
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected section
        const section = item.dataset.section;
        document.getElementById(`section-${section}`).style.display = 'block';
        document.getElementById('section-title').textContent = item.textContent.trim();
        
        // Load data for section
        loadSectionData(section);
    });
});

function loadSectionData(section) {
    switch(section) {
        case 'profile': loadProfile(); break;
        case 'stories': loadStories(); break;
        case 'gallery': loadGallery(); break;
        case 'projects': loadProjects(); break;
        case 'skills': loadSkills(); break;
        case 'experience': loadExperience(); break;
        case 'education': loadEducation(); break;
        case 'awards': loadAwards(); break;
    }
}

// ==================== PROFILE ====================
async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/profile`);
        const profile = await response.json();
        
        const form = document.getElementById('profile-form');
        form.elements['name'].value = profile.name;
        form.elements['title'].value = profile.title;
        form.elements['bio'].value = profile.bio;
        form.elements['email'].value = profile.email;
        form.elements['phone'].value = profile.phone;
        form.elements['location'].value = profile.location;
        form.elements['avatar'].value = profile.avatar || '';
        form.elements['social.github'].value = profile.social.github || '';
        form.elements['social.linkedin'].value = profile.social.linkedin || '';
        form.elements['social.facebook'].value = profile.social.facebook || '';
        form.elements['social.twitter'].value = profile.social.twitter || '';
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        title: formData.get('title'),
        bio: formData.get('bio'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        avatar: formData.get('avatar'),
        social: {
            github: formData.get('social.github'),
            linkedin: formData.get('social.linkedin'),
            facebook: formData.get('social.facebook'),
            twitter: formData.get('social.twitter')
        }
    };
    
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Cập nhật profile thành công!');
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

// ==================== STORIES ====================
async function loadStories() {
    try {
        const response = await fetch(`${API_URL}/stories`);
        const stories = await response.json();
        
        const list = document.getElementById('stories-list');
        list.innerHTML = '';
        
        stories.forEach(story => {
            const item = document.createElement('div');
            item.className = 'data-item';
            
            const imagesHTML = story.images && story.images.length > 0
                ? `<div class="story-images-grid">${story.images.slice(0, 3).map(img => `<img src="${img}">`).join('')}</div>`
                : '';
            
            item.innerHTML = `
                <div class="data-content">
                    <h3>${story.title}</h3>
                    <p>${story.content}</p>
                    <div class="data-meta">
                        <span class="category-badge">${story.category}</span>
                        <span><i class="far fa-calendar"></i> ${story.date}</span>
                        <span><i class="far fa-images"></i> ${story.images ? story.images.length : 0} ảnh</span>
                    </div>
                    ${imagesHTML}
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editStory(${story.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStory(${story.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading stories:', error);
    }
}

function showStoryForm() {
    document.getElementById('story-form-container').style.display = 'block';
    document.getElementById('story-form-title').textContent = 'Thêm Story Mới';
    document.getElementById('story-form').reset();
    currentStoryImages = [];
    document.getElementById('story-images-preview').innerHTML = '';
}

function hideStoryForm() {
    document.getElementById('story-form-container').style.display = 'none';
}

document.getElementById('story-images').addEventListener('change', async (e) => {
    const files = e.target.files;
    const preview = document.getElementById('story-images-preview');
    preview.innerHTML = '';
    
    for (let file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                currentStoryImages.push(result.imageUrl);
                
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${result.imageUrl}" alt="Preview">
                    <button type="button" class="image-preview-remove" onclick="removeStoryImage('${result.imageUrl}')">×</button>
                `;
                preview.appendChild(previewItem);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
    
    document.getElementById('story-images-data').value = JSON.stringify(currentStoryImages);
});

function removeStoryImage(imageUrl) {
    currentStoryImages = currentStoryImages.filter(img => img !== imageUrl);
    document.getElementById('story-images-data').value = JSON.stringify(currentStoryImages);
    // Refresh preview
    const preview = document.getElementById('story-images-preview');
    preview.innerHTML = '';
    currentStoryImages.forEach(img => {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.innerHTML = `
            <img src="${img}" alt="Preview">
            <button type="button" class="image-preview-remove" onclick="removeStoryImage('${img}')">×</button>
        `;
        preview.appendChild(previewItem);
    });
}

document.getElementById('story-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        date: formData.get('date') || new Date().toISOString().split('T')[0],
        images: currentStoryImages
    };
    
    const id = formData.get('id');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/stories/${id}` : `${API_URL}/stories`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Lưu story thành công!');
            hideStoryForm();
            loadStories();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

async function editStory(id) {
    try {
        const response = await fetch(`${API_URL}/stories/${id}`);
        const story = await response.json();
        
        document.getElementById('story-form-title').textContent = 'Chỉnh sửa Story';
        document.getElementById('story-form-container').style.display = 'block';
        
        const form = document.getElementById('story-form');
        form.elements['id'].value = story.id;
        form.elements['title'].value = story.title;
        form.elements['content'].value = story.content;
        form.elements['category'].value = story.category;
        form.elements['date'].value = story.date;
        
        currentStoryImages = story.images || [];
        const preview = document.getElementById('story-images-preview');
        preview.innerHTML = '';
        currentStoryImages.forEach(img => {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${img}" alt="Preview">
                <button type="button" class="image-preview-remove" onclick="removeStoryImage('${img}')">×</button>
            `;
            preview.appendChild(previewItem);
        });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteStory(id) {
    if (!confirm('Bạn có chắc muốn xóa story này?')) return;
    
    try {
        const response = await fetch(`${API_URL}/stories/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadStories();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}

// ==================== GALLERY ====================
async function loadGallery() {
    try {
        const response = await fetch(`${API_URL}/gallery`);
        const gallery = await response.json();
        
        const list = document.getElementById('gallery-list');
        list.innerHTML = '';
        
        gallery.forEach(item => {
            const div = document.createElement('div');
            div.className = 'data-item';
            
            const imageHTML = item.image 
                ? `<img src="${item.image}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin-top: 0.5rem;">`
                : '';
            
            div.innerHTML = `
                <div class="data-content">
                    <h3>${item.title}</h3>
                    <p>${item.description || ''}</p>
                    <div class="data-meta">
                        <span class="category-badge">${item.category}</span>
                        <span><i class="far fa-calendar"></i> ${item.date}</span>
                    </div>
                    ${imageHTML}
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editGalleryItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGalleryItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function showGalleryForm() {
    document.getElementById('gallery-form-container').style.display = 'block';
    document.getElementById('gallery-form-title').textContent = 'Thêm Ảnh Mới';
    document.getElementById('gallery-form').reset();
    currentGalleryImage = '';
    document.getElementById('gallery-image-preview').innerHTML = '';
}

function hideGalleryForm() {
    document.getElementById('gallery-form-container').style.display = 'none';
}

document.getElementById('gallery-image').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const preview = document.getElementById('gallery-image-preview');
    preview.innerHTML = '<div class="loading" style="grid-column: 1/-1; text-align: center; padding: 1.5rem;">📤 Đang upload...</div>';
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (result.success) {
            document.getElementById('gallery-image-data').value = result.imageUrl;
            
            preview.innerHTML = `
                <div class="gallery-preview-item">
                    <img src="${result.imageUrl}" alt="Preview">
                    <button type="button" class="gallery-preview-remove" onclick="clearGalleryPreview()">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            preview.innerHTML = '<div style="grid-column: 1/-1; color: #ef4444; padding: 1rem; text-align: center;">❌ Lỗi upload ảnh</div>';
        }
    } catch (error) {
        preview.innerHTML = '<div style="grid-column: 1/-1; color: #ef4444; padding: 1rem; text-align: center;">❌ Lỗi: ' + error.message + '</div>';
        console.error('Error uploading image:', error);
    }
});

function clearGalleryPreview() {
    document.getElementById('gallery-image').value = '';
    document.getElementById('gallery-image-data').value = '';
    document.getElementById('gallery-image-preview').innerHTML = '';
}

// Gallery form submit
document.getElementById('gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const imageUrl = document.getElementById('gallery-image-data').value;
    if (!imageUrl) {
        alert('❌ Vui lòng upload ảnh trước!');
        return;
    }
    
    const data = {
        title: document.getElementById('gallery-title').value,
        description: document.getElementById('gallery-description').value,
        category: document.getElementById('gallery-category').value,
        date: document.getElementById('gallery-date').value || new Date().toISOString().split('T')[0],
        image: imageUrl
    };
    
    const id = document.getElementById('gallery-id').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/gallery/${id}` : `${API_URL}/gallery`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Lưu ảnh thành công!');
            document.getElementById('gallery-form').reset();
            document.getElementById('gallery-image-data').value = '';
            document.getElementById('gallery-image-preview').innerHTML = '';
            loadGallery();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

async function editGalleryItem(id) {
    try {
        const response = await fetch(`${API_URL}/gallery`);
        const gallery = await response.json();
        const item = gallery.find(g => g.id === id);
        
        if (!item) return;
        
        document.getElementById('gallery-id').value = item.id;
        document.getElementById('gallery-title').value = item.title;
        document.getElementById('gallery-description').value = item.description || '';
        document.getElementById('gallery-category').value = item.category;
        document.getElementById('gallery-date').value = item.date;
        document.getElementById('gallery-image-data').value = item.image || '';
        
        const preview = document.getElementById('gallery-image-preview');
        if (item.image) {
            preview.innerHTML = `
                <div class="gallery-preview-item">
                    <img src="${item.image}" alt="Preview">
                    <button type="button" class="gallery-preview-remove" onclick="clearGalleryPreview()">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            preview.innerHTML = '';
        }
        
        // Scroll to form
        document.getElementById('tab-gallery').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteGalleryItem(id) {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    
    try {
        const response = await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadGallery();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}

// ==================== PROJECTS ====================
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();
        
        const list = document.getElementById('projects-list');
        list.innerHTML = '';
        
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'data-item';
            
            const techTags = project.technologies && project.technologies.length > 0
                ? project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')
                : '';
            
            item.innerHTML = `
                <div class="data-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div style="margin-top: 0.5rem;">${techTags}</div>
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function showProjectForm() {
    document.getElementById('project-form-container').style.display = 'block';
    document.getElementById('project-form-title').textContent = 'Thêm Project Mới';
    document.getElementById('project-form').reset();
}

function hideProjectForm() {
    document.getElementById('project-form-container').style.display = 'none';
}

document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const technologies = formData.get('technologies') ? formData.get('technologies').split(',').map(t => t.trim()) : [];
    
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        technologies: technologies,
        image: formData.get('image'),
        link: formData.get('link')
    };
    
    const id = formData.get('id');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/projects/${id}` : `${API_URL}/projects`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Lưu project thành công!');
            hideProjectForm();
            loadProjects();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

async function editProject(id) {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();
        const project = projects.find(p => p.id === id);
        
        if (!project) return;
        
        document.getElementById('project-form-title').textContent = 'Chỉnh sửa Project';
        document.getElementById('project-form-container').style.display = 'block';
        
        const form = document.getElementById('project-form');
        form.elements['id'].value = project.id;
        form.elements['title'].value = project.title;
        form.elements['description'].value = project.description;
        form.elements['technologies'].value = project.technologies ? project.technologies.join(', ') : '';
        form.elements['image'].value = project.image || '';
        form.elements['link'].value = project.link || '';
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteProject(id) {
    if (!confirm('Bạn có chắc muốn xóa project này?')) return;
    
    try {
        const response = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadProjects();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}

// ==================== SKILLS ====================
async function loadSkills() {
    try {
        const response = await fetch(`${API_URL}/skills`);
        const skills = await response.json();
        
        const list = document.getElementById('skills-list');
        list.innerHTML = '';
        
        skills.forEach(skill => {
            const item = document.createElement('div');
            item.className = 'data-item';
            
            item.innerHTML = `
                <div class="data-content">
                    <h3>${skill.name}</h3>
                    <div class="data-meta">
                        <span class="tag">${skill.category || 'N/A'}</span>
                        <span>Level: ${skill.level}%</span>
                    </div>
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editSkill(${skill.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSkill(${skill.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function showSkillForm() {
    document.getElementById('skill-form-container').style.display = 'block';
    document.getElementById('skill-form-title').textContent = 'Thêm Skill Mới';
    document.getElementById('skill-form').reset();
}

function hideSkillForm() {
    document.getElementById('skill-form-container').style.display = 'none';
}

document.getElementById('skill-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        category: formData.get('category'),
        level: parseInt(formData.get('level'))
    };
    
    const id = formData.get('id');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/skills/${id}` : `${API_URL}/skills`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Lưu skill thành công!');
            hideSkillForm();
            loadSkills();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

async function editSkill(id) {
    try {
        const response = await fetch(`${API_URL}/skills`);
        const skills = await response.json();
        const skill = skills.find(s => s.id === id);
        
        if (!skill) return;
        
        document.getElementById('skill-form-title').textContent = 'Chỉnh sửa Skill';
        document.getElementById('skill-form-container').style.display = 'block';
        
        const form = document.getElementById('skill-form');
        form.elements['id'].value = skill.id;
        form.elements['name'].value = skill.name;
        form.elements['category'].value = skill.category || '';
        form.elements['level'].value = skill.level;
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteSkill(id) {
    if (!confirm('Bạn có chắc muốn xóa skill này?')) return;
    
    try {
        const response = await fetch(`${API_URL}/skills/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadSkills();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}

// ==================== EXPERIENCE ====================
async function loadExperience() {
    try {
        const response = await fetch(`${API_URL}/experience`);
        const experiences = await response.json();
        
        const list = document.getElementById('experience-list');
        list.innerHTML = '';
        
        experiences.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'data-item';
            
            item.innerHTML = `
                <div class="data-content">
                    <h3>${exp.position}</h3>
                    <div style="color: var(--admin-primary); font-weight: 600; margin-bottom: 0.5rem;">${exp.company}</div>
                    <p>${exp.description}</p>
                    <div class="data-meta">
                        <span>${exp.startDate} - ${exp.endDate}</span>
                    </div>
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editExperience(${exp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExperience(${exp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading experience:', error);
    }
}

function showExperienceForm() {
    document.getElementById('experience-form-container').style.display = 'block';
    document.getElementById('experience-form-title').textContent = 'Thêm Kinh nghiệm Mới';
    document.getElementById('experience-form').reset();
}

function hideExperienceForm() {
    document.getElementById('experience-form-container').style.display = 'none';
}

document.getElementById('experience-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        position: formData.get('position'),
        company: formData.get('company'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        description: formData.get('description')
    };
    
    const id = formData.get('id');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/experience/${id}` : `${API_URL}/experience`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Lưu thành công!');
            hideExperienceForm();
            loadExperience();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

async function editExperience(id) {
    try {
        const response = await fetch(`${API_URL}/experience`);
        const experiences = await response.json();
        const exp = experiences.find(e => e.id === id);
        
        if (!exp) return;
        
        document.getElementById('experience-form-title').textContent = 'Chỉnh sửa Kinh nghiệm';
        document.getElementById('experience-form-container').style.display = 'block';
        
        const form = document.getElementById('experience-form');
        form.elements['id'].value = exp.id;
        form.elements['position'].value = exp.position;
        form.elements['company'].value = exp.company;
        form.elements['startDate'].value = exp.startDate;
        form.elements['endDate'].value = exp.endDate;
        form.elements['description'].value = exp.description || '';
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteExperience(id) {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    
    try {
        const response = await fetch(`${API_URL}/experience/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadExperience();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}

// ==================== EDUCATION ====================
async function loadEducation() {
    try {
        const response = await fetch(`${API_URL}/education`);
        const educations = await response.json();
        
        const list = document.getElementById('education-list');
        list.innerHTML = '';
        
        educations.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'data-item';
            
            item.innerHTML = `
                <div class="data-content">
                    <h3>${edu.degree} - ${edu.major}</h3>
                    <div style="color: var(--admin-primary); font-weight: 600; margin-bottom: 0.5rem;">${edu.school}</div>
                    <div class="data-meta">
                        <span>${edu.startDate} - ${edu.endDate}</span>
                        ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ''}
                    </div>
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editEducation(${edu.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEducation(${edu.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading education:', error);
    }
}

function showEducationForm() {
    document.getElementById('education-form-container').style.display = 'block';
    document.getElementById('education-form-title').textContent = 'Thêm Học vấn Mới';
    document.getElementById('education-form').reset();
}

function hideEducationForm() {
    document.getElementById('education-form-container').style.display = 'none';
}

document.getElementById('education-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        school: formData.get('school'),
        degree: formData.get('degree'),
        major: formData.get('major'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        gpa: formData.get('gpa')
    };
    
    const id = formData.get('id');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/education/${id}` : `${API_URL}/education`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Lưu thành công!');
            hideEducationForm();
            loadEducation();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

async function editEducation(id) {
    try {
        const response = await fetch(`${API_URL}/education`);
        const educations = await response.json();
        const edu = educations.find(e => e.id === id);
        
        if (!edu) return;
        
        document.getElementById('education-form-title').textContent = 'Chỉnh sửa Học vấn';
        document.getElementById('education-form-container').style.display = 'block';
        
        const form = document.getElementById('education-form');
        form.elements['id'].value = edu.id;
        form.elements['school'].value = edu.school;
        form.elements['degree'].value = edu.degree;
        form.elements['major'].value = edu.major;
        form.elements['startDate'].value = edu.startDate;
        form.elements['endDate'].value = edu.endDate;
        form.elements['gpa'].value = edu.gpa || '';
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteEducation(id) {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    
    try {
        const response = await fetch(`${API_URL}/education/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadEducation();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}

// ==================== AWARDS ====================
async function loadAwards() {
    try {
        const response = await fetch(`${API_URL}/awards`);
        const awards = await response.json();
        
        const list = document.getElementById('awards-list');
        list.innerHTML = '';
        
        awards.forEach(award => {
            const item = document.createElement('div');
            item.className = 'data-item';
            
            item.innerHTML = `
                <div class="data-content">
                    <h3>${award.title}</h3>
                    <div style="color: var(--admin-primary); font-weight: 600; margin-bottom: 0.5rem;">${award.organization}</div>
                    <p>${award.description}</p>
                    <div class="data-meta">
                        <span><i class="far fa-calendar"></i> ${award.date}</span>
                    </div>
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editAward(${award.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAward(${award.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading awards:', error);
    }
}

function showAwardForm() {
    document.getElementById('award-form-container').style.display = 'block';
    document.getElementById('award-form-title').textContent = 'Thêm Giải thưởng Mới';
    document.getElementById('award-form').reset();
}

function hideAwardForm() {
    document.getElementById('award-form-container').style.display = 'none';
}

document.getElementById('award-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        organization: formData.get('organization'),
        date: formData.get('date'),
        description: formData.get('description')
    };
    
    const id = formData.get('id');
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/awards/${id}` : `${API_URL}/awards`;
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('✅ Lưu thành công!');
            hideAwardForm();
            loadAwards();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
});

async function editAward(id) {
    try {
        const response = await fetch(`${API_URL}/awards`);
        const awards = await response.json();
        const award = awards.find(a => a.id === id);
        
        if (!award) return;
        
        document.getElementById('award-form-title').textContent = 'Chỉnh sửa Giải thưởng';
        document.getElementById('award-form-container').style.display = 'block';
        
        const form = document.getElementById('award-form');
        form.elements['id'].value = award.id;
        form.elements['title'].value = award.title;
        form.elements['organization'].value = award.organization;
        form.elements['date'].value = award.date;
        form.elements['description'].value = award.description || '';
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteAward(id) {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    
    try {
        const response = await fetch(`${API_URL}/awards/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('✅ Xóa thành công!');
            loadAwards();
        }
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}
