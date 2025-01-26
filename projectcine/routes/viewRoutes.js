const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const movieService = require('../services/movieService');
const bookingService = require('../services/bookingService');
const userController = require('../controllers/userController');

// Root route
router.get('/', async (req, res) => {
    const user = {email: '',pass: ''};
    const data = {
      user,
      errorMessage: null
    }
    res.render('login', data);
  });

// Register route
router.get('/register', async (req,res) =>{
    const user = {fname: '',lname: '',email: '',pass: ''};
    const data = {
      user
    }
    res.render('registerUser', data);
  });

  // Dashboard route
router.get('/admin/dashboard', async (req,res) =>{
  const users = await userService.getAllUsers();
  const movies = await movieService.getAllMovies();
    const data = {
        users: users,
        movies: movies
    }
    res.render('admindash',data);
  })

// Admin Users route
router.get('/admin/users', async (req, res) => {
    const users = await userService.getAllUsers();
    const data = {
        users: users,
    }
    // res.status(200).json({data});
    res.render('users', data);
  });
  
  // Admin Movies route
  router.get('/admin/movies', async (req, res) => {
    const movies = await movieService.getAllMovies();
    const data = {
        movies: movies,
    }
    // res.status(200).json({data});
    res.render('movies', data);
  });

  // Admin Movies route
  router.get('/admin/upload', async (req, res) => {
    const data = {
        movie: { 
            title: '',
            description: '',
            genre: '',
            duration: '',
            release: '',
            stars: '',
            screening: '',
            hallno: '',
            rating: '',
            lang: '',
        },
    };
    res.render('uploadMovie', data);
});


  router.get('/home', async (req,res) => {
    try {

      console.log('Session Data:', req.session); // Check session data
      const userId = req.session.user_id; // Retrieve user ID from session
      console.log('User ID from session:', userId);

      if (!userId) {
      throw new Error('User not logged in');
    }

    const userData = await userService.getUserById(userId);
    res.render('index', {user: userData});

    }catch(error) {
      console.error('Error fetching user data: ', error.message);
    }
  })


  router.get('/aboutus', async (req,res) =>{
    res.render('aboutus')
  })

  router.get('/top100', async (req,res) =>{
    res.render('top100')
  })


  router.get('/mybookings', async (req,res) =>{

    const user_id = req.session.user_id;
    if(!user_id) {
      return res.redirect('/');
    }

    try {

      const bookings = await bookingService.getUserBookings(user_id);

      const data = {
        bookings,
      };

      res.render('myBookings', data)
    } catch(error) {
      console.error('Error fetching booking data: ', error.message);
    }
    
  })

module.exports = router;