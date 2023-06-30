// Definición del componente "movie-card"
Vue.component("movie-card", {
    props: ["movie"],
    template: `
        <div class="col-12 col-md-3 p-0">
          <div class="card-container">
              <div class="card">
                <div class="img-container"><img :src="movie.poster" class="card-img-top" alt="Póster de la película"></div>
                <div class="card-body">
                  <h2 class="card-title mb-3">{{ movie.title }}</h2>
                  <button @click="openModal(movie)">Ver detalles</button>
                </div>
              </div>
          </div>
        </div>
      `,
    methods: {
      // Método para abrir el modal y emitir el evento "open-modal" al componente padre
      openModal(movie) {
        this.$emit("open-modal", movie);
      },
    },
  });
  
  // Registro del Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("Service Worker registrado con éxito:", registration);
      })
      .catch((error) => {
        console.log("Error al registrar el Service Worker:", error);
      });
  }
  
  // Instancia de Vue
  new Vue({
    el: "#app",
    data: {
      popularMovies: [],       // Lista de películas populares
      searchQuery: "",         // Consulta de búsqueda
      filteredMovies: [],      // Lista de películas filtradas
      isModalOpen: false,      // Estado del modal (abierto o cerrado)
      selectedMovie: null,     // Película seleccionada en el modal
      selectedGenre: "",       // Género seleccionado para filtrar películas
      genres: [],              // Lista de géneros disponibles
      favoriteMovies: [],      // Lista de películas favoritas
    },
    methods: {
      // Método para filtrar las películas según la consulta de búsqueda
      filterMovies() {
        const query = this.searchQuery.toLowerCase();
        if (query) {
          this.filteredMovies = this.popularMovies.filter((movie) =>
            movie.title.toLowerCase().includes(query)
          );
        } else {
          this.filteredMovies = this.popularMovies;
        }
      },
      // Método para abrir el modal y mostrar los detalles de una película
      openModal(movie) {
        this.selectedMovie = movie;
        this.isModalOpen = true;
      },
      // Método para cerrar el modal y limpiar la película seleccionada
      closeModal() {
        this.isModalOpen = false;
        this.selectedMovie = null;
  
        // Verificar si la película seleccionada no está en la lista de favoritos y agregarla
        if (
          this.selectedMovie &&
          !this.favoriteMovies.some((movie) => movie.id === this.selectedMovie.id)
        ) {
          this.favoriteMovies.push(this.selectedMovie);
  
          // Guardar la lista de favoritos en el almacenamiento local
          localStorage.setItem("favorites", JSON.stringify(this.favoriteMovies));
        }
      },
      // Método para filtrar las películas por género
      filterMoviesByGenre() {
        if (this.selectedGenre) {
          this.filteredMovies = this.popularMovies.filter(
            (movie) => movie.genre === this.selectedGenre
          );
        } else {
          this.filteredMovies = this.popularMovies;
        }
      },
      // Método para agregar o eliminar una película de la lista de favoritos
      addToFavorites(movie) {
        if (!this.isFavorite(movie.id)) {
          this.favoriteMovies.push(movie);
          localStorage.setItem("favorites", JSON.stringify(this.favoriteMovies));
        } else {
          this.favoriteMovies = this.favoriteMovies.filter(
            (favorite) => favorite.id !== movie.id
          );
          localStorage.setItem("favorites", JSON.stringify(this.favoriteMovies));
        }
      },
      // Método para verificar si una película está en la lista de favoritos
      isFavorite(movieId) {
        return this.favoriteMovies.some((movie) => movie.id === movieId);
      },
    },
    mounted() {
      // Cargar los datos de las películas desde un archivo JSON
      fetch("movies.json")
        .then((response) => response.json())
        .then((data) => {
          // Asignar los datos de las películas a las variables de la instancia Vue
          this.popularMovies = data.map((movie) => ({
            ...movie,
          }));
          this.filteredMovies = this.popularMovies;
  
          // Obtener la lista de géneros disponibles eliminando duplicados
          this.genres = [
            ...new Set(this.popularMovies.map((movie) => movie.genre)),
          ];
        })
        .catch((error) => {
          console.error("Error al cargar el archivo JSON:", error);
        });
  
      // Cargar la lista de películas favoritas desde el almacenamiento local
      this.favoriteMovies = JSON.parse(localStorage.getItem("favorites")) || [];
    },
  });
  