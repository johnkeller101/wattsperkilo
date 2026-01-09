/**
 * Watts Per Kilo - Theme JavaScript
 * Vanilla JS for Bootstrap 5
 */

(function() {
    'use strict';

    // Smooth scroll to anchor on page load (for direct links with hash)
    if (window.location.hash) {
        setTimeout(function() {
            window.scrollTo(0, 0);
            var target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1);
    }

    // Smooth scroll for anchor links on the same page
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var hash = this.getAttribute('href');
            if (hash === '#') return;

            var target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });

                // Update URL hash without jumping
                history.pushState(null, null, hash);
            }
        });
    });

})();
