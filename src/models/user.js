const mongoose = require('mongoose')
const validate=require("validator")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secretkey = process.env.SECRET_KEY
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 4,
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 4,

    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim:true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validate.isStrongPassword(value)){
                throw new Error("Password is not Strong")
            }
        }
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender Data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
        validate(value){
            if(!validate.isURL(value)){
                throw new Error("Invalid Photo Url"+value)
            }
        }
    },
    about: {
        type: String,
        default: "Thia is a default about of User"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

userSchema.methods.getJWT=async function(){ //write function like this only not arrow
    const user=this;
    const token=await  jwt.sign({ _id: user._id }, secretkey)
    return token
}

userSchema.methods.validatePassword=async function (passwordInputByUser){
    console.log("passwordInputByUser",passwordInputByUser);
    
    const user=this;
    const hashedpassword= user.password
    let isPasswordValid = await bcrypt.compare(passwordInputByUser,hashedpassword );
    return isPasswordValid
    
}

module.exports = mongoose.model('User', userSchema)
