// ============================================
// ADVANCED PARTICLE SYSTEM
// ============================================

class AdvancedParticles {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.colors = ['#00f0ff', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'];
        
        this.init();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }
    
    createParticles() {
        const count = Math.min(200, Math.floor(window.innerWidth * window.innerHeight / 8000));
        this.particles = [];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.05 + 0.02,
                connections: []
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Touch support
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });
    }
    
    drawConnection(p1, p2, distance, maxDistance) {
        const opacity = 1 - (distance / maxDistance);
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(0, 240, 255, \${opacity * 0.5})`;
        this.ctx.lineWidth = opacity;
        this.ctx.stroke();
    }
    
    drawParticle(particle) {
        particle.pulse += particle.pulseSpeed;
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.2;
        
        // Glow effect
        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = pulseOpacity * 0.5;
        this.ctx.fillRect(
            particle.x - particle.size * 4,
            particle.y - particle.size * 4,
            particle.size * 8,
            particle.size * 8
        );
        
        // Core
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = pulseOpacity;
        this.ctx.fill();
    }
    
    updateParticle(particle) {
        // Move
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Edge bounce
        if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
        
        // Mouse interaction
        if (this.mouse.x !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                particle.vx += Math.cos(angle) * force * 2;
                particle.vy += Math.sin(angle) * force * 2;
            }
        }
        
        // Speed limit
        const maxSpeed = 3;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
            particle.vx = (particle.vx / speed) * maxSpeed;
            particle.vy = (particle.vy / speed) * maxSpeed;
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            this.updateParticle(particle);
            this.drawParticle(particle);
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = particle.x - p2.x;
                const dy = particle.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.drawConnection(particle, p2, distance, 100);
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.particles = new AdvancedParticles();
});
