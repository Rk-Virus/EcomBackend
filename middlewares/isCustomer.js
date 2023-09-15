
const isCustomer = async (req, res, next) => {
    try {
        if(req.user.userType === "customer") next()
        else{
            return res.status(401).json({msg : "You don't have pemission to access this resource"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({msg : "something went wrong", error : err.message})
    }
}

module.exports = isCustomer