const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agentAllocated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    startsAt: {
        type: Date,
        required: true
    },
    endsAt: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return !this.startsAt || value > this.startsAt;
            },
            message: 'endsAt must be after startsAt'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
