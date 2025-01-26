// routes/seatRoutes.js
const express = require('express');
const seatController = require('../controllers/seatController');
const { validateSeat, validateSeatId } = require('../validators/seatDTO');
const { validateMovieId } = require('../validators/movieDTO');
const router = express.Router();

// Define routes
router.get('/', (req, res) => seatController.getAllSeats(req, res));
router.get('/:id', validateSeatId, (req, res) => seatController.getSeatById(req, res));
router.get('/seating-plan/:id', validateMovieId, (req, res) => seatController.seatPlan(req, res));
router.post('/', validateSeat, (req, res) => seatController.createSeat(req, res));
router.post('/book-seat/:id',validateMovieId, (req, res) => seatController.bookSeat(req, res));
router.put('/:id', [validateSeatId, validateSeat], (req, res) => seatController.updateSeat(req, res));
// router.delete('/:id', validateSeatId, (req, res) => seatController.deleteSeat(req, res));

module.exports = router;
