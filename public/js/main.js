// API Base URL
const API_URL = 'http://localhost:3000/api';

// Generic fetch with fallback to static JSON (useful on static hosts like Vercel)
async function fetchWithFallback(apiEndpoint, fallbackPath) {
    try {
        const res = await fetch(`${API_URL}/${apiEndpoint}`);
        if (!res.ok) throw new Error(`API ${apiEndpoint} failed`);
        return await res.json();
    } catch (err) {
        console.warn(`Using fallback for ${apiEndpoint}:`, err.message);
        const fallbackRes = await fetch(fallbackPath);
        return await fallbackRes.json();
    }
}

// ==================== LOAD DATA ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadStories();
    loadGallery();
    loadProjects();
    loadSkills();
    loadExperience();
    loadEducation();
    loadAwards();
    loadLinks();
    
    // Initialize animations
    initScrollAnimations();
    initNavigation();
    initModal();
    initLightbox();
    initGalleryFilter();
    init3DCubeScroll();
    
    // Initialize settings
    initSettings();
    loadSettings();
});

// ==================== LOAD PROFILE ====================
async function loadProfile() {
    try {
        const profile = await fetchWithFallback('profile', '/data/profile.json');
        
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-title').textContent = profile.title;
        document.getElementById('profile-bio').textContent = profile.bio;
        document.title = `Portfolio - ${profile.name}`;
        
        if (profile.avatar) {
            document.getElementById('profile-avatar').src = profile.avatar;
        }
        
        // Social links
        const socialLinksHTML = [];
        if (profile.social.github) {
            socialLinksHTML.push(`<a href="${profile.social.github}" target="_blank"><i class="fab fa-github"></i></a>`);
        }
        if (profile.social.linkedin) {
            socialLinksHTML.push(`<a href="${profile.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>`);
        }
        if (profile.social.facebook) {
            socialLinksHTML.push(`<a href="${profile.social.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>`);
        }
        if (profile.social.twitter) {
            socialLinksHTML.push(`<a href="${profile.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>`);
        }
        document.getElementById('social-links').innerHTML = socialLinksHTML.join('');
        
        // Contact info
        const contactInfoHTML = `
            <div class="contact-item reveal-up">
                <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                <h4>Email</h4>
                <p><a href="mailto:${profile.email}" style="color: var(--text-secondary); transition: color 0.3s;">${profile.email}</a></p>
            </div>
            <div class="contact-item reveal-up">
                <div class="contact-icon"><i class="fas fa-phone"></i></div>
                <h4>Điện thoại</h4>
                <p><a href="tel:${profile.phone}" style="color: var(--text-secondary); transition: color 0.3s;">${profile.phone}</a></p>
            </div>
            <div class="contact-item reveal-up">
                <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
                <h4>Địa chỉ</h4>
                <p>${profile.location}</p>
            </div>
        `;
        document.getElementById('contact-info').innerHTML = contactInfoHTML;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// ==================== LOAD STORIES (QUAN TRỌNG) ====================
async function loadStories() {
    try {
        const stories = await fetchWithFallback('stories', '/data/stories.json');
        
        const timeline = document.getElementById('story-timeline');
        timeline.innerHTML = '';
        
        stories.forEach((story, index) => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card reveal-up';
            
            const imagesHTML = story.images && story.images.length > 0
                ? story.images.slice(0, 4).map(img => 
                    `<img src="${img}" alt="${story.title}" class="story-image" onclick="openLightbox('${img}')">`
                  ).join('')
                : '<div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-secondary);">Chưa có hình ảnh</div>';
            
            storyCard.innerHTML = `
                <div class="story-dot"></div>
                <div class="story-content" onclick="openStoryDetail(${story.id})">
                    <div class="story-date">${formatDate(story.date)}</div>
                    <span class="story-category">${story.category}</span>
                    <h3>${story.title}</h3>
                    <p>${truncateText(story.content, 150)}</p>
                    <span class="story-read-more">Xem chi tiết <i class="fas fa-arrow-right"></i></span>
                </div>
                <div class="story-images">
                    ${imagesHTML}
                </div>
            `;
            
            timeline.appendChild(storyCard);
        });
    } catch (error) {
        console.error('Error loading stories:', error);
    }
}

// ==================== LOAD GALLERY ====================
async function loadGallery() {
    try {
        // If static items already exist, skip dynamic fetch
        const existing = document.querySelector('#gallery-grid .gallery-item');
        if (existing) return;

            const gallery = await fetchWithFallback('gallery', '/data/gallery.json');
        
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = '';
        gallery.forEach(addGalleryItemToGrid);
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Reusable helper to append a gallery item
function addGalleryItemToGrid(item) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item reveal-up';
    galleryItem.dataset.category = item.category || 'Khác';

    // Build robust image source with fallbacks for static hosting (spaces/diacritics)
    const rawPath = item.image || '';
    const primarySrc = rawPath;
    const secondarySrc = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath; // try without leading slash
    const encodedPrimary = rawPath ? encodeURI(rawPath) : '';
    const encodedSecondary = secondarySrc ? encodeURI(secondarySrc) : '';
    const imageSrc = encodedPrimary || primarySrc;
    const fallbackSrc = encodedSecondary || secondarySrc;
    const imageHTML = imageSrc
        ? `<img src="${imageSrc}" alt="${item.title || 'Hoạt động'}" class="gallery-image" onclick="openLightbox('${imageSrc}')" onerror="if (this.dataset.retry!=='1'){ this.dataset.retry='1'; this.src='${fallbackSrc}'; } else { this.parentElement.style.background='var(--gradient)'; this.remove(); }">`
        : '<div class="gallery-image" style="background: var(--gradient);"></div>';

    galleryItem.innerHTML = `
        ${imageHTML}
        <div class="gallery-overlay">
            <h3>${item.title || ''}</h3>
            <p>${item.description || ''}</p>
            <span class="gallery-category">${item.category || 'Khác'}</span>
        </div>
    `;

    grid.appendChild(galleryItem);
}

// ==================== GALLERY FILTER ====================
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
}

// ==================== LOAD PROJECTS ====================
async function loadProjects() {
    try {
        const projects = await fetchWithFallback('projects', '/data/projects.json');
        
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card reveal-up';
            
            const techTags = project.technologies && project.technologies.length > 0
                ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
                : '';
            
            const imageHTML = project.image 
                ? `<img src="${project.image}" alt="${project.title}" class="project-image">`
                : '<div class="project-image"></div>';
            
            const linkHTML = project.link 
                ? `<a href="${project.link}" target="_blank" class="project-link">Xem dự án <i class="fas fa-external-link-alt"></i></a>`
                : '';
            
            projectCard.innerHTML = `
                ${imageHTML}
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">${techTags}</div>
                    ${linkHTML}
                </div>
            `;
            
            grid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// ==================== LOAD SKILLS ====================
async function loadSkills() {
    try {
        const skills = await fetchWithFallback('skills', '/data/skills.json');
        
        const grid = document.getElementById('skills-grid');
        grid.innerHTML = '';
        
        skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item reveal-up';
            
            skillItem.innerHTML = `
                <div class="skill-header">
                    <h4>${skill.name}</h4>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: 0%" data-width="${skill.level}%"></div>
                </div>
            `;
            
            grid.appendChild(skillItem);
        });
        
        // Animate skill bars
        setTimeout(() => {
            document.querySelectorAll('.skill-progress').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 500);
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// ==================== LOAD EXPERIENCE ====================
async function loadExperience() {
    try {
        const experiences = await fetchWithFallback('experience', '/data/experience.json');
        
        const timeline = document.getElementById('experience-timeline');
        timeline.innerHTML = '';
        
        experiences.forEach(exp => {
            const expItem = document.createElement('div');
            expItem.className = 'experience-item reveal-up';
            
            expItem.innerHTML = `
                <h3>${exp.position}</h3>
                <div class="experience-company">${exp.company}</div>
                <div class="experience-date">${exp.startDate} - ${exp.endDate}</div>
                <p>${exp.description}</p>
            `;
            
            timeline.appendChild(expItem);
        });
    } catch (error) {
        console.error('Error loading experience:', error);
    }
}

// ==================== LOAD EDUCATION ====================
async function loadEducation() {
    try {
        const educations = await fetchWithFallback('education', '/data/education.json');
        
        const grid = document.getElementById('education-grid');
        grid.innerHTML = '';
        
        educations.forEach(edu => {
            const eduCard = document.createElement('div');
            eduCard.className = 'education-card reveal-up';
            
            eduCard.innerHTML = `
                <h3>${edu.degree} - ${edu.major}</h3>
                <div class="education-school">${edu.school}</div>
                <div class="education-date">${edu.startDate} - ${edu.endDate}</div>
                ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            `;
            
            grid.appendChild(eduCard);
        });
    } catch (error) {
        console.error('Error loading education:', error);
    }
}

// ==================== LOAD AWARDS ====================
async function loadAwards() {
    try {
        const awards = await fetchWithFallback('awards', '/data/awards.json');
        
        const grid = document.getElementById('awards-grid');
        grid.innerHTML = '';
        
        awards.forEach(award => {
            const awardCard = document.createElement('div');
            awardCard.className = 'award-card reveal-up';
            
            awardCard.innerHTML = `
                <h3>${award.title}</h3>
                <div class="award-org">${award.organization}</div>
                <div class="award-date">${formatDate(award.date)}</div>
                <p>${award.description}</p>
            `;
            
            grid.appendChild(awardCard);
        });
    } catch (error) {
        console.error('Error loading awards:', error);
    }
}

// ==================== LOAD LINKS ====================
async function loadLinks() {
    try {
          const links = await fetchWithFallback('links', '/data/links.json');

        const grid = document.getElementById('links-grid');
        if (!grid) return;
        grid.innerHTML = '';

        links.forEach(link => {
            const card = document.createElement('div');
            card.className = 'link-card reveal-up';

            const icon = link.type === 'facebook' ? 'fab fa-facebook' :
                         link.type === 'drive' ? 'fab fa-google-drive' :
                         'far fa-newspaper';

            const domain = (() => {
                try { return new URL(link.url).hostname; } catch { return ''; }
            })();

            card.innerHTML = `
                <div class="link-icon"><i class="${icon}"></i></div>
                <div class="link-content">
                    <h3>${link.title}</h3>
                    <p class="link-domain">${domain}</p>
                    <a href="${link.url}" target="_blank" class="link-open">Mở liên kết <i class="fas fa-external-link-alt"></i></a>
                </div>
            `;

            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading links:', error);
    }
}

// ==================== STORY DETAIL MODAL ====================
async function openStoryDetail(id) {
    try {
        // Try API route, fallback to local stories.json then find by id
        let story;
        try {
            const res = await fetch(`${API_URL}/stories/${id}`);
            if (res.ok) {
                story = await res.json();
            }
        } catch {}
        if (!story) {
            const stories = await fetchWithFallback('stories', '/data/stories.json');
            story = stories.find(s => String(s.id) === String(id)) || stories[0];
        }
        
        const imagesHTML = story.images && story.images.length > 0
            ? `<div class="story-images-full">
                ${story.images.map(img => `<img src="${img}" alt="${story.title}" onclick="openLightbox('${img}')">`).join('')}
               </div>`
            : '';
        
        document.getElementById('story-detail').innerHTML = `
            <h2>${story.title}</h2>
            <div class="story-meta">
                <span class="story-date"><i class="far fa-calendar"></i> ${formatDate(story.date)}</span>
                <span class="story-category">${story.category}</span>
            </div>
            <p style="color: var(--text-secondary); line-height: 1.8;">${story.content}</p>
            ${imagesHTML}
        `;
        
        document.getElementById('story-modal').style.display = 'block';
    } catch (error) {
        console.error('Error loading story detail:', error);
    }
}

// ==================== MODAL FUNCTIONS ====================
function initModal() {
    const modal = document.getElementById('story-modal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// ==================== LIGHTBOX ====================
let currentLightboxImage = '';
let allImages = [];
let currentImageIndex = 0;

function openLightbox(imageSrc) {
    currentLightboxImage = imageSrc;
    document.getElementById('lightbox-img').src = imageSrc;
    document.getElementById('lightbox').style.display = 'flex';
    
    // Get all images for navigation
    allImages = Array.from(document.querySelectorAll('.story-image, .gallery-image')).map(img => img.src);
    currentImageIndex = allImages.indexOf(imageSrc);
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    closeBtn.onclick = () => {
        lightbox.style.display = 'none';
    };
    
    prevBtn.onclick = () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            document.getElementById('lightbox-img').src = allImages[currentImageIndex];
        }
    };
    
    nextBtn.onclick = () => {
        if (currentImageIndex < allImages.length - 1) {
            currentImageIndex++;
            document.getElementById('lightbox-img').src = allImages[currentImageIndex];
        }
    };
    
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    };
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') lightbox.style.display = 'none';
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));
    
    // Re-observe when new content is loaded
    setInterval(() => {
        const newElements = document.querySelectorAll('.reveal-up:not(.active), .reveal-left:not(.active), .reveal-right:not(.active)');
        newElements.forEach(el => observer.observe(el));
    }, 500);
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    });
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// ==================== SETTINGS PANEL ====================
function initSettings() {
    const navSettingsBtn = document.getElementById('nav-settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsClose = document.getElementById('settings-close');
    const avatarUploadZone = document.getElementById('avatar-upload-zone');
    const avatarInput = document.getElementById('avatar-upload-input');
    const avatarPreview = document.getElementById('settings-avatar-preview');
    
    // Toggle settings panel from navigation button
    navSettingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        settingsPanel.classList.toggle('active');
    });
    
    settingsClose.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });
    
    // Click outside to close
    settingsPanel.addEventListener('click', (e) => {
        if (e.target === settingsPanel) {
            settingsPanel.classList.remove('active');
        }
    });
    
    // Avatar upload
    avatarUploadZone.addEventListener('click', () => {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.src = e.target.result;
            document.getElementById('profile-avatar').src = e.target.result;
            // Save to localStorage
            localStorage.setItem('customAvatar', e.target.result);
        };
        reader.readAsDataURL(file);
        
        // Upload to server
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('avatarUrl', result.imageUrl);
                console.log('Avatar uploaded:', result.imageUrl);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    });

    // Activity upload
    const activityImageInput = document.getElementById('activity-image-upload');
    const activityTitleInput = document.getElementById('activity-title-input');
    const activityDescInput = document.getElementById('activity-desc-input');
    const activityCategorySelect = document.getElementById('activity-category-select');
    const addActivityBtn = document.getElementById('add-activity-btn');

    const resetActivityForm = () => {
        if (activityImageInput) activityImageInput.value = '';
        if (activityTitleInput) activityTitleInput.value = '';
        if (activityDescInput) activityDescInput.value = '';
        if (activityCategorySelect) activityCategorySelect.value = 'Sự kiện';
    };

    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', async () => {
            if (!activityImageInput || !activityTitleInput || !activityCategorySelect) return;
            const file = activityImageInput.files[0];
            const title = activityTitleInput.value.trim();
            const description = activityDescInput ? activityDescInput.value.trim() : '';
            const category = activityCategorySelect.value || 'Khác';

            if (!file) {
                alert('Vui lòng chọn ảnh.');
                return;
            }
            if (!title) {
                alert('Vui lòng nhập tiêu đề.');
                return;
            }

            try {
                // 1) Upload image
                const formData = new FormData();
                formData.append('image', file);
                const uploadRes = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadRes.json();
                if (!uploadData.success || !uploadData.imageUrl) {
                    throw new Error('Upload ảnh thất bại');
                }

                const newItem = {
                    title,
                    description,
                    category,
                    image: uploadData.imageUrl
                };

                // 2) Save metadata
                await fetch(`${API_URL}/gallery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });

                // 3) Append to UI
                addGalleryItemToGrid(newItem);
                alert('✅ Đã thêm ảnh hoạt động');
                resetActivityForm();
            } catch (err) {
                console.error('Error adding activity image:', err);
                alert('Không thêm được ảnh. Vui lòng thử lại.');
            }
        });
    }
    
    // Theme presets
    const themePresets = document.querySelectorAll('.theme-preset');
    themePresets.forEach(preset => {
        preset.addEventListener('click', () => {
            themePresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            
            const theme = preset.dataset.theme;
            applyThemePreset(theme);
        });
    });
    
    // Color pickers
    const primaryPicker = document.getElementById('primary-color-picker');
    const secondaryPicker = document.getElementById('secondary-color-picker');
    const accentPicker = document.getElementById('accent-color-picker');
    
    const primaryValue = document.getElementById('primary-color-value');
    const secondaryValue = document.getElementById('secondary-color-value');
    const accentValue = document.getElementById('accent-color-value');
    
    primaryPicker.addEventListener('input', (e) => {
        primaryValue.value = e.target.value;
        applyColors(e.target.value, secondaryPicker.value, accentPicker.value);
    });
    
    secondaryPicker.addEventListener('input', (e) => {
        secondaryValue.value = e.target.value;
        applyColors(primaryPicker.value, e.target.value, accentPicker.value);
    });
    
    accentPicker.addEventListener('input', (e) => {
        accentValue.value = e.target.value;
        applyColors(primaryPicker.value, secondaryPicker.value, e.target.value);
    });
    
    // Save settings
    document.getElementById('save-settings').addEventListener('click', () => {
        const settings = {
            primaryColor: primaryPicker.value,
            secondaryColor: secondaryPicker.value,
            accentColor: accentPicker.value,
            avatar: avatarPreview.src
        };
        
        localStorage.setItem('portfolioSettings', JSON.stringify(settings));
        alert('✅ Đã lưu cài đặt!');
        settingsPanel.classList.remove('active');
    });
    
    // Reset settings
    document.getElementById('reset-settings').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn đặt lại cài đặt về mặc định?')) {
            localStorage.removeItem('portfolioSettings');
            localStorage.removeItem('customAvatar');
            localStorage.removeItem('avatarUrl');
            location.reload();
        }
    });
}

function applyThemePreset(theme) {
    const themes = {
        professional: {
            primary: '#2563eb',
            secondary: '#3b82f6',
            accent: '#0ea5e9'
        },
        modern: {
            primary: '#8b5cf6',
            secondary: '#a78bfa',
            accent: '#c084fc'
        },
        ocean: {
            primary: '#06b6d4',
            secondary: '#0891b2',
            accent: '#0e7490'
        },
        sunset: {
            primary: '#f59e0b',
            secondary: '#f97316',
            accent: '#ea580c'
        },
        forest: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#047857'
        },
        rose: {
            primary: '#f43f5e',
            secondary: '#e11d48',
            accent: '#be123c'
        }
    };
    
    const colors = themes[theme];
    if (colors) {
        document.getElementById('primary-color-picker').value = colors.primary;
        document.getElementById('secondary-color-picker').value = colors.secondary;
        document.getElementById('accent-color-picker').value = colors.accent;
        
        document.getElementById('primary-color-value').value = colors.primary;
        document.getElementById('secondary-color-value').value = colors.secondary;
        document.getElementById('accent-color-value').value = colors.accent;
        
        applyColors(colors.primary, colors.secondary, colors.accent);
    }
}

function applyColors(primary, secondary, accent) {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--accent-color', accent);
    document.documentElement.style.setProperty('--gradient', `linear-gradient(135deg, ${primary}, ${secondary})`);
    document.documentElement.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${primary}, ${accent})`);
}

function loadSettings() {
    // Load saved settings
    const savedSettings = localStorage.getItem('portfolioSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply colors
        applyColors(settings.primaryColor, settings.secondaryColor, settings.accentColor);
        
        // Update pickers
        document.getElementById('primary-color-picker').value = settings.primaryColor;
        document.getElementById('secondary-color-picker').value = settings.secondaryColor;
        document.getElementById('accent-color-picker').value = settings.accentColor;
        
        document.getElementById('primary-color-value').value = settings.primaryColor;
        document.getElementById('secondary-color-value').value = settings.secondaryColor;
        document.getElementById('accent-color-value').value = settings.accentColor;
    }
    
    // Load custom avatar
    const customAvatar = localStorage.getItem('customAvatar');
    if (customAvatar) {
        document.getElementById('profile-avatar').src = customAvatar;
        document.getElementById('settings-avatar-preview').src = customAvatar;
    }
}

// ==================== 3D CUBE SCROLL EFFECT ====================
function init3DCubeScroll() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add scroll-reveal class để trigger animation
                entry.target.classList.add('scroll-reveal');
            }
        });
    }, observerOptions);
    
    // Observe all cards
    const cards = document.querySelectorAll(
        '.project-card, .skill-item, .gallery-item, ' +
        '.link-card, .contact-item, .experience-item, ' +
        '.education-card, .award-card, .story-card'
    );
    
    cards.forEach(card => observer.observe(card));
}

