const express=require("express")
const router=express.Router()
const { validateUser, validateLogin ,validatePassword } = require("../helpers/validation")
const User = require('../models/user')



router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender } = req.body
        await validateUser(req)
        const hashpassword = await validatePassword(req)
        // const hashpassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName, lastName, email, password: hashpassword, gender
        })
        await user.save()
        res.status(200).send("User added Successfully")

    }
    catch (error) {
        res.status(400).send(error.message)
    }
}
)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        await validateLogin(req)
        const user = await User.findOne({ email })
        if (!user) throw new Error("User not found");
        let result = await user.validatePassword(password)
        if (!result) throw new Error("Password is incorrect")
        const token = await user.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000), httpOnly: true // cookie will be removed after 8 hours
        });
        res.status(200).send("Credentials verified successfully")
    }
    catch (error) {
        res.status(400).send(error.message)
    }
}
)
router.post('/logout',async(req,res)=>{
    try{
        res.status(200).cookie("token",{},{expires:new Date(Date.now())}).send("Logged out successfully")
    }
    catch(error){
        res.status(500).send('Error:',error.message)
    }
})
module.exports=router