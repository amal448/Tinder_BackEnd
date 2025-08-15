const validate=require("validator")
const User = require('../models/user')
const validateUser=(req)=>{
    console.log("ivsvjnojnsd");
    
    const {firstName,lastName,email,password} =req.body
    if(!firstName ||!lastName)   throw new Error("Mandaa first Name or Last Name illa")  
    if(firstName.length<4 ||lastName.length<4) throw new Error("Name iniyum valaranund") 
    if(!validate.isEmail(email))  throw new Error("Mandaa email allu seriyalla")
    if(!validate.isStrongPassword(password)) throw new Error("Password iniyum valaranund")
}

const validateLogin=async(req)=>{
    console.log("ivsvjnojnsd");
    
    const {email,password} =req.body
    const data=await User.findOne({email})
    if(!data)  throw new Error("email not exist !!")
    if(!validate.isEmail(email))  throw new Error("Mandaa email allu seriyalla")
    // if(!validate.isStrongPassword(password)) throw new Error("Password iniyum valaranund")
}





module.exports={validateUser,validateLogin}