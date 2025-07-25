$(document).ready(function() {
    // Global app initialization
    console.log("EzHome app initialized");
    
    // Check if products are loaded
    setTimeout(function() {
        if (window.products) {
            console.log('Products loaded:', window.products.length, 'items');
        } else {
            console.warn('Products not loaded yet');
        }
    }, 500);
    
    // Newsletter form handler
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val();
        const btn = $(this).find('button[type="submit"]');
        
        // Add loading state
        btn.addClass('btn-loading').prop('disabled', true);
        
        // Simulate API call
        setTimeout(function() {
            btn.removeClass('btn-loading').prop('disabled', false);
            alert('Thank you for subscribing! We\'ll keep you updated with the latest smart home innovations.');
            $('.newsletter-form')[0].reset();
        }, 2000);
    });
    
    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
    
    // Fade in animation on scroll
    function checkScroll() {
        $('.fade-in').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('visible');
            }
        });
    }
    
    $(window).on('scroll', checkScroll);
    checkScroll(); // Check on page load
    
    // Add fade-in class to sections
    $('section').addClass('fade-in');
    
    // Package button handlers
    $('.solution-card button').on('click', function() {
        const packageName = $(this).closest('.card').find('.card-header h5').text();
        alert(`Great choice! You selected the ${packageName}. This would normally redirect to checkout or contact form.`);
    });
    
    // Typing effect for hero title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.html('');
        function type() {
            if (i < text.length) {
                element.html(element.html() + text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Uncomment the line below to enable typing effect for hero title
    // typeWriter($('.hero-content h1'), 'Welcome to EzHome', 80);
    
    // Any other global app functionality can be added here
});
