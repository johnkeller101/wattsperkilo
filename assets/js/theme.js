/**
 * Watts Per Kilo - Theme JavaScript
 * Vanilla JS for Bootstrap 5
 */

(function() {
    'use strict';

    // ========================================
    // Smooth scroll for anchor links
    // ========================================
    if (window.location.hash) {
        setTimeout(function() {
            window.scrollTo(0, 0);
            var target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var hash = this.getAttribute('href');
            if (hash === '#') return;
            var target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, hash);
            }
        });
    });

    // ========================================
    // IntersectionObserver — scroll animations
    // ========================================
    var animObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;

            // Fade-up elements
            if (entry.target.classList.contains('fade-up')) {
                entry.target.classList.add('visible');
            }

            // Score rings — animate fill
            if (entry.target.classList.contains('animate-on-scroll')) {
                var fill = entry.target.querySelector('.score-ring-fill');
                if (fill) {
                    var targetOffset = fill.getAttribute('data-target-offset');
                    fill.style.strokeDashoffset = targetOffset;
                }
            }

            // Score bar fills — animate width
            if (entry.target.classList.contains('score-bar-fill')) {
                var w = entry.target.getAttribute('data-width');
                if (w) {
                    entry.target.style.width = w + '%';
                }
            }

            animObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    // Observe all animatable elements after DOM ready
    document.querySelectorAll('.fade-up, .animate-on-scroll, .score-bar-fill').forEach(function(el) {
        animObserver.observe(el);
    });

    // ========================================
    // Scrollspy — highlight nav links on scroll
    // ========================================
    var spyNav = document.getElementById('productScrollspy');
    if (spyNav) {
        var spyLinks = spyNav.querySelectorAll('.nav-link');
        var spySections = [];
        spyLinks.forEach(function(link) {
            var id = link.getAttribute('href');
            if (id && id.startsWith('#')) {
                var sec = document.querySelector(id);
                if (sec) spySections.push({ el: sec, link: link });
            }
        });

        if (spySections.length > 0) {
            var spyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    var match = spySections.find(function(s) { return s.el === entry.target; });
                    if (!match) return;
                    if (entry.isIntersecting) {
                        spyLinks.forEach(function(l) { l.classList.remove('active'); });
                        match.link.classList.add('active');
                    }
                });
            }, { rootMargin: '-20% 0px -60% 0px' });

            spySections.forEach(function(s) { spyObserver.observe(s.el); });
        }
    }

    // ========================================
    // Bootstrap tooltip init
    // ========================================
    var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(function(el) {
        new bootstrap.Tooltip(el);
    });

    // ========================================
    // Shared compare utilities (window.wpkCompare)
    // ========================================
    window.wpkCompare = {
        /**
         * Get score color for a value 0-10
         */
        scoreColor: function(val) {
            val = parseFloat(val) || 0;
            if (val >= 8.0) return 'var(--wpk-score-excellent)';
            if (val >= 7.0) return 'var(--wpk-score-good)';
            if (val >= 5.0) return 'var(--wpk-score-average)';
            if (val >= 3.0) return 'var(--wpk-score-below)';
            return 'var(--wpk-score-poor)';
        },

        /**
         * Build a score bar HTML string
         */
        scoreBarHTML: function(label, score, avgScore) {
            var pct = (parseFloat(score) || 0) * 10;
            var color = this.scoreColor(score);
            var avgMarker = '';
            if (avgScore !== undefined && avgScore > 0) {
                avgMarker = '<span class="score-bar-avg" style="left:' + (avgScore * 10) + '%"></span>';
            }
            return '<div class="d-flex align-items-center mb-2">' +
                '<span class="score-label text-body-secondary me-2">' + label + '</span>' +
                '<div class="score-bar-track flex-grow-1">' +
                avgMarker +
                '<div class="score-bar-fill" style="width:' + pct + '%;background-color:' + color + '"></div>' +
                '</div>' +
                '<span class="score-value fw-semibold ms-2">' + score + '</span>' +
                '</div>';
        }
    };

})();
