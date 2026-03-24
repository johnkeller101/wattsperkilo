/**
 * Watts Per Kilo - Ranking Page Sort & Filter
 * Vanilla JS, no dependencies. Reads data-* attributes from product rows.
 */
(function () {
    'use strict';

    var list = document.getElementById('rankingList');
    var sortBtns = document.querySelectorAll('.ranking-sort-btn');
    var filterBtns = document.querySelectorAll('.ranking-filter-btn');

    if (!list) return;

    // --- Sort ---

    function getRows() {
        return Array.from(list.querySelectorAll('.product-row'));
    }

    function sortRows(sortType, dim, order) {
        var rows = getRows();

        rows.sort(function (a, b) {
            var valA, valB;

            if (sortType === 'dim' && dim) {
                var dimKey = 'dim' + dim.charAt(0).toUpperCase() + dim.slice(1);
                valA = parseFloat(a.dataset[dimKey]) || 0;
                valB = parseFloat(b.dataset[dimKey]) || 0;
            } else {
                valA = parseFloat(a.dataset.overall) || 0;
                valB = parseFloat(b.dataset.overall) || 0;
            }

            if (order === 'asc') return valA - valB;
            return valB - valA;
        });

        rows.forEach(function (row, i) {
            list.appendChild(row);
            var rankEl = row.querySelector('.rank-display');
            if (rankEl) rankEl.textContent = i + 1;

            row.classList.remove('rank-1', 'rank-2', 'rank-3');
            if (row.style.display !== 'none') {
                if (i === 0) row.classList.add('rank-1');
                else if (i === 1) row.classList.add('rank-2');
                else if (i === 2) row.classList.add('rank-3');
            }
        });
    }

    // --- Filter ---

    function filterRows(filterType) {
        var rows = getRows();
        rows.forEach(function (row) {
            var show = true;
            if (filterType === 'tested') {
                show = row.dataset.status === 'tested';
            }
            row.style.display = show ? '' : 'none';
        });

        var visibleRank = 0;
        rows.forEach(function (row) {
            if (row.style.display !== 'none') {
                visibleRank++;
                var rankEl = row.querySelector('.rank-display');
                if (rankEl) rankEl.textContent = visibleRank;
                row.classList.remove('rank-1', 'rank-2', 'rank-3');
                if (visibleRank === 1) row.classList.add('rank-1');
                else if (visibleRank === 2) row.classList.add('rank-2');
                else if (visibleRank === 3) row.classList.add('rank-3');
            }
        });

        var emptyMsg = document.getElementById('rankingEmpty');
        if (!emptyMsg) {
            emptyMsg = document.createElement('p');
            emptyMsg.id = 'rankingEmpty';
            emptyMsg.className = 'text-center text-body-secondary py-4';
            emptyMsg.textContent = 'No products match the current filter.';
            list.parentNode.insertBefore(emptyMsg, list.nextSibling);
        }
        emptyMsg.style.display = visibleRank === 0 ? '' : 'none';
    }

    // --- URL Hash State ---

    function getHashState() {
        var hash = window.location.hash.replace('#', '');
        var params = {};
        hash.split('&').forEach(function (pair) {
            var parts = pair.split('=');
            if (parts.length === 2) params[parts[0]] = decodeURIComponent(parts[1]);
        });
        return params;
    }

    function setHashState(params) {
        var parts = [];
        for (var key in params) {
            if (params[key]) parts.push(key + '=' + encodeURIComponent(params[key]));
        }
        var newHash = parts.join('&');
        if (newHash) {
            history.replaceState(null, '', '#' + newHash);
        } else {
            history.replaceState(null, '', window.location.pathname);
        }
    }

    var currentSort = 'overall';
    var currentDim = '';
    var currentOrder = 'desc';
    var currentFilter = 'all';

    // --- Update arrow icons on all matching buttons ---
    function updateArrows() {
        sortBtns.forEach(function (btn) {
            var arrow = btn.querySelector('.sort-arrow');
            if (!arrow) return;
            if (btn.classList.contains('active')) {
                arrow.style.display = '';
                arrow.className = 'bi sort-arrow ' + (currentOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down');
            } else {
                arrow.style.display = 'none';
            }
        });
    }

    // --- Sync both desktop and mobile button groups ---
    function syncButtons(sortType, dim) {
        sortBtns.forEach(function (btn) {
            btn.classList.remove('active');
            if (btn.dataset.sort === sortType) {
                if (sortType === 'dim' && btn.dataset.dim === dim) {
                    btn.classList.add('active');
                } else if (sortType !== 'dim') {
                    btn.classList.add('active');
                }
            }
        });
        updateArrows();
    }

    // --- Event Listeners ---

    sortBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var newSort = btn.dataset.sort;
            var newDim = btn.dataset.dim || '';

            // Toggle order if clicking the same sort button
            if (newSort === currentSort && newDim === currentDim) {
                currentOrder = currentOrder === 'desc' ? 'asc' : 'desc';
            } else {
                currentSort = newSort;
                currentDim = newDim;
                currentOrder = 'desc';
            }

            syncButtons(currentSort, currentDim);
            sortRows(currentSort, currentDim, currentOrder);
            filterRows(currentFilter);
            setHashState({ sort: currentSort, dim: currentDim, order: currentOrder, filter: currentFilter });
        });
    });

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.ranking-filter-btn').forEach(function(b) {
                b.classList.remove('active');
                if (b.dataset.filter === currentFilter) b.classList.add('active');
            });
            filterRows(currentFilter);
            setHashState({ sort: currentSort, dim: currentDim, order: currentOrder, filter: currentFilter });
        });
    });

    // --- Init from hash ---

    function init() {
        var state = getHashState();

        if (state.sort) {
            currentSort = state.sort;
            currentDim = state.dim || '';
            currentOrder = state.order || 'desc';

            syncButtons(currentSort, currentDim);
            sortRows(currentSort, currentDim, currentOrder);
        }

        if (state.filter) {
            currentFilter = state.filter;
            filterBtns.forEach(function (btn) {
                btn.classList.remove('active');
                if (btn.dataset.filter === currentFilter) btn.classList.add('active');
            });
            filterRows(currentFilter);
        }

        // Set initial arrow state
        updateArrows();
    }

    init();
})();
