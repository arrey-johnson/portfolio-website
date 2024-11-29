document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    const header = document.querySelector('header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Reset nav links animation
        navLinks.forEach(link => {
            if (isMenuOpen) {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            } else {
                link.style.transform = 'translateX(50px)';
                link.style.opacity = '0';
            }
        });
    }

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(e.target);
        
        if (isMenuOpen && !isClickInsideMenu && !isClickOnMenuBtn) {
            toggleMenu();
        }
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Close menu on window resize (if open)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu();
        }
    });

    // Prevent scrolling when menu is open
    document.body.addEventListener('touchmove', (e) => {
        if (isMenuOpen) {
            e.preventDefault();
        }
    }, { passive: false });

    // Initialize EmailJS with error handling
    try {
        emailjs.init("u6gP9pYolFH6NPlx-");
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
    }

    // Contact Form Handling with improved error handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Validate form
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Prepare the template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };

            // Send the email using EmailJS with better error handling
            emailjs.send('service_0owz8jr', 'template_tcfkns6', templateParams)
                .then(function(response) {
                    if (response.status === 200) {
                        showNotification('Thank you! Your message has been sent successfully.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error('Email not sent successfully');
                    }
                })
                .catch(function(error) {
                    console.error('EmailJS error:', error);
                    if (error.text) {
                        showNotification(error.text, 'error');
                    } else {
                        showNotification('Oops! Something went wrong. Please try again later.', 'error');
                    }
                })
                .finally(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }

                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .notification.success {
            background-color: #00b894;
        }

        .notification.error {
            background-color: #d63031;
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    }

    // Project hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Slider functionality
    function initSlider() {
        const sliderTrack = document.querySelector('.slider-track');
        const slides = document.querySelectorAll('.slider-item');
        const prevButton = document.querySelector('.nav-button.prev');
        const nextButton = document.querySelector('.nav-button.next');
        
        let currentIndex = 0;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let isDragging = false;

        // Calculate the number of slides visible based on viewport width
        function getSlidesPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        // Calculate the width of a single slide
        function getSlideWidth() {
            const containerWidth = sliderTrack.parentElement.offsetWidth;
            const gap = 20; // matches the gap in CSS
            const slidesPerView = getSlidesPerView();
            return (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
        }

        // Update slider position
        function setSliderPosition() {
            const slideWidth = getSlideWidth();
            const gap = 20;
            currentTranslate = currentIndex * -(slideWidth + gap);
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
            updateButtons();
        }

        // Update button states
        function updateButtons() {
            const slidesPerView = getSlidesPerView();
            prevButton.style.opacity = currentIndex <= 0 ? '0.5' : '1';
            nextButton.style.opacity = currentIndex >= slides.length - slidesPerView ? '0.5' : '1';
            prevButton.disabled = currentIndex <= 0;
            nextButton.disabled = currentIndex >= slides.length - slidesPerView;
        }

        // Event listeners for buttons
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                setSliderPosition();
            }
        });

        nextButton.addEventListener('click', () => {
            const slidesPerView = getSlidesPerView();
            if (currentIndex < slides.length - slidesPerView) {
                currentIndex++;
                setSliderPosition();
            }
        });

        // Touch events
        sliderTrack.addEventListener('touchstart', touchStart);
        sliderTrack.addEventListener('touchmove', touchMove);
        sliderTrack.addEventListener('touchend', touchEnd);

        // Mouse events
        sliderTrack.addEventListener('mousedown', touchStart);
        sliderTrack.addEventListener('mousemove', touchMove);
        sliderTrack.addEventListener('mouseup', touchEnd);
        sliderTrack.addEventListener('mouseleave', touchEnd);

        function touchStart(event) {
            startPos = getPositionX(event);
            isDragging = true;
            sliderTrack.style.cursor = 'grabbing';
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
                sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
            }
        }

        function touchEnd() {
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;
            
            if (Math.abs(movedBy) > getSlideWidth() / 3) {
                if (movedBy < 0 && currentIndex < slides.length - getSlidesPerView()) {
                    currentIndex++;
                } else if (movedBy > 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            
            setSliderPosition();
            sliderTrack.style.cursor = 'grab';
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setSliderPosition();
            }, 250);
        });

        // Initialize slider
        setSliderPosition();
    }

    initSlider();

    // Clone slider items for infinite scroll
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
        const sliderItems = document.querySelectorAll('.slider-item');
        sliderItems.forEach(item => {
            const clone = item.cloneNode(true);
            sliderTrack.appendChild(clone);
        });

        // Pause animation on hover
        sliderTrack.addEventListener('mouseenter', () => {
            sliderTrack.style.animationPlayState = 'paused';
        });

        sliderTrack.addEventListener('mouseleave', () => {
            sliderTrack.style.animationPlayState = 'running';
        });

        // Reset animation when it ends
        sliderTrack.addEventListener('animationend', () => {
            sliderTrack.style.animation = 'none';
            sliderTrack.offsetHeight; // Trigger reflow
            sliderTrack.style.animation = null;
        });
    }

    // Add smooth reveal animation for slider items
    const sliderItems = document.querySelectorAll('.slider-item');
    sliderItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // Hero Section Animations
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Typing animation for dynamic texts
    const dynamicTexts = document.querySelector('.dynamic-texts');
    if (dynamicTexts) {
        const items = dynamicTexts.getElementsByTagName('li');
        let currentIndex = 0;
        let isAnimating = false;

        function updateText() {
            if (isAnimating) return;
            isAnimating = true;

            const currentItem = items[currentIndex];
            const nextIndex = (currentIndex + 1) % items.length;
            const nextItem = items[nextIndex];

            // Add out animation to current item
            currentItem.classList.add('out');
            
            // Remove active class after animation
            setTimeout(() => {
                currentItem.classList.remove('active', 'out');
                // Add active class to next item
                nextItem.classList.add('active');
                currentIndex = nextIndex;
                isAnimating = false;
            }, 500);
        }

        // Show first item
        items[currentIndex].classList.add('active');
        
        // Start rotation
        setInterval(updateText, 3000);
    }

    // Floating cards animation
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach(card => {
        const randomDelay = Math.random() * 2;
        card.style.animationDelay = `${randomDelay}s`;
    });

    // Parallax effect for shapes
    const shapes = document.querySelectorAll('.shape');
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Smooth scroll functionality
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
