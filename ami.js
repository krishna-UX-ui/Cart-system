function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 12 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 10) + 's';
        container.appendChild(particle);
    }
}


document.addEventListener('mousemove', e => {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed; left: ${e.clientX}px; top: ${e.clientY}px;
        width: 8px; height: 8px; background: radial-gradient(circle, #ff6b6b, transparent);
        border-radius: 50%; pointer-events: none; z-index: 999;
        animation: mouseTrail .7s ease-out forwards;
    `;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 700);
});


const style = document.createElement('style');
style.textContent = `@keyframes mouseTrail { to { transform: scale(0) translateY(-50px); opacity: 0; } }`;
document.head.appendChild(style);


document.getElementById('logo').onclick = function() {
    this.style.animation = 'none';
    this.style.transform = 'scale(.9)';
    setTimeout(() => {
        this.style.animation = 'gradientShift 3s ease infinite, logoFloat 6s ease-in-out infinite';
        this.style.transform = 'scale(1)';
    }, 200);
};

document.querySelector('.cta-button').onclick = function() {
    this.innerHTML = '🚀 Loading...';
    this.style.transform = 'scale(.95)';
    setTimeout(() => {
        this.innerHTML = '🛒 Shop Now';
        this.style.transform = 'translateY(-8px) scale(1.05)';
    }, 800);
};

createParticles();