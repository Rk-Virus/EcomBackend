// MongoDB connection setup 
const mongoose = require('mongoose')
const dbURL = process.env.ATLAS_URI ; // Replace with MongoDB URL
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});