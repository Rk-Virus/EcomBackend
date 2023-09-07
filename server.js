const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000
app.use(cors());
app.use(express.json());

// MongoDB connection setup
const dbURL = process.env.ATLAS_URI ; // Replace with your MongoDB URL
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// handling routes
// app.use('/user', usersRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})