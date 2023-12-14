import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, deleteDoc,query,where, updateDoc, doc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABVxssIQCTs1IVeJz06hp3qOqMixQX78M",
  authDomain: "movieexam-28ac6.firebaseapp.com",
  projectId: "movieexam-28ac6",
  storageBucket: "movieexam-28ac6.appspot.com",
  messagingSenderId: "402919323382",
  appId: "1:402919323382:web:2c4863b148a7cf33f3ded7",
  measurementId: "G-YLLQQME70X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const filmsElem = document.getElementById('filmsList');

async function postFilm(film) {
    try {
        
          const { title, genre, releaseDate } = film;

          // Validate input
          if (!validateInput(title, genre, releaseDate)) {
            return; // Don't proceed if input is not valid
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
        const filmsSnapshot = await getDocs(filmsCollection);

        const formattedFilms = [];

        filmsSnapshot.forEach((film) => {
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

const showFavoritesButton = document.getElementById('showFavoritesButton');

showFavoritesButton.addEventListener('click', async () => {
    const films = await getFilms(true);
    displayFilms(films);
});

async function deleteFilm(id) {
    try {
        await deleteDoc(doc(db, 'movies', id));
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
}

 /* async function updateFilm(genre, id) {
    try {
        await updateDoc(doc(db, 'movies', id), {
            genre: genre,
        });
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
} */

function createFilmElement(film) {
    const containerElem = document.createElement('article');
    const titleElem = document.createElement('h3');
    const genreElem = document.createElement('p');
    const releaseDateElem = document.createElement('p');
    const watchedButton = document.createElement('button');  // New button for marking as watched
    const favoriteButton = document.createElement('button');

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

function displayFilms(films) {
    for (const film of films) {
        createFilmElement(film);
    }
}

const getFilmsButton = document.getElementById('getFilmsButton');

getFilmsButton.addEventListener('click', async () => {
    const genre = document.querySelector('#genrePost').value;

    const films = await getFilms(genre);
    displayFilms(films);
});

async function isMovieTitleExists(title) {
    try {
        const moviesCollection = collection(db, 'movies');
        const queryTitle = query(moviesCollection, where('title', '==', title));
        const matchingMovies = await getDocs(queryTitle);

        return !matchingMovies.empty; // Returns true if there are matching movies, indicating the title already exists
    } catch (error) {
        console.log(`ERROR: ${error}`);
        return false; // Handle the error as needed
    }
}

// Function to post a new film if the title doesn't already exist
async function postFilmIfNotExists(film) {
    const titleExists = await isMovieTitleExists(film.title);

    if (!titleExists) {
        // Title doesn't exist, proceed to add the film
        await postFilm(film);
    } else {
        console.log('Movie with the same title already exists.');
        // You can provide user feedback or handle the situation as needed
    }
}

const searchButton = document.getElementById('searchButton');

// Add an event listener to the search button
searchButton.addEventListener('click', async () => {
    const searchTitle = document.querySelector('#searchTitle').value;
    console.log("hej")

    // Call the search function with the entered title
    const searchResults = await searchByTitle(searchTitle);
    
    // Display the search results
    displayFilms(searchResults);
});

// Function to search movies by title
async function searchByTitle(title) {
    try {
        const queryTitle = query(collection(db, 'movies'), where('title', '==', title));
        const movies = await getDocs(queryTitle);

        console.log('Movies:', movies.docs.map(doc => doc.data())); // Log movies for debugging

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

        console.log('Search Results:', searchResults); // Log search results for debugging

        displaySearchResults(searchResults); // Display the search results

        return searchResults;
    } catch (error) {
        console.log(`ERROR: ${error}`);
        return []; // Return an empty array in case of an error
    }
}

function validateInput(title, genre, releaseDate) {
    if (!title || !genre || !releaseDate) {
        alert("Please fill in all the required fields (Title, Genre, Release Date).");
        return false;
    }

    return true;
}

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

const postFilmButton = document.getElementById('postFilmButton');

postFilmButton.addEventListener('click', () => {
    const film = {
        title: document.querySelector('#title').value,
        genre: document.querySelector('#genrePost').value,
        releaseDate: document.querySelector('#releaseDate').value,
        favorite: false, // Initialize the favorite property as false
    };

    postFilmIfNotExists(film);
});