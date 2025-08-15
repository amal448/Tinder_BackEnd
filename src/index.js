require('dotenv').config();
const express = require('express')
const { dbcluster } = require('./config/database')
const { userAuth } = require('./middleware/auth')
const User = require('./models/user')
const { validateUser, validateLogin } = require("./helpers/validation")
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cookieParser())
const secretkey = process.env.SECRET_KEY

app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender } = req.body
        await validateUser(req)
        const hashpassword = await bcrypt.hash(password, 10);
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
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        await validateLogin(req)
        const user = await User.findOne({ email })
        let result = await validatePassword(password, user.password)
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

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch (error) {
        console.log("error", error.message);

        res.status(400).send(error.message)
    }
})
app.post('/sendConnectionRequest', async (req, res) => {

})

dbcluster().then(() => {
    console.log("Database Connected Successfully");
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        console.log(`Port ${PORT} is running`);

    })

})




app.use('/', (err, req, res, next) => {
    console.log(err);

    res.status(500).send("Some Error is Occured", err)
})