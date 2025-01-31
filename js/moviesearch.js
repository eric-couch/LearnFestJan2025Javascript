const OMDBAPIURL = "http://www.omdbapi.com/?apikey=";
const OMDBAPIKEY = "86c39163";
let SearchTitle = "";
let MoviePoster = "http://img.omdbapi.com/?apikey=" + OMDBAPIKEY + "&i=";
let curPage = 1;
let totalPages = 0;

document.addEventListener("DOMContentLoaded", event => {
    console.log("DOM fully loaded and parsed");
    const button = document.getElementById("searchbtn");
    button.addEventListener("click", event => {
        console.log("Button was clicked");
        (async () => {
            UpdatePage();
        })()
    })
    // add event listeners for the pagination buttons
    let prevButton = document.getElementById("prevbtn");
    prevButton.addEventListener("click", event => {
        if (curPage > 1 && totalPages > 1) {
            curPage--;
            (async () => {
                UpdatePage();
            })();
        }
    });
    let nextButton = document.getElementById("nextbtn");
    nextButton.addEventListener("click", event => {
        if (curPage < totalPages) {
            curPage++;
            (async () => {
                UpdatePage();
            })();
        }
    });
});

const UpdatePage = async () => {
    const movies = await getMovies();
    console.log(`Movies: ${movies}`);
    const movieList = document.getElementById("favMovieList");
    const totalResults = movies.totalResults;
    totalPages = Math.ceil(totalResults / 10);
    movieList.innerHTML = "";
    if (movies) {
        movies.Search.forEach(movie => {
            console.log(`Movie: ${movie.Title}`);
            BuildMovieCard(movie);
        })
    }
    UpdateNavBar();
}

function UpdateNavBar() {
    let navBar = document.getElementById("searchListNav");
    let navBarPages = document.getElementById("pages");
    const navBarMessage = `Page ${curPage} of ${totalPages}`;
    console.log(navBarMessage);
    navBarPages.innerText = navBarMessage;
    navBar.style.visibility = "visible";
}

function BuildMovieCard(movie) {
    const { Title, Year, imdbID, Poster } = movie;
    const movieCard = document.getElementById("movieCard");
    movieCardClone = movieCard.cloneNode(true);
    movieCardClone.querySelector("#moviePoster").src = MoviePoster + imdbID;
    movieCardClone.querySelector("#cardBody").firstElementChild.innerText = `${Title} (${Year})`;
    let favButton = movieCardClone.querySelector("#favbtn");
    if (favButton != null) {
        favButton.addEventListener("click", event => {
            console.log("Fav Button was clicked");
            AddToFavorites(movie);
        })
    }
    favMovieList.appendChild(movieCardClone);
    movieCardClone.style.display = "inline";
}

function AddToFavorites(movie) {
    // todo: check to make sure the movie isn't already in the list
    let jsonString = localStorage.getItem("favMovies");
    if (jsonString === null) {
        jsonString = '[]';
    }
    let favoriteMovies = JSON.parse(jsonString);
    favoriteMovies.push(movie);
    localStorage.setItem("favMovies", JSON.stringify(favoriteMovies));
    // todo: add toast letting user know movie was added
}

const getMovies = async () => { 
    SearchTitle = document.getElementById("searchTerm").value;
    console.log("Search Title: ", SearchTitle);
    // add in the page parameter
    const searchURL = OMDBAPIURL + OMDBAPIKEY + "&s=" + SearchTitle + "&page=" + curPage;
    const response = await fetch(searchURL);
    return await response.json();
}