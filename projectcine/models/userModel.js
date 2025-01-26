const moment = require("moment");

class User {
  constructor(id, fname, lname, email, pass) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.pass = pass;
  }

  // Static method to map database row to User model
  // mapper to map the datafields from database to our user Model
  static fromRow(row) {
    return new User(
      row.user_id,         // Map user_id to id
      row.user_fname,
      row.user_lname,       
      row.user_email,
      row.user_pass,      
    );
  }
}

module.exports = User;
