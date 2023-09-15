
const isAdmin = async (req, res, next) => {
    // console.log({isAdmin : req.user})
    try {
        if(req.user.userType === "admin") return next()
        else{
            return res.status(401).json({msg : "You don't have pemission to access this resource"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({msg : "something went wrong", error : err.message})
    }
}

module.exports = isAdmin