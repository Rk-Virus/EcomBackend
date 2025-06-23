require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser')
// const usersRouter = require('./routes/commonRoutes')

const app = express()
const port = process.env.PORT || 3000

//middlewares
const middle = (req, res, next)=>{
  console.log("middleware running...")
  next()
}

// connecting to db
require('./db/connection')


app.use(cors());
//converting any json response to object
app.use(express.json());

// handling routes...
// backend home route, just to test
app.get('/', middle , (req, res) => {
  res.send('Welcome to Ecommerce App !!')
})

// api routes
app.use("/api", require("./routes/commonRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))
// app.use("/api/customer", require("./routes/customerRoutes"))

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})