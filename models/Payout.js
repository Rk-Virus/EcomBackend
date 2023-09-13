const mongoose = require('mongoose')

const payoutSchema = new mongoose.Schema({
    cashgramId : {
        type : String,
        required : true,
        index : true
    },
    amount : {
        type : Number,
        required : true
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}, {timestamps : true})

module.exports = mongoose.model('Payout', payoutSchema)
