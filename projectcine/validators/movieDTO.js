// validators/movieValidator.js
const { body, param, validationResult } = require('express-validator');
/*
 -----------------------------------------------------------------------
  Purpose: Validates a movie object.
  Parameters: req and res objects.
  Postcondition: If movie object is verified, the program continues by 
  next(), otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateMovie = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title is required'),
  body('description')
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('Description is required'),
  body('genre')
    .isString()
    .withMessage('Genre must be valid')
    .notEmpty()
    .withMessage('Genre is required'),
  //.isIn([])
  //.withMessage('Genre must be one of the specified')
  body('duration')
    .isInt()
    .withMessage('Duration must be an int')
    .notEmpty()
    .withMessage('Duration is required'),
  body('release')
    .isString()
    .withMessage('Release date must be valid')
    .notEmpty()
    .withMessage('Release date is required'),
  body('stars')
    .isString()
    .withMessage('Starring actors must be valid')
    .notEmpty()
    .withMessage('Starring actors are required'),
  body('screening')
    .isString()
    .withMessage('Screening time must be valid')
    .notEmpty()
    .withMessage('Screening time is required'),
  body('hallno')
    .isInt()
    .withMessage('Hall No. must be valid')
    .notEmpty()
    .withMessage('Hall No. is required'),
  body('rating')
    .isInt()
    .withMessage('Rating must be valid')
    .notEmpty()
    .withMessage('Rating is required'),
  body('lang')
    .isString()
    .withMessage('Language must be valid')
    .notEmpty()
    .withMessage('Language is required'),
  //.isIn([])
  //.withMessage('Language must be one of the specified')
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
/*
 -----------------------------------------------------------------------
  Purpose: Validates movie ID.
  Parameters: Takes movie ID.
  Postcondition: If movie ID is verified, the program continues
  otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateMovieId = [
  param('id').isInt().withMessage('ID must be an integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateMovie,
  validateMovieId
};
