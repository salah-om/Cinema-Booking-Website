// routes/movieRoutes.js
const express = require('express');
const movieController = require('../controllers/movieController');
const { validateMovie, validateMovieId } = require('../validators/movieDTO');
const upload = require('../config/upload');

const router = express.Router();

// Define routes
router.get('/', (req, res) => movieController.getAllMovies(req, res));
router.get('/:id', validateMovieId, (req, res) => movieController.getMovieById(req, res));
router.post('/', upload.single('poster'), validateMovie, (req, res) => movieController.createMovie(req, res));
// router.put('/:id', [validateMovieId, validateMovie], (req, res) => movieController.updateMovie(req, res));
router.post('/update-movie/:id', upload.single('poster'), validateMovieId, (req, res) => movieController.updateMovie(req, res));
// router.delete('/:id', validateMovieId, (req, res) => movieController.deleteMovie(req, res));
router.get('/delete/:id', validateMovieId, (req, res) => movieController.deleteMovie(req, res));
router.get('/edit-form/:id', validateMovieId, (req, res) => movieController.editForm(req, res));

module.exports = router;
