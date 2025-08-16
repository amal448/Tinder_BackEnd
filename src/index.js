require('dotenv').config();

const express = require('express')
const { dbcluster } = require('./config/database')
const cookieParser = require('cookie-parser')
const authRoute=require('./routes/auth')
const profileRoute=require('./routes/profile')
const requestRoute=require('./routes/request')

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/',authRoute)
app.use('/',profileRoute)
app.use('/',requestRoute)

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