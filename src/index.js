const express=require('express')
require('dotenv').config();

const app=express()
app.use('/',(req,res)=>{
    res.send("message to home from backend")
})

const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`Port ${PORT} is running`);
    
})