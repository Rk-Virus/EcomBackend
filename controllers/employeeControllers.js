const Order = require('../Models/Order')


const getSchedule = async (req, res)=>{
    try {
        const foundOrders = await Order.find({employeeAllocated : req.user._id, endsAt : {$gt : Date.now()}})
                                                               .populate('offer')
                                                               .populate('customer', '-password -refferalId -bookings -userType')
                                                               .select('-employeeAllocated -cashfreeDetails')
                                                               .sort({startsAt : 'asc'})
                                            
        res.status(200).json({msg : "success", response : foundOrders})
    } catch (err) {
        console.log(err)
        res.status(500).json({msg : "something went wrong", error : err})
    }

}

module.exports = {getSchedule}