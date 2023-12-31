import { getFilms, postFilmIfNotExists, searchByTitle } from "./filmService.js";
import { displayFilms, } from "./filmUI.js";

const showFavoritesButton = document.getElementById('showFavoritesButton');

showFavoritesButton.addEventListener('click', async () => {
    const films = await getFilms(true);
    displayFilms(films);
});

const getFilmsButton = document.getElementById('getFilmsButton');

getFilmsButton.addEventListener('click', async () => {
    const genre = document.querySelector('#genrePost').value;

    const films = await getFilms(genre);
    displayFilms(films);
});

const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', async () => {
    const searchTitle = document.querySelector('#searchTitle').value;
    console.log("hej")

    const searchResults = await searchByTitle(searchTitle);
    
    displayFilms(searchResults);
});

const postFilmButton = document.getElementById('postFilmButton');

postFilmButton.addEventListener('click', () => {
    const film = {
        title: document.querySelector('#title').value,
        genre: document.querySelector('#genrePost').value,
        releaseDate: document.querySelector('#releaseDate').value,
        favorite: false, 
    };

    postFilmIfNotExists(film);
});