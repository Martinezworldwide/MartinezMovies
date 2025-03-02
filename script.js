// Martinez Movies - JavaScript
const apiKey = "6264585815mshaaa60564d43dd2ap132e53jsn11ef0791b6f8";
const apiHost = "streaming-availability.p.rapidapi.com";

// Populate dropdowns
document.addEventListener("DOMContentLoaded", () => {
    populateYears();
    loadGenres();
    loadStreamingServices();
});

// Populate years
function populateYears() {
    const yearFrom = document.getElementById("yearFrom");
    const yearTo = document.getElementById("yearTo");
    const currentYear = new Date().getFullYear();

    for (let year = 1970; year <= currentYear; year++) {
        yearFrom.add(new Option(year, year));
        yearTo.add(new Option(year, year));
    }
    yearTo.value = currentYear;
}

// Load Genres (Fixed API Call)
async function loadGenres() {
    try {
        const url = `https://${apiHost}/genres?output_language=en`;
        const response = await fetch(url, getHeaders());

        if (!response.ok) {
            throw new Error(`Failed to fetch genres: ${response.status}`);
        }

        const data = await response.json();
        if (!data.result) {
            throw new Error("Genres API did not return expected results.");
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
    }
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

    // Correcting API URL Structure
    let url = `https://${apiHost}/shows/search/filters?series_granularity=show&order_by=original_title&show_type=${type}&output_language=${language}`;

    if (genres.length > 0) url += `&genres=${encodeURIComponent(genres.join(","))}&genres_relation=and`;
    if (services.length > 0) url += `&services=${encodeURIComponent(services.join(","))}`;
    if (yearFrom && yearTo) url += `&release_year_from=${yearFrom}&release_year_to=${yearTo}`;

    console.log("API Request URL:", url);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": apiHost
            }
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.result && data.result.length > 0) {
            displayMovies(data.result);
        } else {
            document.getElementById("movies-container").innerHTML = "<p>No movies found. Try adjusting filters!</p>";
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        document.getElementById("movies-container").innerHTML = "<p>Failed to load movies. Check console for errors.</p>";
    }
}

// Display Movies (Fix Poster Path)
function displayMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = "";
    
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="${movie.poster_path || 'placeholder.jpg'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="addToWatchlist('${movie.id}', '${movie.title}', '${movie.poster_path}')">Add to Watchlist</button>
        `;
        container.appendChild(movieCard);
    });
}

// Headers (Fixed Method)
function getHeaders() {
    return {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": apiHost
        }
    };
}



