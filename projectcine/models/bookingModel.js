
class Booking {
  constructor(id, movid, usid, date, price) {
    this.id = id;
    this.movid = movid;
    this.usid = usid;
    this.date = date;
    this.price = price;
  }

  // Static method to map database row to Booking model
  // mapper to map the datafields from database to our booking Model
  static fromRow(row) {
    return new Booking(
      row.booking_id,         // Map booking_id to id
      row.movie_id,
      row.user_id,
      row.booking_date,       
      row.booking_price,      
    );
  }
}

module.exports = Booking;
