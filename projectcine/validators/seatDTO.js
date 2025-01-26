// validators/seatValidator.js
const { body, param, validationResult } = require('express-validator');
/*
 -----------------------------------------------------------------------
  Purpose: Validates a seat object.
  Parameters: req and res objects.
  Postcondition: If seat object is verified, the program continues by 
  next(), otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateSeat = [
  body('bookid')
    .isInt()
    .withMessage('Booking id must be an int')
    .notEmpty()
    .withMessage('Booking is is required'),
  body('status')
    .isString()
    .withMessage('Status must be a string')
    .notEmpty()
    .withMessage('Status is required'),
  body('number')
    .isString()
    .withMessage('Seat number must be valid')
    .notEmpty()
    .withMessage('Seat number is required'),
    body('movid')
    .isInt()
    .withMessage('Booking id must be an int')
    .notEmpty()
    .withMessage('Booking is is required'),
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
  Purpose: Validates seat ID.
  Parameters: Takes seat ID.
  Postcondition: If seat ID is verified, the program continues
  otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateSeatId = [
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
  validateSeat,
  validateSeatId
};
