const express = require('express')
const router = express.Router()
const { bookOrder,
            // acceptPayment,
            getActiveOrders,
            getPreviousOrders,
            getSingleOrder,
            // redeemWallet,
            // cashGramWebHook,
            // acceptPaymentFromApp
          } = require("../controllers/customerControllers")
const checkIfAlreadyBooked = require('../middlewares/checkIfAlreadyBooked')

const isAuthenticated = require('../middlewares/isAuthenticated')
const isCustomer = require('../middlewares/isCustomer')

// router.post('/accept-payment', isAuthenticated, checkIfAlreadyBooked, acceptPayment)
// router.get('/accept-app-payment/:offerId', isAuthenticated, checkIfAlreadyBooked, acceptPaymentFromApp)
// router.get('/redeem-wallet', isAuthenticated, redeemWallet)
router.post("/book-order",isAuthenticated, bookOrder)
router.get('/get-active-orders', isAuthenticated, getActiveOrders)
router.get('/get-previous-orders', isAuthenticated, getPreviousOrders)
router.get('/get-single-order/:orderId', isAuthenticated, getSingleOrder)

// router.post('/cashgram-webhook', cashGramWebHook)

// router.post('/payment-notification', async (req, res) => {
//   console.log('paymentNotify', req.body)
//   res.status(200).json({msg : 'Ok'})
// })

module.exports = router