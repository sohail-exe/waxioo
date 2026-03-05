
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');

       
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}


window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});


const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});



const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});


const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.querySelectorAll('.slider-dot');

if (sliderTrack && sliderDots.length > 0) {
    let currentSlide = 0;
    const totalSlides = 6;

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        const offset = slideIndex * -100;
        sliderTrack.style.transform = `translateX(${offset}%)`;

        sliderDots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });


    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);


    let touchStartX = 0;
    let touchEndX = 0;

    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {

            currentSlide = Math.min(currentSlide + 1, totalSlides - 1);
            goToSlide(currentSlide);
        }
        if (touchEndX > touchStartX + 50) {

            currentSlide = Math.max(currentSlide - 1, 0);
            goToSlide(currentSlide);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    const sendEvent = (eventName, params) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    };

    // Track standard CTA buttons (excluding WhatsApp to avoid double fire if they overlap class-wise)
    // We target .btn but exclude specific whatsapp ones if they share classes? 
    // In HTML, whatsapp buttons often have `btn` class too.
    // Let's strictly separate: 
    // Website conversion CTAs usually go to contact.html or anchor links
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, a[href*="contact.html"]');

    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            
            const href = btn.getAttribute('href') || '';
            if (href.includes('wa.me')) return; 

            sendEvent('website_cta_click', {
                button_text: btn.innerText.trim(),
                link_url: href
            });
        });
    });

    
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', () => {
            sendEvent('whatsapp_contact_click', {
                link_url: link.getAttribute('href')
            });
        });
    });
});


const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = hero.getBoundingClientRect();
        const mouseX = (e.clientX - left) / width - 0.5;
        const mouseY = (e.clientY - top) / height - 0.5;

        hero.style.setProperty('--move-x', mouseX);
        hero.style.setProperty('--move-y', mouseY);
    });

   
    hero.addEventListener('mouseleave', () => {
        hero.style.setProperty('--move-x', 0);
        hero.style.setProperty('--move-y', 0);
    });
}
