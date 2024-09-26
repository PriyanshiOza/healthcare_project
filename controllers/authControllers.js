const userModel = require("../models/userModels");
const createError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// FOR REGISTER USER
exports.register = async (req,res,next) => {
    try {
        const user = await userModel.findOne({email: req.body.email});

        if(user){
            return next(new createError("User already exists!" , 400));
        }
        const hashedPassword = await bcrypt.hash(req.body.password ,12);

        const newUser = await userModel.create({
            ...req.body,
            password: hashedPassword,
        });

        // Assign JWT (json web token)
        const token = jwt.sign({ _id: newUser._id } ,"secretkey123" , {
            expiresIn:'90d',
        });

        res.status(201).json({
            status: 'success',
            message: 'User Registered Successfully',
            token,
            user: {
                _id : newUser._id,
                account: newUser.account,
                username : newUser.username,
                email: newUser.email,
            },
        })
        
    } catch (error) {
        next(error);
        
    }

};  

// FOR LOGIN USER
exports.login = async (req,res,next) => {
    try {
        const {account, email , password} = req.body;

        const user = await userModel.findOne({account,email});

        if(!user) return next(new createError("User not Found!" , 404));

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return next(new createError("Invalid Password!" , 401));
        }

        // Assign JWT (json web token)
        const token = jwt.sign({ _id: user._id } ,"secretkey123" , {
            expiresIn:'90d',
        });

        res.status(200).json({
            status:'success',
            token,
            messsage: "Logged In Successfully",
            user: {
                _id : user._id,
                account: user.account,
                username : user.username,
                email: user.email,
            },
        });

    } catch (error) {
        next(error);
        
    }
};