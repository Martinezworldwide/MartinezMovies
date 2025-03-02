// Martinez Movies - JavaScript
const apiKey = "6264585815mshaaa60564d43dd2ap132e53jsn11ef0791b6f8";
const apiHost = "streaming-availability.p.rapidapi.com";

// Load filters when the page loads
document.addEventListener("DOMContentLoaded", () => {
    populateYears();
    loadGenres();
    loadStreamingServices();
});

// ✅ Populate Release Year Dropdowns
function populateYears() {
    const yearFrom = document.getElementById("yearFrom");
    const yearTo = document.getElementById("yearTo");
    const currentYear = new Date().getFullYear();

    for (let year = 1970; year <= currentYear; year++) {
        let optionFrom = new Option(year, year);
        let optionTo = new Option(year, year);
        yearFrom.add(optionFrom);
        yearTo.add(optionTo);
    }
    yearTo.value = currentYear;
}

// ✅ Load Genres from API
async function loadGenres() {
    const url = `https://${apiHost}/genres?output_language=en`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": apiHost
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Genres API Response:", data); // Debugging

        if (!data.result || data.result.length === 0) {
            throw new Error("No genres returned from API");
        }

        const genresDiv = document.getElementById("genres");
        data.result.forEach(genre => {
            const btn = document.createElement("button");
            btn.textContent = genre.name;
            btn.classList.add("genre-btn");
            btn.onclick = () => btn.classList.toggle("selected");
            genresDiv.appendChild(btn);
        });

    } catch (error) {
        console.error("Error loading genres:", error);
        document.getElementById("genres").innerHTML = "<p>Failed to load genres.</p>";
    }
}

// ✅ Load Streaming Services
function loadStreamingServices() {
    const services = ["Netflix", "Hulu", "Disney+", "Prime Video", "HBO Max", "Apple TV+"];
    const servicesDiv = document.getElementById("streamingServices");

    services.forEach(service => {
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = service;
        label.appendChild(checkbox);
        label.append(service);
        servicesDiv.appendChild(label);
    });
}

// ✅ Fetch Movies Based on Filters
async function applyFilters() {
    const type = document.getElementById("toggleType").checked ? "series" : "movie";
    const yearFrom = document.getElementById("yearFrom").value;
    const yearTo = document.getElementById("yearTo").value;
    const language = document.getElementById("language").value;
    const genres = [...document.querySelectorAll("#genres .selected")].map(g => g.textContent);
    const services = [...document.querySelectorAll("#streamingServices input:checked")].map(s => s.value);

    let url = `https://${apiHost}/shows/search/filters?series_granularity=show&order_by=original_title&genres_relation=and&output_language=${language}&show_type=${type}`;

    if (genres.length) url += `&genres=${genres.join(",")}`;
    if (services.length) url += `&services=${services.join(",")}`;
    if (yearFrom && yearTo) url += `&release_year_from=${yearFrom}&release_year_to=${yearTo}`;

    console.log("API Request URL:", url); // Debugging

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": apiHost
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data); // Debugging

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

// ✅ Display Movies
function displayMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="${movie.poster_path || 'https://via.placeholder.com/200'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="addToWatchlist('${movie.id}', '${movie.title}', '${movie.poster_path}')">Add to Watchlist</button>
        `;
        container.appendChild(movieCard);
    });
}

// ✅ Add to Watchlist
function addToWatchlist(id, title, poster) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist.push({ id, title, poster });
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert(`${title} added to your watchlist!`);
}

// ✅ Headers for API Calls
function getHeaders() {
    return {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": apiHost
        }
    };
}


