const OMDBAPIURL = "http://www.omdbapi.com/?apikey=";
const OMDBAPIKEY = "86c39163";
let SearchTitle = "";
let MoviePoster = "http://img.omdbapi.com/?apikey=" + OMDBAPIKEY + "&i=";

document.addEventListener("DOMContentLoaded", event => {
    console.log("DOM fully loaded and parsed");
    const button = document.getElementById("searchbtn");
    button.addEventListener("click", event => {
        console.log("Button was clicked");
        (async () => {
            const movies = await getMovies();
            console.log(`Movies: ${movies}`);
            const movieList = document.getElementById("favMovieList");
            movieList.innerHTML = "";
            movies.Search.forEach(movie => {
                console.log(`Movie: ${movie.Title}`);
                BuildMovieCard(movie);
            })
        })()
    })
});

function BuildMovieCard(movie) {
    const { Title, Year, imdbID, Poster } = movie;
    const movieCard = document.getElementById("movieCard");
    movieCardClone = movieCard.cloneNode(true);
    movieCardClone.querySelector("#moviePoster").src = MoviePoster + imdbID;
    movieCardClone.querySelector("#cardBody").firstElementChild.innerText = `${Title} (${Year})`;
    favMovieList.appendChild(movieCardClone);
    movieCardClone.style.display = "inline";
}

const getMovies = async () => { 
    SearchTitle = document.getElementById("searchTerm").value;
    console.log("Search Title: ", SearchTitle);
    const searchURL = OMDBAPIURL + OMDBAPIKEY + "&s=" + SearchTitle;
    const response = await fetch(searchURL);
    return await response.json();
}