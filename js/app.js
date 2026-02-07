
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

        // Close menu when clicking the overlay background
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                mobileBtn.classList.remove('active');
                mobileNav.classList.remove('active');
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

    // FAQ Logic
    const toggleBtn = document.getElementById('faq-toggle-btn');
    const faqDetails = document.querySelectorAll('.faq-item');

    if (toggleBtn && faqDetails) {
        toggleBtn.addEventListener('click', () => {
            const isExpand = toggleBtn.textContent.includes('Expand');

            if (isExpand) {
                // Expand All
                faqDetails.forEach(detail => detail.setAttribute('open', 'true'));
                toggleBtn.textContent = 'Collapse All';
                toggleBtn.classList.replace('btn-primary', 'btn-outline'); // optional visual toggle
            } else {
                // Collapse All
                faqDetails.forEach(detail => detail.removeAttribute('open'));
                toggleBtn.textContent = 'Expand All';
                toggleBtn.classList.replace('btn-outline', 'btn-primary'); // optional visual toggle
            }
        });
    }

    // Modal Logic

    // Modal Logic
    const modal = document.getElementById('notify-modal');
    const notifyBtn = document.getElementById('notify-btn');
    const closeBtn = document.querySelector('.modal-close');
    const notifyForm = document.getElementById('notify-form');
    const notifyStatus = document.getElementById('notify-status');

    if (modal && closeBtn) {
        // Open Modal (if legacy button exists or future buttons need a helper)
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        }

        // Close Modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Form Submission Logic
    if (notifyForm) {
        notifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = notifyForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            notifyStatus.style.display = 'none';

            try {
                const formData = new FormData(notifyForm);
                const response = await fetch(notifyForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    notifyStatus.textContent = "Success! You are on the list.";
                    notifyStatus.style.color = "green";
                    notifyStatus.style.display = 'block';
                    notifyForm.reset();
                    submitBtn.textContent = "Sent!";

                    // Close modal after 2 seconds
                    setTimeout(() => {
                        const closeModal = () => {
                            if (modal) modal.classList.remove('active');
                            document.body.style.overflow = '';
                        };
                        closeModal();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        notifyStatus.style.display = 'none';
                    }, 2000);

                } else {
                    // Error
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        notifyStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        notifyStatus.textContent = "Oops! There was a problem submitting your form";
                    }
                    notifyStatus.style.color = "red";
                    notifyStatus.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } catch (error) {
                notifyStatus.textContent = "Oops! There was a problem submitting your form";
                notifyStatus.style.color = "red";
                notifyStatus.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Gallery Lightbox Logic
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        // Open Lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImageIndex = index;
                showLightboxImage(currentImageIndex);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        // Close Lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Show Image Function
        const showLightboxImage = (index) => {
            // Use the high-res image if available, otherwise the src
            // For now, simple implementation uses src from the thumbnail
            const imgSrc = galleryItems[index].src;
            if (lightboxImg) {
                lightboxImg.src = imgSrc;
            }
        };

        // Prev/Next Navigation
        const navigateLightbox = (step) => {
            currentImageIndex += step;
            if (currentImageIndex < 0) {
                currentImageIndex = galleryItems.length - 1;
            } else if (currentImageIndex >= galleryItems.length) {
                currentImageIndex = 0;
            }
            showLightboxImage(currentImageIndex);
        };

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing when clicking nav
                navigateLightbox(-1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing when clicking nav
                navigateLightbox(1);
            });
        }

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        });
    }

});
