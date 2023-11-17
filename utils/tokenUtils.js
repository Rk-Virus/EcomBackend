
const sendToken =  (user, res)=>{
    const token = user.getToken()
    console.log(token)
    res.status(201).json({
        msg : "Success!",
        response : { token,  user }
    })
}

module.exports = {sendToken}