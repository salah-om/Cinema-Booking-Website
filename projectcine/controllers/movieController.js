// controllers/movieController.js
const movieService = require('../services/movieService');

class MovieController {
    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves all movies.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: A JSON array of movies or an error message.
    -----------------------------------------------------------------------
    */
  async getAllMovies(req, res) {
    try {
      const movies = await movieService.getAllMovies();
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves a movie by ID.
      Parameters: The req is the request object with a movie ID & the 
      res is the response object sending JSON data.
      Postcondition: Requested movie data for specific ID or error message.
    -----------------------------------------------------------------------
    */
  async getMovieById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const movie = await movieService.getMovieById(id);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Creates a new movie.
      Parameters: The req is the request object with movie data in the body
      & the res is the response object sending JSON data.
      Postcondition: Creates the movie with its data or error message.
    -----------------------------------------------------------------------
    */
  async createMovie(req, res) {
    try {
      const { id, title, description, genre, duration, release, stars, screening, hallno, rating, lang} = req.body;
      const poster = req.file ? `/images/${req.file.filename}` : null;
      const newMovie = await movieService.createMovie({ id, title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster });
      console.log('Uploaded File:', req.file);
      //res.status(201).json(newMovie);
      res.redirect('/admin/movies');
    } catch (error) {
      console.error('Error creating movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Updates an existing movie by its ID.
      Parameters: The req is the request object with movie ID and updated 
      data in the body & the res is the response object sending JSON data.
      Postcondition: Updates movie and responds with success message or 
      error message if movie was not found or changed.
    -----------------------------------------------------------------------
    */
  async updateMovie(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, description, genre, duration, release, stars, screening, hallno, rating, lang} = req.body;
      const poster = req.file ? `/images/${req.file.filename}` : null;
      const success = await movieService.updateMovie(id, { title, description, genre, duration, release, stars, screening, hallno, rating, lang, poster });
      if (!success) {
        res.render('404')
        // return res.status(404).json({ message: 'Movie not found or no changes made' });
      }
      // res.json({ message: 'Movie updated successfully' });
      res.redirect('/admin/movies');
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

    /*
    -----------------------------------------------------------------------
      Purpose: Deletes a movie by its ID.
      Parameters: The req is the request object with movie ID & the res is 
      the response object sending JSON data.
      Postcondition: Deletes the movie and responds with success message or 
      error message if movie was not found or deleted.
    -----------------------------------------------------------------------
    */
  async deleteMovie(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await movieService.deleteMovie(id);
      if (!success) {
        // return res.status(404).json({ message: 'Movie not found' });
        res.redirect('404');
      }
      // res.json({ message: 'Movie deleted successfully' });
      res.redirect('/admin/movies');
    } catch (error) {
      console.error('Error deleting movie:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

 /*
    -------------------------------------------------------------------------
      Purpose: Sends specific JSON data of a movie by its id.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: Renders the editMovie.ejs and sends the movie as JSON.
    -------------------------------------------------------------------------
    */
async editForm(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const movie = await movieService.getMovieById(id);
    res.render('editMovie', {movie: movie});
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

}
module.exports = new MovieController();
