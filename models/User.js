const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        default: 'customer'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index : true
    },
    phoneNo: {
        type: String,
        required: true,
        length : [10, '10 digit mobile number is required'],
        unique: true,
        index : true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    profilePic: {
        // can be of Buffer type 
        type: String,
        default: ""
    },
    bookedOrders : [{
        offer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Offer'
        },
        endsAt : {
            type : Date
        }
    }],
    Rating : {
        type : Number,
        min : 0,
        max : 5
    },
    location : {
        type : {
            type : String,
            default : 'Point'
        },
        coordinates : {
            type : [Number],
            default : [0,0],
            index : '2dsphere'
        }
    },
})


// --------Hashing password------------------------
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10)
//     }
//     next();
// })


// --------Comparing password------------------------
// userSchema.methods.comparePassword = async function (password) {

//     try {
//         return await bcrypt.compare(password, this.password)
//     } catch (err) {
//         console.log(err)
//     }
// }

// --------generatingToken----------------------------

// userSchema.methods.getToken = function () {
//     return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: Math.floor(Date.now() / 1000) + process.env.COOKIE_EXPIRE * 24 * 60 * 60
//     })
// }

module.exports = mongoose.model('User', userSchema)