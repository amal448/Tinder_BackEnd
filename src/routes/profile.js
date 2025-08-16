const express = require("express")
const { userAuth } = require('../middleware/auth')
const { validateEdit ,validatePassword} = require("../helpers/validation")
const user = require("../models/user")
const router = express.Router()

router.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch (error) {
        console.log("error", error.message);

        res.status(400).send(error.message)
    }
})

router.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEdit(req)) throw new Error("Can't update those fields");
        // update the fields accordingly
        const loggedInUser = req.user
        Object.keys(req.body).forEach(item => loggedInUser[item] = req.body[item])
        loggedInUser.save()
        res.send("updated successfully")
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
})

// create patch /profile/password api =>forget password api

router.patch('/profile/forgot-password', async (req, res) => {
    try {
        const {email,password}=req.body
        const User=await user.findOne({email})
        if (!User) throw new Error("Account not found")
        const hashed = await validatePassword(req)
        User.password = hashed
        await User.save()
        console.log(User);
        
        res.status(200).send("Password reset sucessfully",User)
    }
    catch(error) {
        console.log(error);
        
        res.status(400).send("error:", error)
    }
})

module.exports = router