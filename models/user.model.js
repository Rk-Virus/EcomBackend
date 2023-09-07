const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique
  },
  password: {
    type: String,
    required: true,
  },
  // You can include other fields as needed (e.g., name, role, etc.)
}, {
    timestamps:true
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
