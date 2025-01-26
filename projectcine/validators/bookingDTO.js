// validators/bookingValidator.js
const { body, param, validationResult } = require('express-validator');
/*
 -----------------------------------------------------------------------
  Purpose: Validates a booking object.
  Parameters: req and res objects.
  Postcondition: If booking object is verified, the program continues by 
  next(), otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateBooking = [
  body('movid')
    .isInt()
    .withMessage('Movie id must be an int')
    .notEmpty()
    .withMessage('Movie id is required'),
  body('usid')
    .isInt()
    .withMessage('User id must be an int')
    .notEmpty()
    .withMessage('User id is required'),
  body('date')
    .isString()
    .withMessage('Date must be valid')
    .notEmpty()
    .withMessage('Date is required'),
  body('price')
    .isString()
    .withMessage('Price must be a string')
    .notEmpty()
    .withMessage('Price is required'),
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
  Purpose: Validates booking ID.
  Parameters: Takes booking ID.
  Postcondition: If booking ID is verified, the program continues
  otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateBookingId = [
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
  validateBooking,
  validateBookingId
};
