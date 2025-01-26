// server.js imports
const express = require('express');
const dotenv = require('dotenv');
const ejs = require("ejs");
const path = require('path');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seatRoutes = require('./routes/seatRoutes');
const viewRoutes = require('./routes/viewRoutes')

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static('public'));

app.use(session({
  secret: 'sskeyforwebproject', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// Routes
app.use('/', viewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/seats', seatRoutes);


// 404 Handler
app.use((req, res, next) => {
  // res.status(404).json({ message: 'Endpoint not found' });
  res.render('404')
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
