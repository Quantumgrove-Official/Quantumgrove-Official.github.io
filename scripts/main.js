
// Theme Management
const initTheme = () => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
};

// Navbar Logic
const initNavbar = () => {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuBtn?.querySelector('.material-symbols-outlined');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
            // Tailwind classes for scrolled state
            header.classList.remove('top-0', 'w-full', 'border-transparent', 'bg-white/80', 'dark:bg-[#0b0f1a]/80');
            header.classList.add('top-0', 'w-full', 'border-b', 'border-[#e7ebf3]', 'dark:border-white/5', 'bg-white/90', 'dark:bg-[#0b0f1a]/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
            // On desktop we add specific classes if we want the floating effect
            if (window.innerWidth >= 768) {
                header.classList.add('md:top-6', 'md:w-[90%]', 'md:max-w-[1280px]', 'md:rounded-2xl', 'md:border', 'md:shadow-2xl');
            }
        } else {
            header.classList.remove('is-scrolled');
            header.classList.add('top-0', 'w-full', 'border-b', 'border-transparent', 'bg-white/80', 'dark:bg-[#0b0f1a]/80', 'backdrop-blur-sm', 'py-5');
            header.classList.remove('border-[#e7ebf3]', 'dark:border-white/5', 'bg-white/90', 'dark:bg-[#0b0f1a]/90', 'backdrop-blur-md', 'shadow-sm', 'py-3', 'md:top-6', 'md:w-[90%]', 'md:max-w-[1280px]', 'md:rounded-2xl', 'md:border', 'md:shadow-2xl');
        }
    });

    mobileMenuBtn?.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('max-h-0');
        if (isOpen) {
            mobileMenu.classList.add('max-h-0', 'opacity-0');
            mobileMenu.classList.remove('max-h-[450px]', 'opacity-100');
            menuIcon.textContent = 'menu';
        } else {
            mobileMenu.classList.remove('max-h-0', 'opacity-0');
            mobileMenu.classList.add('max-h-[450px]', 'opacity-100');
            menuIcon.textContent = 'close';
        }
    });
};

// Constellation Animation
const initConstellation = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    const particleCount = 120;
    const connectionDist = 120;
    const mouseRadius = 150;
    let mouse = { x: 0, y: 0, active: false };

    const resize = () => {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
    };

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
            });
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.classList.contains('dark');
        const color = isDark ? 'rgba(15, 138, 95, 0.4)' : 'rgba(15, 138, 95, 0.2)';
        const particleColor = isDark ? 'rgba(15, 138, 95, 0.8)' : 'rgba(15, 138, 95, 0.6)';

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius) {
                    p.x += dx * 0.01;
                    p.y += dy * 0.01;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = color.replace('0.4', (1 - dist / connectionDist).toString());
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    };

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
};

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    
    // Theme toggle button click listener
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn?.addEventListener('click', toggleTheme);
});
