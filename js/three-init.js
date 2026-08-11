// ============================================
// 3D QUANTUM ORB - THREE.JS IMPLEMENTATION
// ============================================

class QuantumOrb3D {
    constructor() {
        this.container = document.getElementById('heroOrb3D');
        if (!this.container) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.orbGroup = new THREE.Group();
        
        this.init();
        this.createParticles();
        this.createRings();
        this.createCore();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 5;
        this.scene.add(this.orbGroup);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00f0ff, 2, 10);
        pointLight1.position.set(2, 2, 2);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xa855f7, 2, 10);
        pointLight2.position.set(-2, -1, 3);
        this.scene.add(pointLight2);
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = 1500;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i += 3) {
            const radius = 2 + Math.random() * 1.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
            
            // Colors
            const color = new THREE.Color();
            if (Math.random() > 0.5) {
                color.setHSL(0.5, 1, 0.5); // Cyan
            } else {
                color.setHSL(0.75, 1, 0.5); // Purple
            }
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.orbGroup.add(this.particles);
    }
    
    createRings() {
        // Create multiple rotating rings
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.RingGeometry(1.5 + i * 0.3, 1.55 + i * 0.3, 64);
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00f0ff : 0xa855f7,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 2 * (i % 2 === 0 ? 1 : -1);
            ring.rotation.y = i * 0.5;
            ring.userData = { speed: (i % 2 === 0 ? 1 : -1) * (0.2 + i * 0.05) };
            
            this.orbGroup.add(ring);
            this.rings = this.rings || [];
            this.rings.push(ring);
        }
        
        // Add a sphere wireframe
        const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        this.orbGroup.add(sphere);
    }
    
    createCore() {
        // Create glowing core
        const innerCore = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                transparent: true,
                opacity: 0.8
            })
        );
        this.orbGroup.add(innerCore);
        
        // Add glow effect
        const glowSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: this.createGlowTexture(),
                blending: THREE.AdditiveBlending,
                opacity: 0.5
            })
        );
        glowSprite.scale.set(1.5, 1.5, 1);
        this.orbGroup.add(glowSprite);
    }
    
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    bindEvents() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        
        // Resize
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
        
        // Click burst
        this.container.addEventListener('click', () => {
            this.burstParticles();
        });
    }
    
    burstParticles() {
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const direction = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            ).normalize();
            
            positions[i] += direction.x * 0.1;
            positions[i + 1] += direction.y * 0.1;
            positions[i + 2] += direction.z * 0.1;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Create notification
        window.showToast('⚛ Quantum burst!', 'info');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = this.clock.getElapsedTime();
        
        // Rotate particle system
        if (this.particles) {
            this.particles.rotation.x = time * 0.05;
            this.particles.rotation.y = time * 0.08;
        }
        
        // Rotate rings
        if (this.rings) {
            this.rings.forEach(ring => {
                ring.rotation.z += ring.userData.speed * 0.01;
            });
        }
        
        // Smooth camera rotation based on mouse
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(0, 0, 0);
        
        // Pulsing orb
        const pulse = 1 + Math.sin(time * 2) * 0.1;
        this.orbGroup.scale.set(pulse, pulse, pulse);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.quantumOrb = new QuantumOrb3D();
});
