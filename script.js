// Martinez Movies - JavaScript
const apiKey = "6264585815mshaaa60564d43dd2ap132e53jsn11ef0791b6f8";
const apiHost = "streaming-availability.p.rapidapi.com";

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

async function loadGenres() {
    const url = `https://${apiHost}/genres?output_language=en`;
    
    try {
        const response = await fetch(url, getHeaders());
        const data = await response.json();

        const genresDiv = document.getElementById("genres");
        data.result.forEach(genre => {
            const btn = document.createElement("button");
            btn.textContent = genre.name;
            btn.dataset.id = genre.id; 
            btn.onclick = () => btn.classList.toggle("selected");
            genresDiv.appendChild(btn);
        });
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

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

async function applyFilters() {
    const type = document.getElementById("toggleType").checked ? "series" : "movie";
    const yearFrom = document.getElementById("yearFrom").value;
    const yearTo = document.getElementById("yearTo").value;
    const language = document.getElementById("language").value;
    
    const genres = [...document.querySelectorAll("#genres .selected")].map(g => g.dataset.id);
    const services = [...document.querySelectorAll("#streamingServices input:checked")].map(s => s.value);

    let url = `https://${apiHost}/shows/search/filters?series_granularity=show&order_by=original_title&order_direction=asc&show_type=${type}&output_language=en`;

    if (genres.length) url += `&genres=${genres.join(",")}&genres_relation=and`;
    if (services.length) url += `&services=${services.join(",")}`;
    if (yearFrom && yearTo) url += `&release_year_from=${yearFrom}&release_year_to=${yearTo}`;
    if (language) url += `&language=${language}`;

    try {
        const response = await fetch(url, getHeaders());
        const data = await response.json();
        displayMovies(data.result);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function getHeaders() {
    return {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": apiHost
        }
    };
}


