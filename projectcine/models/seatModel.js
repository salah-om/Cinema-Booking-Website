
class Seat {
  constructor(id, bookid, status, number, movid) {
    this.id = id;
    this.bookid = bookid;
    this.status = status;
    this.number = number;
    this.movid = movid;
  }

  // Static method to map database row to Seat model
  // mapper to map the datafields from database to our seat Model
  static fromRow(row) {
    return new Seat(
      row.seat_id,         // Map seat_id to id
      row.booking_id,
      row.seat_status,       
      row.seat_no,
      row.movie_id,      
    );
  }
}

module.exports = Seat;
