
//userModel.js

const mongoose = require('mongoose');

// creating schema
const userSchema = new mongoose.Schema( 
{
    account:{
        type:String,
        required:[true, 'Account type is required'],

    },
    username:{
        type:String,
        required:[true, "Username is required"],
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique: true,
    },
    password:{
        type:String,
        required:[true, 'Please provide a password'],
    },
    confirmPassword:{
        type:String,
        requied:[true , "Password and Comfirm Password should be same"],
        
        
    },
    

}, {timestamps:true});


const UserModel = mongoose.model("users" , userSchema); //const User = mongoose.model("User" , userSchema);
module.exports = UserModel; //module.export = User;