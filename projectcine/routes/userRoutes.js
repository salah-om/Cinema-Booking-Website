// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { validateUser, validateUserId } = require('../validators/userDTO');

const router = express.Router();

// Define routes
router.post('/login', (req, res) => userController.validateLoginUser(req, res));
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', validateUserId, (req, res) => userController.getUserById(req, res));
router.post('/', validateUser, (req, res) => userController.createUser(req, res));
// router.put('/:id', [validateUserId, validateUser], (req, res) => userController.updateUser(req, res));
router.post('/update-user/:id', validateUserId, (req, res) => userController.updateUser(req, res));
// router.delete('/:id', validateUserId, (req, res) => userController.deleteUser(req, res));
router.get('/delete/:id', validateUserId, (req, res) => userController.deleteUser(req, res));
router.get('/edit-form/:id', validateUserId, (req, res) => userController.editForm(req, res));



module.exports = router;
