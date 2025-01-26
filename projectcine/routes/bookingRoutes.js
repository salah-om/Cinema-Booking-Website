// routes/bookingRoutes.js
const express = require('express');
const bookingController = require('../controllers/bookingController');
const { validateBooking, validateBookingId } = require('../validators/bookingDTO');

const router = express.Router();

// Define routes
router.get('/', (req, res) => bookingController.getAllBookings(req, res));
router.get('/:id', validateBookingId, (req, res) => bookingController.getBookingById(req, res));
router.post('/', validateBooking, (req, res) => bookingController.createBooking(req, res));
// router.put('/:id', [validateBookingId, validateBooking], (req, res) => bookingController.updateBooking(req, res));
// router.delete('/:id', validateBookingId, (req, res) => bookingController.deleteBooking(req, res));

module.exports = router;
