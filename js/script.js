import { API_KEY } from './config.js'
let inputMovie = document.getElementById("input-text");
let searchBtn = document.getElementById("search-icon");
let result = document.getElementById("result");
let movieDetails = document.getElementById("movie-details");
let poster = document.getElementById("poster");
let info = document.getElementById("info");
let line = document.getElementById("line");

inputMovie.addEventListener("focus", () => {
  inputMovie.removeAttribute("placeholder");
});

inputMovie.addEventListener("blur", () => {
  inputMovie.setAttribute("placeholder", "Enter a word...");
});

function displayMovieDetails(data) {
  poster.innerHTML = "";
  info.innerHTML = "";

  const posterElement = document.createElement("img");
  posterElement.src = data.Poster;
  posterElement.width = 170;

  const titleElement = document.createElement("h2");
  titleElement.textContent = data.Title;

  const yearElement = document.createElement("p");
  yearElement.innerHTML = `<strong>${data.Year}</strong>&nbsp;&nbsp;    <i class="fa-solid fa-star" style="color: #ffd438;"></i> <strong>${data.imdbRating}</strong>`;

  const plotElement = document.createElement("p");
  plotElement.classList.add("description-size");
  plotElement.textContent = data.Plot;

  poster.appendChild(posterElement);
  info.appendChild(titleElement);
  info.appendChild(yearElement);

  info.appendChild(plotElement);
}
function displayMovies(movies) {
  result.innerHTML = "";
  if (movies.length === 0) {
    result.innerHTML = `<p>Can't find a movie</p>`;
  } else {
    movies.forEach((movie) => {
      if (movie.Type === "movie") {
        movieDetails.classList.add("hidden");
        movieDetails.classList.remove("flex-details");
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML = `
            <img src="${movie.Poster}" width="100">   
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>  
               
            `;

        movieElement.addEventListener("click", () => {
          const allMovies = document.querySelectorAll(".movie");
          allMovies.forEach((movie) => {
            movie.style.display = "none";
          });
          result.classList.add("hidden");
          movieDetails.classList.remove("hidden");
          movieDetails.classList.add("flex-details");
          info.classList.add("flex-info");

          const title = movie.Title;
          const detailsApi = `https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`;

          // Realiza el nuevo fetch para obtener los detalles de la película
          fetch(detailsApi)
            .then((resp) => resp.json())
            .then((data) => {
              // Muestra los detalles en el div de detalles
              displayMovieDetails(data);
              console.log(data);
            })
            .catch((error) => {
              console.error("Error fetching movie details:", error);
            });
        });
        result.classList.remove("hidden");
        result.appendChild(movieElement);
      } else {
      }
    });
  }
}

function getMoviesByKeyword(keyword) {
  let api = `https://www.omdbapi.com/?s=${keyword}&apikey=${API_KEY}`;
  if (keyword.length <= 0) {
    result.classList.remove("hidden");
    result.innerHTML = `<p>Can't find a movie</p>`;
  } else {
    fetch(api)
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.Search) {
          displayMovies(data.Search);
        } else {
          result.classList.remove("hidden");
          result.innerHTML = `<p>Can't find a movie</p>`;
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
}

function handleSearch() {
  const keyword = inputMovie.value.trim();
  if (keyword.length > 0) {
    getMoviesByKeyword(keyword);
  } else {
    result.classList.remove("hidden");
    result.innerHTML = `<p>Can't find a movie</p>`;
  }
}

inputMovie.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    handleSearch();
  }
});

searchBtn.addEventListener("click", () => {
  handleSearch();
});
