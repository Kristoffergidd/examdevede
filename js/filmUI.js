import {db} from "./firebase.js"
import {deleteFilm} from "./filmService.js"
import {updateDoc,doc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    searchResultsContainer.innerHTML = '';

    for (const result of results) {
        const containerElem = document.createElement('article');
        const titleElem = document.createElement('h3');
        const genreElem = document.createElement('p');
        const releaseDateElem = document.createElement('p');

        titleElem.innerText = `Title: ${result.movie.title}`;
        genreElem.innerText = `Genre: ${result.movie.genre}`;
        releaseDateElem.innerText = `Release Date: ${result.movie.releaseDate}`;

        containerElem.append(titleElem);
        containerElem.append(genreElem);
        containerElem.append(releaseDateElem);

        searchResultsContainer.append(containerElem);
    }
}

function displayFilms(films) {
    for (const film of films) {
        createFilmElement(film);
    }
}

function createFilmElement(film) {
    const containerElem = document.createElement('article');
    const titleElem = document.createElement('h3');
    const genreElem = document.createElement('p');
    const releaseDateElem = document.createElement('p');
    const watchedButton = document.createElement('button');  // New button for marking as watched
    const favoriteButton = document.createElement('button');
    const filmsElem = document.getElementById('filmsList');

    if (film && film.film) {
        titleElem.innerText = film.film.title || 'N/A';
        genreElem.innerText = film.film.genre || 'N/A';
        releaseDateElem.innerText = film.film.releaseDate || 'N/A';
        watchedButton.innerText = film.film.watched ? 'Unwatch' : 'Mark as Watched'; // Update button text based on watched status

        containerElem.append(titleElem);
        containerElem.append(genreElem);
        containerElem.append(releaseDateElem);
        containerElem.append(watchedButton);
        filmsElem.append(containerElem);

        if (film.film.hasOwnProperty('favorite')) {
            favoriteButton.innerText = film.film.favorite ? 'Unfavorite' : 'Favorite';

            favoriteButton.addEventListener('click', async () => {
                const filmId = film.id;

                const updatedFavoriteStatus = !film.film.favorite;

                try {
                    await updateDoc(doc(db, 'movies', filmId), {
                        favorite: updatedFavoriteStatus,
                    });

                    favoriteButton.innerText = updatedFavoriteStatus ? 'Unfavorite' : 'Favorite';
                } catch (error) {
                    console.log(`ERROR: ${error}`);
                }
            });

            containerElem.append(favoriteButton);

            // Add an event listener to the watched button
            watchedButton.addEventListener('click', async () => {
                const filmId = film.id;
                const updatedWatchedStatus = !film.film.watched; // Toggle the watched status

                try {
                    await updateDoc(doc(db, 'movies', filmId), {
                        watched: updatedWatchedStatus,
                    });

                    // Update the button text based on the new watched status
                    watchedButton.innerText = updatedWatchedStatus ? 'Unwatch' : 'Mark as Watched';
                } catch (error) {
                    console.log(`ERROR: ${error}`);
                }
            });
        }
    }

    containerElem.append(favoriteButton);

    favoriteButton.addEventListener('click', async () => {
        const filmId = film.id;
        const updatedFavoriteStatus = !film.film.favorite; // Toggle the favorite status

        try {
            await updateDoc(doc(db, 'movies', filmId), {
                favorite: updatedFavoriteStatus,
            });

            // Update the button text based on the new favorite status
            favoriteButton.innerText = updatedFavoriteStatus ? 'Unfavorite' : 'Favorite';
        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';

    containerElem.append(deleteButton);

    deleteButton.addEventListener('click', async () => {
        const filmId = film.id;

        try {
            await deleteFilm(filmId);
            containerElem.remove(); // Remove the film element from the UI
        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    });
}

export{ displaySearchResults,  displayFilms, createFilmElement }