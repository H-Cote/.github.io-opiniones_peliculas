document.addEventListener('DOMContentLoaded', () => {
    // State
    let movies = [];
    let currentFilter = 'all';
    let currentYear = 'all';
    let searchQuery = '';

    // DOM Elements
    const homeView = document.getElementById('home-view');
    const movieView = document.getElementById('movie-view');
    const movieGrid = document.getElementById('movie-grid');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const yearSelect = document.getElementById('year-filter');
    const movieCount = document.getElementById('movie-count');
    const emptyState = document.getElementById('empty-state');
    const backBtn = document.getElementById('back-btn');
    const shareBtn = document.getElementById('share-btn');
    const whatsappBtn = document.getElementById('whatsapp-share');

    // Initialize
    async function init() {
        await fetchMovies();
        populateYears();
        setupEventListeners();
        handleRouting();
    }

    // Fetch data
    async function fetchMovies() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) throw new Error('Network response was not ok');
            movies = await response.json();
            // Sort by year descending by default
            movies.sort((a, b) => b.year - a.year);
        } catch (error) {
            console.error('Error loading movies:', error);
            movieGrid.innerHTML = '<p class="empty-state">Error al cargar la colección.</p>';
        }
    }

    // Populate Year Dropdown
    function populateYears() {
        const years = [...new Set(movies.map(m => m.year))].sort((a, b) => b - a);
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }

    // Event Listeners
    function setupEventListeners() {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderGrid();
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderGrid();
            });
        });

        yearSelect.addEventListener('change', (e) => {
            currentYear = e.target.value;
            renderGrid();
        });

        window.addEventListener('popstate', handleRouting);
        
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            history.pushState(null, '', window.location.pathname);
            handleRouting();
        });

        const shareAction = async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: document.title,
                        url: window.location.href
                    });
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Enlace copiado al portapapeles');
            }
        };

        shareBtn.addEventListener('click', shareAction);
        whatsappBtn.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`He publicado una nueva reseña en SALA 35mm. Échale un vistazo: `);
            window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
        });
    }

    // Routing
    function handleRouting() {
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get('id');

        if (movieId) {
            const movie = movies.find(m => m.id === movieId);
            if (movie) {
                renderDetail(movie);
                homeView.classList.remove('active');
                homeView.classList.add('hidden');
                movieView.classList.remove('hidden');
                movieView.classList.add('active');
                window.scrollTo(0, 0);
            } else {
                history.pushState(null, '', window.location.pathname);
                handleRouting();
            }
        } else {
            movieView.classList.remove('active');
            movieView.classList.add('hidden');
            homeView.classList.remove('hidden');
            homeView.classList.add('active');
            document.title = 'SALA 35mm - Un archivo personal de cine';
            renderGrid();
        }
    }

    // Render Grid
    function renderGrid() {
        let filtered = movies.filter(m => {
            const matchesSearch = m.title.toLowerCase().includes(searchQuery) || 
                                  m.director.toLowerCase().includes(searchQuery) || 
                                  m.year.toString().includes(searchQuery);
            
            let matchesRating = true;
            if (currentFilter !== 'all') {
                const requiredRating = parseInt(currentFilter);
                matchesRating = m.rating >= requiredRating;
            }

            let matchesYear = true;
            if (currentYear !== 'all') {
                matchesYear = m.year.toString() === currentYear;
            }

            return matchesSearch && matchesRating && matchesYear;
        });

        movieGrid.innerHTML = '';
        movieCount.textContent = `${filtered.length} PELÍCULA${filtered.length !== 1 ? 'S' : ''}`;

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            filtered.forEach(movie => {
                const card = document.createElement('a');
                card.href = `?id=${movie.id}`;
                card.className = 'movie-card';
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    history.pushState(null, '', `?id=${movie.id}`);
                    handleRouting();
                });

                const stars = '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);

                card.innerHTML = `
                    <div class="poster-wrapper">
                        <img src="${movie.poster}" alt="Póster de ${movie.title}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'300\'><rect width=\'200\' height=\'300\' fill=\'%23211E1B\'/></svg>'">
                    </div>
                    <h3 class="movie-card-title" title="${movie.title}">${movie.title}</h3>
                    <p class="movie-card-year">${movie.year}</p>
                    <div class="movie-card-rating">${stars}</div>
                `;
                movieGrid.appendChild(card);
            });
        }
    }

    // Render Detail
    function renderDetail(movie) {
        document.title = `${movie.title} - SALA 35mm`;
        
        document.getElementById('detail-poster').src = movie.poster;
        document.getElementById('detail-title').textContent = movie.title;
        document.getElementById('detail-year').textContent = movie.year;
        document.getElementById('detail-director').textContent = movie.director;
        
        const stars = '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);
        document.getElementById('detail-rating').textContent = stars;
        
        document.getElementById('side-year').textContent = movie.year;
        document.getElementById('side-director').textContent = movie.director;
        document.getElementById('side-duration').textContent = movie.duration || 'N/D';
        document.getElementById('side-genre').textContent = movie.genre || 'N/D';
        
        document.getElementById('detail-short-opinion').textContent = movie.shortOpinion;
        
        // Handle paragraphs for long opinion
        const formattedReview = movie.longOpinion.split('\n\n').map(p => `<p>${p}</p>`).join('');
        document.getElementById('detail-long-opinion').innerHTML = formattedReview;
    }

    init();
});
