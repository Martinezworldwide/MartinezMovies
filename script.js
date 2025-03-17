// Martinez Movies - JavaScript
const config = {
    apiKey: "6264585815mshaaa60564d43dd2ap132e53jsn11ef0791b6f8",
    apiHost: "streaming-availability.p.rapidapi.com"
};

// Default URL with the required `country=us` query
const baseUrl = `https://${config.apiHost}/shows/search/filters?country=us&series_granularity=show&order_direction=asc&order_by=original_title&genres_relation=and&output_language=en&show_type=movie`;

// Fetch movies function
async function fetchMovies() {
    const type = document.getElementById("toggleType").checked ? "series" : "movie";
    const yearFrom = document.getElementById("yearFrom").value;
    const yearTo = document.getElementById("yearTo").value;
    const language = document.getElementById("language").value;
    const genres = [...document.querySelectorAll("#genres .selected")].map(g => g.textContent);
    const services = [...document.querySelectorAll("#streamingServices input:checked")].map(s => s.value);

    // Append user selections to base URL
    let url = `${baseUrl}&show_type=${type}`;
    if (genres.length) url += `&genres=${genres.join(",")}`;
    if (services.length) url += `&services=${services.join(",")}`;
    if (yearFrom && yearTo) url += `&release_year_from=${yearFrom}&release_year_to=${yearTo}`;

    console.log("API Request URL:", url); // Debugging

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": config.apiKey,
            "X-RapidAPI-Host": config.apiHost,
            "Access-Control-Allow-Origin": "*"
        },
        mode: "cors"
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Debugging output

        if (data.result && data.result.length > 0) {
            displayMovies(data.result);
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
        movieCard.innerHTML = `
            <img src="${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.overview || 'No description available'}</p>
            <div class="streaming-services">
                ${movie.streamingInfo ? Object.entries(movie.streamingInfo)
                    .map(([service, info]) => `<span class="service">${service}</span>`)
                    .join('') : 'Not available on any service'}
            </div>
            <button onclick="addToWatchlist('${movie.id}', '${movie.title}', '${movie.poster_path}')">Add to Watchlist</button>
        `;
        container.appendChild(movieCard);
    });
}

// Load genres when page loads
async function loadGenres() {
    const url = `https://${config.apiHost}/genres?output_language=en`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": config.apiKey,
                "X-RapidAPI-Host": config.apiHost
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Genres data:", data); // Debugging

        if (!data.result || data.result.length === 0) {
            throw new Error("No genres returned from API");
        }

        const genresDiv = document.getElementById("genres");
        data.result.forEach(genre => {
            const btn = document.createElement("button");
            btn.textContent = genre.name;
            btn.onclick = () => btn.classList.toggle("selected");
            genresDiv.appendChild(btn);
        });

    } catch (error) {
        console.error("Error loading genres:", error);
        document.getElementById("genres").innerHTML = "Failed to load genres.";
    }
}

// Populate streaming services
function loadStreamingServices() {
    const services = ["netflix", "hulu", "disney", "prime", "hbo", "apple"];
    const servicesDiv = document.getElementById("streamingServices");

    services.forEach(service => {
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = service;
        label.appendChild(checkbox);
        label.append(service.charAt(0).toUpperCase() + service.slice(1));
        servicesDiv.appendChild(label);
    });
}

// Populate year selects
function populateYearSelects() {
    const currentYear = new Date().getFullYear();
    const yearFrom = document.getElementById("yearFrom");
    const yearTo = document.getElementById("yearTo");

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
        // Add search term to URL and fetch
        const searchUrl = `${baseUrl}&title=${encodeURIComponent(searchTerm)}`;
        fetchMovies(searchUrl);
    }
}

// Apply filters function
function applyFilters() {
    fetchMovies();
}

// Call necessary functions when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadGenres();
    loadStreamingServices();
    populateYearSelects();
});


