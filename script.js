// Martinez Movies - JavaScript
const apiKey = "6264585815mshaaa60564d43dd2ap132e53jsn11ef0791b6f8";
const apiHost = "streaming-availability.p.rapidapi.com";

// Populate dropdowns
document.addEventListener("DOMContentLoaded", () => {
    populateYears();
    loadGenres();
    loadStreamingServices();
});

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

// Load Genres
async function loadGenres() {
    const url = `https://${apiHost}/genres?output_language=en`;
    const response = await fetch(url, getHeaders());
    const data = await response.json();
    
    const genresDiv = document.getElementById("genres");
    data.result.forEach(genre => {
        const btn = document.createElement("button");
        btn.textContent = genre.name;
        btn.onclick = () => btn.classList.toggle("selected");
        genresDiv.appendChild(btn);
    });
}

// Load Streaming Services
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

// Fetch Movies Based on Filters
async function applyFilters() {
    const type = document.getElementById("toggleType").checked ? "series" : "movie";
    const yearFrom = document.getElementById("yearFrom").value;
    const yearTo = document.getElementById("yearTo").value;
    const language = document.getElementById("language").value;
    const genres = [...document.querySelectorAll("#genres .selected")].map(g => g.textContent);
    const services = [...document.querySelectorAll("#streamingServices input:checked")].map(s => s.value);

    let url = `https://${apiHost}/shows/search/filters?series_granularity=show&order_by=original_title&show_type=${type}&output_language=${language}`;
    if (genres.length) url += `&genres=${genres.join(",")}`;
    if (services.length) url += `&streamingServices=${services.join(",")}`;
    
    const response = await fetch(url, getHeaders());
    const data = await response.json();
    
    displayMovies(data.result);
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
            <button onclick="addToWatchlist('${movie.id}', '${movie.title}', '${movie.poster_path}')">Add to Watchlist</button>
        `;
        container.appendChild(movieCard);
    });
}

// Headers
function getHeaders() {
    return {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": apiHost
        }
    };
}
