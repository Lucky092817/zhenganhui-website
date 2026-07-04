// 增强型滚动动效 - 更明显的视觉效果

console.log('🎬 加载滚动动效...');

// 1. 滚动进度条
const progressBar = document.querySelector('.scroll-progress') || document.createElement('div');
progressBar.className = 'scroll-progress';
if (!progressBar.parentElement) {
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #d4af37, #f0c040);
        z-index: 9999;
        width: 0%;
        box-shadow: 0 0 15px #d4af37;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
}

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
    progressBar.style.width = scrolled + '%';
}, { passive: true });

// 2. Hero视差效果（更明显）
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVideo = document.querySelector('.hero-video');
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (heroVideo) {
        // 保持居中定位的同时添加视差效果
        heroVideo.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.3}px) scale(1.05)`;
    }

    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
        heroContent.style.opacity = Math.max(0, 1 - (scrolled / (window.innerHeight * 0.8)));
    }

    if (scrollIndicator) {
        scrollIndicator.style.opacity = Math.max(0, 1 - (scrolled / 300));
        scrollIndicator.style.transform = `translateX(-50%) translateY(${scrolled * 0.2}px)`;
    }
}, { passive: true });

// 3. 元素飞入动画（更夸张）
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .cue-item, .case-card, .section-title, .section-subtitle');

    elements.forEach((el, index) => {
        // 初始状态
        el.style.opacity = '0';
        el.style.transform = 'translateY(80px) scale(0.9)';
        el.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, idx * 150); // 延迟更长
                // 移除 unobserve，保持持续观察
            } else {
                // 元素离开视口时重置状态
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(80px) scale(0.9)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// 4. 卡片悬停增强
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .cue-item, .case-card');
    
    cards.forEach(card => {
        if (card.dataset.hoverEffectBound === 'true') return;
        card.dataset.hoverEffectBound = 'true';

        card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-20px) scale(1.05)';
            card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
            card.style.zIndex = '';
        });
    });
});

// 5. 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.dataset.smoothScrollBound === 'true') return;
    anchor.dataset.smoothScrollBound = 'true';

    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 6. 区域进入时的闪光效果
function sectionFlash() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'sectionPulse 0.6s ease-out';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 600);
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => observer.observe(section));
}

// 添加sectionPulse动画
if (!document.getElementById('section-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'section-pulse-style';
    style.textContent = `
        @keyframes sectionPulse {
            0% { filter: brightness(1); }
            50% { filter: brightness(1.1); }
            100% { filter: brightness(1); }
        }
    `;
    document.head.appendChild(style);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    sectionFlash();
    console.log('✨ 滚动动效已激活');
});

console.log('✅ 滚动效果脚本加载完成');
