const jwt = require('jsonwebtoken')
const User = require('../models/user')
const secretkey = process.env.SECRET_KEY

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        console.log(token);
        
        if (!token) throw new Error("Token is not valid!!!!!")
            console.log("secretkey",secretkey);
            
        const decodedObj = await jwt.verify(token, secretkey,)
        console.log(decodedObj);
    
        const { _id } = decodedObj
        const user = await User.findById({ _id })
        if (!user) {
            throw new Error("Please Login with authorised credentails")
        }
        console.log("user",user);
        
        req.user=user
        next()
    }
    catch (error) {
        res.status(404).send(error.message)
    }

}
module.exports = { userAuth }