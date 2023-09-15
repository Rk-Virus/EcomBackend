
const sendToken =  (user, res)=>{
    const token = user.getToken()

    res.status(200).json({
        msg : "success",
        response : { token,  user }
    })
}

module.exports = {sendToken}