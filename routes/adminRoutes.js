const express = require('express')
const router = express.Router()
const { addEmployee, 
            createOffer, 
            approveOrder, 
            getAllEmployees,
            getAllOrders,
            getEmployeeSchedule,
            getSingleOrder
          } = require('../controllers/adminControllers')
const isAdmin = require('../middlewares/isAdmin')
const isAuthenticated = require('../middlewares/isAuthenticated')

router.post('/add-employee', isAuthenticated, isAdmin, addEmployee)
router.post('/create-offer', isAuthenticated, isAdmin, createOffer)
router.post('/approove-order', isAuthenticated, isAdmin,  approveOrder)
router.get('/get-all-employees', isAuthenticated, isAdmin, getAllEmployees)
router.get('/get-employee-schedule/:empId', isAuthenticated, isAdmin, getEmployeeSchedule)
router.get('/get-all-orders', isAuthenticated, isAdmin, getAllOrders)
router.get('/get-single-order/:orderId', isAuthenticated, isAdmin, getSingleOrder)

module.exports = router