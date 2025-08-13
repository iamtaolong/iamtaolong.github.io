document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const calligraphyContainer = document.querySelector('.calligraphy');
    
    // Set up canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    calligraphyContainer.appendChild(canvas);
    
    // Highlight marker colors from CSS
    const highlightColors = [
        'rgba(251, 140, 36, 0.2)',
        'rgba(251, 140, 36, 0.15)',
        'rgba(251, 140, 36, 0.1)',
        'rgba(251, 140, 36, 0.3)',
        'rgba(251, 140, 36, 0.25)'
    ];
    
    let windowSize = {
        w: window.innerWidth,
        h: window.innerHeight
    };
    
    // Resize canvas
    function resizeCanvas() {
        windowSize.w = window.innerWidth;
        windowSize.h = window.innerHeight;
        canvas.width = windowSize.w;
        canvas.height = windowSize.h;
    }
    
    // Highlighter stroke class for rectangular highlighter marks
    class CalligraphyStroke {
        constructor() {
            this.rectangles = [];
            this.maxRectangles = Math.random() * 40 + 30;
            
            // Better distribution across left and right white spaces
            const spawnZone = Math.random();
            if (spawnZone < 0.3) {
                // Left side of screen
                this.startX = Math.random() * (windowSize.w * 0.3);
            } else if (spawnZone < 0.6) {
                // Right side of screen  
                this.startX = windowSize.w * 0.7 + Math.random() * (windowSize.w * 0.3);
            } else {
                // Center area (less frequent)
                this.startX = windowSize.w * 0.3 + Math.random() * (windowSize.w * 0.4);
            }
            
            this.startY = Math.random() * windowSize.h;
            this.currentX = this.startX;
            this.currentY = this.startY;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 3 + 1;
            this.width = Math.random() * 60 + 20;
            this.height = Math.random() * 20 + 8;
            this.baseColor = highlightColors[Math.floor(Math.random() * highlightColors.length)];
            this.life = 0;
            this.maxLife = Math.random() * 300 + 150;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.completed = false;
            
            // Color animation properties
            this.colorPhase = Math.random() * Math.PI * 2;
            this.colorSpeed = Math.random() * 0.02 + 0.01;
            
            // Flow direction changes
            this.angleChange = (Math.random() - 0.5) * 0.015;
            this.widthChange = (Math.random() - 0.5) * 0.3;
        }
        
        update() {
            if (this.completed) return;
            
            this.life++;
            
            // Update color animation
            this.colorPhase += this.colorSpeed;
            
            // Create flowing, organic movement
            this.angle += this.angleChange + Math.sin(this.life * 0.008) * 0.008;
            this.width += this.widthChange;
            this.width = Math.max(15, Math.min(80, this.width));
            
            // Move the highlighter
            this.currentX += Math.cos(this.angle) * this.speed;
            this.currentY += Math.sin(this.angle) * this.speed;
            
            // Create color variations for animation
            const colorIntensity = (Math.sin(this.colorPhase) + 1) * 0.5; // 0 to 1
            
            // Highlighter starts darker and fades - realistic highlighter behavior
            const strokeProgress = this.life / this.maxLife;
            const highlighterFade = 1 - (strokeProgress * 0.7); // Starts at 1, fades to 0.3
            const animatedOpacity = this.opacity * (0.3 + colorIntensity * 0.7) * highlighterFade;
            
            // Add rectangle to highlighter path
            this.rectangles.push({
                x: this.currentX,
                y: this.currentY,
                width: this.width,
                height: this.height,
                opacity: animatedOpacity,
                rotation: this.angle,
                colorPhase: this.colorPhase,
                strokeProgress: strokeProgress
            });
            
            // Remove old rectangles
            if (this.rectangles.length > this.maxRectangles) {
                this.rectangles.shift();
            }
            
            // Mark as completed when life is over
            if (this.life >= this.maxLife) {
                this.completed = true;
            }
        }
        
        draw() {
            if (this.rectangles.length < 1) return;
            
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            
            for (let i = 0; i < this.rectangles.length; i++) {
                const rect = this.rectangles[i];
                
                // Create color variation based on phase and stroke progress
                const colorShift = Math.sin(rect.colorPhase) * 0.1;
                const r = 251;
                const g = Math.max(100, Math.min(180, 140 + colorShift * 40));
                const b = Math.max(20, Math.min(50, 36 + colorShift * 20));
                
                // Highlighter starts darker (higher opacity) and gets lighter
                const darknessMultiplier = rect.strokeProgress < 0.2 ? 1.5 : (1 - rect.strokeProgress * 0.5);
                
                // Create gradient for highlighter effect
                const gradient = ctx.createLinearGradient(
                    rect.x - rect.width/2, rect.y - rect.height/2,
                    rect.x + rect.width/2, rect.y + rect.height/2
                );
                
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${rect.opacity * 0.9 * darknessMultiplier})`);
                gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${rect.opacity * 1.2 * darknessMultiplier})`);
                gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${rect.opacity * 1.2 * darknessMultiplier})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${rect.opacity * 0.7 * darknessMultiplier})`);
                
                ctx.save();
                ctx.translate(rect.x, rect.y);
                ctx.rotate(rect.rotation);
                
                // Draw rectangular highlighter mark
                ctx.fillStyle = gradient;
                ctx.fillRect(-rect.width/2, -rect.height/2, rect.width, rect.height);
                
                // Add slight border for more realistic highlighter look
                ctx.strokeStyle = `rgba(${r}, ${g-20}, ${b}, ${rect.opacity * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(-rect.width/2, -rect.height/2, rect.width, rect.height);
                
                ctx.restore();
            }
            
            ctx.restore();
        }
    }
    
    let strokes = [];
    const maxStrokes = 16;
    let lastStrokeTime = 0;
    const strokeInterval = 1200; // New highlighter stroke every 1.2 seconds
    
    function createStroke() {
        if (strokes.length < maxStrokes) {
            strokes.push(new CalligraphyStroke());
        }
    }
    
    function animate() {
        // Clear canvas with slight fade effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, windowSize.w, windowSize.h);
        
        const currentTime = Date.now();
        
        // Create new strokes periodically
        if (currentTime - lastStrokeTime > strokeInterval) {
            createStroke();
            lastStrokeTime = currentTime;
        }
        
        // Update and draw strokes
        for (let i = strokes.length - 1; i >= 0; i--) {
            const stroke = strokes[i];
            stroke.update();
            stroke.draw();
            
            // Remove completed strokes
            if (stroke.completed && stroke.rectangles.length === 0) {
                strokes.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize
    resizeCanvas();
    
    // Start with more initial highlighter strokes for better coverage
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createStroke(), i * 200);
    }
    
    animate();
    
    // Fade in effect
    setTimeout(() => {
        canvas.style.transition = 'opacity 2s ease-in';
        canvas.style.opacity = '0.15';
    }, 1000);
}); 