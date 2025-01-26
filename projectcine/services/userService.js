// services/userService.js
const { initDB } = require('../config/database');
const User = require('../models/userModel');

class UserService {
  constructor() {
    this.pool = null;
    this.init();
  }
  /*
   -----------------------------------------------------------------------------------
    Purpose: Initializes the database connection pool for the service.
    Parameters: None.
    Postcondition: The `pool` property is set to the initialized database connection.
   -----------------------------------------------------------------------------------
  */
  async init() {
    this.pool = await initDB();
  }

  /*
   ---------------------------------------------------------------------------------------
    Purpose: Retrieves all users.
    Parameters: None.
    Postcondition: Returns an array of users mapped to User model instances.
   ---------------------------------------------------------------------------------------
  */
  async getAllUsers() {
    const [rows] = await this.pool.query('SELECT * FROM users');
    return rows.map(User.fromRow);
  }
  /*
   ---------------------------------------------------------------------------------
    Purpose: Retrieves a user by ID.
    Parameters: id (integer) as the ID of the user to retrieve.
    Postcondition: Returns the user instance if found; otherwise, returns null.
   ---------------------------------------------------------------------------------
  */
  async getUserById(id) {
    try {
      const [rows] = await this.pool.query(
        'SELECT user_id, user_fname FROM users WHERE user_id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        throw new Error('User not found');
      }
  
      const user = User.fromRow(rows[0]);
      return user;
    } catch (error) {
      console.error('Error in getUserById:', error.message);
      throw error;
    }
  }
  /*
   -----------------------------------------------------------------------
    Purpose: Creates a new user.
    Parameters: userData which contains user details.
    Postcondition: Returns the new user created as an object.
   -----------------------------------------------------------------------
  */
  async createUser(userData) {
    const { fname, lname, email, pass } = userData;
    const [result] = await this.pool.query(
      'INSERT INTO users (user_fname, user_lname, user_email, user_pass) VALUES (?, ?, ?, ?)',
      [fname, lname, email, pass]
    );
    const insertedUser = new User(result.insertId, fname, lname, email, pass);
    return insertedUser;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Updates an existing user.
    Parameters: id (integer) as the id of the user to update and userData (object) 
    containing updated user details.
    Postcondition: Returns true if the user was updated successfully; otherwise, false.
   -----------------------------------------------------------------------------------------
  */
  async updateUser(id, userData) {
    const { fname, lname, email, pass } = userData;
    const [result] = await this.pool.query(
      'UPDATE users SET user_fname = ?, user_lname = ?, user_email = ?, user_pass = ? WHERE user_id = ?',
      [fname, lname, email,pass, id]
    );
    return result.affectedRows > 0;
  }
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Deletes a user record.
    Parameters: id (integer) as the id of the user to delete.
    Postcondition: Returns true if the user was deleted successfully; otherwise, false.
   ----------------------------------------------------------------------------------------
  */
  async deleteUser(id) {
    const [result] = await this.pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    return result.affectedRows > 0;
  }

  /*
   ----------------------------------------------------------------------------------------
    Purpose: Checks if the email is already in database.
    Parameters: Type String of email of the user.
    Postcondition: Return true if count > 0 (username is taken)
   ----------------------------------------------------------------------------------------
  */
  async isEmailTaken(userData) {
      const {email} = userData;
      const [result] = await this.pool.query('SELECT COUNT(*) AS count FROM users WHERE user_email = ?',
         [email]);
      const count = result[0].count;
      return count > 0; 
  }
  
  /*
   ----------------------------------------------------------------------------------------
    Purpose: Checks if the email and pass match in database.
    Parameters: Type String of email and pass of the user.
    Postcondition: Return true if found; false otherwise.
   ----------------------------------------------------------------------------------------
  */
   async validateLoginUser(userData) {
      const {email, pass} = userData;
      const [result] = await this.pool.query('SELECT user_id, user_fname FROM users WHERE user_email = ? AND user_pass = ?',
      [email, pass]);
      console.log('Query Result:', result);
      // Check the result from the query
      if (result.length > 0) {
        const user = User.fromRow(result[0]); // Map the database row to the User model
        
        return {
          userId: user.id,        
          userFName: `${user.fname}`, 
          isValid: true
        };
      } else {
        return { isValid: false };
      }
    
  }

}

module.exports = new UserService();
