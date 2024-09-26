const mongoose = require('mongoose');

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    doctorName: { type: String, required: true },
    doctorEmail: { type: String, required: true },
    selectedDate: { type: Date, required: true }
});

// Create Appointment Model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
