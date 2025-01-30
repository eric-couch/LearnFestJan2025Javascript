const OMDBAPIURL = "http://www.omdbapi.com/?apikey=";
const OMDBAPIKEY = "86c39163";
let SearchTitle = "";
let MoviePoster = "http://img.omdbapi.com/?apikey=" + OMDBAPIKEY + "&i=";

document.addEventListener("DOMContentLoaded", event => {
    console.log("DOM fully loaded and parsed");
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
});

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
    
    favMovieList.appendChild(movieCardClone);
    movieCardClone.style.display = "inline";
}


const getMovieData = async (imdbId) => { 
    const searchURL = OMDBAPIURL + OMDBAPIKEY + "&i=" + imdbId;
    const response = await fetch(searchURL);
    return await response.json();
}