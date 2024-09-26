const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
{
    
    name: { 
    type: String, 
    required: true
    },
    email: {
        type :String,
        required: true
    } ,
    specialization: { 
        type: String, 
        required: true 
    },
    availability: {
        type: String,
        required: true
    },
    contact: { 
        type: String, 
        required: true 
    },
  
}, {timestamps:true});

const DoctorModel = mongoose.model("Doctor", doctorSchema);

module.exports = DoctorModel;
