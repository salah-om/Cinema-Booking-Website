// services/seatService.js
const { initDB } = require('../config/database');
const Seat = require('../models/seatModel');

class SeatService {
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
    Purpose: Retrieves all seats.
    Parameters: None.
    Postcondition: Returns an array of seats mapped to Seat model instances.
   ---------------------------------------------------------------------------------------
  */
  async getAllSeats() {
    const [rows] = await this.pool.query('SELECT * FROM seats');
    return rows.map(Seat.fromRow);
  }
  /*
   ---------------------------------------------------------------------------------
    Purpose: Retrieves a seat by ID.
    Parameters: id (integer) as the ID of the seat to retrieve.
    Postcondition: Returns the seat instance if found; otherwise, returns null.
   ---------------------------------------------------------------------------------
  */
  async getSeatById(id) {
    const [rows] = await this.pool.query('SELECT * FROM seats WHERE seat_id = ?', [id]);
    if (rows.length === 0) return null;
    return Seat.fromRow(rows[0]);
  }

   /*
   ---------------------------------------------------------------------------------
    Purpose: Retrieves a seat by  Movie ID.
    Parameters: id (integer) as the ID of the movie to retrieve its seats.
    Postcondition: Returns the seats of the specific movie.
   ---------------------------------------------------------------------------------
  */
  async getSeatsByMovieId(movieId) {
    const [rows] = await this.pool.query('SELECT * FROM seats WHERE movie_id = ?', [movieId]);
    return rows;
}

  /*
   -----------------------------------------------------------------------
    Purpose: Creates a new seat.
    Parameters: seatData which contains seat details.
    Postcondition: Returns the new seat created as an object.
   -----------------------------------------------------------------------
  */
  async createSeat(seatData) {
    const { bookid, status, number, movid } = seatData;
    const [result] = await this.pool.query(
      'INSERT INTO seats (seat_id, booking_id, seat_status, seat_no, movie_id) VALUES (?, ?, ?, ?, ?)',
      [bookid, status, number, movid]
    );
    const insertedSeat = new Seat(result.insertId, bookid, status, number, movid);
    return insertedSeat;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Updates an existing seat.
    Parameters: id (integer) as the id of the seat to update and seatData (object) 
    containing updated seat details.
    Postcondition: Returns true if the seat was updated successfully; otherwise, false.
   -----------------------------------------------------------------------------------------
  */
  async updateSeat(id, seatData) {
    const { bookid, status, number, movid } = seatData;
    const [result] = await this.pool.query(
      'UPDATE seats SET booking_id = ?, seat_status = ?, seat_no = ?, movie_id = ? WHERE seat_id = ?',
      [bookid, status, number,movid, id]
    );
    return result.affectedRows > 0;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Deletes a seat record.
    Parameters: id (integer) as the id of the seat to delete.
    Postcondition: Returns true if the seat was deleted successfully; otherwise, false.
   ----------------------------------------------------------------------------------------
  */
  async deleteSeat(id) {
    const [result] = await this.pool.query('DELETE FROM seats WHERE seat_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new SeatService();
