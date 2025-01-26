// controllers/seatController.js
const seatService = require('../services/seatService');
const bookingService = require('../services/bookingService');
const movieService = require('../services/movieService');
class SeatController {
    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves all seats.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: A JSON array of seats or an error message.
    -----------------------------------------------------------------------
    */
  async getAllSeats(req, res) {
    try {
      const seats = await seatService.getAllSeats();
      res.json(seats);
    } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves a seat by ID.
      Parameters: The req is the request object with a seat ID & the 
      res is the response object sending JSON data.
      Postcondition: Requested seat data for specific ID or error message.
    -----------------------------------------------------------------------
    */
  async getSeatById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const seat = await seatService.getSeatById(id);
      if (!seat) {
        return res.status(404).json({ message: 'Seat not found' });
      }
      res.json(seat);
    } catch (error) {
      console.error('Error fetching seat:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

    /*
    -----------------------------------------------------------------------
      Purpose: Creates a new seat.
      Parameters: The req is the request object with seat data in the body
      & the res is the response object sending JSON data.
      Postcondition: Creates the seat with its data or error message.
    -----------------------------------------------------------------------
    */
  async createSeat(req, res) {
    try {
      const { id, bookid, status, number, movid } = req.body;
      const newSeat = await seatService.createSeat({ id, bookid, status, number, movid });
      res.status(201).json(newSeat);
    } catch (error) {
      console.error('Error creating seat:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

    /*
    -----------------------------------------------------------------------
      Purpose: Updates an existing seat by its ID.
      Parameters: The req is the request object with seat ID and updated 
      data in the body & the res is the response object sending JSON data.
      Postcondition: Updates seat and responds with success message or 
      error message if seat was not found or changed.
    -----------------------------------------------------------------------
    */
  async updateSeat(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { bookid, status, number, movid } = req.body;
      const success = await seatService.updateSeat(id, { bookid, status, number, movid });
      if (!success) {
        return res.status(404).json({ message: 'Seat not found or no changes made' });
      }
      res.json({ message: 'Seat updated successfully' });
    } catch (error) {
      console.error('Error updating seat:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

   /*
    -----------------------------------------------------------------------------------------------------
      Purpose: Sends JSON data of specific movie and its seats.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: bookSeat.ejs is rendered and the JSON data of movie and seats is sent to that ejs.
    -----------------------------------------------------------------------------------------------------
    */
  async seatPlan(req,res) {
    try {
      const id = parseInt(req.params.id, 10);
      const movie = await movieService.getMovieById(id);
      const seats = await seatService.getSeatsByMovieId(id); // Fetch seats for the movie 
      res.render('bookSeat', { movie: movie, seats: seats});
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

   /*
    ------------------------------------------------------------------------------
      Purpose: Books the seat/s the user has chosen.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: Returns the booking of the user with booking information.
    ------------------------------------------------------------------------------
    */
  async bookSeat(req, res) {
    try {
      const { seats } = req.body;
      const movie_id = parseInt(req.params.id, 10);
      const user_id = req.session.user_id;
  
      if (!user_id) {
        return res.send(`
          <script>
            alert('Unauthorized. Please log in.');
            window.location.href = '/';
          </script>
        `);
      }
  
      const seatIds = Array.isArray(seats) ? seats : [seats];
      if (seatIds.length === 0 || seatIds.includes('')) {
        return res.send(`
          <script>
            alert('No valid seats selected.');
            window.location.href = '/api/seats/seating-plan/${movie_id}';
          </script>
        `);
      }
  
      const seatReservations = seatIds.map(seat_id => ({
        seat_id,
        movie_id,
        user_id,
        booking_price: 10, // Example price
      }));
  
      try {
        const bookingResults = await Promise.all(
          seatReservations.map(async (reservation) => {
            const seat = await seatService.getSeatById(reservation.seat_id);
  
            if (!seat || seat.status === 'Reserved' || seat.movid !== movie_id) {
              throw new Error(`Seat ${reservation.seat_id} is reserved.`);
            }
  
            const newBooking = await bookingService.createBooking({
              movid: reservation.movie_id,
              usid: reservation.user_id,
              date: new Date(),
              price: reservation.booking_price,
            });
  
            await seatService.updateSeat(seat.id, {
              bookid: newBooking.id,
              status: 'Reserved',
              number: seat.number,
              movid: reservation.movie_id,
            });
  
            return newBooking;
          })
        );
  
        return res.send(`
          <script>
            alert('Seats booked successfully!');
            window.location.href = '/home';
          </script>
        `);
      } catch (error) {
        return res.send(`
          <script>
            alert('${error.message}');
            window.location.href = '/api/seats/seating-plan/${movie_id}';
          </script>
        `);
      }
    } catch (error) {
      console.error('Error booking seat:', error);
      return res.send(`
        <script>
          alert('Internal server error.');
          window.location.href = '/api/seats/seating-plan/${movie_id}';
        </script>
      `);
    }
  }
  

}


module.exports = new SeatController();
