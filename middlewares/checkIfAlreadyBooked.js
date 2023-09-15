const Order = require('../Models/Order')

const checkIfAlreadyBooked = async (req, res, next) => {
    const {offerId, customerId} = req.body
    const foundOrder = await Order.findOne({offer : offerId, customer : customerId, endsAt : {$gt : Date.now()}})
    if(foundOrder){
        return res.status(400).json({msg : "You already booked this offer"})
    }
    next()
}

module.exports = checkIfAlreadyBooked