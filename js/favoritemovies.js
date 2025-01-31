const OMDBAPIURL = "http://www.omdbapi.com/?apikey=";
const OMDBAPIKEY = "86c39163";
let SearchTitle = "";
let MoviePoster = "http://img.omdbapi.com/?apikey=" + OMDBAPIKEY + "&i=";

document.addEventListener("DOMContentLoaded", event => {
    console.log("DOM fully loaded and parsed");
    LoadMovies();
});

function LoadMovies() {
    let jsonString = localStorage.getItem("favMovies");
    if (jsonString != null) {
        console.log("Favorite Movies: ", jsonString);
        let favoriteMovies = JSON.parse(jsonString);
        favoriteMovies.forEach (movie => {
            (async () => {
                console.log(`Movie: ${movie.Title}`);
                const movieData = await getMovieData(movie.imdbID);
                BuildMovieCard(movieData);
            })();
        });
    }
}

function BuildMovieCard(movie) {
    const { Title, Year, imdbID, Genre, Plot, Ratings } = movie;
    const movieCard = document.getElementById("movieCard");
    movieCardClone = movieCard.cloneNode(true);
    movieCardClone.querySelector("#moviePoster").src = MoviePoster + imdbID;
    movieCardClone.querySelector("#cardBody").firstElementChild.innerText = `${Title} (${Year})`;
    let genre = movieCardClone.querySelector("#genre");
    genre.innerText = `Genre: ${Genre}`;
    let plot = movieCardClone.querySelector("#plot");
    plot.innerText = `Plot: ${Plot}`;
    // add remove button event handler here
    let removeButton = movieCardClone.querySelector("#removeMovie");
    if (removeButton != null) {
        removeButton.addEventListener("click", () => {
            RemoveMovie(movie);
        })
    }
    favMovieList.appendChild(movieCardClone);
    movieCardClone.style.display = "inline";
}

function RemoveMovie(movie) {
    // remove movie from local storage
    // remove movie from the list
    // todo: add toast confirmation message
    let favMovieList = document.getElementById("favMovieList");
    let jsonString = localStorage.getItem("favMovies");
    if (jsonString != null) {
        let favoriteMovies = JSON.parse(jsonString);
        // why would doing it this way be a bad idea?
        favoriteMovies = favoriteMovies.filter(favMovie => favMovie.imdbID !== movie.imdbID);
        localStorage.setItem("favMovies", JSON.stringify(favoriteMovies));
        //location.reload();  // this refreshes the page
        favMovieList.innerHTML = "";
        // rebuild the list
        LoadMovies();
    }
}


const getMovieData = async (imdbId) => { 
    const searchURL = OMDBAPIURL + OMDBAPIKEY + "&i=" + imdbId;
    const response = await fetch(searchURL);
    return await response.json();
}