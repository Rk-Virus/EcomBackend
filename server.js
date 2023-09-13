require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
// const usersRouter = require('./routes/commonRoutes')

const app = express()

const port = process.env.PORT || 3000

// connecting to db
require('./db/connection')


app.use(cors());
app.use(express.json());

// handling routes
// app.use('/user', usersRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})