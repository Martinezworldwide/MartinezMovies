// Martinez Movies - JavaScript
// Fetch movies function
async function fetchMovies() {
    const type = document.getElementById("toggleType").checked ? "tv" : "movie";
    const yearFrom = document.getElementById("yearFrom").value;
    const yearTo = document.getElementById("yearTo").value;
    const language = document.getElementById("language").value;
    const genres = [...document.querySelectorAll("#genres .selected")].map(g => g.dataset.id);
    const page = 1;
    const resultsPerPage = 20; // Increased from default 20

    // Build the URL with filters
    let url = `${config.baseUrl}/discover/${type}?api_key=${config.apiKey}&language=en-US&sort_by=popularity.desc&page=${page}&include_adult=false&include_video=false&vote_count.gte=100`;
    if (genres.length) url += `&with_genres=${genres.join(",")}`;
    if (yearFrom && yearTo) url += `&primary_release_year.gte=${yearFrom}&primary_release_year.lte=${yearTo}`;
    if (language !== "any") url += `&with_original_language=${language}`;

    console.log("API Request URL:", url); // Debugging

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Movies data:", data); // Debugging output

        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
        } else {
            document.getElementById("movies-container").innerHTML = "<p>No movies found. Try adjusting filters!</p>";
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        document.getElementById("movies-container").innerHTML = `<p>Failed to load movies. Error: ${error.message}</p>`;
    }
}

// Display Movies
function displayMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        const posterPath = movie.poster_path ? `${config.imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
        const title = movie.title || movie.name;
        const releaseDate = movie.release_date || movie.first_air_date;
        const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';

        movieCard.innerHTML = `
            <img src="${posterPath}" alt="${title}">
            <h3>${title} (${year})</h3>
            <p>${movie.overview || 'No description available'}</p>
            <div class="rating">
                <span>⭐ ${movie.vote_average.toFixed(1)}</span>
            </div>
            <button onclick="addToWatchlist('${movie.id}', '${title}', '${posterPath}', '${year}')">Add to Watchlist</button>
        `;
        container.appendChild(movieCard);
    });
}

// Load genres when page loads
async function loadGenres() {
    const type = document.getElementById("toggleType").checked ? "tv" : "movie";
    const url = `${config.baseUrl}/genre/${type}/list?api_key=${config.apiKey}&language=en-US`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Genres data:", data); // Debugging

        if (!data.genres || data.genres.length === 0) {
            throw new Error("No genres returned from API");
        }

        const genresDiv = document.getElementById("genres");
        genresDiv.innerHTML = ""; // Clear loading message
        data.genres.forEach(genre => {
            const btn = document.createElement("button");
            btn.textContent = genre.name;
            btn.dataset.id = genre.id;
            btn.onclick = () => btn.classList.toggle("selected");
            genresDiv.appendChild(btn);
        });

    } catch (error) {
        console.error("Error loading genres:", error);
        document.getElementById("genres").innerHTML = "Failed to load genres.";
    }
}

// Populate year selects
function populateYearSelects() {
    const currentYear = new Date().getFullYear();
    const yearFrom = document.getElementById("yearFrom");
    const yearTo = document.getElementById("yearTo");

    // Clear loading messages
    yearFrom.innerHTML = "";
    yearTo.innerHTML = "";

    // Add years from 1900 to current year
    for (let year = currentYear; year >= 1900; year--) {
        const optionFrom = document.createElement("option");
        const optionTo = document.createElement("option");
        optionFrom.value = year;
        optionTo.value = year;
        optionFrom.textContent = year;
        optionTo.textContent = year;
        yearFrom.appendChild(optionFrom);
        yearTo.appendChild(optionTo);
    }

    // Set default values (last 10 years)
    yearFrom.value = currentYear - 10;
    yearTo.value = currentYear;
}

// Search movies function
function searchMovies() {
    const searchTerm = document.getElementById("search").value;
    if (searchTerm) {
        const type = document.getElementById("toggleType").checked ? "tv" : "movie";
        const url = `${config.baseUrl}/search/${type}?api_key=${config.apiKey}&language=en-US&query=${encodeURIComponent(searchTerm)}`;
        fetchMovies(url);
    }
}

// Apply filters function
function applyFilters() {
    fetchMovies();
}

// Handle type toggle
document.getElementById("toggleType").addEventListener("change", () => {
    loadGenres(); // Reload genres when switching between movies and TV shows
});

// Call necessary functions when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadGenres();
    populateYearSelects();
});

// Add to watchlist function
function addToWatchlist(id, title, posterPath, year) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    // Check if item already exists
    if (!watchlist.some(item => item.id === id)) {
        watchlist.push({
            id: id,
            title: title,
            posterPath: posterPath,
            year: year,
            addedDate: new Date().toISOString()
        });
        
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert('Added to watchlist!');
    } else {
        alert('Already in watchlist!');
    }
}


