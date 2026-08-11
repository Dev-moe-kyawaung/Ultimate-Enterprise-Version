// ============================================
// QUANTUM PORTFOLIO PRO - MAIN APPLICATION
// ============================================

'use strict';

// App State Management
const AppState = {
    theme: 'dark',
    mobileMenu: false,
    chatWidget: false,
    currentProjectFilter: 'all',
    currentCertFilter: 'all',
    testimonialsIndex: 0,
    projectsLoaded: 0,
    isPageLoading: true,
    pageLoaded: false
};

// ============================================
// DOM READY - INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTheme();
    initNavigation();
    initBackgroundEffects();
    initHeroEffects();
    initAboutSection();
    initSkillsSection();
    initProjectsSection();
    initExperienceSection();
    initCertificationsSection();
    initGitHubSection();
    initTestimonials();
    initBlogSection();
    initContactForm();
    initChatSystem();
    initBackToTop();
    initToastSystem();
    initModalSystem();
    initAOS();
    initCounters();
    initCursorEffects();
    initParticles();
    initMatrixRain();
    initScrollAnimations();
    initPerformanceMonitoring();
    initNewsletterForm();
    initEmailJSIntegration();
    initGoogleAnalytics();
    initCurrentYear();
});

// ============================================
// PRELOADER SYSTEM
// ============================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    const percent = document.getElementById('loadPercent');
    
    let progress = 0;
    const totalSteps = 10;
    let step = 0;
    
    const loadingInterval = setInterval(() => {
        step++;
        progress = Math.min(Math.floor((step / totalSteps) * 100), 100);
        
        fill.style.width = `\${progress}%`;
        percent.textContent = `\${progress}%`;
        
        if (step >= totalSteps) {
            clearInterval(loadingInterval);
            finishLoading();
        }
    }, 150);
    
    function finishLoading() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('lock-scroll');
            document.body.classList.add('loaded');
            AppState.pageLoaded = true;
        }, 500);
    }
}

// ============================================
// THEME SWITCHING
// ============================================
function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    const savedTheme = localStorage.getItem('quantum-theme') || 'dark';
    
    applyTheme(savedTheme);
    
    themeSwitch.addEventListener('click', () => {
        const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
        AppState.theme = newTheme;
        applyTheme(newTheme);
        localStorage.setItem('quantum-theme', newTheme);
    });
}

function applyTheme(theme) {
    AppState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const icons = document.querySelector('.theme-icons');
    if (theme === 'dark') {
        icons.querySelector('.icon-dark').style.display = 'none';
        icons.querySelector('.icon-light').style.display = 'block';
    } else {
        icons.querySelector('.icon-dark').style.display = 'block';
        icons.querySelector('.icon-light').style.display = 'none';
    }
    
    // Trigger custom event for other components
    document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Mobile Menu Toggle
    const toggleMobileMenu = (open) => {
        AppState.mobileMenu = open;
        hamburger.classList.toggle('active', open);
        mobileMenu.classList.toggle('active', open);
        document.body.classList.toggle('lock-scroll', open);
        hamburger.setAttribute('aria-expanded', open);
    };
    
    hamburger.addEventListener('click', () => toggleMobileMenu(!AppState.mobileMenu));
    closeMenu.addEventListener('click', () => toggleMobileMenu(false));
    
    // Close mobile menu on link click
    document.querySelectorAll('[data-mobile-nav]').forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });
    
    // Navbar scroll effect
    const header = document.getElementById('siteHeader');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Navigation active state
    const sections = document.querySelectorAll('section[data-scroll-section]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const scrollSpy = () => {
        const currentPos = window.scrollY;
        
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            const id = section.id;
            
            if (currentPos >= top && currentPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.scrollTo === id);
                });
            }
        });
    };
    
    window.addEventListener('scroll', scrollSpy, { passive: true });
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.scrollTo;
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                toggleMobileMenu(false);
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// BACKGROUND EFFECTS
// ============================================
function initBackgroundEffects() {
    // Initialize Floating Particles
    initFloatingParticles();
    
    // Initialize Grid Effect
    createGridEffect();
    
    // Initialize Noise
    createNoisePattern();
    
    // Initialize Vignette
    createVignetteEffect();
}

function initFloatingParticles() {
    const container = document.getElementById('floatingParticles');
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'float-particle';
        particle.innerHTML = getRandomIcon();
        particle.style.cssText = `
            position: absolute;
            left: \${Math.random() * 100}%;
            top: \${Math.random() * 100}%;
            font-size: \${Math.random() * 20 + 10}px;
            color: \${getRandomColor()};
            opacity: \${Math.random() * 0.3 + 0.1};
            animation: float-up \${Math.random() * 10 + 5}s linear infinite;
            animation-delay: \${Math.random() * 5}s;
            pointer-events: none;
            z-index: 1;
        `;
        container.appendChild(particle);
    }
}

function getRandomIcon() {
    const icons = ['⚡', '◆', '●', '▲', '■', '✦', '✧', '∞', 'π', '∑'];
    return icons[Math.floor(Math.random() * icons.length)];
}

function getRandomColor() {
    const colors = ['#00f0ff', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createGridEffect() {
    const grid = document.querySelector('.bg-animated-grid');
    if (!grid) return;
    
    // Add CSS animation class
    grid.classList.add('animated-grid');
}

function createNoisePattern() {
    const noise = document.querySelector('.bg-noise');
    if (!noise) return;
    
    // Create canvas noise pattern
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(Math.random() * 255);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 25;
    }
    ctx.putImageData(imageData, 0, 0);
    
    noise.style.backgroundImage = `url(\${canvas.toDataURL()})`;
    noise.style.backgroundRepeat = 'repeat';
}

function createVignetteEffect() {
    const vignette = document.querySelector('.bg-vignette');
    if (!vignette) return;
    
    vignette.style.background = 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)';
}

// ============================================
// HERO SECTION
// ============================================
function initHeroEffects() {
    // Typing Effect
    initTypingEffect();
    
    // Hero Orb Animation
    initHeroOrb();
    
    // Stats Counter
    initCounterAnimation('.hero-stats .counter');
    
    // Floating Tech Icons
    initTechFloatingAnimations();
}

function initTypingEffect() {
    const typedElement = document.getElementById('typedRoles');
    const roles = [
        'Senior Android Developer',
        'Kotlin & Compose Expert',
        'Clean Architecture Advocate',
        'AI Integration Specialist',
        'Mobile Problem Solver'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex);
            charIndex--;
            
            if (charIndex < 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 500);
                return;
            }
            
            setTimeout(type, 30);
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentRole.length) {
                setTimeout(() => { isDeleting = true; }, 2000);
            }
            
            setTimeout(type, 60);
        }
    }
    
    type();
}

function initHeroOrb() {
    const orb = document.getElementById('heroOrb');
    if (!orb) return;
    
    orb.addEventListener('mouseenter', () => {
        orb.classList.add('hover');
    });
    
    orb.addEventListener('mouseleave', () => {
        orb.classList.remove('hover');
    });
    
    orb.addEventListener('click', () => {
        createOrbBurst();
    });
}

function createOrbBurst() {
    const orb = document.getElementById('heroOrb');
    const rect = orb.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i;
        const particle = document.createElement('div');
        particle.className = 'orb-particle';
        particle.style.cssText = `
            position: fixed;
            left: \${centerX}px;
            top: \${centerY}px;
            width: 4px;
            height: 4px;
            background: \${i % 2 === 0 ? '#00f0ff' : '#a855f7'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(particle);
        
        const velocity = 3;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        
        let x = 0;
        let y = 0;
        
        const animate = () => {
            x += dx * 5;
            y += dy * 5;
            particle.style.transform = `translate(\${x}px, \${y}px) scale(\${1 - (Math.abs(x) + Math.abs(y)) / 200})`;
            particle.style.opacity = String(1 - (Math.abs(x) + Math.abs(y)) / 300);
            
            if (Math.abs(x) + Math.abs(y) < 300) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
    
    // Show toast
    showToast('⚛ Quantum burst initiated!');
}

function initTechFloatingAnimations() {
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item, index) => {
        item.style.animationDelay = `\${index * 0.5}s`;
        item.style.setProperty('--float-x', `\${Math.random() * 20 - 10}px`);
        item.style.setProperty('--float-y', `\${Math.random() * 20 - 10}px`);
    });
}

// ============================================
// ABOUT SECTION
// ============================================
function initAboutSection() {
    // Profile card tilt effect
    const profileCard = document.querySelector('.profile-card-wrapper');
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            profileCard.style.transform = `perspective(1000px) rotateY(\${x * 10}deg) rotateX(\${y * -10}deg)`;
        });
        
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    }
    
    // About cards interactive effects
    document.querySelectorAll('.about-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('is-hovered');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-hovered');
        });
    });
}

// ============================================
// SKILLS SECTION
// ============================================
function initSkillsSection() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-\${tabId}`).classList.add('active');
            
            // Animate skill bars
            animateSkillBars(document.getElementById(`tab-\${tabId}`));
        });
    });
    
    // Initial skill bar animation
    animateSkillBars(document.querySelector('.tab-content.active'));
}

function animateSkillBars(container) {
    if (!container) return;
    
    const bars = container.querySelectorAll('.skill-bar-fill');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// ============================================
// PROJECTS SECTION
// ============================================
function initProjectsSection() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.getElementById('projectsGrid');
    
    // Render initial projects
    renderProjects('all');
    
    // Update counts
    updateProjectCounts();
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            renderProjects(filter);
        });
    });
    
    // Footer filter buttons
    document.querySelectorAll('.footer-project-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.footer-project-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });
}

function renderProjects(filter) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const projects = filter === 'all' 
        ? ProjectsData 
        : ProjectsData.filter(p => p.category === filter);
    
    const fragment = document.createDocumentFragment();
    
    projects.forEach((project, index) => {
        const card = document.createElement('article');
        card.className = `project-card project-\${project.category}`;
        card.dataset.id = project.id;
        
        card.innerHTML = `
            <div class="project-thumbnail">
                <img src="\${project.image}" alt="\${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-actions">
                        <a href="\${project.github}" class="btn-circle" target="_blank" aria-label="View on GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                        \${project.demo ? `<a href="\${project.demo}" class="btn-circle" target="_blank" aria-label="Live Preview">
                            <i class="fas fa-external-link-alt"></i>
                        </a>` : ''}
                    </div>
                </div>
                <div class="project-category">\${project.icon} \${project.category}</div>
            </div>
            <div class="project-info">
                <h3 class="project-title">\${project.title}</h3>
                <p class="project-desc">\${project.description}</p>
                <div class="project-tech">
                    \${project.tech.map(t => `<span class="tech-tag">\${t}</span>`).join('')}
                </div>
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> \${project.stats?.stars || 0}</span>
                    <span><i class="fas fa-code-branch"></i> \${project.stats?.forks || 0}</span>
                    <span class="project-year">\${project.year}</span>
                </div>
            </div>
        `;
        
        fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
    
    // Add reveal animations
    const revealElements = grid.querySelectorAll('.project-card');
    revealElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50 * index);
    });
}

function updateProjectCounts() {
    const counts = {
        all: ProjectsData.length,
        android: ProjectsData.filter(p => p.category === 'android').length,
        game: ProjectsData.filter(p => p.category === 'game').length,
        web: ProjectsData.filter(p => p.category === 'web').length
    };
    
    document.getElementById('countAll').textContent = counts.all;
    document.getElementById('countAndroid').textContent = counts.android;
    document.getElementById('countGame').textContent = counts.game;
    document.getElementById('countWeb').textContent = counts.web;
}
