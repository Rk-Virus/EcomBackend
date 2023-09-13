const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    offer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Offer'
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    employeeAllocated : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    startsAt : {
        type : Date,
        default : Date.now
    },
    endsAt : {
        type : Date
    },
    cashfreeDetails : {
        type : mongoose.Schema.Types.Mixed,
    }
},{timestamps : true})

module.exports = mongoose.model('Order', orderSchema)