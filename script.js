// =============================================
// BU SABER AUTO PARTS - JAVASCRIPT CODE
// =============================================

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
    
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

function initScrollDownButton() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Find the next section (services) or any section below hero
            const heroSection = document.getElementById('home');
            const servicesSection = document.getElementById('services');
            
            if (servicesSection) {
                // Scroll to services section with offset for fixed header
                window.scrollTo({
                    top: servicesSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            } else if (heroSection && heroSection.nextElementSibling) {
                // Fallback: scroll to next section after hero
                window.scrollTo({
                    top: heroSection.nextElementSibling.offsetTop - 80,
                    behavior: 'smooth'
                });
            } else {
                // Final fallback: scroll down by viewport height
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }
        });
        
        // Optional: Add keyboard support (spacebar or arrow down)
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowDown') && window.scrollY === 0) {
                e.preventDefault();
                scrollIndicator.click();
            }
        });
    }
}     

// ============ MOBILE MENU FUNCTIONALITY ============
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add click event listener to mobile menu button
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle the 'active' class on the navigation menu
        navMenu.classList.toggle('active');
        
        // Change the icon based on menu state
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>'  // Show close icon when menu is open
            : '<i class="fas fa-bars"></i>';  // Show hamburger icon when menu is closed
    });

    // Close mobile menu when clicking a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ============ TESTIMONIAL SLIDER FUNCTIONALITY ============
function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const sliderDots = document.getElementById('slider-dots');
    let currentSlide = 0;
    let slideInterval;

    // Create dots for slider
    testimonialSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show the selected slide
        testimonialSlides[index].classList.add('active');
        dots[index].classList.add('active');
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
        slideInterval = setInterval(nextSlide, 5000);
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

    // Auto-rotate testimonials every 5 seconds
    slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-rotation on hover
    const slider = document.querySelector('.testimonial-slider');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', resetAutoSlide);
}

// ============ SMOOTH SCROLLING FUNCTIONALITY ============
function initSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default jump behavior
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty anchors
            
            // Find target element
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Smooth scroll to target element with offset for fixed header
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============ SCROLL EFFECTS FUNCTIONALITY ============
function initScrollEffects() {
    const callBtn = document.querySelector('.call-now-btn');
    const backToTopBtn = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Show/hide call now button based on scroll position
    window.addEventListener('scroll', () => {
        // Call now button
        if (window.scrollY > 300) {
            callBtn.style.display = 'flex';
        } else {
            callBtn.style.display = 'none';
        }

        // Back to top button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Update active navigation link
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${current}`) {
                link.classList.add('active');
            }
        });

        // If no section is active (at the very top), make home active
        if (current === '' && window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('a[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }

        // Debug: log active sections (remove this in production)
        console.log('Active section:', current);
    });

    // Back to top functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Set home as active on initial load
    navLinks.forEach(link => link.classList.remove('active'));
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) homeLink.classList.add('active');
}

// ============ ANIMATION ON SCROLL FUNCTIONALITY ============
function initAnimations() {
    // Select elements to animate
    const elements = document.querySelectorAll('.service-card, .about-content, .testimonial-slider, .contact-container');
    
    // Create Intersection Observer to detect when elements enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate element when it comes into view
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible
    
    // Initialize all elements as hidden and observe them
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ============ LOADING ANIMATION & PAGE LOAD FUNCTIONALITY ============
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    // Force scroll to top on page load (as backup)
    window.scrollTo(0, 0);
    
    // Hide loader after 1 second
    setTimeout(() => {
        if (loader) {
            loader.style.display = 'none';
        }
    }, 1000);
});

// Additional safety: Prevent browser scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}