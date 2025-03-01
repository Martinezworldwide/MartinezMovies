// Martinez Movies - JavaScript

const apiKey = "6264585815mshaaa60564d43dd2ap132e53jsn11ef0791b6f8";
const apiHost = "streaming-availability.p.rapidapi.com";

// Function to search movies
async function searchMovies() {
    const query = document.getElementById("search-input").value;
    const url = `https://${apiHost}/shows/search/filters?series_granularity=show&order_by=original_title&output_language=en&show_type=movie`;

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": apiHost
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        displayMovies(data);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Function to display movies
function displayMovies(data) {
    const container = document.getElementById("movies-container");
    container.innerHTML = "";

    if (!data || data.results.length === 0) {
        container.innerHTML = "<p>No movies found</p>";
        return;
    }

    data.results.forEach(movie => {
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

// Function to add movies to watchlist
function addToWatchlist(id, title, poster) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    if (!watchlist.some(movie => movie.id === id)) {
        watchlist.push({ id, title, poster });
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert(`${title} added to your watchlist!`);
    } else {
        alert("Movie already in watchlist!");
    }
}

// Load watchlist on another page
function loadWatchlist() {
    const watchlistContainer = document.getElementById("watchlist-container");
    watchlistContainer.innerHTML = "";
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = "<p>No movies in watchlist</p>";
        return;
    }

    watchlist.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="removeFromWatchlist('${movie.id}')">Remove</button>
        `;

        watchlistContainer.appendChild(movieCard);
    });
}

// Function to remove movies from watchlist
function removeFromWatchlist(id) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist = watchlist.filter(movie => movie.id !== id);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    loadWatchlist();
}
