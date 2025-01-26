// controllers/bookingController.js
const bookingService = require('../services/bookingService');

class BookingController {
    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves all bookings.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: A JSON array of bookings or an error message.
    -----------------------------------------------------------------------
    */
  async getAllBookings(req, res) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves a booking by ID.
      Parameters: The req is the request object with a booking ID & the 
      res is the response object sending JSON data.
      Postcondition: Requested booking data for specific ID or error message.
    -----------------------------------------------------------------------
    */
  async getBookingById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const booking = await bookingService.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Creates a new booking.
      Parameters: The req is the request object with booking data in the body
      & the res is the response object sending JSON data.
      Postcondition: Creates the booking with its data or error message.
    -----------------------------------------------------------------------
    */
  async createBooking(req, res) {
    try {
      const { id, movid, usid, date, price } = req.body;
      const newBooking = await bookingService.createBooking({ id, movid, usid, date, price });
      res.status(201).json(newBooking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Updates an existing booking by its ID.
      Parameters: The req is the request object with booking ID and updated 
      data in the body & the res is the response object sending JSON data.
      Postcondition: Updates booking and responds with success message or 
      error message if booking was not found or changed.
    -----------------------------------------------------------------------
    */
  async updateBooking(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { movid, usid, date, price } = req.body;
      const success = await bookingService.updateBooking(id, { movid, usid, date, price });
      if (!success) {
        return res.status(404).json({ message: 'Booking not found or no changes made' });
      }
      res.json({ message: 'Booking updated successfully' });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Deletes a booking by its ID.
      Parameters: The req is the request object with booking ID & the res is 
      the response object sending JSON data.
      Postcondition: Deletes the booking and responds with success message or 
      error message if booking was not found or deleted.
    -----------------------------------------------------------------------
    */
  async deleteBooking(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await bookingService.deleteBooking(id);
      if (!success) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new BookingController();
