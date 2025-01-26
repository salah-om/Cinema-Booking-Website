// controllers/userController.js
const userService = require('../services/userService');

class UserController {
    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves all users.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: A JSON array of users or an error message.
    -----------------------------------------------------------------------
    */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      console.log(users);
      const data = {
        users: users
      }
      //res.json(users);
      res.render('users', data);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Retrieves a user by ID.
      Parameters: The req is the request object with a user ID & the 
      res is the response object sending JSON data.
      Postcondition: Requested user data for specific ID or error message.
    -----------------------------------------------------------------------
    */
  async getUserById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

   /*
    -----------------------------------------------------------------------
      Purpose: Retrieves a user by Session ID.
      Parameters: The req is the request object with a user ID & the 
      res is the response object sending JSON data.
      Postcondition: Returns the JSON data of the user in the session.
    -----------------------------------------------------------------------
    */
  async getUserBySessionId(userId) {
    try {
      const [result] = await userService.getUserById(userId);
      if (!result) {
        throw new Error('User not found');
      }
      return result;
    } catch (error) {
      console.error('Error in getUserBySessionId:', error.message);
      throw error;
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Creates a new user.
      Parameters: The req is the request object with user data in the body
      & the res is the response object sending JSON data.
      Postcondition: Creates the user with its data or error message.
    -----------------------------------------------------------------------
    */
  async createUser(req, res) {
    try {
      const { fname, lname, email, pass } = req.body;
      const emailTaken = await userService.isEmailTaken(email);
      if (emailTaken){
        return res.status(400).json({ message: 'Email is already registered' });
      }
      const newUser = await userService.createUser({ fname, lname, email, pass });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Updates an existing user by its ID.
      Parameters: The req is the request object with user ID and updated 
      data in the body & the res is the response object sending JSON data.
      Postcondition: Updates user and responds with success message or 
      error message if user was not found or changed.
    -----------------------------------------------------------------------
    */
  async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { fname, lname, email, pass } = req.body;
      const success = await userService.updateUser(id, { fname, lname, email, pass });
      if (!success) {
        res.render('404')
        // return res.status(404).json({ message: 'User not found or no changes made' });
      }
      // res.json({ message: 'User updated successfully' });
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
    /*
    -----------------------------------------------------------------------
      Purpose: Deletes a user by its ID.
      Parameters: The req is the request object with user ID & the res is 
      the response object sending JSON data.
      Postcondition: Deletes the user and responds with success message or 
      error message if user was not found or deleted.
    -----------------------------------------------------------------------
    */
  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await userService.deleteUser(id);
      if (!success) {
        // return res.status(404).json({ message: 'User not found' });
        console.log('error deleting user.');
      }
      // res.json({ message: 'User deleted successfully' });
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

   /*
    -------------------------------------------------------------------------
      Purpose: Sends specific JSON data of a user by its id.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: Renders the editUser.ejs and sends the user as JSON.
    -------------------------------------------------------------------------
    */
  async editForm(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await userService.getUserById(id);
      res.render('editUser', {user: user});
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /*
    -------------------------------------------------------------------------
      Purpose: Validates login credentials by checking database.
      Parameters: the req is the request object & the res is the response 
      object sending JSON data.
      Postcondition: Redirects the user to the home page if valid.
    -------------------------------------------------------------------------
    */
  async validateLoginUser(req, res) {
      try {
        const {email, pass } = req.body;
        console.log(req.body);
        const validation = await userService.validateLoginUser({ email, pass});

        if(!validation){
          return res.status(400).json({ message: 'Email or password is Incorrect.' });
        }

        if (email === "adminaccess@gmail.com" && pass === "rootpass") {
          return res.status(200).json({ message: 'Admin login successful', redirect: '/admin/dashboard' });
      } else {
          req.session.user_id = validation.userId;
          console.log('User ID set in session:', req.session.user_id);
          return res.status(200).json({ message: 'User login successful', redirect: '/home' });
      }
       
      }catch(error){
        console.error('Error validating user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  }
}



module.exports = new UserController();
