// Enhanced Portfolio Website JavaScript with Modern Features

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeTypingEffect();
    initializeParallax();
    initializeContactForm();
    initializeScrollEffects();
    initializeAnalytics();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link
        updateActiveNavLink(sections, navLinks);
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Track navigation click
                trackEvent('navigation_click', 'header', targetId);
            }

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink(sections, navLinks) {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Initialize AOS animations
function initializeAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            delay: 100,
            once: true,
            offset: 50
        });
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .skill-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Typing effect for hero section
function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;

    const text = typingElement.textContent;
    const speed = 100;
    let i = 0;

    typingElement.textContent = '';
    typingElement.style.borderRight = '3px solid #3b82f6';

    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Blinking cursor effect
            setInterval(() => {
                typingElement.style.borderRight =
                    typingElement.style.borderRight === '3px solid transparent'
                        ? '3px solid #3b82f6'
                        : '3px solid transparent';
            }, 750);
        }
    }

    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// Parallax effects
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.floating-shapes, .hero-bg');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    if (!contactForm) return;

    // Form validation
    const formInputs = contactForm.querySelectorAll('input, textarea');

    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Clear previous validation styles
            this.classList.remove('is-valid', 'is-invalid');
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide previous alerts
        if (successAlert) successAlert.classList.add('d-none');
        if (errorAlert) errorAlert.classList.add('d-none');

        const validation = validateForm();

        if (validation.isValid) {
            submitForm();
        } else {
            showFormErrors(validation.errors);
        }
    });

    function validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        let isValid = true;

        // Reset validation classes
        field.classList.remove('is-valid', 'is-invalid');

        switch (fieldName) {
            case 'name':
                isValid = fieldValue.length >= 2;
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(fieldValue);
                break;
            case 'subject':
                isValid = fieldValue.length >= 5;
                break;
            case 'message':
                isValid = fieldValue.length >= 10;
                break;
        }

        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        return isValid;
    }

    function validateForm() {
        const formData = new FormData(contactForm);
        const errors = [];
        let isValid = true;

        // Validate name
        const name = formData.get('name')?.trim();
        if (!name || name.length < 2) {
            errors.push('Name must be at least 2 characters long');
            isValid = false;
        }

        // Validate email
        const email = formData.get('email')?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }

        // Validate subject
        const subject = formData.get('subject')?.trim();
        if (!subject || subject.length < 5) {
            errors.push('Subject must be at least 5 characters long');
            isValid = false;
        }

        // Validate message
        const message = formData.get('message')?.trim();
        if (!message || message.length < 10) {
            errors.push('Message must be at least 10 characters long');
            isValid = false;
        }

        return {
            isValid: isValid,
            errors: errors
        };
    }

    function showFormErrors(errors) {
        if (errorMessage && errorAlert) {
            errorMessage.innerHTML = errors.map(error => `• ${error}`).join('<br>');
            errorAlert.classList.remove('d-none');
            errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function showFormSuccess() {
        if (successAlert) {
            successAlert.classList.remove('d-none');
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => {
                successAlert.classList.add('d-none');
            }, 5000);
        }
    }

    function submitForm() {
        if (!submitBtn) return;

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            // Show success message
            showFormSuccess();

            // Reset form
            contactForm.reset();
            formInputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });

            // Track form submission
            trackEvent('form_submit', 'contact', 'success');
        }, 2000);
    }
}

// Scroll effects and interactions
function initializeScrollEffects() {
    // Smooth reveal animations for elements
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Analytics and tracking
function initializeAnalytics() {
    // Track page load
    trackEvent('page_load', 'engagement', window.location.pathname);

    // Track time on page
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
        const timeOnPage = Date.now() - startTime;
        trackEvent('time_on_page', 'engagement', Math.round(timeOnPage / 1000));
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    function updateScrollDepth() {
        const scrollDepth = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;

            // Track scroll milestones
            if (scrollDepth >= 25 && scrollDepth < 50) {
                trackEvent('scroll_depth', 'engagement', '25%');
            } else if (scrollDepth >= 50 && scrollDepth < 75) {
                trackEvent('scroll_depth', 'engagement', '50%');
            } else if (scrollDepth >= 75 && scrollDepth < 100) {
                trackEvent('scroll_depth', 'engagement', '75%');
            } else if (scrollDepth >= 100) {
                trackEvent('scroll_depth', 'engagement', '100%');
            }
        }
    }

    // Throttled scroll event
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
            updateScrollDepth();
        }, 150);
    }, { passive: true });

    // Track clicks on external links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.target === '_blank') {
            trackEvent('external_link_click', 'engagement', link.href);
        }
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('.social-btn');
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.querySelector('i').className.includes('linkedin') ? 'linkedin' :
                           link.querySelector('i').className.includes('github') ? 'github' :
                           link.querySelector('i').className.includes('envelope') ? 'email' : 'unknown';
            trackEvent('social_click', 'engagement', platform);
        });
    });
}

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', 'error', e.message);
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
                trackEvent('service_worker', 'install', 'success');
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
                trackEvent('service_worker', 'install', 'failed');
            });
    });
}

// Utility function for event tracking
function trackEvent(action, category, label) {
    const eventData = {
        action: action,
        category: category,
        label: label,
        timestamp: new Date().toISOString()
    };

    console.log('Event tracked:', eventData);

    // Here you would send to your analytics service
    // Example: gtag('event', action, { category, label });
    // Or: analytics.track(action, eventData);
}

// Performance monitoring
function reportWebVitals() {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
        new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    trackEvent('page_load_time', 'performance', Math.round(entry.loadEventEnd - entry.loadEventStart));
                }
            });
        }).observe({ entryTypes: ['navigation'] });
    }
}

// Initialize performance monitoring
reportWebVitals();

// CSS and resource loading optimization
function optimizeResourceLoading() {
    // Preload critical fonts
    const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = fontUrl;
        document.head.appendChild(link);
    });
}

// Initialize resource optimization
optimizeResourceLoading();