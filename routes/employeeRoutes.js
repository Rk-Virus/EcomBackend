const express = require('express')
const router = express.Router()
const {getSchedule} = require("../controllers/employeeControllers")
const isAuthenticated = require('../middlewares/isAuthenticated')
const isEmployee = require('../middlewares/isEmployee')

router.get('/get-schedule', isAuthenticated, isEmployee, getSchedule)

module.exports = router
