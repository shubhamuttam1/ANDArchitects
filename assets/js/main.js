/**
 * AND Architects - Main JavaScript File
 * Handles navigation, animations, form interactions, and general site functionality
 */

// ===== GLOBAL VARIABLES =====
let isNavOpen = false;
let isScrolled = false;
let portfolioFilter = 'all';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== MAIN INITIALIZATION =====
function initializeWebsite() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initPortfolioFilter();
    initForms();
    initBackToTop();
    initLoadingScreen();
    initSmoothScroll();
    initLazyLoading();
    
    // Initialize page-specific functionality
    if (document.body.classList.contains('home-page') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
        initHeroEffects();
        initCounterAnimation();
    }
    
    console.log('AND Architects website initialized successfully');
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isNavOpen && !navbar.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
    
    // Dropdown functionality for touch devices
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Active link highlighting
    highlightActiveLink();
    
    // Update active link on scroll (for single page navigation)
    window.addEventListener('scroll', updateActiveLink);
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    isNavOpen = !isNavOpen;
    hamburger.classList.toggle('active', isNavOpen);
    navMenu.classList.toggle('active', isNavOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isNavOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    if (isNavOpen) {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        isNavOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage || 
            (currentPage === '' && linkPath === 'index.html') ||
            (currentPage === 'index.html' && linkPath === '/')) {
            link.classList.add('active');
        }
    });
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
}

function handleScroll() {
    const scrollTop = window.pageYOffset;
    const navbar = document.getElementById('navbar');
    
    // Navbar scroll effect
    if (scrollTop > 50 && !isScrolled) {
        isScrolled = true;
        navbar.classList.add('scrolled');
    } else if (scrollTop <= 50 && isScrolled) {
        isScrolled = false;
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero && scrollTop < window.innerHeight) {
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
    }
    
    // Update progress indicator if exists
    updateScrollProgress();
}

function updateScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progressBar.style.width = scrolled + '%';
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }
    
    // Custom intersection observer for elements without AOS
    initIntersectionObserver();
}

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that need animation
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// ===== HERO EFFECTS =====
function initHeroEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Typing effect for hero title
    initTypingEffect();
    
    // Hero stats animation
    initStatsAnimation();
}

function initTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement || titleElement.dataset.typed) return;
    
    const originalText = titleElement.innerHTML;
    const textToType = titleElement.textContent;
    
    titleElement.innerHTML = '';
    titleElement.dataset.typed = 'true';
    
    let index = 0;
    const typingSpeed = 100;
    
    function typeCharacter() {
        if (index < textToType.length) {
            titleElement.textContent += textToType.charAt(index);
            index++;
            setTimeout(typeCharacter, typingSpeed);
        } else {
            // Restore original HTML with styling
            titleElement.innerHTML = originalText;
        }
    }
    
    setTimeout(typeCharacter, 1000);
}

function initVideoOptimization() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    
    // Preload video for better performance
    video.addEventListener('loadeddata', () => {
        video.style.opacity = '1';
    });
    
    // Pause video when not in viewport (performance optimization)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    
    observer.observe(video);
}

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateStatNumber(element) {
    const finalNumber = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    const duration = 2000;
    const steps = 60;
    const increment = finalNumber / steps;
    const stepDuration = duration / steps;
    
    let currentNumber = 0;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            currentNumber = finalNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber) + suffix;
    }, stepDuration);
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = parseInt(element.dataset.duration) || 2000;
    const start = parseInt(element.textContent) || 0;
    const range = target - start;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (range * easeOutCubic(progress)));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// ===== PORTFOLIO FILTER =====
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(filter, portfolioItems);
        });
    });
}

function filterPortfolioItems(filter, items) {
    items.forEach(item => {
        const category = item.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            // Animate in
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// ===== FORMS =====
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add input validation
        addInputValidation(form);
        
        // Add form submission handling
        form.addEventListener('submit', handleFormSubmission);
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => clearInputError(input));
        });
    });
}

function addInputValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            showInputError(this, getValidationMessage(this));
        });
    });
}

function validateInput(input) {
    const isValid = input.checkValidity();
    
    if (!isValid) {
        showInputError(input, getValidationMessage(input));
        return false;
    } else {
        clearInputError(input);
        return true;
    }
}

function showInputError(input, message) {
    clearInputError(input);
    
    input.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = message;
    
    input.parentNode.appendChild(errorElement);
}

function clearInputError(input) {
    input.classList.remove('error');
    const errorElement = input.parentNode.querySelector('.input-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function getValidationMessage(input) {
    if (input.validity.valueMissing) {
        return `${getInputLabel(input)} is required.`;
    }
    if (input.validity.typeMismatch) {
        return `Please enter a valid ${input.type}.`;
    }
    if (input.validity.tooShort) {
        return `${getInputLabel(input)} must be at least ${input.minLength} characters.`;
    }
    if (input.validity.tooLong) {
        return `${getInputLabel(input)} must be no more than ${input.maxLength} characters.`;
    }
    if (input.validity.patternMismatch) {
        return `Please enter a valid ${getInputLabel(input).toLowerCase()}.`;
    }
    
    return 'Please correct this field.';
}

function getInputLabel(input) {
    const label = input.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : 'Field';
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('[type="submit"]');
    
    // Validate all inputs
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please correct the errors in the form.', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(formData);
        
        // Show success message
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

async function simulateFormSubmission(formData) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (replace with actual API logic)
            Math.random() > 0.1 ? resolve() : reject(new Error('Simulated error'));
        }, 2000);
    });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => removeNotification(notification));
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                e.preventDefault();
                
                const targetPosition = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768 && isNavOpen) {
        closeMobileMenu();
    }
    
    // Reinitialize AOS if needed
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log(`Page loaded in ${loadTime}ms`);
        }, 0);
    });
}

// ===== EXPORTS FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        toggleMobileMenu,
        filterPortfolioItems,
        showNotification
    };
}
