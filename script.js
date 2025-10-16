// =============================================
// BU SABER AUTO PARTS - JAVASCRIPT CODE
// =============================================

// Configuration object for easy customization
const CONFIG = {
    testimonialInterval: 5000, // 5 seconds between testimonials
    scrollOffset: 80, // Offset for fixed header
    animationThreshold: 0.1, // Intersection Observer threshold
    enableSmoothScroll: true // Enable/disable smooth scrolling
};

// Utility functions
const utils = {
    // Debounce function to limit function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function to limit function execution rate
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if user prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Safe query selector with null check
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    // Safe query selector all with array conversion
    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }
};

// DOM Content Loaded Event - Initialize when page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    
    // Initialize all functionality
    initMobileMenu();
    initTestimonialSlider();
    initSmoothScrolling();
    initScrollEffects();
    initAnimations();
    initScrollDownButton();
    initAccessibility();
    initLocationTabs();
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    
});



// ============ ACCESSIBILITY ENHANCEMENTS ============
function initAccessibility() {
    // Add keyboard navigation for service cards
    const serviceCards = utils.$$('.service-card');
    
    serviceCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Improve focus management for mobile menu
    const mobileMenuBtn = utils.$('#mobile-menu-btn');
    const navMenu = utils.$('#nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileMenuBtn.click();
            }
        });
    }

    // Add focus trap for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            mobileMenuBtn.click();
            mobileMenuBtn.focus();
        }
    });
}

// ============ MOBILE MENU FUNCTIONALITY ============
function initMobileMenu() {
    const mobileMenuBtn = utils.$('#mobile-menu-btn');
    const navMenu = utils.$('#nav-menu');
    const navLinks = utils.$$('.nav-link');

    if (!mobileMenuBtn || !navMenu) return;

    // Enhanced click handler with better event handling
    function toggleMobileMenu() {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        
        // Toggle the 'active' class on the navigation menu
        navMenu.classList.toggle('active');
        
        // Update ARIA attributes
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Change the icon based on menu state
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = navMenu.classList.contains('active') 
                ? 'fas fa-times'  // Show close icon when menu is open
                : 'fas fa-bars';  // Show hamburger icon when menu is closed
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Add multiple event listeners for better touch support
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileMenuBtn.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent double-tap zoom on mobile
        toggleMobileMenu();
    }, { passive: false });

    // Close mobile menu when clicking a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        });
        
        // Add touch support for links
        link.addEventListener('touchstart', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
            mobileMenuBtn.focus();
        }
    });
}

// ============ TESTIMONIAL SLIDER FUNCTIONALITY ============
function initTestimonialSlider() {
    const testimonialSlides = utils.$$('.testimonial-slide');
    const prevBtn = utils.$('#prev-btn');
    const nextBtn = utils.$('#next-btn');
    const sliderDots = utils.$('#slider-dots');
    
    if (!testimonialSlides.length || !prevBtn || !nextBtn || !sliderDots) return;

    let currentSlide = 0;
    let slideInterval;

    // Create dots for slider
    testimonialSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    const dots = utils.$$('.slider-dot');

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides and update ARIA attributes
        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
            dots[i].classList.remove('active');
            dots[i].setAttribute('aria-selected', 'false');
        });
        
        // Show the selected slide
        testimonialSlides[index].classList.add('active');
        testimonialSlides[index].setAttribute('aria-hidden', 'false');
        dots[index].classList.add('active');
        dots[index].setAttribute('aria-selected', 'true');
        currentSlide = index;
    }

    // Function to navigate to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % testimonialSlides.length;
        showSlide(nextIndex);
    }

    // Function to navigate to previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(prevIndex);
    }

    // Function to go to specific slide
    function goToSlide(index) {
        showSlide(index);
        resetAutoSlide();
    }

    // Function to reset auto slide timer
    function resetAutoSlide() {
        clearInterval(slideInterval);
        if (!utils.prefersReducedMotion()) {
            slideInterval = setInterval(nextSlide, CONFIG.testimonialInterval);
        }
    }

    // Add event listeners to navigation buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Keyboard navigation for slider
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });

    // Auto-rotate testimonials if user doesn't prefer reduced motion
    if (!utils.prefersReducedMotion()) {
        slideInterval = setInterval(nextSlide, CONFIG.testimonialInterval);
    }

    // Pause auto-rotation on hover and focus
    const slider = utils.$('.testimonial-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', resetAutoSlide);
        slider.addEventListener('focusin', () => clearInterval(slideInterval));
        slider.addEventListener('focusout', resetAutoSlide);
    }
}

// ============ SMOOTH SCROLLING FUNCTIONALITY ============
function initSmoothScrolling() {
    // Respect reduced motion preference
    if (utils.prefersReducedMotion() || !CONFIG.enableSmoothScroll) {
        return;
    }

    // Add smooth scrolling to all anchor links
    utils.$$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default jump behavior
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty anchors
            
            // Find target element
            const targetElement = utils.$(targetId);
            if (targetElement) {
                // Smooth scroll to target element with offset for fixed header
                const targetPosition = targetElement.offsetTop - CONFIG.scrollOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ============ SCROLL EFFECTS FUNCTIONALITY ============
function initScrollEffects() {
    const callBtn = utils.$('.call-now-btn');
    const backToTopBtn = utils.$('#back-to-top');
    const navLinks = utils.$$('.nav-link');
    const sections = utils.$$('section[id]');

    if (!callBtn || !backToTopBtn) return;

    // Throttled scroll handler for better performance
    const handleScroll = utils.throttle(() => {
        const scrollY = window.scrollY;

        // Call now button
        callBtn.style.display = scrollY > 300 ? 'flex' : 'none';

        // Back to top button
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Update active navigation link
        updateActiveNavLink(scrollY);
    }, 100);

    // Update active navigation link based on scroll position
    function updateActiveNavLink(scrollPosition) {
        let current = '';
        const adjustedScrollPosition = scrollPosition + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (adjustedScrollPosition >= sectionTop && adjustedScrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${current}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        // If no section is active (at the very top), make home active
        if (current === '' && scrollPosition < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = utils.$('a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
                homeLink.setAttribute('aria-current', 'page');
            }
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Back to top functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Set home as active on initial load
    navLinks.forEach(link => link.classList.remove('active'));
    const homeLink = utils.$('a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
        homeLink.setAttribute('aria-current', 'page');
    }
}

// ============ ANIMATION ON SCROLL FUNCTIONALITY ============
function initAnimations() {
    // Respect reduced motion preference
    if (utils.prefersReducedMotion()) {
        return;
    }

    // Select elements to animate
    const elements = utils.$$('.service-card, .about-content, .testimonial-slider, .contact-container');
    
    // Create Intersection Observer to detect when elements enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate element when it comes into view
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { 
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px 0px -50px 0px' // Trigger when element is 50px from viewport bottom
    });
    
    // Initialize all elements as hidden and observe them
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ============ SCROLL DOWN BUTTON FUNCTIONALITY ============
function initScrollDownButton() {
    const scrollIndicator = utils.$('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            scrollToNextSection();
        });
        
        // Keyboard support
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToNextSection();
            }
        });
        
        // Optional: Add keyboard support (spacebar or arrow down)
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowDown') && window.scrollY === 0) {
                e.preventDefault();
                scrollToNextSection();
            }
        });
    }
    
    function scrollToNextSection() {
        // Find the next section (services) or any section below hero
        const heroSection = utils.$('#home');
        const servicesSection = utils.$('#services');
        
        if (servicesSection) {
            // Scroll to services section with offset for fixed header
            window.scrollTo({
                top: servicesSection.offsetTop - CONFIG.scrollOffset,
                behavior: 'smooth'
            });
        } else if (heroSection && heroSection.nextElementSibling) {
            // Fallback: scroll to next section after hero
            window.scrollTo({
                top: heroSection.nextElementSibling.offsetTop - CONFIG.scrollOffset,
                behavior: 'smooth'
            });
        } else {
            // Final fallback: scroll down by viewport height
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    }
}

// ============ LOADING ANIMATION & PAGE LOAD FUNCTIONALITY ============
window.addEventListener('load', () => {
    const loader = utils.$('#loader');
    
    // Force scroll to top on page load (as backup)
    window.scrollTo(0, 0);
    
    // Hide loader after a short delay
    setTimeout(() => {
        if (loader) {
            loader.style.display = 'none';
            document.body.style.overflow = ''; // Ensure body scroll is enabled
        }
    }, 600);
});

// Additional safety: Prevent browser scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // You could add a placeholder image here
        // e.target.src = 'path/to/placeholder.jpg';
    }
}, true);

// Export for potential module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        utils,
        CONFIG
    };
}

function initLocationTabs() {
    const locationTabs = utils.$$('.location-tab');
    const locationContents = utils.$$('.location-content');

    if (!locationTabs.length || !locationContents.length) return;

    function switchLocation(locationId) {
        // Update tabs
        locationTabs.forEach(tab => {
            if (tab.getAttribute('data-location') === locationId) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update content
        locationContents.forEach(content => {
            if (content.id === locationId) {
                content.classList.add('active');
                content.setAttribute('aria-hidden', 'false');
            } else {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
            }
        });

        // Update URL hash
        history.pushState(null, null, `#${locationId}`);
    }

    // Add click event listeners to tabs
    locationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const locationId = tab.getAttribute('data-location');
            switchLocation(locationId);
        });

        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const locationId = tab.getAttribute('data-location');
                switchLocation(locationId);
            }
        });
    });

    // Check URL hash on load
    const hash = window.location.hash.substring(1);
    if (hash && (hash === 'isa-town' || hash === 'muharraq')) {
        switchLocation(hash);
    }
}

