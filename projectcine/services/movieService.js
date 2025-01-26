// services/movieService.js
const { initDB } = require('../config/database');
const Movie = require('../models/movieModel');

class MovieService {
  constructor() {
    this.pool = null;
    this.init();
  }
/*
   -----------------------------------------------------------------------------------
    Purpose: Initializes the database connection pool for the service.
    Parameters: None.
    Postcondition: The `pool` property is set to the initialized database connection.
   -----------------------------------------------------------------------------------
  */
  async init() {
    this.pool = await initDB();
  }
  /*
   ---------------------------------------------------------------------------------------
    Purpose: Retrieves all movies.
    Parameters: None.
    Postcondition: Returns an array of movies mapped to Movie model instances.
   ---------------------------------------------------------------------------------------
  */
  async getAllMovies() {
    const [rows] = await this.pool.query('SELECT * FROM movies');
    return rows.map(Movie.fromRow);
  }
  /*
   ---------------------------------------------------------------------------------
    Purpose: Retrieves a movie by ID.
    Parameters: id (integer) as the ID of the movie to retrieve.
    Postcondition: Returns the movie instance if found; otherwise, returns null.
   ---------------------------------------------------------------------------------
  */
  async getMovieById(id) {
    const [rows] = await this.pool.query('SELECT * FROM movies WHERE movie_id = ?', [id]);
    if (rows.length === 0) return null;
    return Movie.fromRow(rows[0]);
  }
  /*
   -----------------------------------------------------------------------
    Purpose: Creates a new movie.
    Parameters: movieData which contains movie details.
    Postcondition: Returns the new movie created as an object.
   -----------------------------------------------------------------------
  */
  async createMovie(movieData) {
    const { title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster } = movieData;
    const [result] = await this.pool.query(
      'INSERT INTO movies (movie_title, movie_desc, movie_genre, movie_duration, movie_release, movie_stars, movie_screeningtime, movie_hallno, movie_rating, movie_lang, movie_poster) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster]
    );
    const insertedMovie = new Movie(result.insertId, title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster);
    return insertedMovie;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Updates an existing movie.
    Parameters: id (integer) as the id of the movie to update and movieData (object) 
    containing updated movie details.
    Postcondition: Returns true if the movie was updated successfully; otherwise, false.
   -----------------------------------------------------------------------------------------
  */
  async updateMovie(id, movieData) {
    const { title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster } = movieData;
    const [result] = await this.pool.query(
      'UPDATE movies SET movie_title = ?, movie_desc = ?, movie_genre = ?, movie_duration = ?, movie_release = ?, movie_stars = ?, movie_screeningtime = ?, movie_hallno = ?, movie_rating = ?, movie_lang = ?, movie_poster = ? WHERE movie_id = ?',
      [title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster, id]
    );
    return result.affectedRows > 0;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Deletes a movie record.
    Parameters: id (integer) as the id of the movie to delete.
    Postcondition: Returns true if the movie was deleted successfully; otherwise, false.
   ----------------------------------------------------------------------------------------
  */
  async deleteMovie(id) {
    const [result] = await this.pool.query('DELETE FROM movies WHERE movie_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new MovieService();
