// validators/userValidator.js

const { body, param, validationResult } = require('express-validator');
const userService = require('../services/userService');
/*
 -----------------------------------------------------------------------
  Purpose: Validates a user object.
  Parameters: req and res objects.
  Postcondition: If user object is verified, the program continues by 
  next(), otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateUser = [
  body('fname')
    .isString()
    .withMessage('First Name must be a string')
    .notEmpty()
    .withMessage('First Name is required'),
  body('lname')
    .isString()
    .withMessage('Last Name must be a string')
    .notEmpty()
    .withMessage('Last Name is required'),
  body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required')
    .custom(async (email) => {
      const emailExists = await userService.isEmailTaken({ email });
      if (emailExists) {
        throw new Error('Email is already registered');
      }
    }),
  body('pass')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password is required'),
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
  Purpose: Validates user ID.
  Parameters: Takes user ID.
  Postcondition: If user ID is verified, the program continues
  otherwise, error message is sent.
 -----------------------------------------------------------------------
*/
const validateUserId = [
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
  validateUser,
  validateUserId,
  userService
};
