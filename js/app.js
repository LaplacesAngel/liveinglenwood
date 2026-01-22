
// DOM Elements
const homesGrid = document.getElementById('homes-grid');

// Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const body = document.body;

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Prevent scrolling when menu is open
            if (mobileNav.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // Hero Slideshow Logic
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change image every 5 seconds
    }

    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'var(--color-bg-glass)';
            nav.style.boxShadow = 'var(--shadow-glass)';
        }
    });

});
