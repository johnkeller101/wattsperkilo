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

// "New" badge for recent posts
(function() {
    var threeDays = 3 * 24 * 60 * 60 * 1000;
    var now = new Date();
    document.querySelectorAll('[data-post-date]').forEach(function(el) {
        var postDate = new Date(el.getAttribute('data-post-date') + 'T00:00:00');
        if (now - postDate <= threeDays) {
            var colorIndex = el.getAttribute('data-color-index') || '1';
            var badge = document.createElement('span');
            badge.className = 'badge-new badge-tint-' + colorIndex;
            badge.textContent = 'New';
            el.appendChild(badge);
        }
    });
})();

function toggleSearch() {
    var container = document.getElementById('headerSearch');
    var input = document.getElementById('lunrsearch');
    var results = document.getElementById('searchResults');

    container.classList.toggle('active');

    if (container.classList.contains('active')) {
        input.focus();
    } else {
        input.value = '';
        if (results) {
            results.style.display = 'none';
            results.innerHTML = '';
        }
    }
}

// Close search when clicking outside
document.addEventListener('click', function(e) {
    var headerSearch = document.querySelector('.header-search');
    if (headerSearch && !headerSearch.contains(e.target)) {
        var container = document.getElementById('headerSearch');
        var input = document.getElementById('lunrsearch');
        var results = document.getElementById('searchResults');
        if (container && container.classList.contains('active')) {
            container.classList.remove('active');
            input.value = '';
            if (results) {
                results.style.display = 'none';
                results.innerHTML = '';
            }
        }
    }
});
