import {db} from "./firebase.js"
import {addDoc, collection, getDocs, deleteDoc,query,where,doc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {displaySearchResults} from "./filmUI.js"

async function postFilm(film) {
    try {
        
          const { title, genre, releaseDate } = film;

          if (!validateInput(title, genre, releaseDate)) {
            return; 
        }

        await addDoc(collection(db, 'movies'), film);
        document.querySelector('#title').value = '';
        document.querySelector('#genrePost').value = '';
        document.querySelector('#releaseDate').value = '';
        console.log("success");
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
}

async function getFilms(showFavorites = false) {
    try {
        const filmsCollection = collection(db, 'movies');
        const filmsDatabase = await getDocs(filmsCollection);

        const formattedFilms = [];

        filmsDatabase.forEach((film) => {
            const formattedFilm = {
                id: film.id,
                film: film.data(),
            };

            if (!showFavorites || formattedFilm.film.favorite) {
                formattedFilms.push(formattedFilm);
            }
        });

        return formattedFilms;
    } catch (error) {
        console.log(`ERROR: ${error}`);
        return [];
    }
}

async function deleteFilm(id) {
    try {
        await deleteDoc(doc(db, 'movies', id));
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
}

async function postFilmIfNotExists(film) {
    const titleExists = await isMovieTitleExists(film.title);

    if (!titleExists) {
        await postFilm(film);
    } else {
        console.log('Movie with the same title already exists.');
    }
}


async function searchByTitle(title) {
    try {
        const queryTitle = query(collection(db, 'movies'), where('title', '==', title));
        const movies = await getDocs(queryTitle);

        console.log('Movies:', movies.docs.map(doc => doc.data())); 

        const searchResults = [];

        movies.forEach((movie) => {
            const movieData = movie.data();

            if (movieData && Object.prototype.hasOwnProperty.call(movieData, 'title')) {
                const formattedMovie = {
                    id: movie.id,
                    movie: movieData,
                };

                searchResults.push(formattedMovie);
            }
        });

        console.log('Search Results:', searchResults); 

        displaySearchResults(searchResults); 

        return searchResults;
    } catch (error) {
        console.log(`ERROR: ${error}`);
        return []; 
    }
}

function validateInput(title, genre, releaseDate) {
    if (!title || !genre || !releaseDate) {
        alert("Please fill in all the required fields (Title, Genre, Release Date).");
        return false;
    }

    return true;
}

async function isMovieTitleExists(title) {
    try {
        const moviesCollection = collection(db, 'movies');
        const queryTitle = query(moviesCollection, where('title', '==', title));
        const matchingMovies = await getDocs(queryTitle);

        return !matchingMovies.empty;
    } catch (error) {
        console.log(`ERROR: ${error}`);
        return false; 
    }
}

export { validateInput,  searchByTitle, postFilmIfNotExists, deleteFilm, getFilms, isMovieTitleExists  }