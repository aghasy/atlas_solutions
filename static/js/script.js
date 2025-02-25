// Animated counter for metrics
const animateCounter = (element, target) => {
    const duration = 2000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = `${target}%`;
            clearInterval(timer);
        } else {
            element.textContent = `${Math.floor(current)}%`;
        }
    }, stepTime);
};

// Intersection Observer for metrics animation
const observeMetrics = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metrics = entry.target.querySelectorAll('.metric-number');
                metrics.forEach(metric => {
                    const target = parseInt(metric.dataset.target);
                    animateCounter(metric, target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const metricsContainer = document.querySelector('.metrics-container');
    if (metricsContainer) {
        observer.observe(metricsContainer);
    }
};

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    observeMetrics();
});

// Header behavior on scroll
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Contact form handling with fetch API
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Invio in corso...';
        submitButton.disabled = true;

        try {
            const formData = new FormData(this);

            const response = await fetch('/submit-contact', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${result.status}`;
            notification.textContent = result.message;

            // Add notification to the form
            this.insertAdjacentElement('beforebegin', notification);

            // Reset form on success
            if (result.status === 'success') {
                this.reset();

                // Remove notification after 5 seconds
                setTimeout(() => {
                    notification.remove();
                }, 5000);
            }
        } catch (error) {
            console.error('Error:', error);
            const notification = document.createElement('div');
            notification.className = 'notification error';
            notification.textContent = 'Si è verificato un errore. Riprova più tardi.';
            this.insertAdjacentElement('beforebegin', notification);
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}