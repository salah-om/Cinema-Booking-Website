// services/bookingService.js
const { initDB } = require('../config/database');
const Booking = require('../models/bookingModel');

class BookingService {
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
    Purpose: Retrieves all bookings.
    Parameters: None.
    Postcondition: Returns an array of booking mapped to Booking model instances.
   ---------------------------------------------------------------------------------------
  */
  async getAllBookings() {
    const [rows] = await this.pool.query('SELECT * FROM bookings');
    return rows.map(Booking.fromRow);
  }
  /*
   ---------------------------------------------------------------------------------
    Purpose: Retrieves a booking by ID.
    Parameters: id (integer) as the ID of the booking to retrieve.
    Postcondition: Returns the booking instance if found; otherwise, returns null.
   ---------------------------------------------------------------------------------
  */
  async getBookingById(id) {
    const [rows] = await this.pool.query('SELECT * FROM bookings WHERE booking_id = ?', [id]);
    if (rows.length === 0) return null;
    return Booking.fromRow(rows[0]);
  }

   /*
   -----------------------------------------------------------------------
    Purpose: Retrieves users booking information.
    Parameters: id (integer) as the ID of the user to retrieve.
    Postcondition: Returns the booking information.
   -----------------------------------------------------------------------
  */
  async getUserBookings(userId) {
    const [rows] = await this.pool.query('SELECT b.booking_id, b.booking_date, b.booking_price, m.movie_title AS movie_title, m.movie_duration, m.movie_screeningtime, m.movie_hallno, s.seat_no, u.user_fname FROM bookings b JOIN movies m ON b.movie_id = m.movie_id JOIN seats s ON b.booking_id = s.booking_id JOIN users u ON b.user_id = u.user_id WHERE b.user_id = ?;', [userId]);
    return rows;

  }
  /*
   -----------------------------------------------------------------------
    Purpose: Creates a new booking.
    Parameters: bookingData which contains booking details.
    Postcondition: Returns the new booking created as an object.
   -----------------------------------------------------------------------
  */
  async createBooking(bookingData) {
    const { movid, usid, date, price } = bookingData;
    const [result] = await this.pool.query(
      'INSERT INTO bookings (movie_id, user_id, booking_date, booking_price) VALUES (?, ?, ?, ?)',
      [movid, usid, date, price]
    );
    const insertedBooking = new Booking(result.insertId, movid, usid, date, price);
    return insertedBooking;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Updates an existing booking.
    Parameters: id (integer) as the id of the booking to update and bookingData (object) 
    containing updated booking details.
    Postcondition: Returns true if the booking was updated successfully; otherwise, false.
   -----------------------------------------------------------------------------------------
  */
  async updateBooking(id, bookingData) {
    const { movid, usid, date, price } = bookingData;
    const [result] = await this.pool.query(
      'UPDATE bookings SET movie_id = ?, user_id = ?, booking_date = ?, booking_price = ? WHERE booking_id = ?',
      [movid, usid, date, price, id]
    );
    return result.affectedRows > 0;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Deletes a booking record.
    Parameters: id (integer) as the id of the booking to delete.
    Postcondition: Returns true if the booking was deleted successfully; otherwise, false.
   ----------------------------------------------------------------------------------------
  */
  async deleteBooking(id) {
    const [result] = await this.pool.query('DELETE FROM bookings WHERE booking_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new BookingService();
