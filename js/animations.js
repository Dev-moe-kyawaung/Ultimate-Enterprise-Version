// ============================================
// PREMIUM ANIMATIONS - GSAP IMPLEMENTATION
// ============================================

class PremiumAnimations {
    constructor() {
        this.initScrollAnimations();
        this.initHeroAnimations();
        this.initCounterAnimations();
        this.initTextAnimations();
        this.initButtonEffects();
        this.initParallaxEffects();
        this.initPageTransitions();
    }
    
    initScrollAnimations() {
        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Section reveal animations
        document.querySelectorAll('[data-reveal]').forEach(element => {
            const delay = element.dataset.delay || 0;
            
            gsap.fromTo(element, 
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    delay: delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Timeline effects
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
                duration: 0.8,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                }
            });
        });
    }
    
    initHeroAnimations() {
        // Hero timeline
        const tl = gsap.timeline();
        
        tl.from('.hero-eyebrow', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.hero-title .title-line-1', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-title .title-line-2', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .from('.hero-title .title-line-3', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .from('.hero-roles', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-description', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-cta-row', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-stat-item', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.4');
        
        // Floating tech badges animation
        document.querySelectorAll('.tech-badge').forEach((badge, index) => {
            gsap.to(badge, {
                y: Math.random() * 20 - 10,
                x: Math.random() * 20 - 10,
                rotation: Math.random() * 20 - 10,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                delay: index * 0.1,
                ease: 'sine.inOut'
            });
        });
    }
    
    initCounterAnimations() {
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const start = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, start, target, duration, suffix);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    animateCounter(element, start, end, duration, suffix) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = `\${currentValue}\${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = `\${end}\${suffix}`;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    initTextAnimations() {
        // Gradient text animation
        document.querySelectorAll('.gradient-text').forEach(text => {
            gsap.to(text, {
                backgroundPosition: '200% 0',
                duration: 3,
                repeat: -1,
                ease: 'linear'
            });
        });
        
        // Text scramble on hover
        document.querySelectorAll('.scramble-text').forEach(element => {
            const chars = '!<>-_\\/[]{}—=+*^?#________';
            const original = element.textContent;
            
            element.addEventListener('mouseenter', () => {
                let iteration = 0;
                const interval = setInterval(() => {
                    element.textContent = original.split('').map((char, index) => {
                        if (index < iteration) return original[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('');
                    
                    if (iteration >= original.length) clearInterval(interval);
                    iteration++;
                }, 30);
            });
        });
    }
    
    initButtonEffects() {
        // Magnetic buttons
        document.querySelectorAll('.btn-magnetic').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(button, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power3.out'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
        
        // Button shine effect
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                button.style.setProperty('--shine-x', `\${x}px`);
                button.style.setProperty('--shine-y', `\${y}px`);
            });
        });
    }
    
    initParallaxEffects() {
        // Parallax on hero
        gsap.to('.hero-visual', {
            y: -100,
            opacity: 0.5,
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
        
        // Parallax on sections
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = element.dataset.parallax || 0.3;
            
            gsap.to(element, {
                y: () => speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: element.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }
    
    initPageTransitions() {
        // Smooth page transitions with Barba
        barba.init({
            sync: true,
            transitions: [{
                async leave(data) {
                    const done = this.async();
                    
                    // Animate out
                    gsap.to('.page-transition', {
                        opacity: 1,
                        duration: 0.5,
                        onComplete: done
                    });
                },
                async enter(data) {
                    const done = this.async();
                    
                    // Animate in
                    gsap.from('.page-transition', {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: done
                    });
                }
            }]
        });
    }
    
    initializeSkillBars() {
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            const targetWidth = bar.dataset.width;
            
            gsap.fromTo(bar, {
                width: '0%'
            }, {
                width: targetWidth,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 80%'
                }
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.animations = new PremiumAnimations();
});
