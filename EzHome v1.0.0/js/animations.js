// Enhanced Animations and Visual Effects for EzHome
$(document).ready(function() {
    
    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    $('.animate-on-scroll').each(function() {
        observer.observe(this);
    });

    // Staggered animation for feature cards
    $('.feature-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.2) + 's');
    });

    // Parallax effect for hero section
    $(window).scroll(function() {
        const scrolled = $(this).scrollTop();
        const parallax = $('.hero-image img');
        const speed = scrolled * 0.3;
        
        parallax.css('transform', 'translateY(' + speed + 'px)');
    });

    // Enhanced hover effects for cards
    $('.card').hover(
        function() {
            $(this).find('.card-img-top').addClass('loading');
        },
        function() {
            $(this).find('.card-img-top').removeClass('loading');
        }
    );

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000, 'easeInOutExpo');
        }
    });

    // Interactive button effects
    $('.btn').on('mouseenter', function() {
        $(this).addClass('interactive');
    }).on('mouseleave', function() {
        $(this).removeClass('interactive');
    });

    // Dynamic background color change based on scroll position
    $(window).scroll(function() {
        const scrollPosition = $(this).scrollTop();
        const windowHeight = $(this).height();
        const documentHeight = $(document).height();
        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
        
        // Change navbar opacity based on scroll
        if (scrollPosition > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Add floating animation to specific elements
    $('.hero-image img').addClass('float');
    
    // Typewriter effect for hero title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Enhanced loading states for dynamic content
    $(document).ajaxStart(function() {
        $('body').addClass('loading');
    }).ajaxStop(function() {
        $('body').removeClass('loading');
    });

    // Add ripple effect to buttons
    $('.btn').on('click', function(e) {
        const button = $(this);
        const rect = this.getBoundingClientRect();
        const ripple = $('<span class="ripple"></span>');
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.css({
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px'
        });
        
        button.append(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Auto-hide alerts after 5 seconds
    $('.alert').each(function() {
        const alert = $(this);
        setTimeout(() => {
            alert.fadeOut(500);
        }, 5000);
    });

});

// CSS for additional animations (injected via JavaScript)
const additionalCSS = `
    <style>
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98) !important;
            box-shadow: var(--shadow-md);
        }
        
        .float {
            animation: float 6s ease-in-out infinite;
        }
        
        .ripple {
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        body.loading {
            cursor: wait;
        }
        
        body.loading * {
            pointer-events: none;
        }
        
        .animate-on-scroll {
            transition-delay: 0.1s;
        }
        
        .animate-on-scroll:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .animate-on-scroll:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .animate-on-scroll:nth-child(4) {
            transition-delay: 0.4s;
        }
        
        /* Enhanced testimonial animations */
        .testimonial-card {
            transition-delay: 0.1s;
        }
        
        .testimonial-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .testimonial-card:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        /* Solution card stagger */
        .solution-card:nth-child(1) {
            animation-delay: 0.1s;
        }
        
        .solution-card:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .solution-card:nth-child(3) {
            animation-delay: 0.3s;
        }
    </style>
`;

// Inject additional CSS
$('head').append(additionalCSS);
